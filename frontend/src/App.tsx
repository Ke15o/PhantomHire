import { Ghost, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import JobInputForm from './components/JobInputForm';
import ReasonList from './components/ReasonList';
import ScoreCard from './components/ScoreCard';
import TechnicalDetails from './components/TechnicalDetails';
import { analyseJob } from './services/api';
import type { AnalyseRequest, AnalyseResponse } from './types';

export default function App() {
  const [result, setResult] = useState<AnalyseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyse = async (payload: AnalyseRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyseJob(payload);
      setResult(response);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Something went wrong while contacting the backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Ghost size={20} />
          </div>
          <div>
            <h1>PhantomHire</h1>
            <p>GhostJob Detector</p>
          </div>
        </div>
        <div className="status-pill">Backend-powered scoring</div>
      </header>

      <main className="page-grid">
        <section className="left-column">
          <div className="intro-block">
            <p className="eyebrow">Deterministic analysis</p>
            <h2>Check whether a job looks active, unclear, or likely ghosted.</h2>
            <p>
              This frontend talks directly to your FastAPI backend and only uses the manual text-entry
              flow, because that is the route you can currently trust for demo reliability.
            </p>
          </div>

          <JobInputForm onSubmit={handleAnalyse} isLoading={isLoading} error={error} />
        </section>

        <section className="right-column">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="panel empty-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <div className="spinner" />
                <h3>Analysing listing…</h3>
                <p>Calling the backend, scoring the text, and collecting triggered reasons.</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                className="result-stack"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <ScoreCard result={result} />
                <ReasonList reasons={result.reasons} />
                <TechnicalDetails features={result.features} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="panel empty-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <div className="empty-icon">
                  <Search size={28} />
                </div>
                <h3>Awaiting input</h3>
                <p>Submit a job listing to see the score, verdict, confidence, and feature breakdown.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
