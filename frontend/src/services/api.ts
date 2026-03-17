import type { AnalyseRequest, AnalyseResponse, ApiError } from '../types';

const API_BASE = '/api';

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function analyseJob(payload: AnalyseRequest): Promise<AnalyseResponse> {
  const body: AnalyseRequest = {
    title: trimOptional(payload.title),
    company: trimOptional(payload.company),
    description: payload.description.trim(),
    date_posted: trimOptional(payload.date_posted),
  };

  const response = await fetch(`${API_BASE}/analyse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorData = (await response.json()) as Partial<ApiError>;
      message = errorData.detail || errorData.error || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as AnalyseResponse;
}
