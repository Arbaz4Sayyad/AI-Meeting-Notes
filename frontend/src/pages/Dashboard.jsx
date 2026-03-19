import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meetingsApi.dashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats({ totalMeetings: 0, recentMeetings: [], meetingsWithSummaries: [], pendingActionItems: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold text-slate-800">Meeting AI</Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-sm">{user?.name}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign out
            </button>
            <Link
              to="/templates"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Templates
            </Link>
            <Link
              to="/analytics"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
            <Link
              to="/meetings/upload"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
            >
              Upload Meeting
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium">Total Meetings</h3>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.totalMeetings ?? 0}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium">Pending Action Items</h3>
                <p className="text-3xl font-bold text-teal-600 mt-1">{stats?.pendingActionItems ?? 0}</p>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Meetings</h2>
              {stats?.recentMeetings?.length ? (
                <div className="space-y-2">
                  {stats.recentMeetings.map((m) => (
                    <Link
                      key={m.id}
                      to={`/meetings/${m.id}`}
                      className="block bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:border-teal-200 transition"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-800">{m.title}</span>
                        {m.hasSummary && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">Summary</span>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No meetings yet. <Link to="/meetings/upload" className="text-teal-600">Upload one</Link></p>
              )}
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Summaries</h2>
              {stats?.meetingsWithSummaries?.length ? (
                <div className="space-y-2">
                  {stats.meetingsWithSummaries.map((m) => (
                    <Link
                      key={m.id}
                      to={`/meetings/${m.id}/summary`}
                      className="block bg-white rounded-lg p-4 shadow-sm border border-slate-100 hover:border-teal-200 transition"
                    >
                      <span className="font-medium text-slate-800">{m.title}</span>
                      <span className="text-sm text-slate-500 ml-2">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No summaries yet. Generate one from a meeting.</p>
              )}
            </section>
          </>
        )}

        <div className="mt-8">
          <Link to="/meetings" className="text-teal-600 hover:text-teal-700 font-medium">View all meetings →</Link>
        </div>
      </main>
    </div>
  );
}
