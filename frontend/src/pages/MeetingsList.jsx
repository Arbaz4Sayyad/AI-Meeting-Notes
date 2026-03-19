import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function MeetingsList() {
  const { user } = useAuth();
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
  useEffect(() => { if (page === 0) load(); else setPage(0); }, [search, from, to]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Meetings</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 w-64"
          />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200"
          />
        </div>

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : (
          <div className="space-y-2">
            {meetings.map((m) => (
              <Link
                key={m.id}
                to={`/meetings/${m.id}`}
                className="block bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:border-teal-200 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{m.title}</div>
                    {m.description && (
                      <div className="text-sm text-slate-600 mt-1">{m.description}</div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      {m.meetingDate && (
                        <span>{new Date(m.meetingDate).toLocaleDateString()}</span>
                      )}
                      {m.startTime && m.endTime && (
                        <span>{m.startTime} - {m.endTime}</span>
                      )}
                      {m.meetingType && (
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                          {m.meetingType === 'ONLINE' ? 'Online' : 'Offline'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {m.hasSummary && (
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">Summary</span>
                    )}
                    {m.audioFileUrl && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Audio</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-2 text-slate-600">
              Page {page + 1} of {totalPages} ({total} total)
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
