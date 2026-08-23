import React from 'react';
import { XCircle, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import Card from '../ui/Card';

export default function ProblemSolution() {
  return (
    <section className="py-16 border-t border-slate-200 dark:border-[#1e2436] bg-slate-50/50 dark:bg-[#0e111a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Why We Built This
          </h2>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Meeting knowledge gets lost in audio files and scattered notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional Manual Process */}
          <Card className="border-rose-200 dark:border-rose-950/50 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Without AI Meeting Pipeline</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>Engineers spend 15–30 minutes per meeting typing manual summaries.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>Action items lack clear assignees or get forgotten across chat channels.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>Synchronous processing blocks the client and fails on large audio files.</span>
              </div>
            </div>
          </Card>

          {/* AI Meeting Notes Solution */}
          <Card className="border-emerald-200 dark:border-emerald-950/50 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>With AI Meeting Pipeline</span>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Automated audio processing in &lt; 45s with multi-provider transcription fallback.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Structured extraction of owners, deadlines, decisions, and identified risks.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Asynchronous `@Async` architecture keeps API response times under 300ms.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
