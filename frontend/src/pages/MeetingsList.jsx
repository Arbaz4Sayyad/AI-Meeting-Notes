import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Filter,
  FileAudio
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function MeetingsList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = () => {
    setLoading(true);
    meetingsApi
      .list({ page, size: 10, search: search || undefined, from: from || undefined, to: to || undefined })
      .then((res) => {
        const d = res.data;
        setMeetings(d.data || []);
        setTotalPages(d.page?.totalPages ?? 1);
        setTotal(d.page?.totalElements ?? 0);
      })
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page]);
  
  useEffect(() => { 
    const timer = setTimeout(() => {
      if (page === 0) load(); else setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, from, to]);

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
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              All Meetings
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {total}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter, and review meeting transcripts and AI summaries.
          </p>
        </div>

        <Link to="/create-meeting">
          <Button size="sm" icon={Plus}>
            New Meeting
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-[#12151f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1e2436] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2436] rounded-md px-2.5 py-1 text-xs">
            <span className="text-slate-400 mr-2 text-[11px] font-medium">From:</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none"
            />
          </div>

          <div className="flex items-center bg-white dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2436] rounded-md px-2.5 py-1 text-xs">
            <span className="text-slate-400 mr-2 text-[11px] font-medium">To:</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none"
            />
          </div>

          {(search || from || to) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setFrom(''); setTo(''); }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 underline font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Fetching meetings...</p>
        </div>
      ) : meetings.length > 0 ? (
        <div className="space-y-3">
          <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#161a26] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/meetings/${m.id}`}
                      className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                    >
                      {m.title || 'Untitled Meeting'}
                    </Link>
                    {getStatusBadge(m.status, m.hasSummary)}
                  </div>

                  {m.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                      {m.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {m.meetingDate
                        ? new Date(m.meetingDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : new Date(m.createdAt).toLocaleDateString()}
                    </span>

                    {m.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {m.startTime} {m.endTime ? `- ${m.endTime}` : ''}
                      </span>
                    )}

                    {m.meetingType && (
                      <span className="inline-flex items-center gap-1 uppercase tracking-wider font-semibold text-slate-400">
                        {m.meetingType === 'ONLINE' ? (
                          <Video className="w-3 h-3 text-blue-500" />
                        ) : (
                          <MapPin className="w-3 h-3 text-amber-500" />
                        )}
                        {m.meetingType}
                      </span>
                    )}

                    {m.audioFileUrl && (
                      <span className="inline-flex items-center gap-1 text-slate-400" title="Audio recording available">
                        <FileAudio className="w-3.5 h-3.5" />
                        Audio attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {m.hasSummary ? (
                    <Link to={`/meetings/${m.id}/summary`}>
                      <Button variant="secondary" size="sm">
                        View Summary
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/meetings/${m.id}`}>
                      <Button variant="outline" size="sm">
                        Open Workspace
                      </Button>
                    </Link>
                  )}
                  <Link to={`/meetings/${m.id}`}>
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Open details"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={search ? "No matching meetings found" : "No meetings found"}
          description={search ? "Try adjusting your search query or clear date filters." : "Create your first meeting to begin organizing notes and AI insights."}
          actionLabel={search ? "Clear Search" : "Create Meeting"}
          onAction={search ? () => { setSearch(''); setFrom(''); setTo(''); } : undefined}
        />
      )}
    </AppShell>
  );
}
