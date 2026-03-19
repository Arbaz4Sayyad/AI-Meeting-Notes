import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CreateMeeting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meetingDate: '',
    startTime: '',
    endTime: '',
    attendees: [],
    meetingType: 'ONLINE',
    meetingLink: '',
    location: '',
    language: 'en',
    agendaNotes: '',
    transcript: '',
    generateTranscript: false
  });
  const [attendeeInput, setAttendeeInput] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendeeAdd = () => {
    const email = attendeeInput.trim();
    if (email && !formData.attendees.includes(email)) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, email]
      }));
      setAttendeeInput('');
    }
  };

  const handleAttendeeRemove = (email) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== email)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAttendeeAdd();
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      validateAndSetFile(f);
    }
  };

  const validateAndSetFile = (f) => {
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a'];
    const allowedExtensions = ['.mp3', '.wav', '.m4a'];
    
    const isValidType = allowedTypes.includes(f.type) || 
                       allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      setError('Please select a valid audio file (MP3, WAV, or M4A)');
      return;
    }
    
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (f.size > maxSize) {
      setError('File size must be less than 25MB');
      return;
    }
    
    setFile(f);
    setError('');
    if (!formData.title) setFormData(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.meetingDate) {
      setError('Meeting date is required');
      return false;
    }
    if (!formData.startTime) {
      setError('Start time is required');
      return false;
    }
    if (formData.meetingType === 'ONLINE' && !formData.meetingLink && !file) {
      setError('Meeting link or audio file is required for online meetings');
      return false;
    }
    if (formData.meetingType === 'OFFLINE' && !formData.location) {
      setError('Location is required for offline meetings');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (file) {
        // Create meeting with audio file and metadata
        const formDataWithFile = new FormData();
        formDataWithFile.append('title', formData.title || file.name);
        formDataWithFile.append('description', formData.description);
        formDataWithFile.append('meetingDate', formData.meetingDate);
        formDataWithFile.append('startTime', formData.startTime);
        formDataWithFile.append('endTime', formData.endTime);
        formDataWithFile.append('attendees', JSON.stringify(formData.attendees));
        formDataWithFile.append('meetingType', formData.meetingType);
        formDataWithFile.append('meetingLink', formData.meetingLink);
        formDataWithFile.append('location', formData.location);
        formDataWithFile.append('language', formData.language);
        formDataWithFile.append('agendaNotes', formData.agendaNotes);
        formDataWithFile.append('transcript', formData.transcript);
        formDataWithFile.append('file', file);
        
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
      } else {
        // Create meeting with transcript only
        const { data } = await meetingsApi.create(formData);
        if (data.success) navigate(`/meetings/${data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <a href="/dashboard" className="text-xl font-bold text-slate-800">Meeting AI</a>
          <span className="text-slate-600 text-sm">{user?.name}</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Create Meeting</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Meeting title"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Meeting description..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Date and Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="meetingDate"
                  value={formData.meetingDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Meeting Type</h2>
            
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="meetingType"
                  value="ONLINE"
                  checked={formData.meetingType === 'ONLINE'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Online Meeting</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="meetingType"
                  value="OFFLINE"
                  checked={formData.meetingType === 'OFFLINE'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Offline Meeting</span>
              </label>
            </div>

            {formData.meetingType === 'ONLINE' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Conference Room A, Office Building..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required={formData.meetingType === 'OFFLINE'}
                />
              </div>
            )}
          </div>

          {/* Attendees */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Attendees</h2>
            
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add attendee email..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAttendeeAdd}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.attendees.map((email, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleAttendeeRemove(email)}
                    className="ml-1 text-teal-600 hover:text-teal-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Audio Upload */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Audio File (Optional)</h2>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a"
              onChange={handleFile}
              className="hidden"
            />
            
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${isDragging 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
                }
                ${file ? 'border-teal-500 bg-teal-50' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              {file ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700">
                    {isDragging ? 'Drop your audio file here' : 'Choose audio file or drag and drop'}
                  </p>
                  <p className="text-sm text-slate-500">
                    MP3, WAV, or M4A (max 25MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Agenda and Transcript */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Agenda & Transcript</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agenda / Notes</label>
                <textarea
                  name="agendaNotes"
                  value={formData.agendaNotes}
                  onChange={handleInputChange}
                  placeholder="Meeting agenda, topics to discuss, notes..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transcript</label>
                <textarea
                  name="transcript"
                  value={formData.transcript}
                  onChange={handleInputChange}
                  placeholder="Paste meeting transcript here..."
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating Meeting...' : 'Create Meeting'}
          </button>
        </form>
      </main>
    </div>
  );
}
