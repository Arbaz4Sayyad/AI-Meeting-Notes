import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  FileAudio,
  Copy,
  Check
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        setError(err.response?.data?.message || 'Failed to load meeting details.');
        setMeeting(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveTranscript = () => {
    setSaving(true);
    setSaveSuccess(false);
    meetingsApi.updateTranscript(id, transcript)
      .then((res) => {
        setMeeting(res.data.data);
        setError(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to save transcript.');
      })
      .finally(() => setSaving(false));
  };

  const handleGenerateSummary = () => {
    if (!transcript?.trim()) {
      setError('Please add or paste a transcript before generating a summary.');
      return;
    }
    setGenerating(true);
    setError(null);
    meetingsApi.generateSummary(id)
      .then(() => {
        navigate(`/meetings/${id}/summary`);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to generate summary. Please check your Gemini API configuration.';
        setError(msg);
      })
      .finally(() => setGenerating(false));
  };

  const handleCopyTranscript = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status, hasSummary) => {
    if (hasSummary || status === 'COMPLETED') {
      return <Badge variant="success" dot>Processed</Badge>;
    }
    if (status === 'PROCESSING_AI' || status === 'TRANSCRIBING') {
      return <Badge variant="info" dot>Processing AI</Badge>;
    }
    if (status === 'FAILED') {
      return <Badge variant="danger" dot>Failed</Badge>;
    }
    return <Badge variant="neutral" dot>Draft</Badge>;
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading meeting workspace...</p>
        </div>
      </AppShell>
    );
  }

  if (error && !meeting) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Failed to load meeting</h2>
          <p className="text-xs text-slate-500 mb-4">{error}</p>
          <Link to="/meetings">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              Back to Meetings
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const workspaceTabs = [
    { id: 'transcript', label: 'Transcript', icon: FileText, count: transcript?.length ? `${transcript.length}c` : undefined },
    { id: 'metadata', label: 'Meeting Details', icon: Calendar },
  ];

  return (
    <AppShell>
      {/* Back Navigation & Breadcrumb */}
      <div className="mb-4">
        <Link 
          to="/meetings"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all meetings</span>
        </Link>
      </div>

      {/* Header Info Block */}
      <div className="border-b border-slate-200 dark:border-[#1e2436] pb-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {meeting?.title || 'Untitled Meeting'}
              </h1>
              {getStatusBadge(meeting?.status, meeting?.hasSummary)}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {meeting?.meetingDate 
                  ? new Date(meeting.meetingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                  : new Date(meeting?.createdAt).toLocaleDateString()}
              </span>

              {meeting?.startTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {meeting.startTime} {meeting.endTime ? `- ${meeting.endTime}` : ''}
                </span>
              )}

              {meeting?.meetingType && (
                <span className="inline-flex items-center gap-1 uppercase tracking-wider font-semibold text-slate-400">
                  {meeting.meetingType === 'ONLINE' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                  {meeting.meetingType}
                </span>
              )}
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Save}
              loading={saving}
              onClick={handleSaveTranscript}
            >
              {saveSuccess ? 'Saved!' : 'Save Transcript'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              loading={generating}
              disabled={!transcript?.trim()}
              onClick={handleGenerateSummary}
            >
              {generating ? 'Analyzing with AI...' : 'Generate AI Summary'}
            </Button>

            {meeting?.hasSummary && (
              <Link to={`/meetings/${id}/summary`}>
                <Button variant="accent" size="sm" icon={FileText}>
                  View Summary
                </Button>
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={workspaceTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {/* Tab 1: Transcript Editor */}
      {activeTab === 'transcript' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Meeting Transcript Content
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyTranscript}
                disabled={!transcript}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={18}
              placeholder="Paste or edit the meeting transcript here...&#10;&#10;Example format:&#10;Alice: Let's review the deployment strategy for Q3.&#10;Bob: We have Neon set up for the database and Render for backend."
              className="w-full text-xs sm:text-sm font-mono leading-relaxed bg-white dark:bg-[#12151f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1e2436] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <span>
              💡 Speaker labels (e.g. <code className="font-mono text-slate-700 dark:text-slate-300">Name: ...</code>) ensure clean participant and action item extraction.
            </span>
            <span className="font-mono shrink-0">
              {transcript.length} characters
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Meeting Metadata */}
      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Description & Agenda
            </h3>
            {meeting?.description ? (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">
                {meeting.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic mb-4">No description provided.</p>
            )}

            {meeting?.agendaNotes && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Agenda Notes</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {meeting.agendaNotes}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Logistics & Participants
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Meeting Type</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{meeting?.meetingType || 'ONLINE'}</span>
              </div>

              {meeting?.meetingLink && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Meeting URL</span>
                  <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block">
                    {meeting.meetingLink}
                  </a>
                </div>
              )}

              {meeting?.location && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{meeting.location}</span>
                </div>
              )}

              {meeting?.attendees?.length > 0 && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1.5">Attendees ({meeting.attendees.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {meeting.attendees.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] text-slate-700 dark:text-slate-300">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {meeting?.audioFileUrl && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Attached Audio</span>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    <FileAudio className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{meeting.audioFileUrl}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
