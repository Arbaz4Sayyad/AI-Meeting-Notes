import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { BarChart3, Users, FileText, Clock, TrendingUp, Calendar } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsApi.get();
        setAnalytics(response.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-teal-600 hover:text-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-slate-500 text-sm font-medium">Total Meetings</h3>
            </div>
            <p className="text-3xl font-bold text-slate-800">{analytics?.totalMeetings || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-green-600" />
              <h3 className="text-slate-500 text-sm font-medium">Total Summaries</h3>
            </div>
            <p className="text-3xl font-bold text-slate-800">{analytics?.totalSummaries || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <h3 className="text-slate-500 text-sm font-medium">Avg Duration</h3>
            </div>
            <p className="text-3xl font-bold text-slate-800">{analytics?.avgDuration || 0}m</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              <h3 className="text-slate-500 text-sm font-medium">Summary Rate</h3>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {analytics?.summaryRate ? Math.round(analytics.summaryRate) : 0}%
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          </div>
          
          {analytics?.recentActivity?.length ? (
            <div className="space-y-3">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.hasSummary ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <Link to={`/meetings/${activity.id}`} className="font-medium text-slate-800 hover:text-teal-600">
                        {activity.title}
                      </Link>
                      <div className="text-sm text-slate-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {activity.hasSummary && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Summary</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No recent activity</p>
          )}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Recent Meetings (30 days)</h3>
            <p className="text-2xl font-bold text-slate-800">{analytics?.recentMeetings || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Meetings with Summaries</h3>
            <p className="text-2xl font-bold text-slate-800">{analytics?.meetingsWithSummaries || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
