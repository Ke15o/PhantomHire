import React, { useState } from 'react';
import { Ghost, Search } from 'lucide-react';
import { AnalyseRequest, AnalyseResponse } from './types';
import { analyseJob } from './services/api';
import JobInputForm from './components/JobInputForm';
import ScoreCard from './components/ScoreCard';
import ReasonList from './components/ReasonList';
import TechnicalDetails from './components/TechnicalDetails';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyseResponse | null>(null);

  const handleAnalyse = async (data: AnalyseRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyseJob(data);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Ghost className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">PhantomHire</h1>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            GhostJob Detector
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyse a Job Listing</h2>
              <p className="text-slate-600">Paste a job advertisement below to estimate whether it's a genuine active role or a stale "ghost" job.</p>
            </div>
            <JobInputForm onSubmit={handleAnalyse} isLoading={isLoading} error={error} />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {!result && !isLoading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Awaiting Input</h3>
                  <p className="text-slate-500 text-sm max-w-xs">Submit a job description to see the ghost score, verdict, and detailed analysis.</p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white shadow-sm"
                >
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    <Ghost className="absolute inset-0 m-auto w-6 h-6 text-indigo-600 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-1">Analysing Listing...</h3>
                  <p className="text-slate-500 text-sm">Running heuristics and similarity checks.</p>
                </motion.div>
              )}

              {result && !isLoading && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <ScoreCard data={result} />
                  <ReasonList reasons={result.reasons} />
                  <TechnicalDetails features={result.features} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
