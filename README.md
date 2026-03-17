---

# PhantomHire

PhantomHire helps job seekers identify **ghost job listings**.

A *ghost job* is a job posting that appears active but is not genuinely being filled. These listings often stay online for long periods, are reposted repeatedly, or contain vague descriptions that suggest the role may not actually exist.

PhantomHire analyses a job listing and produces a **Ghost Score** that estimates how likely the listing is to be a ghost job.

The system also explains **why** the listing was flagged so users can understand the result.

---

# What PhantomHire Does

Users paste a job listing description into the interface.

PhantomHire then analyses the listing and returns:

* **Ghost Score (0–100)** – estimated likelihood the job is a ghost listing
* **Verdict** – Likely Active, Unclear, or Likely Ghost
* **Confidence score**
* **Explanation reasons** describing the signals that influenced the result
* **Feature signals** used during analysis

The goal is to give job seekers **quick transparency** before they invest time applying.

---

# How It Works

PhantomHire evaluates job listings using several signals:

* **Posting age** – older listings are more suspicious
* **Vague wording detection** – phrases common in generic or low-detail postings
* **Role specificity** – concrete skills, tools, and responsibilities reduce suspicion
* **Duplicate detection** – similarity to previously analysed listings
* **Salary signals** – presence of compensation details

The system combines these signals into a **deterministic scoring engine** that produces the Ghost Score.

Duplicate detection uses **TF-IDF text vectorisation and cosine similarity** to detect reposted job descriptions.

---

# Project Structure

```
PhantomHire
│
├── backend
│   ├── main.py
│   ├── analyser.py
│   ├── features.py
│   ├── similarity.py
│   ├── scoring.py
│   ├── database.py
│   ├── schemas.py
│   ├── config.py
│   └── data/
│
├── frontend
│   ├── index.html
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   └── services/
│
├── README.md
└── .gitignore
```

---

# Requirements

Install the following before running the project:

**Backend**

* Python 3.9+
* pip

**Frontend**

* Node.js 18+
* npm

---

# Running the Project

The backend and frontend run as two local servers.

## 1. Start the Backend

Navigate to the backend folder:

```
cd backend
```

Install dependencies:

```
pip install -r requirements.txt
```

Run the API server:

```
uvicorn main:app --reload
```

The backend will start at:

```
http://127.0.0.1:8000
```

Test it with:

```
http://127.0.0.1:8000/health
```

---

## 2. Start the Frontend

Open a second terminal and navigate to the frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The interface will run at:

```
http://localhost:3000
```

---

# Using PhantomHire

1. Open the frontend in your browser.
2. Paste a job listing description into the form.
3. Submit the listing.
4. PhantomHire returns a **Ghost Score and explanation**.

---

# API Example

### Request

```
POST /analyse
```

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

# Technology Used

### Backend

* Python
* FastAPI
* scikit-learn
* NumPy
* Pandas
* SQLite

### Frontend

* React
* TypeScript
* Vite

### Methods

* TF-IDF text vectorisation
* Cosine similarity
* Rule-based scoring engine

---

# Limitations

PhantomHire analyses the **text of job listings**, not the internal hiring status of companies.

The Ghost Score is an **estimate based on patterns**, not a definitive judgement.

---

# Future Improvements

Possible extensions include:

* automatic job page extraction
* larger dataset of historical listings
* improved scoring calibration
* browser extension for analysing listings directly on job sites

---

