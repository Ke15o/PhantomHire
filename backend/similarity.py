from typing import Dict, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import SIMILARITY_THRESHOLD
from database import fetch_historical_jobs


def compute_similarity_signals(description: str, company: Optional[str] = None) -> Dict:
    historical_jobs = fetch_historical_jobs()
    historical_descriptions = [job["description"] for job in historical_jobs if job.get("description")]

    if not historical_descriptions:
        return {
            "max_similarity": 0.0,
            "duplicate_count": 0,
            "same_company_duplicate_count": 0,
        }

    corpus = historical_descriptions + [description]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(corpus)

    if matrix.shape[0] <= 1:
        return {
            "max_similarity": 0.0,
            "duplicate_count": 0,
            "same_company_duplicate_count": 0,
        }

    new_vector = matrix[-1]
    historical_vectors = matrix[:-1]
    similarities = cosine_similarity(new_vector, historical_vectors)[0]

    max_similarity = float(similarities.max()) if len(similarities) else 0.0
    duplicate_count = int((similarities >= SIMILARITY_THRESHOLD).sum())

    same_company_duplicate_count = 0
    if company:
        company_normalized = company.strip().lower()
        for job, similarity in zip(historical_jobs, similarities):
            historical_company = (job.get("company") or "").strip().lower()
            if historical_company and historical_company == company_normalized and similarity >= SIMILARITY_THRESHOLD:
                same_company_duplicate_count += 1

    return {
        "max_similarity": round(max_similarity, 4),
        "duplicate_count": duplicate_count,
        "same_company_duplicate_count": same_company_duplicate_count,
    }
