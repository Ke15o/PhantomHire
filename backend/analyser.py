from typing import Dict

from database import insert_job
from features import extract_features
from scoring import score_job
from similarity import compute_similarity_signals


def analyse_job(job_input: Dict) -> Dict:
    title = (job_input.get("title") or "").strip() or None
    company = (job_input.get("company") or "").strip() or None
    description = (job_input.get("description") or "").strip()
    date_posted = (job_input.get("date_posted") or "").strip() or None

    features = extract_features(title, company, description, date_posted)
    similarity = compute_similarity_signals(description, company)
    scoring = score_job(features, similarity)

    public_features = {
        "age_days": features.get("age_days"),
        "vagueness_score": features.get("vagueness_score", 0.0),
        "specificity_score": features.get("specificity_score", 0.0),
        "max_similarity": similarity.get("max_similarity", 0.0),
        "duplicate_count": similarity.get("duplicate_count", 0),
    }

    response = {
        "ghost_score": scoring["ghost_score"],
        "verdict": scoring["verdict"],
        "confidence": scoring["confidence"],
        "reasons": scoring["reasons"],
        "features": public_features,
    }

    insert_job(
        {
            "title": title,
            "company": company,
            "description": description,
            "date_posted": date_posted,
        }
    )

    return response
