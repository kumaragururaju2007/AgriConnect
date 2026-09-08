import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, DollarSign, Package, ShieldCheck, 
  Trash2, ArrowRight, Clock, AlertCircle, Check
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from './driverData';

export default function DriverNotifications({ setActiveTab, lang = 'en' }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'job':
        return <Package size={18} color="#0284c7" />;
      case 'payment':
        return <DollarSign size={18} color="#15803d" />;
      case 'status':
        return <CheckCircle2 size={18} color="#2563eb" />;
      case 'compliance':
        return <ShieldCheck size={18} color="#d97706" />;
      default:
        return <Bell size={18} color="#64748b" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)',
        borderRadius: 16,
        padding: '22px 26px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(194, 65, 12, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.2)' }}>
              LIVE OPERATIONS FEED
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffedd5' }}>
              • Real-Time Dispatch & Escrow Alerts
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
            Consignment Alerts & Notifications
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#fed7aa' }}>
            Instant notifications for pre-funded load requests, escrow credits, gate clearances, and compliance renewals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Check size={14} /> Mark All as Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        padding: '14px 18px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'job', label: 'Load Requests' },
          { id: 'payment', label: 'Escrow Payouts' },
          { id: 'status', label: 'Dock Clearances' },
          { id: 'compliance', label: 'RTO Compliance' }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 700,
              border: filter === chip.id ? '1px solid #c2410c' : '1px solid #cbd5e1',
              background: filter === chip.id ? '#fff7ed' : '#f8fafc',
              color: filter === chip.id ? '#c2410c' : '#475569',
              cursor: 'pointer'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredNotifs.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b',
            border: '1px solid #e2e8f0'
          }}>
            No notifications in this category.
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.unread ? '#fffbf7' : '#ffffff',
                borderRadius: 14,
                border: n.unread ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                padding: '16px 20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: n.unread ? '#ffedd5' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(n.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {n.title}
                    </h4>
                    {n.unread && (
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#ea580c',
                        boxShadow: '0 0 6px #ea580c'
                      }} />
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#475569', lineHeight: 1.4 }}>
                    {n.desc}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {n.time}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {n.tabTarget && (
                  <button
                    onClick={() => setActiveTab(n.tabTarget)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0284c7',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    View <ArrowRight size={13} />
                  </button>
                )}

                <button
                  onClick={() => deleteNotif(n.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 6,
                    borderRadius: 6
                  }}
                  title="Dismiss alert"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
