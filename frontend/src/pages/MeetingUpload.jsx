import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UploadCloud, 
  FileAudio, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { meetingsApi } from '../api/client';
import AppShell from '../components/layout/AppShell';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Textarea } from '../components/ui/Input';

export default function MeetingUpload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [transcriptOnly, setTranscriptOnly] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (f) => {
    const allowedExtensions = ['.mp3', '.wav', '.m4a'];
    const hasValidExt = allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
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
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (transcriptOnly) {
        if (!transcript.trim()) {
          setError('Please provide transcript text.');
          setLoading(false);
          return;
        }
        const { data } = await meetingsApi.createWithTranscript({
          title: title || 'Untitled Meeting',
          transcript: transcript,
        });
        if (data.success) {
          navigate(`/meetings/${data.data.id}`);
        }
      } else {
        if (!file) {
          setError('Please choose an audio file to upload.');
          setLoading(false);
          return;
        }
        const { data } = await meetingsApi.upload(title || file.name, file);
        if (data.success) {
          navigate(`/meetings/${data.data.id}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process upload. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
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
              Upload Meeting Recording
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload audio files for automated asynchronous transcription and AI summarization.
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
          <Card>
            <div className="space-y-4">
              <Input
                label="Meeting Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Product Strategy Review"
              />

              <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#1e2436] pb-3">
                <button
                  type="button"
                  onClick={() => setTranscriptOnly(false)}
                  className={`pb-1 transition-colors ${
                    !transcriptOnly
                      ? 'border-b-2 border-blue-600 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  Audio File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setTranscriptOnly(true)}
                  className={`pb-1 transition-colors ${
                    transcriptOnly
                      ? 'border-b-2 border-blue-600 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  Direct Transcript Text
                </button>
              </div>

              {!transcriptOnly ? (
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
                  className={`p-8 border border-dashed rounded-lg text-center cursor-pointer transition-colors ${
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
                      <FileAudio className="w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-sm">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for processing
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-500 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        Drag and drop your audio file here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        MP3, WAV, or M4A · Up to 25MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <Textarea
                  label="Meeting Transcript"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste complete meeting transcript here..."
                  rows={8}
                  required
                />
              )}
            </div>
          </Card>

          {/* Pipeline Explainer */}
          <div className="p-4 rounded-lg bg-slate-100/70 dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2436] space-y-2 text-xs">
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              How the processing pipeline works:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Upload securely to backend storage</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Asynchronous speech-to-text transcription</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Gemini extracts tasks & structured summary</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
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
              icon={UploadCloud}
              disabled={!transcriptOnly && !file}
            >
              {loading ? 'Submitting...' : 'Start Processing'}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
