# GhostJob Detector Backend

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be available at:

```text
http://127.0.0.1:8000
```

## Health check

```bash
curl http://127.0.0.1:8000/health
```

## Analyse example

```bash
curl -X POST http://127.0.0.1:8000/analyse \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Graduate Software Engineer",
    "company": "Northstar Systems",
    "description": "We are hiring a Graduate Software Engineer to join our platform team in Manchester. You will build internal APIs in Python and FastAPI, write SQL queries, support AWS deployments, and work closely with product and data teams. Requirements include a degree in Computer Science, Mathematics, or a related subject, experience with Git, and strong problem-solving skills. Salary is £35,000-£40,000 plus bonus, pension, private healthcare, and 28 days annual leave. This hybrid role includes structured mentoring, code reviews, and a clear set of delivery responsibilities.",
    "date_posted": "2026-03-10"
  }'
```

## Golden demo inputs

### Legitimate input
Use the curl example above. It should score low and usually return `Likely Active`.

### Suspicious input

```json
{
  "title": "Operations Associate",
  "company": "TalentFlow Partners",
  "description": "We are seeking a motivated individual to join our dynamic team in a fast-paced environment. This exciting opportunity is ideal for a self-starter who can wear many hats, hit the ground running, and demonstrate excellent communication skills. The successful candidate will support various responsibilities across the business and must be flexible, results-driven, and a strong team player. We offer a competitive salary and strong growth mindset culture. This exciting opportunity is ideal for a motivated individual who thrives in a dynamic team and fast-paced environment.",
  "date_posted": "2025-12-20"
}
```

This should score high and usually return `Likely Ghost`.
