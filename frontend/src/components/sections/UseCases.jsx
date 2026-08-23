import React from 'react';
import { Terminal, Users, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';

const useCases = [
  {
    icon: Terminal,
    title: "Engineering & Dev Teams",
    desc: "Capture technical decisions, architecture trade-offs, and Jira action items from sprint planning and standups.",
    points: ["Architecture RFC discussions", "Sprint planning & estimation", "Incident post-mortems"]
  },
  {
    icon: Layers,
    title: "Product & Design Teams",
    desc: "Document user feedback, product requirement reviews, and roadmap milestones with clear deliverables.",
    points: ["Design critique sessions", "Feature scoping & backlog reviews", "Cross-functional syncs"]
  },
  {
    icon: Users,
    title: "Managers & Team Leads",
    desc: "Maintain structured records of 1-on-1s, team capacity allocation, and quarterly objective reviews.",
    points: ["1-on-1 growth syncs", "Quarterly OKR alignment", "Executive project status"]
  },
  {
    icon: ShieldCheck,
    title: "Client & Stakeholder Calls",
    desc: "Create immediate executive summaries following client consultations with verifiable sign-offs.",
    points: ["Milestone deliverable reviews", "Discovery interviews", "Vendor contract reviews"]
  }
];

export default function UseCases() {
  return (
    <section className="py-20 border-t border-slate-200 dark:border-[#1e2436]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Target Workflows
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designed for high-cadence technical collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {useCases.map((uc, index) => {
            const Icon = uc.icon;
            return (
              <Card key={index} padding="default" className="space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-[#1a1e2d] text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {uc.desc}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-[#1e2436]">
                    {uc.points.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
