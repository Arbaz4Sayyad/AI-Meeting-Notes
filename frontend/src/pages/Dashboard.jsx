import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const quickActions = [
    {
      title: 'New Meeting',
      desc: 'Schedule and set up metadata',
      icon: Plus,
      color: 'from-teal-500 to-emerald-500',
      link: '/create-meeting'
    },
    {
      title: 'Upload Audio',
      desc: 'Transcribe recordings with AI',
      icon: Upload,
      color: 'from-blue-500 to-indigo-500',
      link: '/upload-audio'
    },
    {
      title: 'Templates',
      desc: 'Reusable meeting structures',
      icon: Layers,
      color: 'from-purple-500 to-pink-500',
      link: '/templates'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 bg-gradient-mesh transition-colors duration-500">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm tracking-wider uppercase">Overview</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage your meetings and AI-generated insights in one place.
          </p>
        </motion.header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Quick Actions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <Link
                      to={action.link}
                      className="group relative block p-px rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div className="relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg`}>
                          <action.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors uppercase tracking-wide text-xs mb-1">
                            {action.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            {action.desc}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transition-all transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Activity & Summaries */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Meetings */}
                <motion.section variants={itemVariants}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-500" />
                      Recent Activity
                    </h2>
                    <Link to="/meetings" className="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1 group">
                      View All <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {stats?.recentMeetings?.length ? (
                    <div className="space-y-4">
                      {stats.recentMeetings.map((m) => (
                        <Link
                          key={m.id}
                          to={`/meetings/${m.id}`}
                          className="block bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-teal-600 transition-colors">
                                  {m.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                  {m.hasSummary && (
                                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                                      <Sparkles className="w-3 h-3" />
                                      Summary
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 transform group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No meetings yet.</p>
                      <Link to="/create-meeting" className="text-teal-600 font-bold hover:underline mt-2 inline-block">Create your first meeting</Link>
                    </div>
                  )}
                </motion.section>

                {/* Summaries Section */}
                <motion.section variants={itemVariants}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Summaries
                    </h2>
                  </div>

                  {stats?.meetingsWithSummaries?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.meetingsWithSummaries.map((m) => (
                        <Link
                          key={m.id}
                          to={`/meetings/${m.id}/summary`}
                          className="block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <FileText className="w-6 h-6 mb-3 opacity-80" />
                          <h4 className="font-bold line-clamp-1">{m.title}</h4>
                          <p className="text-xs text-indigo-100 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(m.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 text-sm italic">
                      No summaries generated yet. Upload an audio file to get started.
                    </div>
                  )}
                </motion.section>
              </div>

              {/* Right Column: Key Metrics */}
              <div className="space-y-6">
                <motion.section variants={itemVariants}>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Overview</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Total Meetings</h3>
                      </div>
                      <p className="text-5xl font-black text-slate-800 dark:text-white">{stats?.totalMeetings ?? 0}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-teal-600 bg-teal-50 dark:bg-teal-900 px-2 py-1 rounded w-fit">
                        <div className="w-1 h-1 rounded-full bg-teal-500" />
                        Live Status
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Action Items</h3>
                      </div>
                      <p className="text-5xl font-black text-slate-800 dark:text-white">{stats?.pendingActionItems ?? 0}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900 px-2 py-1 rounded w-fit">
                        Pending extraction
                      </div>
                    </div>

                    <Link
                      to="/analytics"
                      className="block p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-black text-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                        <BarChart3 className="w-20 h-20" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        View Analytics
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                        Dive deeper into your meeting metrics and patterns.
                      </p>
                    </Link>
                  </div>
                </motion.section>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
