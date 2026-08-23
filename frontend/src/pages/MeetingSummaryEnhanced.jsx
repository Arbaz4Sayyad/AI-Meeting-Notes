import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check, 
  CheckSquare, 
  Square, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ListTodo,
  Calendar,
  Share2
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function MeetingSummaryEnhanced() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

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

  const toggleTask = (index) => {
    setCompletedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const parseActionItem = (item) => {
    // Standard format: "Task - Owner - Priority - Due Date"
    if (typeof item !== 'string') return { task: JSON.stringify(item), owner: 'Unassigned', priority: 'Medium', dueDate: 'Not specified' };
    const parts = item.split(' - ');
    return {
      task: parts[0] || item,
      owner: parts[1] || 'Unassigned',
      priority: parts[2] || 'Medium',
      dueDate: parts[3] || 'Not specified'
    };
  };

  const getPriorityBadge = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return <Badge variant="danger" size="sm">High Priority</Badge>;
    if (p === 'low') return <Badge variant="neutral" size="sm">Low</Badge>;
    return <Badge variant="warning" size="sm">Medium</Badge>;
  };

  const handleCopySummary = () => {
    if (!summary) return;
    let text = `# Meeting Summary\n\n${summary.summary || ''}\n\n`;
    
    if (summary.decisions?.length) {
      text += `## Decisions Made\n${summary.decisions.map(d => `- ${d}`).join('\n')}\n\n`;
    }
    if (summary.actionItems?.length) {
      text += `## Action Items\n${summary.actionItems.map(a => `- [ ] ${a}`).join('\n')}\n\n`;
    }
    if (summary.keyPoints?.length) {
      text += `## Key Discussion Points\n${summary.keyPoints.map(k => `- ${k}`).join('\n')}\n\n`;
    }
    if (summary.risks?.length) {
      text += `## Risks & Blockers\n${summary.risks.map(r => `- ${r}`).join('\n')}\n\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading AI summary...</p>
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
            Summary not generated yet
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            This meeting does not have an AI summary yet. Generate one from the meeting workspace.
          </p>
          <div className="flex justify-center gap-2">
            <Link to={`/meetings/${id}`}>
              <Button size="sm" variant="primary">
                Open Meeting Workspace
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1e2436] pb-4 mb-6">
        <Link 
          to={`/meetings/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to meeting workspace</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={copied ? Check : Copy}
            onClick={handleCopySummary}
          >
            {copied ? 'Copied to Clipboard' : 'Copy Summary'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={RotateCw}
            loading={generating}
            onClick={handleRegenerate}
          >
            {generating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        </div>
      </div>

      {/* Document Workspace */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Document Header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="success" dot size="sm">AI Generated Notes</Badge>
            <span className="text-[11px] text-slate-400 font-mono">Gemini 2.5 Flash</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Meeting Executive Summary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Structured insights, actionable tasks, decisions, and identified risks extracted from the transcript.
          </p>
        </div>

        {/* 1. Overview Section */}
        {summary.summary && (
          <div className="p-4 sm:p-5 rounded-lg bg-slate-50 dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2436]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Overview
            </h2>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {summary.summary}
            </p>
          </div>
        )}

        {/* 2. Action Items Checklist */}
        {summary.actionItems?.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Action Items ({summary.actionItems.length})
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                {Object.values(completedTasks).filter(Boolean).length} of {summary.actionItems.length} completed
              </span>
            </div>

            <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
              {summary.actionItems.map((item, index) => {
                const parsed = parseActionItem(item);
                const isCompleted = !!completedTasks[index];

                return (
                  <div
                    key={index}
                    onClick={() => toggleTask(index)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isCompleted ? 'bg-slate-50/70 dark:bg-slate-900/30' : 'hover:bg-slate-50/50 dark:hover:bg-[#161a26]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-400 hover:text-blue-600 focus:outline-none"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-medium ${
                        isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {parsed.task}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {parsed.owner && parsed.owner !== 'Unassigned' && (
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                            <Users className="w-3 h-3 text-slate-400" />
                            {parsed.owner}
                          </span>
                        )}
                        {parsed.dueDate && parsed.dueDate !== 'Not specified' && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {parsed.dueDate}
                          </span>
                        )}
                        {getPriorityBadge(parsed.priority)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Decisions Made */}
        {summary.decisions?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Decisions Made ({summary.decisions.length})
            </h2>

            <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
              {summary.decisions.map((decision, index) => (
                <div key={index} className="p-3.5 flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{decision}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Key Discussion Points */}
        {summary.keyPoints?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Key Discussion Points ({summary.keyPoints.length})
            </h2>

            <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
              {summary.keyPoints.map((point, index) => (
                <div key={index} className="p-3.5 flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Risks & Blockers */}
        {summary.risks?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Risks & Blockers ({summary.risks.length})
            </h2>

            <div className="border border-amber-200 dark:border-amber-900/40 rounded-lg divide-y divide-amber-100 dark:divide-amber-950/40 bg-amber-50/30 dark:bg-amber-950/10 overflow-hidden">
              {summary.risks.map((risk, index) => (
                <div key={index} className="p-3.5 flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Next Steps */}
        {summary.nextSteps?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500" />
              Next Steps ({summary.nextSteps.length})
            </h2>

            <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
              {summary.nextSteps.map((step, index) => (
                <div key={index} className="p-3.5 flex items-start gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Participants list */}
        {summary.participants?.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-[#1e2436]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Identified Participants ({summary.participants.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {summary.participants.map((p, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
