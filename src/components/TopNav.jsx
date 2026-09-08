import React from 'react';
import { ShieldCheck, PhoneCall, Globe, UserCheck, Building2, Store, Sparkles, ChevronRight, ChevronLeft, LogIn, LogOut, UserPlus } from 'lucide-react';
import { MOCK_PRICES_TICKER, MOCK_FARMER } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';
import { useAgri } from '../context/AgriContext';

export default function TopNav({ 
  activeTerminal, 
  setTerminal, 
  currentStep, 
  setStep, 
  lang, 
  setLang,
  driverTab = 'home',
  setDriverTab,
  openDriverPortal,
  openFarmerPortal,
  openBuyerDesk,
  openByProductBuyerPortal,
  openAdminPortal,
  openFieldAgentPortal
}) {
  const { authUser, logoutUser, switchRole, lang: ctxLang, setLang: ctxSetLang } = useAgri();
  // Prefer context lang (global), fall back to prop
  const activeLang = ctxLang || lang;
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
  const isFarmer = activeTerminal === 'farmer';
  const handleSetLang = (l) => {
    if (ctxSetLang) ctxSetLang(l);
  };

  const handleLogout = () => {
    logoutUser();
    if (setTerminal) setTerminal('farmer');
    setStep(1);
  };

  const handleSelectRole = (role) => {
    if (role === 'driver') {
      if (openDriverPortal) {
        openDriverPortal('home');
      } else {
        if (switchRole) switchRole('driver');
        setTerminal('driver');
        setStep(20);
        if (setDriverTab) setDriverTab('home');
      }
    } else if (role === 'farmer') {
      if (openFarmerPortal) {
        openFarmerPortal();
      } else {
        if (switchRole) switchRole('farmer');
        setTerminal('farmer');
        setStep(3);
      }
    } else if (role === 'buyer') {
      if (openBuyerDesk) {
        openBuyerDesk();
      } else {
        if (switchRole) switchRole('buyer');
        setTerminal('apmc');
        setStep(7);
      }
    } else if (role === 'agent' || role === 'field_agent') {
      if (openFieldAgentPortal) {
        openFieldAgentPortal();
      } else {
        if (switchRole) switchRole('agent');
        setTerminal('agent');
        setStep(22);
      }
    } else if (role === 'admin') {
      if (openAdminPortal) {
        openAdminPortal();
      } else {
        if (switchRole) switchRole('admin');
        setTerminal('admin');
        setStep(21);
      }
    }
  };

  const isDriverActive = activeTerminal === 'driver' || currentStep === 20;
  const isAgentActive = activeTerminal === 'agent' || currentStep === 22 || authUser?.role === 'agent';
  const isAdminActive = activeTerminal === 'admin' || currentStep === 21 || authUser?.role === 'admin';
  const isByProductActive = currentStep === 23;
  const isFarmerActive = !isAdminActive && !isAgentActive && !isByProductActive && activeTerminal === 'farmer' && currentStep !== 20 && currentStep !== 21 && currentStep !== 22 && currentStep !== 1 && currentStep !== 2;
  const isBuyerActive = !isAdminActive && !isAgentActive && !isByProductActive && (activeTerminal === 'apmc' || activeTerminal === 'buyer') && currentStep !== 20 && currentStep !== 21 && currentStep !== 22 && currentStep !== 1 && currentStep !== 2;

  return (
    <header style={{ 
      background: 'rgba(255, 255, 255, 0.82)', 
      backdropFilter: 'blur(20px)', 
      WebkitBackdropFilter: 'blur(20px)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.85)', 
      position: 'sticky', top: 0, zIndex: 100, 
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' 
    }}>
      {/* Top Green Institutional Ribbon */}
      <div style={{ background: '#14532d', color: '#f0fdf4', padding: '4px 16px', fontSize: '0.75rem', whiteSpace: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              🏛️ Government of Maharashtra
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Agriculture Dept & Maharashtra State Innovation Society (MSInS)</span>
            <span className="badge" style={{ background: '#22c55e', color: '#052e16', fontSize: '0.62rem', padding: '1px 6px', fontWeight: 800 }}>
              Smart India Hackathon #26132
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, whiteSpace: 'nowrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#86efac' }}>
              <PhoneCall size={11} /> {t.kisanCallCenter}
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ color: '#dcfce7' }}>{t.mahadbtHelp}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(0,0,0,0.22)', padding: '2px 4px', borderRadius: 6, marginLeft: 6, border: '1px solid rgba(255,255,255,0.2)' }}>
              <Globe size={11} style={{ margin: '0 2px 0 4px', color: '#86efac' }} />
              <button 
                id="lang-btn-en"
                onClick={() => handleSetLang('en')} 
                style={{ 
                  color: activeLang === 'en' ? '#052e16' : '#dcfce7', 
                  background: activeLang === 'en' ? '#86efac' : 'transparent',
                  fontWeight: activeLang === 'en' ? 900 : 500, 
                  fontSize: '0.72rem', 
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                EN
              </button>
              <span style={{ opacity: 0.4, color: '#bbf7d0' }}>|</span>
              <button 
                id="lang-btn-mr"
                onClick={() => handleSetLang('mr')} 
                style={{ 
                  color: activeLang === 'mr' ? '#052e16' : '#dcfce7', 
                  background: activeLang === 'mr' ? '#86efac' : 'transparent',
                  fontWeight: activeLang === 'mr' ? 900 : 500, 
                  fontSize: '0.72rem', 
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                मराठी
              </button>
              <span style={{ opacity: 0.4, color: '#bbf7d0' }}>|</span>
              <button 
                id="lang-btn-hi"
                onClick={() => handleSetLang('hi')} 
                style={{ 
                  color: activeLang === 'hi' ? '#052e16' : '#dcfce7', 
                  background: activeLang === 'hi' ? '#86efac' : 'transparent',
                  fontWeight: activeLang === 'hi' ? 900 : 500, 
                  fontSize: '0.72rem', 
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                हिंदी
              </button>
              <span style={{ opacity: 0.4, color: '#bbf7d0' }}>|</span>
              <button 
                id="lang-btn-ta"
                onClick={() => handleSetLang('ta')} 
                style={{ 
                  color: activeLang === 'ta' ? '#052e16' : '#dcfce7', 
                  background: activeLang === 'ta' ? '#86efac' : 'transparent',
                  fontWeight: activeLang === 'ta' ? 900 : 500, 
                  fontSize: '0.72rem', 
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}>
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setStep(1)}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: '#fff', boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)' }}>
            🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em' }}>
                Agri<span style={{ color: '#15803d' }}>Connect</span>
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>MAHARASHTRA</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Unified e-Mandi, AI Quality Grading & State Escrow Vault
            </p>
          </div>
        </div>



        {/* Right Side: Auth Buttons or User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {authUser ? (
            /* Logged In User Profile & Logout */
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                  {authUser.user?.name || (authUser.role === 'admin' ? 'S. K. Deshmukh' : authUser.role === 'agent' ? 'Sachin B. Kadam' : authUser.role === 'farmer' ? 'Santosh Shinde' : authUser.role === 'driver' ? 'Rajesh Patil' : 'AgroFresh Supply Chain')}
                </div>
                <div style={{ fontSize: '0.72rem', color: authUser.role === 'admin' ? '#065f46' : authUser.role === 'agent' ? '#059669' : authUser.role === 'farmer' ? '#15803d' : authUser.role === 'driver' ? '#2563eb' : '#ea580c', fontWeight: 700 }}>
                  {authUser.role === 'admin' ? 'District APMC Regulatory Magistrate' : authUser.role === 'agent' ? 'Krishi Sahayak / Field Extension Officer' : authUser.role === 'farmer' ? 'Verified Farmer (7/12 Linked)' : authUser.role === 'driver' ? `Vahan Verified Driver (${authUser.user?.vehicle_reg || 'MH 15 EG 4402'})` : 'APMC Registered Corporate Buyer'}
                </div>
              </div>

              <button
                id="top-nav-switch-btn"
                onClick={() => setStep(2)}
                title="Sign in with a different account or role"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
                  background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                <LogIn size={13} style={{ color: '#15803d' }} />
                <span>Sign In / Switch</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700,
                  background: 'linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%)', 
                  border: '1px solid #fca5a5', color: '#b91c1c',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(220, 38, 38, 0.1)',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                <LogOut size={14} />
                <span>Log Out (बाहेर पडा)</span>
              </button>
            </div>
          ) : (
            /* Public Visitor: Sign In & Register Buttons */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                id="top-nav-sign-in-btn"
                onClick={() => setStep(2)}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              >
                <LogIn size={15} style={{ color: '#15803d' }} />
                <span>Sign In (प्रवेश करा)</span>
              </button>

              <button
                id="top-nav-register-btn"
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              >
                <UserPlus size={15} />
                <span>Register (नवीन नोंदणी)</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Live Mandi Ticker Sub-strip (Moving Horizontally from Right to Left) */}
      <div style={{
        background: 'rgba(248, 250, 252, 0.88)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.75)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        padding: '5px 20px',
        overflow: 'hidden'
      }}>
        <div className="mandi-ticker-container" style={{ maxWidth: 1600, margin: '0 auto' }}>
          {/* Static Mandi Live Feed Left Badge with pulse */}
          <div className="mandi-ticker-badge">
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#22c55e', boxShadow: '0 0 8px #22c55e',
              display: 'inline-block'
            }}></span>
            <span>MANDI LIVE FEED:</span>
          </div>

          {/* Continuous Right-to-Left Viewport & Track */}
          <div className="mandi-ticker-viewport">
            <div className="mandi-ticker-track">
              {/* Duplicated array for seamless 100% continuous infinite loop */}
              {[...MOCK_PRICES_TICKER, ...MOCK_PRICES_TICKER].map((t, idx) => (
                <div key={idx} className="mandi-ticker-item">
                  <span>{t.crop}:</span>
                  <strong>{t.price}</strong>
                  <span className={t.positive ? 'mandi-ticker-change-pos' : 'mandi-ticker-change-neg'}>
                    {t.positive ? '▲ ' : '▼ '}{t.change}
                  </span>
                  <span className="mandi-ticker-sep">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
