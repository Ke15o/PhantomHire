import React, { useState } from 'react';
import { AnalyseResponse } from '../types';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  features: AnalyseResponse['features'];
}

export default function TechnicalDetails({ features }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!features) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Activity className="w-4 h-4 text-slate-400" />
          Technical Details
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 grid grid-cols-2 gap-4">
              <DetailItem label="Age (Days)" value={features.age_days ?? 'N/A'} />
              <DetailItem label="Vagueness Score" value={features.vagueness_score?.toFixed(2) ?? 'N/A'} />
              <DetailItem label="Specificity Score" value={features.specificity_score?.toFixed(2) ?? 'N/A'} />
              <DetailItem label="Max Similarity" value={features.max_similarity?.toFixed(2) ?? 'N/A'} />
              <DetailItem label="Duplicate Count" value={features.duplicate_count ?? 'N/A'} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded w-fit">{value}</span>
    </div>
  );
}
