from typing import List, Optional

from pydantic import BaseModel, Field


class AnalyseRequest(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: str = Field(..., description="Full job description text")
    date_posted: Optional[str] = Field(None, description="YYYY-MM-DD")


class FeaturesResponse(BaseModel):
    age_days: Optional[int]
    vagueness_score: float
    specificity_score: float
    max_similarity: float
    duplicate_count: int


class AnalyseResponse(BaseModel):
    ghost_score: int
    verdict: str
    confidence: float
    reasons: List[str]
    features: FeaturesResponse


class ErrorResponse(BaseModel):
    error: str
    detail: str
