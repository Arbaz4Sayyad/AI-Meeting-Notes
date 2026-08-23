import React from 'react';
import { UploadCloud, Cpu, Sparkles, CheckSquare } from 'lucide-react';
import Card from '../ui/Card';

const steps = [
  {
    step: "01",
    icon: UploadCloud,
    title: "Upload Audio or Transcript",
    description: "Submit meeting recordings (MP3, WAV, M4A) via REST API or dropzone. Client receives an immediate 200ms ACK."
  },
  {
    step: "02",
    icon: Cpu,
    title: "Asynchronous Speech-to-Text",
    description: "Spring Boot triggers an internal AudioUploadedEvent. Workers transcribe audio using Whisper API with Google STT fallback."
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Gemini 2.5 Flash Summarization",
    description: "LLM parses the conversation to extract executive points, key decisions, assignees, deadlines, and project risks."
  },
  {
    step: "04",
    icon: CheckSquare,
    title: "Actionable Workspace Delivery",
    description: "Insights are persisted into PostgreSQL and delivered to the workspace UI with interactive checklists and export options."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 border-t border-slate-200 dark:border-[#1e2436] bg-slate-50/50 dark:bg-[#0e111a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Execution Flow
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            From audio file to structured decisions in 4 steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <Card key={index} padding="default" className="relative space-y-3">
                <span className="font-mono text-2xl font-bold text-slate-300 dark:text-slate-700 block">
                  {s.step}
                </span>
                <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
