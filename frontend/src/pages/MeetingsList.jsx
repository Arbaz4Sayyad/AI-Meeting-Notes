import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  FileText, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';
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
  useEffect(() => { 
    const timer = setTimeout(() => {
      if (page === 0) load(); else setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, from, to]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 bg-gradient-mesh transition-colors duration-500">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Meetings</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Browse and manage your recorded sessions.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all w-64 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-transparent text-xs font-bold px-3 py-1.5 outline-none text-slate-600 dark:text-slate-400"
                />
              </div>
              <div className="text-slate-300">|</div>
              <div className="relative">
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-transparent text-xs font-bold px-3 py-1.5 outline-none text-slate-600 dark:text-slate-400"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Fetching Meetings</div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {meetings.length > 0 ? (
                meetings.map((m) => (
                  <motion.div
                    key={m.id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    whileHover={{ scale: 1.005 }}
                    className="group"
                  >
                    <Link
                      to={`/meetings/${m.id}`}
                      className="block bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-teal-600 transition-colors">
                              {m.title}
                            </h3>
                            {m.meetingType && (
                              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                m.meetingType === 'ONLINE' 
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                  : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                              }`}>
                                {m.meetingType === 'ONLINE' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                {m.meetingType}
                              </span>
                            )}
                          </div>
                          
                          {m.description && (
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1 mb-4">
                              {m.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-5 text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                              <Calendar className="w-3.5 h-3.5 text-teal-500" />
                              {m.meetingDate ? new Date(m.meetingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                            </div>
                            {m.startTime && (
                              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5 text-teal-500" />
                                {m.startTime} {m.endTime ? `- ${m.endTime}` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-4 min-w-fit">
                          <div className="flex items-center gap-2">
                            {m.hasSummary && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20">
                                <Sparkles className="w-3 h-3" />
                                Summary
                              </div>
                            )}
                            {m.audioFileUrl && (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500" title="Audio included">
                                <Video className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-teal-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
                >
                  <Filter className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-lg mb-2">No meetings found</p>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <button onClick={() => { setSearch(''); setFrom(''); setTo(''); }} className="text-teal-600 font-black uppercase tracking-widest text-xs hover:underline">
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page <span className="text-slate-800 dark:text-white">{page + 1}</span> of <span className="text-slate-800 dark:text-white">{totalPages}</span>
              </span>
            </div>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
