from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from analyser import analyse_job
from config import MIN_DESCRIPTION_CHARS
from database import init_db
from schemas import AnalyseRequest, AnalyseResponse


app = FastAPI(title="GhostJob Detector Backend")


@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/analyse", response_model=AnalyseResponse)
def analyse(payload: AnalyseRequest):
    description = (payload.description or "").strip()
    if len(description) < MIN_DESCRIPTION_CHARS:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Invalid input",
                "detail": f"Description must be at least {MIN_DESCRIPTION_CHARS} characters",
            },
        )

    try:
        return analyse_job(payload.model_dump())
    except HTTPException:
        raise
    except Exception:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal error",
                "detail": "Analysis failed",
            },
        )
