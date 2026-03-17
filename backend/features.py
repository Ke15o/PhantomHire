import re
from datetime import date, datetime
from typing import Dict, Optional

from config import (
    BENEFIT_KEYWORDS,
    DEGREE_KEYWORDS,
    LOCATION_KEYWORDS,
    MIN_DESCRIPTION_CHARS,
    TEAM_KEYWORDS,
    TECHNOLOGY_KEYWORDS,
    VAGUE_PHRASES,
)


WORD_RE = re.compile(r"\b\w+\b")
NUMBER_RE = re.compile(r"\b\d+(?:[.,]\d+)?\b")
YEARS_EXP_RE = re.compile(r"\b\d+\+?\s+years?\b")
SALARY_RE = re.compile(
    r"(£\s?\d[\d,]*(?:k)?|\$\s?\d[\d,]*(?:k)?|salary|per annum|bonus|hourly rate|per hour)"
)
BULLET_LINE_RE = re.compile(r"^\s*[-•*]", re.MULTILINE)


def compute_word_count(description: str) -> int:
    return len(WORD_RE.findall(description))


def compute_vagueness_score(description: str) -> float:
    description_lower = description.lower()
    word_count = max(compute_word_count(description), 1)
    vague_hits = sum(description_lower.count(phrase) for phrase in VAGUE_PHRASES)
    score = vague_hits / word_count
    return round(min(score, 1.0), 4)


def compute_salary_presence(description: str) -> float:
    return 1.0 if SALARY_RE.search(description.lower()) else 0.0


def compute_specificity_score(description: str) -> float:
    description_lower = description.lower()
    word_count = max(compute_word_count(description), 1)

    tech_hits = sum(description_lower.count(keyword) for keyword in TECHNOLOGY_KEYWORDS)
    degree_hits = sum(description_lower.count(keyword) for keyword in DEGREE_KEYWORDS)
    team_hits = sum(description_lower.count(keyword) for keyword in TEAM_KEYWORDS)
    location_hits = sum(description_lower.count(keyword) for keyword in LOCATION_KEYWORDS)
    benefit_hits = sum(description_lower.count(keyword) for keyword in BENEFIT_KEYWORDS)
    number_hits = len(NUMBER_RE.findall(description_lower))
    years_hits = len(YEARS_EXP_RE.findall(description_lower))
    bullet_hits = len(BULLET_LINE_RE.findall(description))
    salary_hits = 1 if SALARY_RE.search(description_lower) else 0

    weighted_hits = (
        tech_hits * 2.5
        + degree_hits * 1.2
        + team_hits * 1.0
        + location_hits * 1.0
        + benefit_hits * 1.0
        + number_hits * 0.8
        + years_hits * 1.5
        + bullet_hits * 0.7
        + salary_hits * 2.0
    )

    raw_score = weighted_hits / word_count
    scaled_score = min(raw_score * 2.2, 1.0)
    return round(scaled_score, 4)


def compute_age_days(date_posted: Optional[str]) -> Optional[int]:
    if not date_posted:
        return None
    try:
        posted = datetime.strptime(date_posted, "%Y-%m-%d").date()
    except ValueError:
        return None
    today = date.today()
    return (today - posted).days


def extract_features(
    title: Optional[str],
    company: Optional[str],
    description: str,
    date_posted: Optional[str],
) -> Dict:
    return {
        "title_present": bool(title),
        "company_present": bool(company),
        "word_count": compute_word_count(description),
        "age_days": compute_age_days(date_posted),
        "vagueness_score": compute_vagueness_score(description),
        "specificity_score": compute_specificity_score(description),
        "salary_presence": compute_salary_presence(description),
        "valid_description": len(description.strip()) >= MIN_DESCRIPTION_CHARS,
    }
