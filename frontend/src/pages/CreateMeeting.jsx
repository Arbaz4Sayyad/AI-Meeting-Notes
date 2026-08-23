import React, { useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Plus, 
  X, 
  FileAudio,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';

export default function CreateMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const templateData = location.state?.template;

  const [formData, setFormData] = useState({
    title: templateData?.title || '',
    description: templateData?.description || '',
    meetingDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    attendees: templateData?.suggestedParticipants || [],
    meetingType: 'ONLINE',
    meetingLink: '',
    location: '',
    language: 'en',
    agendaNotes: templateData?.agendaItems?.join('\n') || '',
    transcript: '',
  });

  const [attendeeInput, setAttendeeInput] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendeeAdd = () => {
    const val = attendeeInput.trim();
    if (val && !formData.attendees.includes(val)) {
      setFormData(prev => ({ ...prev, attendees: [...prev.attendees, val] }));
      setAttendeeInput('');
    }
  };

  const handleAttendeeRemove = (item) => {
    setFormData(prev => ({ ...prev, attendees: prev.attendees.filter(a => a !== item) }));
  };

  const validateAndSetFile = (f) => {
    const allowedExtensions = ['.mp3', '.wav', '.m4a'];
    const hasValidExt = allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setError('Please upload a valid audio file (MP3, WAV, or M4A)');
      return;
    }
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (f.size > maxSize) {
      setError('File size must be under 25MB');
      return;
    }
    setFile(f);
    setError('');
    if (!formData.title) {
      setFormData(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Meeting title is required.');
      return false;
    }
    if (!formData.meetingDate) {
      setError('Meeting date is required.');
      return false;
    }
    if (!formData.startTime) {
      setError('Start time is required.');
      return false;
    }
    if (formData.meetingType === 'ONLINE' && !formData.meetingLink && !file && !formData.transcript) {
      setError('Please provide a meeting URL, upload an audio recording, or add a transcript.');
      return false;
    }
    if (formData.meetingType === 'OFFLINE' && !formData.location) {
      setError('Location is required for in-person meetings.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (file) {
        const { data } = await meetingsApi.uploadWithMetadata({
          title: formData.title || file.name,
          description: formData.description,
          meetingDate: formData.meetingDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          attendees: formData.attendees,
          meetingType: formData.meetingType,
          meetingLink: formData.meetingLink,
          location: formData.location,
          language: formData.language,
          agendaNotes: formData.agendaNotes,
          transcript: formData.transcript,
          file: file
        });
        if (data.success) {
          navigate(`/meetings/${data.data.id}`);
        }
      } else {
        const { data } = await meetingsApi.create(formData);
        if (data.success) {
          navigate(`/meetings/${data.data.id}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link 
            to="/meetings"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to meetings</span>
          </Link>
        </div>

        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-[#1e2436]">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create New Meeting
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set up meeting details, attach audio recordings, or paste existing transcripts.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: General Info */}
          <Card>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              1. General Details
            </h2>

            <div className="space-y-4">
              <Input
                label="Meeting Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Weekly Engineering Sync"
                required
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief summary or context of this meeting..."
                rows={2}
              />
            </div>
          </Card>

          {/* Section 2: Date & Logistics */}
          <Card>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              2. Schedule & Logistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Input
                label="Date"
                type="date"
                name="meetingDate"
                value={formData.meetingDate}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Start Time"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />

              <Input
                label="End Time"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Meeting Type
                </label>
                <select
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleInputChange}
                  className="w-full text-sm bg-white dark:bg-[#12151f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1e2436] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="ONLINE">Online (Virtual)</option>
                  <option value="OFFLINE">Offline (In-Person)</option>
                </select>
              </div>

              {formData.meetingType === 'ONLINE' ? (
                <Input
                  label="Meeting URL"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/xyz-abc"
                />
              ) : (
                <Input
                  label="Location / Room"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Conference Room 4B"
                  required={formData.meetingType === 'OFFLINE'}
                />
              )}
            </div>
          </Card>

          {/* Section 3: Attendees & Agenda */}
          <Card>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              3. Attendees & Agenda
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Participants / Attendees
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAttendeeAdd();
                      }
                    }}
                    placeholder="Enter name or email and press Enter..."
                    className="flex-1 text-sm bg-white dark:bg-[#12151f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-[#1e2436] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <Button variant="secondary" size="sm" onClick={handleAttendeeAdd}>
                    Add
                  </Button>
                </div>

                {formData.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {formData.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {attendee}
                        <button
                          type="button"
                          onClick={() => handleAttendeeRemove(attendee)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Textarea
                label="Agenda Notes"
                name="agendaNotes"
                value={formData.agendaNotes}
                onChange={handleInputChange}
                placeholder="Key topics to cover in this session..."
                rows={3}
              />
            </div>
          </Card>

          {/* Section 4: Audio File or Direct Transcript */}
          <Card>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              4. Audio Recording or Transcript
            </h2>

            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) validateAndSetFile(f);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-[#1e2436] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-[#0e111a]/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) validateAndSetFile(f);
                  }}
                />

                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileAudio className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Drag and drop your meeting recording here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supported formats: MP3, WAV, M4A (Max 25MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Or manual transcript */}
              {!file && (
                <div className="pt-2">
                  <Textarea
                    label="Or Paste Transcript Directly"
                    name="transcript"
                    value={formData.transcript}
                    onChange={handleInputChange}
                    placeholder="If you already have text notes or transcript, paste them here..."
                    rows={4}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/meetings">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={Plus}
            >
              {file ? 'Create & Process Recording' : 'Create Meeting'}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
