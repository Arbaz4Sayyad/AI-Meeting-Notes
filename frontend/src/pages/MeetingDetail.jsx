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
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    meetingsApi.get(id)
      .then((res) => {
        const m = res.data.data;
        setMeeting(m);
        setTranscript(m?.transcript || '');
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch meeting:', err);
        setError(err.response?.data?.message || 'Failed to load meeting. Please try again.');
        setMeeting(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveTranscript = () => {
    setSaving(true);
    meetingsApi.updateTranscript(id, transcript)
      .then((res) => {
        setMeeting(res.data.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to save transcript.');
      })
      .finally(() => setSaving(false));
  };

  const handleGenerateSummary = () => {
    if (!transcript?.trim()) {
      setError('Please add a transcript before generating a summary.');
      return;
    }
    setGenerating(true);
    setError(null);
    meetingsApi.generateSummary(id)
      .then((res) => {
        // Navigate to summary page after successful generation
        navigate(`/meetings/${id}/summary`);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to generate summary. Please try again.';
        setError(msg);
      })
      .finally(() => setGenerating(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading meeting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !meeting) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Failed to load meeting</h2>
            <p className="text-slate-500 mb-4">{error}</p>
            <Link to="/meetings" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              Back to Meetings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
          <Link to="/meetings" className="hover:text-teal-600">Meetings</Link>
          <span>/</span>
          <span className="text-slate-700">{meeting?.title}</span>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{meeting?.title}</h1>
            {meeting?.createdAt && (
              <p className="text-slate-500 text-sm mt-1">
                Created {new Date(meeting.createdAt).toLocaleString()}
              </p>
            )}
            {meeting?.status && (
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                meeting.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                meeting.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                meeting.status === 'PROCESSING_AI' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {meeting.status}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveTranscript}
              disabled={saving}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Transcript'}
            </button>
            <button
              onClick={handleGenerateSummary}
              disabled={generating || !transcript?.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating AI Summary...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.344.344a3.875 3.875 0 01-2.829 1.172 3.875 3.875 0 01-2.829-1.172l-.343-.344z" />
                  </svg>
                  Generate AI Summary
                </>
              )}
            </button>
            {meeting?.hasSummary && (
              <Link
                to={`/meetings/${id}/summary`}
                className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm hover:bg-teal-200 transition-colors"
              >
                View Summary
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {meeting?.description && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Description</h2>
            <p className="text-slate-600">{meeting.description}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Meeting Transcript
            <span className="ml-2 text-xs text-slate-400 font-normal">
              {transcript.length > 0 ? `(${transcript.length} characters)` : '— Add transcript to generate AI summary'}
            </span>
          </h2>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-72 px-4 py-3 rounded-lg border border-slate-200 text-slate-800 resize-y focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Paste your meeting transcript here... The AI will analyze it to generate a structured summary with action items, decisions, and key points."
          />
          <p className="text-xs text-slate-400 mt-2">
            💡 Tip: Include speaker names (e.g., "Alice: ...") for better participant extraction.
          </p>
        </div>
      </main>
    </div>
  );
}
