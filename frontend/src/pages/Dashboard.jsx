import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

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
      </main>
    </div>
  );
}
