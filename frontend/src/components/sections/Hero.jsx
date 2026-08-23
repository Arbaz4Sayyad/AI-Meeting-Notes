import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Github, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Users, 
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Hero() {
  return (
    <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag */}
        <div className="flex justify-center mb-6">
          <a
            href="https://github.com/Arbaz4Sayyad/AI-Meeting-Notes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#1a1e2d] border border-slate-200 dark:border-[#282f45] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Open Source Meeting AI Pipeline</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* Hero Title & Subhead */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Asynchronous meeting intelligence for engineering teams.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Transform high-latency speech processing into structured decisions, clear action item checklists, and risk assessments in under a minute without blocking your UI.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>

            <a
              href="https://github.com/Arbaz4Sayyad/AI-Meeting-Notes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary" icon={Github}>
                View Source on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Real Product UI Mockup */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="rounded-xl border border-slate-200 dark:border-[#1e2436] bg-white dark:bg-[#12151f] shadow-xl overflow-hidden">
            {/* Window bar */}
            <div className="h-9 bg-slate-50 dark:bg-[#0e111a] border-b border-slate-200 dark:border-[#1e2436] px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                meeting-ai.internal/meetings/8492/summary
              </span>
              <div className="w-10" />
            </div>

            {/* Simulated Meeting Workspace */}
            <div className="p-5 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1e2436] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Q3 Architecture & Cloud Deployment Review
                    </h2>
                    <Badge variant="success" dot size="sm">Processed</Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Recorded today · 42 min · 4 participants
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                    Latency: 38s
                  </span>
                </div>
              </div>

              {/* Grid: Overview + Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#161a26] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Executive Summary
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    The engineering team finalized moving database persistence to serverless PostgreSQL on Neon, deploying the Spring Boot container onto Render with JVM memory limits, and publishing the SPA to Vercel.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#161a26] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Key Decisions
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Use Docker container with 384MB heap limit for backend.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Configure client-side rewrites in vercel.json for SPA routing.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Item Rows */}
              <div className="border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] text-xs">
                <div className="p-2.5 px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Configure CORS allowed patterns in Spring Security config
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>Arbaz</span>
                    <Badge variant="danger" size="sm">High</Badge>
                  </div>
                </div>

                <div className="p-2.5 px-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Verify Neon database JDBC connection string in production
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>Dev Team</span>
                    <Badge variant="warning" size="sm">Medium</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-slate-600 dark:text-slate-400 text-center">
          <div className="p-3 border border-slate-200 dark:border-[#1e2436] rounded-lg bg-white dark:bg-[#12151f]">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Asynchronous</span>
            <span>Non-blocking `@Async` pipeline</span>
          </div>
          <div className="p-3 border border-slate-200 dark:border-[#1e2436] rounded-lg bg-white dark:bg-[#12151f]">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Multi-Provider</span>
            <span>Whisper + Google STT fallback</span>
          </div>
          <div className="p-3 border border-slate-200 dark:border-[#1e2436] rounded-lg bg-white dark:bg-[#12151f]">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">ACID Storage</span>
            <span>PostgreSQL persistence</span>
          </div>
          <div className="p-3 border border-slate-200 dark:border-[#1e2436] rounded-lg bg-white dark:bg-[#12151f]">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Secure Auth</span>
            <span>JWT + Google / GitHub OAuth2</span>
          </div>
        </div>
      </div>
    </section>
  );
}
