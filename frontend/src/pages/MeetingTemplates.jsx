import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mock API service - in real app, this would connect to the backend
const templatesApi = {
  getTemplates: () => Promise.resolve({
    data: {
      success: true,
      data: {
        content: [
          {
            id: 1,
            title: "Weekly Team Standup",
            description: "Template for weekly team sync meetings",
            agendaItems: [
              "Team updates and progress",
              "Blockers and challenges",
              "Upcoming priorities",
              "Action items review"
            ],
            suggestedParticipants: ["Team Lead", "Dev Team", "Product Manager"],
            commonActionItems: [
              "Update project board - Team Lead - High - End of week",
              "Review blockers - Dev Team - Medium - Next standup"
            ],
            isPublic: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            title: "Client Project Review",
            description: "Template for client-facing project review meetings",
            agendaItems: [
              "Project progress overview",
              "Demo of new features",
              "Client feedback and requirements",
              "Next steps and timeline"
            ],
            suggestedParticipants: ["Project Manager", "Tech Lead", "Client Representative"],
            commonActionItems: [
              "Send demo recording - Project Manager - Medium - Within 24 hours",
              "Update project plan - Tech Lead - High - Next week"
            ],
            isPublic: false,
            createdAt: "2024-01-10T14:30:00Z",
            updatedAt: "2024-01-10T14:30:00Z"
          },
          {
            id: 3,
            title: "Sprint Planning",
            description: "Template for agile sprint planning sessions",
            agendaItems: [
              "Previous sprint retrospective",
              "Sprint goal definition",
              "Story estimation and prioritization",
              "Capacity planning and resource allocation"
            ],
            suggestedParticipants: ["Scrum Master", "Product Owner", "Dev Team"],
            commonActionItems: [
              "Create sprint backlog - Product Owner - High - Before sprint start",
              "Setup sprint board - Scrum Master - High - Day 1"
            ],
            isPublic: true,
            createdAt: "2024-01-08T09:00:00Z",
            updatedAt: "2024-01-08T09:00:00Z"
          }
        ],
        totalElements: 3,
        totalPages: 1
      }
    }
  }),
  
  createTemplate: (template) => Promise.resolve({
    data: { success: true, data: { ...template, id: Date.now() } }
  }),
  
  deleteTemplate: (id) => Promise.resolve({
    data: { success: true }
  })
};

export default function MeetingTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, my, public

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await templatesApi.getTemplates();
      setTemplates(response.data.data.content);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await templatesApi.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      const response = await templatesApi.createTemplate(templateData);
      setTemplates([response.data.data, ...templates]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'my') return matchesSearch && !template.isPublic;
    if (filter === 'public') return matchesSearch && template.isPublic;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold text-slate-800">Meeting AI</Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-sm">{user?.name}</span>
            <Link
              to="/meetings/upload"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
            >
              Upload Meeting
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Meeting Templates</h1>
            <p className="text-slate-600 mt-2">Create and manage reusable meeting templates</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Template
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Templates
              </button>
              <button
                onClick={() => setFilter('my')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'my' 
                    ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                My Templates
              </button>
              <button
                onClick={() => setFilter('public')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'public' 
                    ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Public Templates
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{template.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {template.isPublic && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Public</span>
                  )}
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Agenda Items</h4>
                  <ul className="space-y-1">
                    {template.agendaItems.slice(0, 3).map((item, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-center gap-2">
                        <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                    {template.agendaItems.length > 3 && (
                      <li className="text-sm text-slate-400">+{template.agendaItems.length - 3} more</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Suggested Participants</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.suggestedParticipants.slice(0, 3).map((participant, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        {participant}
                      </span>
                    ))}
                    {template.suggestedParticipants.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-400 text-xs rounded-full">
                        +{template.suggestedParticipants.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Created {new Date(template.createdAt).toLocaleDateString()}
                </span>
                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Use Template →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No templates found</h3>
            <p className="text-slate-600 mb-4">Create your first template to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
            >
              Create Template
            </button>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Create Template</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <CreateTemplateForm
                  onSubmit={handleCreateTemplate}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Create Template Form Component
function CreateTemplateForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agendaItems: [''],
    suggestedParticipants: [''],
    commonActionItems: [''],
    isPublic: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty items
    const cleanData = {
      ...formData,
      agendaItems: formData.agendaItems.filter(item => item.trim() !== ''),
      suggestedParticipants: formData.suggestedParticipants.filter(item => item.trim() !== ''),
      commonActionItems: formData.commonActionItems.filter(item => item.trim() !== '')
    };
    
    onSubmit(cleanData);
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Template Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="e.g., Weekly Team Standup"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          rows={3}
          placeholder="Brief description of when to use this template"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Agenda Items</label>
        {formData.agendaItems.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayItem('agendaItems', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Agenda item"
            />
            {formData.agendaItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('agendaItems', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('agendaItems')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
        >
          + Add Agenda Item
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Suggested Participants</label>
        {formData.suggestedParticipants.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayItem('suggestedParticipants', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Participant role or name"
            />
            {formData.suggestedParticipants.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('suggestedParticipants', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('suggestedParticipants')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
        >
          + Add Participant
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Common Action Items</label>
        {formData.commonActionItems.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayItem('commonActionItems', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Task - Owner - Priority - Due Date"
            />
            {formData.commonActionItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('commonActionItems', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('commonActionItems')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
        >
          + Add Action Item
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
        />
        <label htmlFor="isPublic" className="ml-2 text-sm text-slate-700">
          Make this template public (others can see and use it)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Create Template
        </button>
      </div>
    </form>
  );
}
