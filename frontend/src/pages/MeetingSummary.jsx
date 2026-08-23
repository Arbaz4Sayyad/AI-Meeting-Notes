import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RotateCw, Copy, Check, FileText } from 'lucide-react';
import { meetingsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function MeetingSummaryPage() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    meetingsApi.getSummary(id)
      .then((res) => setSummary(res.data.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegenerate = () => {
    setGenerating(true);
    meetingsApi.generateSummary(id)
      .then((res) => setSummary(res.data.data))
      .finally(() => setGenerating(false));
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary.summary || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading summary...</p>
        </div>
      </AppShell>
    );
  }

  if (!summary) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
            Summary not found
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Generate one from the meeting workspace.
          </p>
          <Link to={`/meetings/${id}`}>
            <Button size="sm" variant="primary">
              Go to meeting
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const List = ({ items, title }) => (
    items?.length ? (
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h3>
        <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
          {items.map((item, i) => (
            <div key={i} className="p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e2436] pb-4">
          <Link 
            to={`/meetings/${id}`} 
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to meeting</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" icon={RotateCw} loading={generating} onClick={handleRegenerate}>
              Regenerate
            </Button>
          </div>
        </div>

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="success" dot size="sm">AI Generated Summary</Badge>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Meeting Executive Summary
          </h1>

          {summary.summary && (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#161a26] p-4 rounded-md border border-slate-200/80 dark:border-slate-800/80">
              {summary.summary}
            </p>
          )}

          <List items={summary.keyPoints} title="Key Discussion Points" />
          <List items={summary.decisions} title="Decisions Made" />
          <List items={summary.actionItems} title="Action Items" />
          <List items={summary.followUpTasks} title="Follow-up Tasks" />
        </Card>
      </div>
    </AppShell>
  );
}
