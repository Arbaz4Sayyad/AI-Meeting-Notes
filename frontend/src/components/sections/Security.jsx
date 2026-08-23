import React from 'react';
import { ShieldCheck, Lock, Key, Server } from 'lucide-react';
import Card from '../ui/Card';

const securityItems = [
  {
    icon: Lock,
    title: "Stateless JWT Auth",
    desc: "Cryptographically signed JWT tokens with expiration policies and user session revocation."
  },
  {
    icon: Key,
    title: "OAuth2 Provider Integration",
    desc: "Seamless Google and GitHub OAuth2 authentication without storing raw external credentials."
  },
  {
    icon: ShieldCheck,
    title: "Isolated User Ownership",
    desc: "Row-level user ID association ensures each team or member only accesses their own meetings and notes."
  },
  {
    icon: Server,
    title: "HTTPS & CORS Controls",
    desc: "Strict Cross-Origin Resource Sharing policy and TLS encryption for all API endpoints and database links."
  }
];

export default function Security() {
  return (
    <section id="security" className="py-20 border-t border-slate-200 dark:border-[#1e2436]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Security & Compliance
          </h2>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built with strict data security standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {securityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} padding="default" className="space-y-2.5">
                <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-[#1a1e2d] text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
