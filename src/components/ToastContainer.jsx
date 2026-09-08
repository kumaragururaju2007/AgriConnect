import React from 'react';
import { CheckCircle2, AlertTriangle, Bell, ShieldCheck, X } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 70,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 380,
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isDecree = toast.type === 'decree';

        let borderColor = '#bbf7d0';
        let bgColor = '#f0fdf4';
        let iconColor = '#15803d';

        if (isWarning) {
          borderColor = '#fed7aa';
          bgColor = '#fff7ed';
          iconColor = '#ea580c';
        } else if (isDecree) {
          borderColor = '#fecaca';
          bgColor = '#fef2f2';
          iconColor = '#dc2626';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 10,
              padding: '12px 16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ marginTop: 2 }}>
              {isDecree ? (
                <AlertTriangle size={18} style={{ color: iconColor }} />
              ) : isWarning ? (
                <Bell size={18} style={{ color: iconColor }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: iconColor }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: '#94a3b8', padding: 2, cursor: 'pointer', background: 'none', border: 'none' }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
