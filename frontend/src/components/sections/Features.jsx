import React from 'react';
import { 
  Zap, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Layers, 
  FileCheck2, 
  Clock, 
  Share2 
} from 'lucide-react';
import Card from '../ui/Card';

const features = [
  {
    icon: Zap,
    title: "Asynchronous Pipeline",
    description: "Decoupled audio upload and transcription pipeline using Spring Boot event publishing and non-blocking workers."
  },
  {
    icon: Cpu,
    title: "Multi-Provider Fallback",
    description: "Automatic transcription fallback mechanism between Whisper API, Google Speech-to-Text, and direct transcript ingestion."
  },
  {
    icon: FileCheck2,
    title: "Gemini 2.5 Flash Intelligence",
    description: "Structured extraction of decisions, assignees, deadlines, discussion points, and identified risk blockers."
  },
  {
    icon: Database,
    title: "PostgreSQL ACID Storage",
    description: "Strong consistency guarantees for all meeting metadata, transcripts, structured summaries, and user accounts."
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description: "Stateless JWT token authentication combined with OAuth2 social login (Google & GitHub) and bcrypt password hashing."
  },
  {
    icon: Layers,
    title: "Standardized Templates",
    description: "Pre-configured agendas for Standups, Sprint Planning, Architecture Reviews, and 1-on-1 career syncs."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-slate-200 dark:border-[#1e2436]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Engineered for Reliability
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Core capabilities and architectural design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} padding="default" className="space-y-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-[#1a1e2d] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#282f45] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
