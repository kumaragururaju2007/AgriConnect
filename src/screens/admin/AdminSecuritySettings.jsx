import React, { useState } from 'react';
import { 
  ShieldCheck, Clock, Lock, Bell, CheckCircle2, Save, 
  MapPin, AlertCircle, RefreshCw, KeyRound
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function AdminSecuritySettings() {
  const { adminUser, setAdminUser, addToast } = useAgri();
  
  const [timeoutMinutes, setTimeoutMinutes] = useState(adminUser?.sessionTimeoutMinutes || 15);
  const [twoFactorActive, setTwoFactorActive] = useState(adminUser?.twoFactorEnabled !== false);
  const [jurisdiction, setJurisdiction] = useState(adminUser?.jurisdiction || 'Nashik Supervised Division (34 Mandis)');
  const [regulatoryBroadcast, setRegulatoryBroadcast] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setAdminUser(prev => ({
      ...prev,
      sessionTimeoutMinutes: Number(timeoutMinutes),
      twoFactorEnabled: twoFactorActive,
      jurisdiction
    }));

    addToast({
      type: 'success',
      title: '⚙️ Security Policy Updated',
      message: `Inactivity timeout updated to ${timeoutMinutes} minutes. 2FA enforcement: ${twoFactorActive ? 'ACTIVE' : 'OFF'}.`
    });
  };

  const handlePublishBroadcast = (e) => {
    e.preventDefault();
    if (!regulatoryBroadcast.trim()) return;
    addToast({
      type: 'info',
      title: '📢 Regulatory Circular Dispatched',
      message: `Statutory notice broadcasted across 34 Mandi yards: "${regulatoryBroadcast.slice(0, 45)}..."`
    });
    setRegulatoryBroadcast('');
  };

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>Admin Portal Security & APMC Settings</span>
          <span style={{ fontSize: '0.74rem', background: '#ecfdf5', color: '#065f46', padding: '3px 10px', borderRadius: 999, fontWeight: 800 }}>
            Executive Governance
          </span>
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          Configure session inactivity thresholds, APMC jurisdiction parameters, two-factor authentication, and system directives.
        </p>
      </div>

      {/* Full-Width 2-Column Responsive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 24, width: '100%', alignItems: 'start' }}>
        
        {/* Column 1: Core Security Configuration */}
        <form onSubmit={handleSaveSettings} className="panel" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 22, borderRadius: 14, background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            <ShieldCheck size={20} style={{ color: '#15803d' }} />
            <span style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>Regulatory Access & Session Safeguards</span>
          </div>

          {/* Inactivity Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} style={{ color: '#2563eb' }} />
                <span>Inactivity Session Timeout Threshold</span>
              </label>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 12px', borderRadius: 999 }}>
                {timeoutMinutes} Minutes
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px' }}>
              Automatically locks the administrative console if no keyboard or mouse activity is detected, protecting escrow and arbitration powers.
            </p>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={timeoutMinutes}
              onChange={(e) => setTimeoutMinutes(e.target.value)}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: 6, fontWeight: 700 }}>
              <span>5 min (High Security)</span>
              <span>15 min (Standard)</span>
              <span>30 min</span>
              <span>60 min (Extended)</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />

          {/* 2FA Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={16} style={{ color: '#15803d' }} />
                <span>Two-Factor Authentication (OTP on Sign In)</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Enforce a 6-digit one-time passcode verification to approve financial payouts and legal decrees.
              </p>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 46, height: 26 }}>
              <input
                type="checkbox"
                checked={twoFactorActive}
                onChange={(e) => setTwoFactorActive(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                background: twoFactorActive ? '#15803d' : '#cbd5e1',
                borderRadius: 26, transition: '0.2s'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: 20, width: 20, left: twoFactorActive ? 23 : 3, bottom: 3,
                  background: 'white', borderRadius: '50%', transition: '0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </span>
            </label>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />

          {/* Jurisdiction */}
          <div>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', marginBottom: 6 }}>
              Supervised Mandi Division:
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 600, background: '#f8fafc', color: '#0f172a' }}
            >
              <option value="Nashik Supervised Division (34 Mandis)">Nashik Supervised Division (34 Mandis: Lasalgaon, Pimpalgaon, Yeola...)</option>
              <option value="Pune Metropolitan Agricultural Division (18 Mandis)">Pune Metropolitan Agricultural Division (18 Mandis: Gultekdi, Baramati...)</option>
              <option value="Mumbai & Konkan Apex Mandi Yard (Vashi APMC)">Mumbai & Konkan Apex Mandi Yard (Vashi APMC)</option>
              <option value="Vidarbha Cotton & Soyabean Grid (Amravati / Nagpur)">Vidarbha Cotton & Soyabean Grid (Amravati / Nagpur)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              type="submit"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff', border: 'none', padding: '11px 26px', borderRadius: 8,
                fontSize: '0.86rem', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)'
              }}
            >
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>

        {/* Column 2: Broadcast Circular & System Certificate Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Broadcast Circular Panel */}
          <form onSubmit={handlePublishBroadcast} className="panel" style={{ padding: 24, borderRadius: 14, background: '#ffffff', border: '1px solid #fecdd3', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.04)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} />
              <span>Publish Regulatory Circular or Mandi Advisory</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>
              Broadcast price ceiling notices, monsoon advisories, or APMC statutory orders directly to registered buyers and cultivators.
            </p>

            <textarea
              rows={4}
              placeholder="E.g., Pursuant to APMC Circular #2024-88, electronic weighbridge recalibration is mandatory across all 34 yards before 15th September..."
              value={regulatoryBroadcast}
              onChange={(e) => setRegulatoryBroadcast(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.84rem', outline: 'none', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button
                type="submit"
                disabled={!regulatoryBroadcast.trim()}
                style={{
                  background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: 8,
                  fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer',
                  opacity: !regulatoryBroadcast.trim() ? 0.6 : 1,
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                }}
              >
                Broadcast Notice
              </button>
            </div>
          </form>

          {/* System Cryptographic Status & Digital Seal */}
          <div className="panel" style={{ padding: 22, borderRadius: 14, background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <KeyRound size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>State Regulatory Key & Vault Integrity</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>MSInS Problem Statement ID 26132</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase' }}>Officer Designation</div>
                <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>{adminUser?.designation || 'Regulatory Magistrate'}</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase' }}>Digital State Seal</div>
                <div style={{ fontWeight: 800, color: '#10b981', marginTop: 2 }}>{adminUser?.badge || 'Gazetted MH-GOV-9142'}</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase' }}>Escrow Security</div>
                <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>AES-256 GCM Lien Lock</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase' }}>e-NAM Node Gateway</div>
                <div style={{ fontWeight: 800, color: '#22c55e', marginTop: 2 }}>34 Mandi Sync Active</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
