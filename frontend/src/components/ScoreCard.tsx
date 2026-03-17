import { AlertTriangle, CheckCircle2, Ghost, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { AnalyseResponse } from '../types';

interface ScoreCardProps {
  result: AnalyseResponse;
}

export default function ScoreCard({ result }: ScoreCardProps) {
  const { ghost_score, verdict, confidence } = result;

  let tone: 'good' | 'mid' | 'bad' = 'mid';
  let Icon = HelpCircle;

  if (ghost_score <= 34) {
    tone = 'good';
    Icon = CheckCircle2;
  } else if (ghost_score >= 65) {
    tone = 'bad';
    Icon = Ghost;
  } else {
    tone = 'mid';
    Icon = AlertTriangle;
  }

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ghost_score / 100) * circumference;

  return (
    <section className={`panel result-card result-card-${tone}`}>
      <div className="result-header-row">
        <div>
          <p className="eyebrow">Ghost score</p>
          <h2>{verdict}</h2>
        </div>
        <div className="confidence-pill">Confidence {Math.round(confidence * 100)}%</div>
      </div>

      <div className="result-ring-wrap">
        <div className="result-ring">
          <svg viewBox="0 0 140 140" className="ring-svg" aria-hidden="true">
            <circle cx="70" cy="70" r={radius} className="ring-track" />
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              className="ring-progress"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="ring-label">
            <span className="ring-score">{ghost_score}</span>
            <span className="ring-caption">/100</span>
          </div>
        </div>
      </div>

      <div className="verdict-row">
        <Icon size={20} />
        <span>{verdict}</span>
      </div>
    </section>
  );
}
