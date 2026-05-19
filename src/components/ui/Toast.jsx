import React, { useEffect } from 'react';
import { XCircle, CheckCircle2, X } from 'lucide-react';

export function Toast({ status, onClose }) {
  useEffect(() => {
    if (status.success || status.error) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  if (!status.success && !status.error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
        status.success ? 'bg-dracula-surface border-dracula-green text-dracula-green' : 'bg-dracula-surface border-dracula-red text-dracula-red'
      }`}>
        {status.success ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        <p className="text-sm font-medium max-w-xs truncate">
          {status.success ? 'Transaction successful!' : status.error}
        </p>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
