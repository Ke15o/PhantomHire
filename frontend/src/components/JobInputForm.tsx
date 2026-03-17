import { AlertCircle, FileText, Sparkles } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import type { AnalyseRequest } from '../types';

interface JobInputFormProps {
  onSubmit: (payload: AnalyseRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const legitimateExample = {
  title: 'Junior Data Analyst',
  company: 'Northbridge Analytics',
  description:
    'Northbridge Analytics is hiring a Junior Data Analyst to join our commercial insights team in London. In this role, you will build weekly reporting dashboards, write SQL queries against PostgreSQL data sources, and support analysts with Python-based data cleaning and modelling tasks. You will work closely with the Head of Insights and the marketing team to measure campaign performance, customer retention, and revenue trends. Candidates should have experience with SQL, Excel, and either Python or R, and should be comfortable presenting findings to non-technical stakeholders. Experience with Power BI, A/B testing, statistics, and dashboard design is desirable. The salary for this role is 38000 to 42000 per annum plus pension, 25 days holiday, and an annual performance bonus.',
  date_posted: '2026-03-10',
};

const suspiciousExample = {
  title: 'Operations Associate',
  company: 'Vertex Growth Partners',
  description:
    'We are looking for a motivated individual to join our dynamic team in a fast-paced environment. This exciting opportunity is ideal for a self-starter who can wear many hats and hit the ground running. The successful candidate will support various responsibilities across multiple business functions and work closely with stakeholders to deliver results. You should be a team player with excellent communication skills, a growth mindset, and a flexible approach to changing priorities. This role offers the chance to make an impact in a results-driven environment while contributing to a range of strategic initiatives across the business. Candidates should be adaptable, proactive, and comfortable supporting a variety of ongoing projects and operational needs as required by the organisation.',
  date_posted: '2026-01-01',
};

export default function JobInputForm({ onSubmit, isLoading, error }: JobInputFormProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [description, setDescription] = useState('');

  const remainingHint = useMemo(() => {
    const deficit = 100 - description.trim().length;
    return deficit > 0 ? `${deficit} more characters needed` : 'Ready to analyse';
  }, [description]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      title,
      company,
      date_posted: datePosted || undefined,
      description,
    });
  };

  const loadExample = (kind: 'legitimate' | 'suspicious') => {
    const source = kind === 'legitimate' ? legitimateExample : suspiciousExample;
    setTitle(source.title);
    setCompany(source.company);
    setDescription(source.description);
    setDatePosted(source.date_posted);
  };

  return (
    <section className="panel panel-form">
      <div className="panel-header">
        <div>
          <h2>Job details</h2>
          <p>Paste the listing text directly. This route is stable and works with your current backend.</p>
        </div>
        <div className="example-buttons">
          <button type="button" className="secondary-button small-button" onClick={() => loadExample('legitimate')}>
            Load active example
          </button>
          <button type="button" className="secondary-button small-button" onClick={() => loadExample('suspicious')}>
            Load ghost example
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="job-form">
        <div className="field-grid">
          <label className="field">
            <span>Job title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Graduate Software Engineer"
            />
          </label>

          <label className="field">
            <span>Company</span>
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Example Corp"
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="field field-date">
            <span>Date posted</span>
            <input
              type="date"
              value={datePosted}
              onChange={(event) => setDatePosted(event.target.value)}
            />
          </label>

          <div className="helper-card">
            <Sparkles size={18} />
            <div>
              <strong>Input rule</strong>
              <p>Description must be at least 100 characters. Title, company, and date can be blank.</p>
            </div>
          </div>
        </div>

        <label className="field">
          <span>Job description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Paste the full job advert here..."
            rows={12}
          />
        </label>

        <div className="description-meta">
          <div className="description-count">
            <FileText size={16} />
            <span>{description.trim().length} characters</span>
          </div>
          <div className={description.trim().length >= 100 ? 'hint success' : 'hint'}>{remainingHint}</div>
        </div>

        {error ? (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="primary-button"
          disabled={isLoading || description.trim().length < 100}
        >
          {isLoading ? 'Analysing…' : 'Analyse listing'}
        </button>
      </form>
    </section>
  );
}
