import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function MeetingUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [transcriptOnly, setTranscriptOnly] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      validateAndSetFile(f);
    }
  };

  const validateAndSetFile = (f) => {
    // Check file type
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a'];
    const allowedExtensions = ['.mp3', '.wav', '.m4a'];
    
    const isValidType = allowedTypes.includes(f.type) || 
                       allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      setError('Please select a valid audio file (MP3, WAV, or M4A)');
      return;
    }
    
    // Check file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (f.size > maxSize) {
      setError('File size must be less than 25MB');
      return;
    }
    
    setFile(f);
    setError('');
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (transcriptOnly) {
        const { data } = await meetingsApi.createWithTranscript({
          title: title || 'Untitled',
          transcript: transcript || '',
        });
        if (data.success) navigate(`/meetings/${data.data.id}`);
      } else {
        if (!file) {
          setError('Select an audio file');
          setLoading(false);
          return;
        }
        const { data } = await meetingsApi.upload(title || file.name, file);
        if (data.success) navigate(`/meetings/${data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Upload Meeting</h1>

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={transcriptOnly}
              onChange={(e) => setTranscriptOnly(e.target.checked)}
            />
            <span>I have a transcript (no audio)</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              required
            />
          </div>

          {transcriptOnly ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Transcript</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste meeting transcript..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 h-48 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Audio File</label>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.m4a"
                onChange={handleFile}
                className="hidden"
              />
              
              {/* Drag and drop area */}
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
                {/* Upload icon */}
                <div className="mx-auto mb-4">
                  {file ? (
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Text content */}
                {file ? (
                  <div className="space-y-2">
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
                    <p className="text-lg font-medium text-slate-700">
                      {isDragging ? 'Drop your audio file here' : 'Choose audio file or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-500">
                      MP3, WAV, or M4A (max 25MB)
                    </p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
              
              {/* Supported formats info */}
              <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z" clipRule="evenodd" />
                  </svg>
                  MP3
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z" clipRule="evenodd" />
                  </svg>
                  WAV
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z" clipRule="evenodd" />
                  </svg>
                  M4A
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : transcriptOnly ? 'Create Meeting' : 'Upload'}
          </button>
        </form>
      </main>
    </div>
  );
}
