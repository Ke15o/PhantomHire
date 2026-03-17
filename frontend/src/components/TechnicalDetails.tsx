import { BarChart3 } from 'lucide-react';
import type { FeaturesResponse } from '../types';

interface TechnicalDetailsProps {
  features: FeaturesResponse;
}

function metricValue(value: number | null, digits = 2): string {
  if (value === null || Number.isNaN(value)) {
    return 'N/A';
  }
  return typeof value === 'number' ? value.toFixed(digits) : String(value);
}

export default function TechnicalDetails({ features }: TechnicalDetailsProps) {
  const items = [
    { label: 'Age days', value: features.age_days === null ? 'N/A' : String(features.age_days) },
    { label: 'Vagueness score', value: metricValue(features.vagueness_score) },
    { label: 'Specificity score', value: metricValue(features.specificity_score) },
    { label: 'Max similarity', value: metricValue(features.max_similarity) },
    { label: 'Duplicate count', value: String(features.duplicate_count) },
  ];

  return (
    <section className="panel">
      <div className="section-heading">
        <BarChart3 size={18} />
        <h3>Feature signals</h3>
      </div>

      <div className="metric-grid">
        {items.map((item) => (
          <div key={item.label} className="metric-card">
            <span className="metric-label">{item.label}</span>
            <span className="metric-value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
