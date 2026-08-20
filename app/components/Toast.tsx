'use client';

import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastState {
  open: boolean;
  variant: 'success' | 'error';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ toast, onClose, duration = 4000 }: Readonly<ToastProps>) {
  useEffect(() => {
    if (!toast.open) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [toast.open, toast.message, duration, onClose]);

  if (!toast.open) return null;

  return (
    <div className={`gx-toast gx-toast--${toast.variant}`} role="status">
      <span className="gx-toast-icon">
        {toast.variant === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </span>
      <span className="gx-toast-text">{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button type="button" className="gx-toast-action" onClick={toast.onAction}>
          {toast.actionLabel}
        </button>
      )}
      <button type="button" className="gx-toast-close" onClick={onClose} aria-label="Cerrar">
        <X size={14} />
      </button>
    </div>
  );
}
