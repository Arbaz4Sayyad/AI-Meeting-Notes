import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  UploadCloud, 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  AlertCircle,
  FileCode2
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meetingsApi.dashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats({ totalMeetings: 0, recentMeetings: [], meetingsWithSummaries: [], pendingActionItems: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status, hasSummary) => {
    if (hasSummary || status === 'COMPLETED') {
      return <Badge variant="success" dot size="sm">Processed</Badge>;
    }
    if (status === 'PROCESSING_AI' || status === 'TRANSCRIBING') {
      return <Badge variant="info" dot size="sm">Processing</Badge>;
    }
    if (status === 'FAILED') {
      return <Badge variant="danger" dot size="sm">Failed</Badge>;
    }
    return <Badge variant="neutral" dot size="sm">Draft</Badge>;
  };

  return (
    <AppShell>
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status of your meetings, transcripts, and AI-extracted notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/upload-audio">
            <Button variant="secondary" size="sm" icon={UploadCloud}>
              Upload Recording
            </Button>
          </Link>
          <Link to="/create-meeting">
            <Button variant="primary" size="sm" icon={Plus}>
              New Meeting
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading workspace data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Card padding="sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Meetings</span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {stats?.totalMeetings ?? 0}
                </span>
                <span className="text-[11px] text-slate-400">recorded</span>
              </div>
            </Card>

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Summaries Ready</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {stats?.meetingsWithSummaries?.length ?? 0}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">AI generated</span>
              </div>
            </Card>

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Action Items</span>
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {stats?.pendingActionItems ?? 0}
                </span>
                <span className="text-[11px] text-slate-400">tracked</span>
              </div>
            </Card>

            <Card padding="sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pipeline Health</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Operational
                </span>
                <span className="text-[11px] text-slate-400">Gemini 2.5 Flash</span>
              </div>
            </Card>
          </div>

          {/* Main Grid: Recent Meetings List + Sidebar Helper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Recent Meetings List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  Recent Meetings
                </h2>
                <Link to="/meetings" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {stats?.recentMeetings?.length ? (
                <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
                  {stats.recentMeetings.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-[#161a26] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            to={`/meetings/${m.id}`}
                            className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate"
                          >
                            {m.title || 'Untitled Meeting'}
                          </Link>
                          {getStatusBadge(m.status, m.hasSummary)}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(m.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {m.meetingType && (
                            <span className="uppercase text-[10px] tracking-wider font-semibold text-slate-400">
                              · {m.meetingType}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {m.hasSummary ? (
                          <Link to={`/meetings/${m.id}/summary`}>
                            <Button variant="secondary" size="sm">
                              Summary
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/meetings/${m.id}`}>
                            <Button variant="outline" size="sm">
                              Workspace
                            </Button>
                          </Link>
                        )}
                        <Link to={`/meetings/${m.id}`}>
                          <button
                            type="button"
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Open meeting"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No meetings recorded yet"
                  description="Create a meeting or upload an audio recording to start extracting AI summaries and action items."
                  actionLabel="Create First Meeting"
                  onAction={() => navigate('/create-meeting')}
                />
              )}
            </div>

            {/* Right: Quick Guides & Summaries */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Quick Shortcuts
              </h2>

              <Card padding="sm" className="space-y-3">
                <Link
                  to="/upload-audio"
                  className="flex items-start gap-3 p-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-[#161a26] transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Audio Processing
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Upload MP3, WAV, or M4A for automatic speech-to-text.
                    </p>
                  </div>
                </Link>

                <Link
                  to="/templates"
                  className="flex items-start gap-3 p-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-[#161a26] transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Meeting Templates
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Use predefined structures for Standups, Sprint Planning & 1-on-1s.
                    </p>
                  </div>
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-start gap-3 p-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-[#161a26] transition-colors group"
                >
                  <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Productivity Analytics
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Review meeting volume, action item tracking & durations.
                    </p>
                  </div>
                </Link>
              </Card>

              {/* AI Processing Info banner */}
              <div className="p-3.5 rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-800 dark:text-blue-300">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  Asynchronous AI Engine
                </div>
                <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                  Audio files are processed asynchronously in the background so your workflow is never blocked.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
