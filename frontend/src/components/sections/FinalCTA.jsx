import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';
import Button from '../ui/Button';

export default function FinalCTA() {
  return (
    <section className="py-20 border-t border-slate-200 dark:border-[#1e2436] bg-slate-50/50 dark:bg-[#0e111a]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Ready to streamline your engineering meetings?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Create your free workspace account to start uploading meeting recordings, generating transcripts, and tracking action items.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
              Star on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
