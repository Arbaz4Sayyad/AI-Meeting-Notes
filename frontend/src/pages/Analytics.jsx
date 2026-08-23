import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';
import { analyticsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyticsApi.get()
      .then((res) => setAnalytics(res.data.data))
      .catch((err) => {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics metrics.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Computing meeting metrics...</p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Failed to load analytics</h2>
          <p className="text-xs text-slate-500 mb-4">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </AppShell>
    );
  }

  const kpis = [
    { label: 'Total Recorded Meetings', value: analytics?.totalMeetings || 0, icon: Users, sub: 'All recorded sessions' },
    { label: 'Summaries Generated', value: analytics?.totalSummaries || 0, icon: FileText, sub: 'AI extraction completed' },
    { label: 'Average Meeting Length', value: `${analytics?.avgDuration || 0} min`, icon: Clock, sub: 'Computed duration' },
    { label: 'Summary Coverage Rate', value: `${analytics?.summaryRate ? Math.round(analytics.summaryRate) : 0}%`, icon: TrendingUp, sub: 'Meetings with AI notes' },
  ];

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Productivity Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key metrics, discussion coverage, and team productivity insights.
          </p>
        </div>

        <Link to="/meetings">
          <Button variant="secondary" size="sm" icon={Calendar}>
            Browse Meetings
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} padding="default">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-medium">{kpi.label}</span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {kpi.value}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {kpi.sub}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Structured Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>AI Pipeline Efficiency</span>
            <Badge variant="success" dot size="sm">Active</Badge>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[#1e2436]">
              <span className="text-slate-600 dark:text-slate-300">Model Engine</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">Gemini 2.5 Flash</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[#1e2436]">
              <span className="text-slate-600 dark:text-slate-300">Processing Mode</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">Asynchronous Non-blocking</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-[#1e2436]">
              <span className="text-slate-600 dark:text-slate-300">Average Summary Latency</span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">&lt; 15 seconds</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600 dark:text-slate-300">Database Consistency</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white">PostgreSQL ACID</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Workflow Summary
          </h2>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">
              Your meeting notes are automatically processed through speech recognition, decision extraction, and risk analysis.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-[#161a26] rounded-md border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-700 dark:text-slate-300">Summary Generation Rate</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {analytics?.summaryRate ? Math.round(analytics.summaryRate) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, analytics?.summaryRate || 0))}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need predefined structures?</span>
              <Link to="/templates" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Browse Templates &rarr;
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
