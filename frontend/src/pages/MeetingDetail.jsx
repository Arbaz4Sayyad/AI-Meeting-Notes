import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function MeetingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    meetingsApi.get(id).then((res) => {
      const m = res.data.data;
      setMeeting(m);
      setTranscript(m?.transcript || '');
    }).catch(() => setMeeting(null));
  }, [id]);

  const handleSaveTranscript = () => {
    setSaving(true);
    meetingsApi.updateTranscript(id, transcript)
      .then((res) => setMeeting(res.data.data))
      .finally(() => setSaving(false));
  };

  const handleGenerateSummary = () => {
    setGenerating(true);
    meetingsApi.generateSummary(id)
      .then(() => navigate(`/meetings/${id}/summary`))
      .catch((err) => alert(err.response?.data?.message || 'Failed'))
      .finally(() => setGenerating(false));
  };

  if (!meeting) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{meeting.title}</h1>
            <p className="text-slate-500 text-sm">{new Date(meeting.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveTranscript}
              disabled={saving}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save transcript'}
            </button>
            <button
              onClick={handleGenerateSummary}
              disabled={generating || !transcript?.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate summary'}
            </button>
            {meeting.hasSummary && (
              <Link
                to={`/meetings/${id}/summary`}
                className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm hover:bg-teal-200"
              >
                View summary
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Transcript</h2>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-64 px-4 py-3 rounded-lg border border-slate-200 text-slate-800 resize-y"
            placeholder="Meeting transcript..."
          />
        </div>
      </main>
    </div>
  );
}
