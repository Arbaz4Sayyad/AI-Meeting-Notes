import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileCode2, 
  Plus, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Calendar, 
  Clock, 
  Search,
  Sparkles
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const defaultTemplates = [
  {
    id: 1,
    title: "Weekly Engineering Standup",
    category: "Agile & Dev",
    description: "High-cadence sync for engineering teams to align on progress, identify blockers, and review weekly milestones.",
    agendaItems: [
      "Completed tasks from last cycle",
      "Current priorities & active PRs",
      "Blockers, dependencies & infrastructure issues",
      "Review sprint burndown & action items"
    ],
    suggestedParticipants: ["Engineering Lead", "Frontend Engineer", "Backend Engineer", "QA Engineer"],
    estimatedDuration: "15-30 min"
  },
  {
    id: 2,
    title: "Sprint Planning & Estimation",
    category: "Agile & Dev",
    description: "Framework for agile story point estimation, capacity allocation, and sprint goal finalization.",
    agendaItems: [
      "Review previous sprint retrospective takeaways",
      "Sprint goal alignment with product roadmap",
      "Story breakdown, acceptance criteria review & estimation",
      "Team capacity allocation & commitment"
    ],
    suggestedParticipants: ["Product Manager", "Scrum Master", "Engineering Team"],
    estimatedDuration: "45-60 min"
  },
  {
    id: 3,
    title: "1-on-1 Sync & Career Growth",
    category: "Management",
    description: "Dedicated check-in between manager and report for feedback, priority alignment, and growth coaching.",
    agendaItems: [
      "Well-being, energy & workload check-in",
      "Current project wins, challenges & feedback",
      "Strategic alignment & quarterly OKR progress",
      "Action items & follow-ups"
    ],
    suggestedParticipants: ["Manager", "Team Member"],
    estimatedDuration: "30-45 min"
  },
  {
    id: 4,
    title: "Technical Architecture Review",
    category: "Architecture",
    description: "Structured design review for proposed RFCs, new microservices, database schemas, and API contracts.",
    agendaItems: [
      "Problem statement & non-functional requirements (SLA, latency)",
      "Proposed architecture & system design trade-offs",
      "Data model, schema migrations & consistency guarantees",
      "Failure modes, fallbacks & rollout strategy"
    ],
    suggestedParticipants: ["Staff Engineer", "Tech Lead", "Security Lead", "DevOps"],
    estimatedDuration: "45-60 min"
  },
  {
    id: 5,
    title: "Client Discovery & Status Review",
    category: "Business",
    description: "Client-facing check-in to review deliverable milestones, capture feedback, and agree on next steps.",
    agendaItems: [
      "Project milestone progress & live demo",
      "Client feedback & scope adjustments",
      "Timeline & deliverable review",
      "Agreed action items and sign-offs"
    ],
    suggestedParticipants: ["Project Manager", "Account Executive", "Client Stakeholders"],
    estimatedDuration: "30-45 min"
  },
  {
    id: 6,
    title: "Incident Post-Mortem / RCA",
    category: "DevOps & SRE",
    description: "Blameless root cause analysis following a production incident to document learnings and remediation tasks.",
    agendaItems: [
      "Incident timeline & user impact summary",
      "Root cause analysis (5 Whys framework)",
      "What went well & what went wrong during response",
      "Action items to prevent recurrence with owners & deadlines"
    ],
    suggestedParticipants: ["Incident Commander", "SRE", "Service Owners"],
    estimatedDuration: "45-60 min"
  }
];

export default function MeetingTemplates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Agile & Dev', 'Management', 'Architecture', 'Business', 'DevOps & SRE'];

  const filteredTemplates = defaultTemplates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleUseTemplate = (template) => {
    navigate('/create-meeting', { state: { template } });
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Meeting Templates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Standardized agendas and structures for consistent meeting notes and action tracking.
          </p>
        </div>

        <Link to="/create-meeting">
          <Button size="sm" icon={Plus}>
            Blank Meeting
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'bg-white dark:bg-[#12151f] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1e2436] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#12151f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1e2436] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} hover padding="default" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="neutral" size="sm">{template.category}</Badge>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {template.estimatedDuration}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                {template.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {template.description}
              </p>

              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Agenda Outline
                </span>
                {template.agendaItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span className="leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#1e2436] flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {template.suggestedParticipants.length} suggested roles
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUseTemplate(template)}
              >
                Use Template &rarr;
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
