import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MeetingSummaryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    meetingsApi.getSummary(id)
      .then((res) => setSummary(res.data.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegenerate = () => {
    setGenerating(true);
    meetingsApi.generateSummary(id)
      .then((res) => setSummary(res.data.data))
      .finally(() => setGenerating(false));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!summary) return (
    <div className="p-6">
      <p>Summary not found. Generate it from the meeting page.</p>
      <Link to={`/meetings/${id}`} className="text-teal-600">Go to meeting</Link>
    </div>
  );

  const List = ({ items, title }) => (
    items?.length ? (
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    ) : null
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold text-slate-800">Meeting AI</Link>
          <span className="text-slate-600 text-sm">{user?.name}</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Link to={`/meetings/${id}`} className="text-teal-600 hover:text-teal-700">← Back to meeting</Link>
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {generating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Meeting Summary</h2>
          {summary.summary && (
            <section className="mb-6">
              <p className="text-slate-700 whitespace-pre-wrap">{summary.summary}</p>
            </section>
          )}
          <List items={summary.keyPoints} title="Key discussion points" />
          <List items={summary.decisions} title="Decisions made" />
          <List items={summary.actionItems} title="Action items" />
          <List items={summary.followUpTasks} title="Follow-up tasks" />
        </div>
      </main>
    </div>
  );
}
