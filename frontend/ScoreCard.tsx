import React from 'react';
import { AnalyseResponse } from '../types';
import { Ghost, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  data: AnalyseResponse;
}

export default function ScoreCard({ data }: Props) {
  const { ghost_score, verdict, confidence } = data;

  let colorClass = '';
  let bgClass = '';
  let borderClass = '';
  let Icon = HelpCircle;

  if (ghost_score <= 34) {
    colorClass = 'text-emerald-600';
    bgClass = 'bg-emerald-50';
    borderClass = 'border-emerald-200';
    Icon = CheckCircle2;
  } else if (ghost_score <= 64) {
    colorClass = 'text-amber-600';
    bgClass = 'bg-amber-50';
    borderClass = 'border-amber-200';
    Icon = AlertTriangle;
  } else {
    colorClass = 'text-rose-600';
    bgClass = 'bg-rose-50';
    borderClass = 'border-rose-200';
    Icon = Ghost;
  }

  // Calculate stroke dasharray for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ghost_score / 100) * circumference;

  return (
    <div className={`p-6 rounded-2xl border ${borderClass} ${bgClass} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white/60 px-2.5 py-1 rounded-full border border-slate-200/60 backdrop-blur-sm">
        <span>Confidence:</span>
        <span className="text-slate-700">{Math.round(confidence * 100)}%</span>
      </div>

      <div className="relative w-32 h-32 mb-4">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 opacity-50"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={colorClass}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold tracking-tighter ${colorClass}`}>
            {ghost_score}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className={`text-xl font-bold ${colorClass}`}>{verdict}</h3>
      </div>
      <p className="text-sm text-slate-600 font-medium">Ghost Score</p>
    </div>
  );
}
