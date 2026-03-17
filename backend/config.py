SIMILARITY_THRESHOLD = 0.85
MIN_DESCRIPTION_CHARS = 100

VAGUE_PHRASES = [
    "fast-paced environment",
    "competitive salary",
    "dynamic team",
    "self-starter",
    "excellent communication skills",
    "various responsibilities",
    "motivated individual",
    "hit the ground running",
    "wear many hats",
    "exciting opportunity",
    "growth mindset",
    "team player",
    "results-driven",
    "must be flexible",
]

TECHNOLOGY_KEYWORDS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "sql",
    "postgresql",
    "mysql",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "pandas",
    "numpy",
    "excel",
    "power bi",
    "tableau",
    "modelling",
    "modeling",
    "statistics",
    "product",
    "compliance",
    "risk",
    "marketing",
    "salesforce",
    "git",
    "linux",
    "api",
    "fastapi",
    "django",
    "flask",
    "spark",
]

DEGREE_KEYWORDS = [
    "degree",
    "bsc",
    "msc",
    "computer science",
    "mathematics",
    "statistics",
    "economics",
    "engineering",
]

TEAM_KEYWORDS = [
    "team",
    "department",
    "squad",
    "platform team",
    "data team",
    "engineering team",
    "product team",
]

LOCATION_KEYWORDS = [
    "london",
    "manchester",
    "edinburgh",
    "glasgow",
    "bristol",
    "birmingham",
    "hybrid",
    "remote",
    "on-site",
    "onsite",
]

BENEFIT_KEYWORDS = [
    "pension",
    "private healthcare",
    "healthcare",
    "annual leave",
    "holiday",
    "bonus",
    "gym membership",
    "flexible working",
    "share options",
    "life assurance",
]

SCORING_WEIGHTS = {
    "age_over_30": 15,
    "age_over_45": 10,
    "age_over_60": 10,
    "vague_over_003": 10,
    "vague_over_006": 10,
    "similarity_over_075": 10,
    "similarity_over_085": 15,
    "duplicate_ge_2": 10,
    "duplicate_ge_4": 10,
    "specificity_over_020": -8,
    "specificity_over_035": -10,
    "salary_present": -5,
    "low_specificity_penalty": 8,
}

VERDICT_THRESHOLDS = {
    "likely_active_max": 34,
    "unclear_max": 64,
}

DATABASE_PATH = "ghost_jobs.db"
SEED_DATA_PATH = "data/sample_jobs.json"
