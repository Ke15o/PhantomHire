# PhantomHire

PhantomHire is a hackathon project designed to detect **ghost job listings**.

A *ghost job* is a job posting that appears active but is not genuinely being filled. These listings can remain online for months, be reposted repeatedly, or contain vague descriptions that suggest the role may not actually exist.

PhantomHire analyses job descriptions and produces a **Ghost Score** indicating the likelihood that the listing is a ghost job.

---

# Features

The backend analyses listings using a deterministic scoring system based on:

* Posting age
* Vague wording detection
* Concrete role specificity
* Duplicate job description similarity
* Salary presence signals

The system returns:

* **Ghost Score (0–100)**
* **Verdict** (Likely Active / Unclear / Likely Ghost)
* **Confidence estimate**
* **Explanation reasons**
* **Key feature signals**

---

# Project Structure

```
PhantomHire/
│
├── backend/          FastAPI analysis engine
│
├── frontend/         Frontend client (built separately)
│
├── .gitignore
└── README.md
```

---

# API Contract

### Endpoint

```
POST /analyse
```

### Request

```json
{
  "title": "Graduate Software Engineer",
  "company": "Example Corp",
  "description": "Full job description text here...",
  "date_posted": "2026-03-01"
}
```

### Response

```json
{
  "ghost_score": 72,
  "verdict": "Likely Ghost",
  "confidence": 0.81,
  "reasons": [
    "Description is highly similar to previous listings",
    "Posting is older than 45 days",
    "Advert contains vague wording"
  ],
  "features": {
    "age_days": 46,
    "vagueness_score": 0.18,
    "specificity_score": 0.22,
    "max_similarity": 0.91,
    "duplicate_count": 3
  }
}
```

---

# Running the Backend

See:

```
backend/README.md
```

---

# Tech Stack

Backend:

* Python
* FastAPI
* scikit-learn
* numpy
* pandas
* SQLite

Similarity detection uses:

* **TF-IDF vectorisation**
* **cosine similarity**

---

# Hackathon Goals

The system is designed for:

* deterministic outputs
* fast local setup
* reliable demo behaviour
* explainable scoring

It intentionally avoids heavy ML pipelines or external services.

---

# Status

MVP backend implemented.

Next steps:

* frontend integration
* UI visualisation of ghost scores
* improved similarity dataset
* tuning scoring heuristics
