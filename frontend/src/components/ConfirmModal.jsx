import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './ui/Button';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-md bg-white dark:bg-[#12151f] border border-slate-200 dark:border-[#1e2436] rounded-lg p-6 shadow-xl transition-all">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {message}
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button variant={type === 'danger' ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>
                  {confirmText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
