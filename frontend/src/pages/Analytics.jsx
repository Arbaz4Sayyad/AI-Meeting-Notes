import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = () => {
    setLoading(true);
    // This would be a new API endpoint for analytics
    // For now, we'll use dashboard stats and enhance them
    meetingsApi.getDashboardStats()
      .then((res) => {
        // Transform data for analytics
        setStats({
          totalMeetings: res.data.data.totalMeetings,
          pendingActionItems: res.data.data.pendingActionItems,
          recentMeetings: res.data.data.recentMeetings,
          meetingsWithSummaries: res.data.data.meetingsWithSummaries,
          // Additional analytics data
          averageMeetingDuration: calculateAverageDuration(res.data.data.recentMeetings),
          meetingFrequency: calculateFrequency(res.data.data.recentMeetings),
          actionItemCompletion: calculateCompletionRate(res.data.data.meetingsWithSummaries),
          productivityScore: calculateProductivityScore(res.data.data),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const calculateAverageDuration = (meetings) => {
    // Mock calculation - in real app, this would come from backend
    return 45; // minutes
  };

  const calculateFrequency = (meetings) => {
    // Mock calculation - meetings per week
    return (meetings?.length || 0) / 4;
  };

  const calculateCompletionRate = (summaries) => {
    // Mock calculation - action item completion rate
    return 75; // percentage
  };

  const calculateProductivityScore = (data) => {
    // Mock productivity score based on various metrics
    return 85; // out of 100
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const MetricCard = ({ title, value, icon, trend, color = "teal" }) => {
    const colorClasses = {
      teal: 'bg-teal-50 text-teal-700 border-teal-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };

    return (
      <div className={`p-6 rounded-xl border ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold text-slate-800">Meeting AI</Link>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-slate-200 rounded-lg text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <span className="text-slate-600 text-sm">{user?.name}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">Track your meeting productivity and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Meetings"
            value={stats?.totalMeetings || 0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            trend={12}
            color="teal"
          />
          <MetricCard
            title="Action Items"
            value={stats?.pendingActionItems || 0}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            trend={-5}
            color="blue"
          />
          <MetricCard
            title="Avg Duration"
            value={`${stats?.averageMeetingDuration || 0}m`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={8}
            color="green"
          />
          <MetricCard
            title="Productivity Score"
            value={`${stats?.productivityScore || 0}%`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            trend={15}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Meeting Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Meeting Trends</h3>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Chart visualization would go here</p>
                <p className="text-sm">Integration with Chart.js or similar</p>
              </div>
            </div>
          </div>

          {/* Action Item Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Action Item Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Completed</span>
                  <span className="font-medium">{stats?.actionItemCompletion || 0}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${stats?.actionItemCompletion || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">In Progress</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Overdue</span>
                  <span className="font-medium">5%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentMeetings?.slice(0, 5).map((meeting, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{meeting.title}</p>
                    <p className="text-sm text-slate-500">{new Date(meeting.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.hasSummary && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Summary
                    </span>
                  )}
                  <span className="text-sm text-slate-500">
                    {meeting.transcript ? 'Has transcript' : 'No transcript'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
            <h4 className="font-semibold text-teal-800 mb-2">Meeting Efficiency</h4>
            <p className="text-sm text-teal-700">
              Your meetings are 20% more efficient than last month. Keep up the great work!
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Action Item Focus</h4>
            <p className="text-sm text-blue-700">
              You have {stats?.pendingActionItems || 0} pending action items. Consider prioritizing high-priority items.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">Productivity Tip</h4>
            <p className="text-sm text-purple-700">
              Try setting clear agendas before meetings to improve action item completion rates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
