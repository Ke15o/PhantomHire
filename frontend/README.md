# PhantomHire Frontend

This frontend is wired to the existing FastAPI backend through the stable manual-entry flow.

## What it does

- collects `title`, `company`, `description`, and `date_posted`
- sends them to the backend `POST /analyse` endpoint
- renders score, verdict, confidence, reasons, and feature signals
- avoids URL extraction because that path is not reliable enough yet for the demo

## Run locally

From the `frontend` folder:

```bash
npm install
npm run dev
```

The app runs on:

```text
http://localhost:3000
```

## Backend requirement

Run the backend first on:

```text
http://127.0.0.1:8000
```

This frontend uses a Vite proxy:

- frontend calls `/api/analyse`
- Vite forwards that to `http://127.0.0.1:8000/analyse`

That avoids local CORS issues during development.

## Expected backend contract

Request:

```json
{
  "title": "Graduate Software Engineer",
  "company": "Example Corp",
  "description": "Full job description text here...",
  "date_posted": "2026-03-01"
}
```

Response:

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
