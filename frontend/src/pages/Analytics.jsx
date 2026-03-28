import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Target,
  Activity,
  ChevronRight
} from 'lucide-react';
import { analyticsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <BarChart3 className="w-12 h-12 text-teal-500" />
          <div className="text-slate-500 font-medium tracking-widest uppercase text-xs">Analyzing Data...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 glass-card rounded-3xl max-w-sm border-red-100 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analysis Failed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 bg-slate-800 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Meetings', value: analytics?.totalMeetings || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Summaries', value: analytics?.totalSummaries || 0, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Avg Duration', value: `${analytics?.avgDuration || 0}m`, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Summary Rate', value: `${analytics?.summaryRate ? Math.round(analytics.summaryRate) : 0}%`, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 bg-gradient-mesh transition-colors duration-500">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs tracking-wider uppercase">Insights</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              Meeting <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Analytics</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last 30 Days
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
            >
              <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50`} />
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
              </div>
              <p className="text-4xl font-black text-slate-800 dark:text-white relative z-10">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h2>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                  History
                </button>
              </div>
              
              <div className="p-6">
                {analytics?.recentActivity?.length ? (
                  <div className="space-y-4">
                    {analytics.recentActivity.map((activity) => (
                      <motion.div 
                        key={activity.id} 
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${activity.hasSummary ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          <div>
                            <Link to={`/meetings/${activity.id}`} className="font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                              {activity.title}
                            </Link>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>{new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                              <span>•</span>
                              <span>{activity.hasSummary ? 'Summarized' : 'Transcript only'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {activity.hasSummary && (
                            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                              AI Ready
                            </span>
                          )}
                          <Link to={`/meetings/${activity.id}`} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No activity to show yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl group">
              <Target className="w-12 h-12 mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-purple-100 text-xs font-black uppercase tracking-widest mb-1">Success Metric</h3>
              <h2 className="text-3xl font-black mb-4">Summary Efficiency</h2>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black">{analytics?.summaryRate ? Math.round(analytics.summaryRate) : 0}%</span>
                <span className="text-purple-200 text-sm font-bold mb-2">Automated</span>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs font-bold text-purple-200">System optimization: High</div>
                <TrendingUp className="w-5 h-5 text-purple-200" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target className="w-3 h-3 text-emerald-500" />
                Performance KPIs
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Retention</span>
                  <span className="text-xs font-black text-emerald-600">92%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[92%]" />
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Accuracy</span>
                  <span className="text-xs font-black text-indigo-600">98%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[98%]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
