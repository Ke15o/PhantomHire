from typing import Dict, List

from config import SCORING_WEIGHTS, VERDICT_THRESHOLDS


def _build_reasons(features: Dict, similarity: Dict, score: int) -> List[str]:
    suspicious_reasons = []
    positive_reasons = []

    age_days = features.get("age_days")
    vagueness_score = features.get("vagueness_score", 0.0)
    specificity_score = features.get("specificity_score", 0.0)
    salary_presence = features.get("salary_presence", 0.0)
    max_similarity = similarity.get("max_similarity", 0.0)
    duplicate_count = similarity.get("duplicate_count", 0)

    if max_similarity > 0.85:
        suspicious_reasons.append("Description is highly similar to previous listings")
    elif max_similarity > 0.75:
        suspicious_reasons.append("Description is moderately similar to previous listings")

    if duplicate_count >= 2:
        suspicious_reasons.append("Listing appears to have been reposted multiple times")

    if age_days is not None and age_days > 45:
        suspicious_reasons.append("Posting is older than 45 days")
    elif age_days is not None and age_days > 30:
        suspicious_reasons.append("Posting has been live for over 30 days")

    if vagueness_score > 0.06:
        suspicious_reasons.append("Advert contains vague wording")
    elif vagueness_score > 0.03:
        suspicious_reasons.append("Advert uses several generic phrases")

    if specificity_score < 0.12:
        suspicious_reasons.append("Description lacks concrete role details")

    if specificity_score > 0.35:
        positive_reasons.append("Advert includes concrete technical details")
    elif specificity_score > 0.20:
        positive_reasons.append("Description contains specific role details")

    if salary_presence > 0:
        positive_reasons.append("Advert includes compensation information")

    if max_similarity < 0.5:
        positive_reasons.append("No strong duplicate signal detected")

    if score >= 65:
        reasons = suspicious_reasons[:4]
        return reasons if reasons else ["Multiple ghost-job signals were triggered"]

    if score <= 34:
        reasons = positive_reasons[:3]
        if suspicious_reasons and len(reasons) < 3:
            reasons.extend(suspicious_reasons[: 3 - len(reasons)])
        return reasons if reasons else ["No strong ghost-job signals detected"]

    reasons = suspicious_reasons[:2] + positive_reasons[:2]
    return reasons[:4] if reasons else ["Signals are mixed, so the listing is unclear"]


def score_job(features: Dict, similarity: Dict) -> Dict:
    score = 0

    age_days = features.get("age_days")
    vagueness_score = features.get("vagueness_score", 0.0)
    specificity_score = features.get("specificity_score", 0.0)
    salary_presence = features.get("salary_presence", 0.0)
    max_similarity = similarity.get("max_similarity", 0.0)
    duplicate_count = similarity.get("duplicate_count", 0)

    if age_days is not None and age_days > 30:
        score += SCORING_WEIGHTS["age_over_30"]
    if age_days is not None and age_days > 45:
        score += SCORING_WEIGHTS["age_over_45"]
    if age_days is not None and age_days > 60:
        score += SCORING_WEIGHTS["age_over_60"]

    if vagueness_score > 0.03:
        score += SCORING_WEIGHTS["vague_over_003"]
    if vagueness_score > 0.06:
        score += SCORING_WEIGHTS["vague_over_006"]

    if max_similarity > 0.75:
        score += SCORING_WEIGHTS["similarity_over_075"]
    if max_similarity > 0.85:
        score += SCORING_WEIGHTS["similarity_over_085"]
    if duplicate_count >= 2:
        score += SCORING_WEIGHTS["duplicate_ge_2"]
    if duplicate_count >= 4:
        score += SCORING_WEIGHTS["duplicate_ge_4"]

    if specificity_score > 0.20:
        score += SCORING_WEIGHTS["specificity_over_020"]
    if specificity_score > 0.35:
        score += SCORING_WEIGHTS["specificity_over_035"]
    if salary_presence > 0:
        score += SCORING_WEIGHTS["salary_present"]
    if specificity_score < 0.12:
        score += SCORING_WEIGHTS["low_specificity_penalty"]

    score = max(0, min(score, 100))

    if score <= VERDICT_THRESHOLDS["likely_active_max"]:
        verdict = "Likely Active"
    elif score <= VERDICT_THRESHOLDS["unclear_max"]:
        verdict = "Unclear"
    else:
        verdict = "Likely Ghost"

    confidence = 0.5
    if age_days is not None and age_days > 45:
        confidence += 0.08
    if max_similarity > 0.85:
        confidence += 0.12
    if duplicate_count >= 2:
        confidence += 0.07
    if vagueness_score > 0.06:
        confidence += 0.06
    if specificity_score > 0.35 and score < 35:
        confidence += 0.07
    if specificity_score < 0.12 and score >= 65:
        confidence += 0.05

    confidence = min(0.95, round(confidence, 2))
    reasons = _build_reasons(features, similarity, score)

    return {
        "ghost_score": score,
        "verdict": verdict,
        "confidence": confidence,
        "reasons": reasons,
    }
