import React from 'react';
import { Layers, Zap, Database, GitBranch } from 'lucide-react';
import Card from '../ui/Card';

export default function ArchitectureHighlight() {
  return (
    <section id="architecture" className="py-20 border-t border-slate-200 dark:border-[#1e2436] bg-slate-50/50 dark:bg-[#0e111a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            System Design
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Event-driven asynchronous processing
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card padding="default" className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Handling High Latency Without Blocking Clients
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI speech transcription and LLM summarization take anywhere between 15 to 45 seconds for a typical meeting recording. Standard synchronous HTTP architectures cause connection timeouts, UI lockup, and poor user experience.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This system solves latency with Spring Boot's internal <code className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">ApplicationEventPublisher</code>. Uploads return immediately with a <code className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">201 Created</code> status, while worker threads execute transcription, prompt summarization, and database persistence in the background.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="sm">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">API Response</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">200–500ms</span>
              <p className="text-[11px] text-slate-500 mt-1">Non-blocking audio ingestion</p>
            </Card>
            <Card padding="sm">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Processing Time</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">&lt; 45s</span>
              <p className="text-[11px] text-slate-500 mt-1">For a 15-minute recording</p>
            </Card>
            <Card padding="sm">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Note-Taking Effort</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">↓ 70%</span>
              <p className="text-[11px] text-slate-500 mt-1">Automated decision extraction</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
