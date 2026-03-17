import React, { useState } from 'react';
import { AnalyseRequest } from '../types';
import { Search, AlertCircle, Link as LinkIcon, Download } from 'lucide-react';
import { scrapeJobUrl } from '../services/api';

interface Props {
  onSubmit: (data: AnalyseRequest) => void;
  isLoading: boolean;
  error: string | null;
}

export default function JobInputForm({ onSubmit, isLoading, error }: Props) {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [datePosted, setDatePosted] = useState('');

  const handleScrape = async () => {
    if (!url) return;
    setIsScraping(true);
    setScrapeError(null);
    try {
      const data = await scrapeJobUrl(url);
      if (data.title) setTitle(data.title);
      if (data.company) setCompany(data.company);
      if (data.description) setDescription(data.description);
      if (data.date_posted) setDatePosted(data.date_posted);
    } catch (err: any) {
      setScrapeError(err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, company, description, date_posted: datePosted || undefined });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800">Job Details</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* URL Scraper Section */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <label htmlFor="url" className="text-sm font-medium text-slate-700">Import from URL (LinkedIn, etc.)</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.linkedin.com/jobs/view/..."
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              />
            </div>
            <button
              type="button"
              onClick={handleScrape}
              disabled={isScraping || !url}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 sm:w-auto w-full"
            >
              {isScraping ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isScraping ? 'Extracting...' : 'Extract Details'}
            </button>
          </div>
          {scrapeError && (
            <p className="text-sm text-rose-600 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{scrapeError}</span>
            </p>
          )}
        </div>

        {/* Manual Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">Job Title <span className="text-rose-500">*</span></label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="company" className="text-sm font-medium text-slate-700">Company <span className="text-rose-500">*</span></label>
              <input
                id="company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="datePosted" className="text-sm font-medium text-slate-700">Date Posted <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input
              id="datePosted"
              type="date"
              value={datePosted}
              onChange={(e) => setDatePosted(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">Job Description <span className="text-rose-500">*</span></label>
            <textarea
              id="description"
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-y"
              placeholder="Paste the full job description here..."
            />
            <p className="text-xs text-slate-500">Minimum 100 characters required for accurate analysis.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || description.length < 100}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analysing job listing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyse Job
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
