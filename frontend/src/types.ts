export interface AnalyseRequest {
  title?: string;
  company?: string;
  description: string;
  date_posted?: string;
}

export interface FeaturesResponse {
  age_days: number | null;
  vagueness_score: number;
  specificity_score: number;
  max_similarity: number;
  duplicate_count: number;
}

export interface AnalyseResponse {
  ghost_score: number;
  verdict: 'Likely Active' | 'Unclear' | 'Likely Ghost' | string;
  confidence: number;
  reasons: string[];
  features: FeaturesResponse;
}

export interface ApiError {
  error: string;
  detail: string;
}
