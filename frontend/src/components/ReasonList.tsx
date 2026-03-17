import { Info } from 'lucide-react';
import { motion } from 'motion/react';

interface ReasonListProps {
  reasons: string[];
}

export default function ReasonList({ reasons }: ReasonListProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <Info size={18} />
        <h3>Triggered reasons</h3>
      </div>

      <ul className="reason-list">
        {reasons.map((reason, index) => (
          <motion.li
            key={reason + index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <span className="reason-dot" />
            <span>{reason}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
