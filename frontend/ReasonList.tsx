import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  reasons: string[];
}

export default function ReasonList({ reasons }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-800">Why?</h3>
      </div>
      
      <ul className="space-y-3">
        {reasons.map((reason, index) => (
          <motion.li 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            key={index} 
            className="flex items-start gap-3 text-slate-700"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
            <span className="leading-relaxed">{reason}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
