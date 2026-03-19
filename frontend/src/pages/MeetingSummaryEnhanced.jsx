import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function MeetingSummaryEnhanced() {
  const { id } = useParams();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    meetingsApi.getSummary(id)
      .then((res) => setSummary(res.data.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegenerate = () => {
    setGenerating(true);
    meetingsApi.generateSummary(id)
      .then((res) => setSummary(res.data.data))
      .finally(() => setGenerating(false));
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const parseActionItem = (item) => {
    // Parse action item format: "Task - Owner - Priority - Due Date"
    const parts = item.split(' - ');
    return {
      task: parts[0] || item,
      owner: parts[1] || 'Unassigned',
      priority: parts[2] || 'Medium',
      dueDate: parts[3] || 'Not specified'
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!summary) return (
    <div className="p-6">
      <p>Summary not found. Generate it from the meeting page.</p>
      <Link to={`/meetings/${id}`} className="text-teal-600">Go to meeting</Link>
    </div>
  );

  const ActionItemsList = ({ items }) => {
    if (!items?.length) return null;

    return (
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Action Items
          <span className="ml-2 text-sm bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
            {items.length}
          </span>
        </h3>
        <div className="space-y-3">
          {items.map((item, index) => {
            const parsed = parseActionItem(item);
            const isExpanded = expandedItems[index];
            
            return (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-slate-800">{parsed.task}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(parsed.priority)}`}>
                        {parsed.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {parsed.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {parsed.dueDate}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(index)}
                    className="ml-4 text-teal-600 hover:text-teal-700"
                  >
                    <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
                    <p><strong>Original text:</strong> {item}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const ParticipantsList = ({ participants }) => {
    if (!participants?.length) return null;

    return (
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Participants
          <span className="ml-2 text-sm bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
            {participants.length}
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-800">{participant}</p>
                <p className="text-xs text-slate-500">Participant</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const StandardList = ({ items, title, icon }) => {
    if (!items?.length) return null;

    return (
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
          {icon}
          {title}
          <span className="ml-2 text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
            {items.length}
          </span>
        </h3>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-slate-700">{item}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Link to={`/meetings/${id}`} className="text-teal-600 hover:text-teal-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to meeting
          </Link>
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {generating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Meeting Summary</h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Generated by AI
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {summary.summary && (
            <section className="mb-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Executive Summary
              </h3>
              <p className="text-slate-700 leading-relaxed">{summary.summary}</p>
            </section>
          )}

          <ActionItemsList items={summary.actionItems} />
          <StandardList 
            items={summary.decisions} 
            title="Decisions Made"
            icon={
              <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StandardList 
            items={summary.keyPoints} 
            title="Key Discussion Points"
            icon={
              <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StandardList 
            items={summary.risks} 
            title="Risks & Blockers"
            icon={
              <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />
          <StandardList 
            items={summary.nextSteps} 
            title="Next Steps"
            icon={
              <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            }
          />
          <ParticipantsList participants={summary.participants} />
        </div>
      </main>
    </div>
  );
}
