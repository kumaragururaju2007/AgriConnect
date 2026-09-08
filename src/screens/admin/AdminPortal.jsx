import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LayoutDashboard, UserCheck, Scale, FileText, 
  Settings, LogOut, Clock, AlertTriangle, ChevronRight, Lock, 
  Building2, Users, CheckCircle2, ChevronLeft, Sparkles, Activity
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';
import AdminOverview from './AdminOverview';
import AdminBuyerKYC from './AdminBuyerKYC';
import AdminFarmerKYC from './AdminFarmerKYC';
import AdminDisputes from './AdminDisputes';
import AdminSecuritySettings from './AdminSecuritySettings';

export default function AdminPortal({ setStep, setRole, lang = 'en' }) {
  const { adminUser, authUser, logoutUser, buyerApplications, farmerApplications, adminGrievances, switchRole } = useAgri();
  
  // Navigation: 'overview' | 'buyers' | 'farmers' | 'disputes' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Cross-view drilldown states
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  // Dynamic notification counts
  const pendingKYCCount = (buyerApplications || []).filter(b => b.status === 'Pending').length;
  const pendingFarmerKYCCount = (farmerApplications || []).filter(f => f.status === 'Pending').length;
  const activeDisputeCount = (adminGrievances || []).filter(g => g.status !== 'RESOLVED').length;

  // Inactivity Session Timeout
  const timeoutMinutes = adminUser?.sessionTimeoutMinutes || 15;
  const [secondsRemaining, setSecondsRemaining] = useState(timeoutMinutes * 60);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const resetTimer = () => {
    if (!showTimeoutModal) {
      setSecondsRemaining(timeoutMinutes * 60);
    }
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const handleActivity = () => resetTimer();

    events.forEach(ev => window.addEventListener(ev, handleActivity));

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowTimeoutModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleActivity));
      clearInterval(interval);
    };
  }, [showTimeoutModal, timeoutMinutes]);

  const handleExitAdmin = () => {
    logoutUser();
    if (setRole) setRole('farmer');
    if (setStep) setStep(1);
  };

  const handleExtendSession = () => {
    setShowTimeoutModal(false);
    setSecondsRemaining(timeoutMinutes * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOverviewSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setActiveTab('buyers');
  };

  const handleOverviewSelectGrievance = (grievance) => {
    setSelectedGrievance(grievance);
    setActiveTab('disputes');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flex: 1, 
      width: '100%', 
      minHeight: 'calc(100vh - 105px)', 
      height: 'calc(100vh - 105px)', 
      background: '#f8fafc',
      overflow: 'hidden'
    }}>
      
      {/* ========================================================================= */}
      {/* DEDICATED EXECUTIVE APMC COMMAND SIDEBAR */}
      {/* ========================================================================= */}
      <aside style={{
        width: 275,
        minWidth: 275,
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        borderRight: '1px solid rgba(255, 255, 255, 0.85)',
        boxShadow: '4px 0 20px -2px rgba(15, 23, 42, 0.05)',
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto'
      }}>
        
        {/* Top: Seal & Magistrate Profile */}
        <div>
          {/* APMC Government Crest */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', color: '#ffffff', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
            }}>
              ⚖️
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, letterSpacing: '-0.01em', color: '#0f172a' }}>
                APMC Command Suite
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>
                State Regulated #26132
              </div>
            </div>
          </div>

          {/* Magistrate Info Card */}
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', borderRadius: 10, padding: '12px 14px', margin: '14px 0 18px', border: '1px solid rgba(203, 213, 225, 0.8)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid #a7f3d0' }}>
                👨‍⚖️
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a' }}>
                  {adminUser?.name || 'S. K. Deshmukh'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  Regulatory Magistrate
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#059669', marginTop: 6, fontWeight: 700 }}>
              📍 {adminUser?.jurisdiction}
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'buyers', label: 'Buyer KYC Queue', icon: UserCheck, badge: pendingKYCCount, badgeColor: '#f59e0b' },
              { id: 'farmers', label: 'Farmer KYC Queue', icon: Users, badge: pendingFarmerKYCCount, badgeColor: '#10b981' },
              { id: 'disputes', label: 'Arbitration Bench', icon: Scale, badge: activeDisputeCount, badgeColor: '#ef4444' },
              { id: 'settings', label: 'Security & Mandis', icon: Settings }
            ].map(nav => {
              const Icon = nav.icon;
              const isCurrent = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    setActiveTab(nav.id);
                    if (nav.id !== 'buyers') setSelectedBuyer(null);
                    if (nav.id !== 'disputes') setSelectedGrievance(null);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 10, fontSize: '0.83rem',
                    fontWeight: isCurrent ? 800 : 500,
                    background: isCurrent ? 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)' : 'transparent',
                    color: isCurrent ? '#15803d' : '#475569',
                    border: isCurrent ? '1px solid #a7f3d0' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    boxShadow: isCurrent ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 5px rgba(0,0,0,0.04)' : 'none',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={16} style={{ color: isCurrent ? '#15803d' : '#64748b' }} />
                    <span>{nav.label}</span>
                  </div>

                  {nav.badge > 0 && (
                    <span style={{
                      background: isCurrent ? '#15803d' : nav.badgeColor,
                      color: '#ffffff',
                      fontSize: '0.68rem', fontWeight: 900, padding: '2px 7px', borderRadius: 999
                    }}>
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Inactivity Timer & Exit Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
          {/* Inactivity Badge */}
          <div style={{
            background: secondsRemaining < 120 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(248, 250, 252, 0.8)',
            border: `1px solid ${secondsRemaining < 120 ? '#fca5a5' : 'rgba(203, 213, 225, 0.8)'}`,
            padding: '8px 12px', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '0.74rem', color: secondsRemaining < 120 ? '#ef4444' : '#475569',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} />
              <span>Auto-Lock:</span>
            </div>
            <span style={{ fontWeight: 800, color: secondsRemaining < 120 ? '#ef4444' : '#0f172a' }}>
              {formatTime(secondsRemaining)}
            </span>
          </div>

          {/* Quick Exit */}
          <button
            onClick={handleExitAdmin}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '9px 0', borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#dc2626', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out of Administration</span>
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT WORKSPACE */}
      {/* ========================================================================= */}
      <main style={{ 
        flex: 1, 
        minWidth: 0, 
        width: '100%',
        padding: '24px 32px 40px', 
        overflowY: 'auto',
        height: '100%'
      }}>
        <div style={{ width: '100%', margin: 0 }}>
          
          {activeTab === 'overview' && (
            <AdminOverview 
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                if (tab !== 'buyers') setSelectedBuyer(null);
                if (tab !== 'disputes') setSelectedGrievance(null);
              }}
              onSelectBuyer={handleOverviewSelectBuyer}
              onSelectGrievance={handleOverviewSelectGrievance}
            />
          )}

          {activeTab === 'buyers' && (
            <AdminBuyerKYC 
              selectedBuyerFromDash={selectedBuyer}
              onClearSelection={() => setSelectedBuyer(null)}
            />
          )}

          {activeTab === 'disputes' && (
            <AdminDisputes 
              selectedDocketFromDash={selectedGrievance}
              onClearSelection={() => setSelectedGrievance(null)}
            />
          )}

          {activeTab === 'farmers' && (
            <AdminFarmerKYC />
          )}

          {activeTab === 'settings' && (
            <AdminSecuritySettings />
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* INACTIVITY SESSION TIMEOUT LOCK MODAL */}
      {/* ========================================================================= */}
      {showTimeoutModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, maxWidth: 440, width: '100%',
            padding: '28px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fee2e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#dc2626', margin: '0 auto 16px'
            }}>
              <Lock size={28} />
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              APMC Administrative Session Locked
            </h3>

            <p style={{ margin: '0 0 20px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              Due to {timeoutMinutes} minutes of inactivity, this regulatory console has been locked to safeguard financial escrow and arbitration dockets.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleExtendSession}
                style={{
                  width: '100%', padding: '11px 0', borderRadius: 8,
                  background: '#15803d', color: '#ffffff', border: 'none',
                  fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer'
                }}
              >
                Re-authenticate & Resume Console
              </button>

              <button
                onClick={handleExitAdmin}
                style={{
                  width: '100%', padding: '9px 0', borderRadius: 8,
                  background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1',
                  fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Exit to Public Portal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
