import React from 'react';
import Card from '../ui/Card';

const stack = [
  { layer: "Backend Service", tech: "Java 17 / Spring Boot 3", desc: "REST controllers, asynchronous event listeners, Spring Security, JPA/Hibernate" },
  { layer: "Frontend Client", tech: "React 19 / Vite / TailwindCSS", desc: "Modern SPA architecture with responsive client-side routing and clean state management" },
  { layer: "Database Storage", tech: "PostgreSQL 16", desc: "ACID transactions, relational indexes, cascade deletes, and JSONB structure storage" },
  { layer: "AI & Transcription", tech: "Gemini 2.5 Flash + Whisper", desc: "High-accuracy speech-to-text with LLM decision and action item extraction" },
  { layer: "Authentication", tech: "JWT + OAuth2 (Google / GitHub)", desc: "Stateless Bearer authentication with token verification filters" },
  { layer: "Infrastructure", tech: "Docker Compose / Multi-Stage Dockerfiles", desc: "Containerized deployment optimized with JVM memory tuning for free cloud tiers" }
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-20 border-t border-slate-200 dark:border-[#1e2436]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Technology Stack
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built with modern, production-grade tools
          </p>
        </div>

        <div className="max-w-4xl mx-auto border border-slate-200 dark:border-[#1e2436] rounded-lg divide-y divide-slate-200 dark:divide-[#1e2436] bg-white dark:bg-[#12151f] overflow-hidden">
          {stack.map((item, index) => (
            <div key={index} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="w-44 shrink-0">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {item.layer}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {item.tech}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
