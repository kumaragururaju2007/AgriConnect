import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, KeyRound, User, FileText, CheckCircle2, 
  ArrowRight, Lock, Building2, MapPin, CreditCard, Sparkles, Database, UserPlus, LogIn,
  Scale, X, HelpCircle, AlertCircle, Award
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';

export default function Step02Login({ setStep, setTerminal, setRole, lang, setLang, openAdminPortal, openFieldAgentPortal }) {
  const { loginUser, registerUser, dbStatus } = useAgri();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  // Role: 'farmer' | 'buyer' | 'driver' | 'admin' | 'agent'
  const [selectedRole, setSelectedRole] = useState('farmer');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('santosh.shinde@agri.mh');
  const [loginPassword, setLoginPassword] = useState('agri1234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin 2FA OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState('849201');
  const [otpError, setOtpError] = useState('');

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Farmer Registration State
  const [farmerData, setFarmerData] = useState({
    fullName: 'Santosh Ramdas Shinde',
    fatherName: 'Ramdas Shinde',
    mobile: '98224 81920',
    email: 'santosh.shinde@agri.mh',
    password: 'password123',
    district: 'Nashik',
    taluka: 'Niphad',
    village: 'Pimpalgaon Baswant',
    landGutNo: 'Gut No. 142/B',
    landArea: '4.2',
    aadhaarNo: '4892 8412 9012',
    bankName: 'State Bank of India',
    bankAccount: '38291048291',
    ifsc: 'SBIN0001429'
  });

  // Buyer Registration State
  const [buyerData, setBuyerData] = useState({
    companyName: 'AgroFresh Supply Chain Pvt Ltd',
    contactPerson: 'Rajesh Mehta',
    email: 'rajesh.mehta@agrofresh.in',
    mobile: '98210 44102',
    password: 'password123',
    licenseNo: 'MH-PUN-APMC-9421',
    cin: 'U01100MH2018PTC309112',
    location: 'Lasalgaon Mandi Grid, Nashik',
    businessType: 'Commercial Mandi Aggregator & Institutional Processor'
  });

  // Driver / Transporter Registration State
  const [driverData, setDriverData] = useState({
    name: 'Rajesh Vitthal Patil',
    phone: '+91 98221 44021',
    email: 'rajesh.patil@freight.mh',
    password: 'password123',
    vehicle_reg: 'MH 15 EG 4402',
    vehicle_type: 'Eicher Pro 2049 (6-Wheel Heavy Truck)',
    capacity_tonnes: 4.5,
    license_number: 'MH-15-2018-0049214',
    vehicle_photo_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
    bank_account: 'State Bank of India (A/C: *******6819)'
  });

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      setShowOtpModal(true);
      return;
    }

    if (selectedRole === 'agent') {
      setIsSubmitting(true);
      await loginUser(
        { usernameOrEmail: loginIdentifier, password: loginPassword },
        'agent'
      );
      setIsSubmitting(false);
      if (setTerminal) setTerminal('agent');
      if (setRole) setRole('agent');
      if (openFieldAgentPortal) openFieldAgentPortal();
      else setStep(22);
      return;
    }

    setIsSubmitting(true);
    await loginUser(
      { usernameOrEmail: loginIdentifier, password: loginPassword },
      selectedRole
    );
    setIsSubmitting(false);

    if (selectedRole === 'farmer') {
      setTerminal('farmer');
      setStep(3); // Farmer Dashboard
    } else if (selectedRole === 'driver') {
      setTerminal('driver');
      setStep(20); // Driver Portal
    } else {
      setTerminal('apmc');
      setStep(7); // Buyer Marketplace / Procurement Desk
    }
  };

  // Verify Admin 2FA OTP
  const handleVerifyAdminOtp = async () => {
    setIsSubmitting(true);
    await loginUser(
      { usernameOrEmail: loginIdentifier, password: loginPassword },
      'admin'
    );
    setIsSubmitting(false);
    setShowOtpModal(false);
    if (setTerminal) setTerminal('admin');
    if (setRole) setRole('admin');
    setStep(21); // Admin Portal
  };

  const handleDirectAdminLogin = async () => {
    setIsSubmitting(true);
    await loginUser(
      { usernameOrEmail: loginIdentifier, password: loginPassword },
      'admin'
    );
    setIsSubmitting(false);
    setShowOtpModal(false);
    if (setTerminal) setTerminal('admin');
    if (setRole) setRole('admin');
    setStep(21); // Admin Portal
  };

  const handleDirectAgentLogin = async () => {
    setIsSubmitting(true);
    await loginUser(
      { usernameOrEmail: '+91 98229 55012', password: 'password123' },
      'agent'
    );
    setIsSubmitting(false);
    if (setTerminal) setTerminal('agent');
    if (setRole) setRole('agent');
    if (openFieldAgentPortal) {
      openFieldAgentPortal();
    } else {
      setStep(22);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === 'admin' || selectedRole === 'agent') {
      return;
    }
    setIsSubmitting(true);
    if (selectedRole === 'farmer') {
      await registerUser(farmerData, 'farmer');
      setTerminal('farmer');
      setStep(3);
    } else if (selectedRole === 'driver') {
      await registerUser(driverData, 'driver');
      setTerminal('driver');
      setStep(20);
    } else {
      await registerUser(buyerData, 'buyer');
      setTerminal('apmc');
      setStep(7);
    }
    setIsSubmitting(false);
  };

  // Quick Demo Fast Fills
  const fillDemoFarmer = () => {
    setSelectedRole('farmer');
    setAuthMode('login');
    setLoginIdentifier('santosh.shinde@agri.mh');
    setLoginPassword('password123');
  };

  const fillDemoBuyer = () => {
    setSelectedRole('buyer');
    setAuthMode('login');
    setLoginIdentifier('procurement@agrofresh.in');
    setLoginPassword('password123');
  };

  const fillDemoDriver = () => {
    setSelectedRole('driver');
    setAuthMode('login');
    setLoginIdentifier('rajesh.patil@freight.mh');
    setLoginPassword('password123');
  };

  const fillDemoAdmin = () => {
    setSelectedRole('admin');
    setAuthMode('login');
    setLoginIdentifier('admin.nashik@agri.mh');
    setLoginPassword('admin1234');
  };

  const fillDemoAgent = () => {
    setSelectedRole('agent');
    setAuthMode('login');
    setLoginIdentifier('+91 98229 55012');
    setLoginPassword('agent1234');
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 840, margin: '0 auto', padding: '10px 0 40px' }}>
      
      {/* Top Banner */}
      <div className="panel" style={{ padding: '28px', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', padding: '4px 14px', borderRadius: 999, border: '1px solid #bbf7d0', marginBottom: 12 }}>
          <ShieldCheck size={16} style={{ color: '#15803d' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d' }}>
            Maha e-Seva, Mahabhulekh (7/12) & e-NAM Unified Gateway
          </span>
        </div>

        <h1 style={{ fontSize: '1.9rem', color: '#0f172a', fontWeight: 900, marginBottom: 6 }}>
          अधिकृत शेतकरी व व्यापारी प्रवेशद्वार
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: 580, margin: '0 auto 18px' }}>
          Select your role below to sign in to your dashboard or create a new verified government-linked profile.
        </p>

        {/* 1-Click Demo Fast Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>Demo Fast-Fill:</span>
          <button 
            type="button"
            onClick={fillDemoFarmer}
            style={{ background: '#ecfdf5', border: '1px solid #15803d', color: '#15803d', padding: '5px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800 }}>
            👨‍🌾 Demo Farmer (Santosh Shinde)
          </button>
          <button 
            type="button"
            onClick={fillDemoBuyer}
            style={{ background: '#fff7ed', border: '1px solid #ea580c', color: '#c2410c', padding: '5px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800 }}>
            🏢 Demo Buyer (AgroFresh Ltd)
          </button>
          <button 
            type="button"
            onClick={fillDemoDriver}
            style={{ background: '#eff6ff', border: '1px solid #2563eb', color: '#1d4ed8', padding: '5px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800 }}>
            🚚 Demo Transportation (Rajesh Patil - MH 15)
          </button>
          <button 
            type="button"
            onClick={fillDemoAgent}
            style={{ background: '#f0fdf4', border: '1px solid #059669', color: '#047857', padding: '5px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800 }}>
            📍 Demo Field Agent (Sachin Kadam)
          </button>
          <button 
            type="button"
            onClick={fillDemoAdmin}
            style={{ background: '#f8fafc', border: '1px solid #0f172a', color: '#0f172a', padding: '5px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800 }}>
            🏛️ Demo APMC Admin (S. K. Deshmukh)
          </button>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="panel" style={{ padding: '32px' }}>
        
        {/* Step A: Role Selection (Farmer vs Buyer vs Driver vs Field Agent vs Admin) */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 10 }}>
            1. Select Your Gateway Role (तुमची भूमिका निवडा)
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
            <div 
              onClick={() => setSelectedRole('farmer')}
              style={{
                padding: '16px', borderRadius: 10, cursor: 'pointer',
                background: selectedRole === 'farmer' ? '#ecfdf5' : '#ffffff',
                border: selectedRole === 'farmer' ? '2px solid #15803d' : '1px solid #e2e8f0',
                transition: 'all 0.15s ease', boxShadow: selectedRole === 'farmer' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.6rem' }}>👨‍🌾</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedRole === 'farmer' ? '#15803d' : '#0f172a' }}>
                    Farmer (शेतकरी)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Sell harvest, AI grading, 7/12 land sync & direct escrow payout
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedRole('buyer')}
              style={{
                padding: '16px', borderRadius: 10, cursor: 'pointer',
                background: selectedRole === 'buyer' ? '#fff7ed' : '#ffffff',
                border: selectedRole === 'buyer' ? '2px solid #ea580c' : '1px solid #e2e8f0',
                transition: 'all 0.15s ease', boxShadow: selectedRole === 'buyer' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.6rem' }}>🏢</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedRole === 'buyer' ? '#ea580c' : '#0f172a' }}>
                    Buyer (व्यापारी)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Procure lots, bid on pools, lock escrow contracts & track dispatch
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setSelectedRole('driver')}
              style={{
                padding: '16px', borderRadius: 10, cursor: 'pointer',
                background: selectedRole === 'driver' ? '#eff6ff' : '#ffffff',
                border: selectedRole === 'driver' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                transition: 'all 0.15s ease', boxShadow: selectedRole === 'driver' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.6rem' }}>🚚</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedRole === 'driver' ? '#2563eb' : '#0f172a' }}>
                    Transportation (वाहतूकदार)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Haul mandi loads, upfront trip rates, pooled trips & Vahan sync
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => {
                setSelectedRole('agent');
                setLoginIdentifier('+91 98229 55012');
                setLoginPassword('agent1234');
              }}
              style={{
                padding: '16px', borderRadius: 10, cursor: 'pointer',
                background: selectedRole === 'agent' ? '#ecfdf5' : '#ffffff',
                border: selectedRole === 'agent' ? '2px solid #059669' : '1px solid #e2e8f0',
                transition: 'all 0.15s ease', boxShadow: selectedRole === 'agent' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.6rem' }}>📍</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedRole === 'agent' ? '#059669' : '#0f172a' }}>
                    Field Agent (क्षेत्र अधिकारी)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    On-ground farm KYC, NIR quality assay, dispute arbitration & offline sync
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={() => {
                setSelectedRole('admin');
                setLoginIdentifier('admin.nashik@agri.mh');
                setLoginPassword('admin1234');
              }}
              style={{
                padding: '16px', borderRadius: 10, cursor: 'pointer',
                background: selectedRole === 'admin' ? '#f8fafc' : '#ffffff',
                border: selectedRole === 'admin' ? '2px solid #0f172a' : '1px solid #e2e8f0',
                transition: 'all 0.15s ease', boxShadow: selectedRole === 'admin' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: '1.6rem' }}>🏛️</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedRole === 'admin' ? '#0f172a' : '#0f172a' }}>
                    APMC Admin (नियामक अधिकारी)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Verify buyers, arbitrate disputes under Sec 31-B & inspect compliance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step B: Toggle between Sign In vs Register */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{
              padding: '10px 24px', fontSize: '0.92rem', fontWeight: 800,
              color: authMode === 'login' ? '#15803d' : '#64748b',
              borderBottom: authMode === 'login' ? '3px solid #15803d' : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <LogIn size={16} />
            <span>Sign In (प्रवेश करा)</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            style={{
              padding: '10px 24px', fontSize: '0.92rem', fontWeight: 800,
              color: authMode === 'register' ? '#15803d' : '#64748b',
              borderBottom: authMode === 'register' ? '3px solid #15803d' : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <UserPlus size={16} />
            <span>Create Account (नवीन नोंदणी)</span>
          </button>
        </div>

        {/* TAB 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="animate-slide-in">
            {/* Field Agent Zone Banner */}
            {selectedRole === 'agent' && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={20} style={{ color: '#059669', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>Assigned Field Jurisdiction: Niphad & Dindori Zone (Nashik Division)</div>
                  <div style={{ fontSize: '0.74rem', color: '#047857' }}>Taluka Ag-HQ • Problem Statement ID 26132 • Low-connectivity Offline Session Caching Enabled</div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                {selectedRole === 'agent' ? 'Field Agent Mobile Number (OTP Linked)' : 'Email Address, Mobile Number, or Citizen ID'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0 12px' }}>
                <User size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
                <input 
                  type="text" 
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin.nashik@agri.mh' : selectedRole === 'agent' ? '+91 98229 55012' : selectedRole === 'farmer' ? 'santosh.shinde@agri.mh or 98224 81920' : selectedRole === 'driver' ? 'rajesh.patil@freight.mh or +91 98221 44021' : 'procurement@agrofresh.in'}
                  required
                  style={{ width: '100%', padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  {selectedRole === 'agent' ? 'Field Security PIN / OTP (पासवर्ड / ओटीपी)' : 'Secret Password / MPIN (पासवर्ड)'}
                </label>
                <span 
                  onClick={() => {
                    setForgotEmail(loginIdentifier);
                    setForgotSuccess(false);
                    setShowForgotModal(true);
                  }}
                  style={{ fontSize: '0.75rem', color: '#15803d', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot Password?
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0 12px' }}>
                <KeyRound size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder={selectedRole === 'agent' ? 'Enter 6-digit Field OTP (Demo: agent1234)' : 'Enter your security password'}
                  required
                  style={{ width: '100%', padding: '10px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={selectedRole === 'farmer' ? 'btn-primary' : selectedRole === 'driver' ? 'btn-blue' : selectedRole === 'agent' ? 'btn-primary' : selectedRole === 'admin' ? 'btn-primary' : 'btn-saffron'} 
              style={{
                width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', borderRadius: 8,
                background: selectedRole === 'admin' ? '#0f172a' : selectedRole === 'agent' ? '#059669' : undefined,
                borderColor: selectedRole === 'admin' ? '#0f172a' : selectedRole === 'agent' ? '#059669' : undefined
              }}
            >
              <span>{isSubmitting ? 'Authenticating credentials...' : selectedRole === 'admin' ? 'Sign In as APMC Regulatory Officer (2FA)' : selectedRole === 'agent' ? 'Sign In as Field Agent (Mobile OTP Verified)' : `Sign In as ${selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'driver' ? 'Transportation / Logistics' : 'Buyer'}`}</span>
              <ArrowRight size={16} />
            </button>

            {selectedRole === 'agent' && (
              <button
                type="button"
                onClick={handleDirectAgentLogin}
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '10px', marginTop: 10, borderRadius: 8,
                  background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
                  color: '#ffffff', border: 'none', fontSize: '0.85rem', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                }}
              >
                <ShieldCheck size={16} />
                <span>⚡ Instant Field Agent Demo (Sachin B. Kadam - 1-Click Launch)</span>
              </button>
            )}

            {selectedRole === 'admin' && (
              <button
                type="button"
                onClick={handleDirectAdminLogin}
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '10px', marginTop: 10, borderRadius: 8,
                  background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff', border: 'none', fontSize: '0.85rem', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                }}
              >
                <ShieldCheck size={16} />
                <span>⚡ Instant Regulatory Admin Demo (1-Click Launch)</span>
              </button>
            )}

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.82rem', color: '#64748b' }}>
              Don't have a registered account yet?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('register')} 
                style={{ color: '#15803d', fontWeight: 800, textDecoration: 'underline' }}>
                Register here (नवीन नोंदणी करा)
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTRATION FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="animate-slide-in">
            
            {/* Restricted notice for Field Agent role */}
            {selectedRole === 'agent' && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '24px', textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', margin: '0 auto 12px' }}>
                  <MapPin size={26} />
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800, color: '#065f46' }}>
                  Field Visitor Official Provisioning
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#047857', lineHeight: 1.5, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
                  Field agent / extension visitor accounts are provisioned exclusively by the Taluka Agricultural Extension Office (SDAO Niphad & Dindori) under Problem Statement ID 26132. Self-service registration is disabled for field agent profiles.
                </p>
                <button
                  type="button"
                  onClick={handleDirectAgentLogin}
                  style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Launch Demo Field Agent (Sachin B. Kadam)
                </button>
              </div>
            )}

            {/* Restricted notice for Admin role */}
            {selectedRole === 'admin' && (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 10, padding: '24px', textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', margin: '0 auto 12px' }}>
                  <ShieldCheck size={26} />
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800, color: '#92400e' }}>
                  Gazetted Administrative Provisioning
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#78350f', lineHeight: 1.5, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
                  Regulatory magistrate accounts are provisioned exclusively by the Maharashtra Directorate of Agricultural Marketing under APMC Act mandate. Self-service registration is disabled for administrative profiles.
                </p>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '9px 20px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Use Demo Magistrate Credentials (S. K. Deshmukh)
                </button>
              </div>
            )}
            
            {/* Farmer Registration Fields */}
            {selectedRole === 'farmer' ? (
              <div>
                <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: '0.82rem', color: '#166534' }}>
                  <strong>Government Verification:</strong> 7/12 Land records will be authenticated via Mahabhulekh API and mapped to your Aadhaar DBT account.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Full Name (संपूर्ण नाव)</label>
                    <input 
                      type="text" 
                      value={farmerData.fullName}
                      onChange={(e) => setFarmerData({ ...farmerData, fullName: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Mobile Number (Aadhaar Linked)</label>
                    <input 
                      type="text" 
                      value={farmerData.mobile}
                      onChange={(e) => setFarmerData({ ...farmerData, mobile: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>District (जिल्हा)</label>
                    <select 
                      value={farmerData.district}
                      onChange={(e) => setFarmerData({ ...farmerData, district: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}>
                      <option value="Nashik">Nashik (नाशिक)</option>
                      <option value="Pune">Pune (पुणे)</option>
                      <option value="Solapur">Solapur (सोलापूर)</option>
                      <option value="Latur">Latur (लातूर)</option>
                      <option value="Akola">Akola (अकोला)</option>
                      <option value="Ahmednagar">Ahmednagar (अहमदनगर)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Taluka & Village (तालुका व गाव)</label>
                    <input 
                      type="text" 
                      value={`${farmerData.taluka}, ${farmerData.village}`}
                      onChange={(e) => setFarmerData({ ...farmerData, village: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>7/12 Land Gut Number (७/१२ गट क्र.)</label>
                    <input 
                      type="text" 
                      value={farmerData.landGutNo}
                      onChange={(e) => setFarmerData({ ...farmerData, landGutNo: e.target.value })}
                      required
                      placeholder="उदा. Gut No. 142/B"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Cultivated Area (Acres)</label>
                    <input 
                      type="text" 
                      value={farmerData.landArea}
                      onChange={(e) => setFarmerData({ ...farmerData, landArea: e.target.value })}
                      required
                      placeholder="उदा. 4.2 Acres"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Aadhaar Number (e-KYC)</label>
                    <input 
                      type="text" 
                      value={farmerData.aadhaarNo}
                      onChange={(e) => setFarmerData({ ...farmerData, aadhaarNo: e.target.value })}
                      required
                      placeholder="XXXX XXXX XXXX"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Bank Account (for Escrow DBT)</label>
                    <input 
                      type="text" 
                      value={farmerData.bankAccount}
                      onChange={(e) => setFarmerData({ ...farmerData, bankAccount: e.target.value })}
                      required
                      placeholder="Bank A/C Number"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>
              </div>
            ) : selectedRole === 'driver' ? (
              /* Driver / Transporter Registration Fields */
              <div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: '0.82rem', color: '#1e40af' }}>
                  <strong>MoRTH Vahan Portal Gateway:</strong> Commercial fitness, vehicle insurance, and PUC status are verified against the Vahan National Register.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Driver / Transporter Name (चालकाचे नाव)</label>
                    <input 
                      type="text" 
                      value={driverData.name}
                      onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
                      required
                      placeholder="उदा. Rajesh Vitthal Patil"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Mobile Contact (चालक संपर्क क्र.)</label>
                    <input 
                      type="text" 
                      value={driverData.phone}
                      onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })}
                      required
                      placeholder="+91 98221 44021"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Commercial Driving License No (चालक परवाना क्र.)</label>
                    <input 
                      type="text" 
                      value={driverData.license_number}
                      onChange={(e) => setDriverData({ ...driverData, license_number: e.target.value })}
                      required
                      placeholder="उदा. MH-15-2018-0049214"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Vehicle Registration Number (वाहन नोंदणी क्र.)</label>
                    <input 
                      type="text" 
                      value={driverData.vehicle_reg}
                      onChange={(e) => setDriverData({ ...driverData, vehicle_reg: e.target.value.toUpperCase() })}
                      required
                      placeholder="उदा. MH 15 EG 4402"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Vehicle Type / Category (वाहनाचा प्रकार)</label>
                    <select 
                      value={driverData.vehicle_type}
                      onChange={(e) => setDriverData({ ...driverData, vehicle_type: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}>
                      <option value="Eicher Pro 2049 (6-Wheel Heavy Truck)">Eicher Pro 2049 (6-Wheel Heavy Truck)</option>
                      <option value="Tata 407 Gold SFC (Medium LCV)">Tata 407 Gold SFC (Medium LCV)</option>
                      <option value="Mahindra Bolero Maxi Truck Plus">Mahindra Bolero Maxi Truck Plus</option>
                      <option value="BharatBenz 1217C (Multi-Axle Rigid)">BharatBenz 1217C (Multi-Axle Rigid)</option>
                      <option value="Ashok Leyland BADA DOST">Ashok Leyland BADA DOST</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Payload Capacity in Tonnes (वजन क्षमता)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={driverData.capacity_tonnes}
                      onChange={(e) => setDriverData({ ...driverData, capacity_tonnes: e.target.value })}
                      required
                      placeholder="उदा. 4.5"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Mandi Freight Payout Bank Account (थेट भाडे जमा खाते)</label>
                    <input 
                      type="text" 
                      value={driverData.bank_account}
                      onChange={(e) => setDriverData({ ...driverData, bank_account: e.target.value })}
                      required
                      placeholder="State Bank of India (A/C: *******6819)"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>

                {/* Vehicle Photo Upload & Preview */}
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, padding: '14px', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                      📸 Vehicle Inspection Photo (वाहनाचा फोटो)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>✓ Verified Clear Front/Side Profile</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <img 
                      src={driverData.vehicle_photo_url} 
                      alt="Registered Vehicle Preview" 
                      style={{ width: 110, height: 75, objectFit: 'cover', borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <div style={{ flex: 1 }}>
                      <input 
                        type="text" 
                        value={driverData.vehicle_photo_url}
                        onChange={(e) => setDriverData({ ...driverData, vehicle_photo_url: e.target.value })}
                        placeholder="Image URL or upload"
                        style={{ width: '100%', padding: '8px 10px', fontSize: '0.8rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, marginBottom: 6 }}
                      />
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Used for mandi gate entry pass and consignor dispatch verification.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Vahan Portal Verification Check Widget */}
                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #86efac', 
                  borderRadius: 8, 
                  padding: '14px', 
                  marginBottom: 16 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShieldCheck size={18} style={{ color: '#15803d' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#14532d' }}>
                        MoRTH Vahan Verification Check (वाहन राष्ट्रीय नोंदणी पडताळणी)
                      </span>
                    </div>
                    {/* 3-Tier Trust Badge */}
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 4, 
                      padding: '4px 10px', 
                      borderRadius: 999, 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      background: driverData.vehicle_reg.length >= 6 ? '#dcfce7' : '#fef3c7',
                      color: driverData.vehicle_reg.length >= 6 ? '#15803d' : '#b45309',
                      border: `1px solid ${driverData.vehicle_reg.length >= 6 ? '#86efac' : '#fcd34d'}`
                    }}>
                      {driverData.vehicle_reg.length >= 6 ? '🛡️ Vahan Verified' : '⏳ Pending Verification'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: '0.75rem' }}>
                    <div style={{ background: '#fff', padding: '8px 10px', borderRadius: 6, border: '1px solid #dcfce7' }}>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>Commercial Fitness</div>
                      <div style={{ fontWeight: 800, color: '#15803d' }}>Valid till 15-Aug-2027</div>
                    </div>
                    <div style={{ background: '#fff', padding: '8px 10px', borderRadius: 6, border: '1px solid #dcfce7' }}>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>Vehicle Insurance</div>
                      <div style={{ fontWeight: 800, color: '#15803d' }}>New India Assurance (2026)</div>
                    </div>
                    <div style={{ background: '#fff', padding: '8px 10px', borderRadius: 6, border: '1px solid #dcfce7' }}>
                      <div style={{ color: '#64748b', fontWeight: 600 }}>PUC Emission (BS-VI)</div>
                      <div style={{ fontWeight: 800, color: '#15803d' }}>Green (Valid till Oct 2026)</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Buyer Registration Fields */
              <div>
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: '0.82rem', color: '#c2410c' }}>
                  <strong>Statutory License Registration:</strong> Buyers must possess a valid APMC Wholesale Trader License or corporate CIN under the Maharashtra APMC Act, 1963.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Enterprise / Company Name</label>
                    <input 
                      type="text" 
                      value={buyerData.companyName}
                      onChange={(e) => setBuyerData({ ...buyerData, companyName: e.target.value })}
                      required
                      placeholder="उदा. AgroFresh Supply Chain Pvt Ltd"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Authorized Contact Person</label>
                    <input 
                      type="text" 
                      value={buyerData.contactPerson}
                      onChange={(e) => setBuyerData({ ...buyerData, contactPerson: e.target.value })}
                      required
                      placeholder="उदा. Rajesh Mehta"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Official Email ID</label>
                    <input 
                      type="email" 
                      value={buyerData.email}
                      onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                      required
                      placeholder="procurement@company.com"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Mobile Contact</label>
                    <input 
                      type="text" 
                      value={buyerData.mobile}
                      onChange={(e) => setBuyerData({ ...buyerData, mobile: e.target.value })}
                      required
                      placeholder="+91 98XXX XXXXX"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>APMC Trader License No.</label>
                    <input 
                      type="text" 
                      value={buyerData.licenseNo}
                      onChange={(e) => setBuyerData({ ...buyerData, licenseNo: e.target.value })}
                      required
                      placeholder="MH-PUN-APMC-9421"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Corporate CIN or GSTIN</label>
                    <input 
                      type="text" 
                      value={buyerData.cin}
                      onChange={(e) => setBuyerData({ ...buyerData, cin: e.target.value })}
                      required
                      placeholder="U01100MH2018PTC309112"
                      style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }} 
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Business Category</label>
                    <select 
                      value={buyerData.businessType}
                      onChange={(e) => setBuyerData({ ...buyerData, businessType: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}>
                      <option value="Commercial Mandi Aggregator & Institutional Processor">Commercial Mandi Aggregator & Institutional Processor</option>
                      <option value="Modern Organized Retail Aggregation Center">Modern Organized Retail Aggregation Center (Supermarkets)</option>
                      <option value="Export House & Cold Chain Corridors">Export House & Cold Chain Corridors</option>
                      <option value="Farmer Producer Organization (FPO Hub)">Farmer Producer Organization (FPO Hub)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className={selectedRole === 'farmer' ? 'btn-primary' : selectedRole === 'driver' ? 'btn-blue' : 'btn-saffron'} 
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', borderRadius: 8, marginTop: 10 }}
            >
              <span>{isSubmitting ? 'Registering into PostgreSQL...' : `Complete Registration as ${selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'driver' ? 'Accredited Transporter' : 'Buyer'}`}</span>
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.82rem', color: '#64748b' }}>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setAuthMode('login')} 
                style={{ color: '#15803d', fontWeight: 800, textDecoration: 'underline' }}>
                Sign In here (येथे लॉग इन करा)
              </button>
            </div>
          </form>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 2FA OTP VERIFICATION MODAL FOR ADMIN */}
      {/* ========================================================================= */}
      {showOtpModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, maxWidth: 460, width: '100%',
            padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', textAlign: 'center'
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', background: '#ecfdf5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#15803d', margin: '0 auto 14px'
            }}>
              <ShieldCheck size={28} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', padding: '3px 12px', borderRadius: 999, marginBottom: 8 }}>
              <Lock size={13} style={{ color: '#15803d' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d' }}>
                APMC 2-FACTOR REGULATORY AUTH
              </span>
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              Two-Factor Authentication (OTP)
            </h3>

            <p style={{ margin: '0 0 18px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              A 6-digit security code was dispatched to registered mobile <strong>+91 ******9142</strong> linked to <strong>S. K. Deshmukh</strong> (Nashik Supervised Division).
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#334155', marginBottom: 6 }}>
                Enter 6-Digit Passcode:
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpDigits}
                onChange={(e) => { setOtpDigits(e.target.value); setOtpError(''); }}
                placeholder="849201"
                style={{
                  width: '100%', textAlign: 'center', fontSize: '1.6rem',
                  fontWeight: 900, letterSpacing: '0.35em', padding: '10px 0',
                  borderRadius: 8, border: '2px solid #0f172a', background: '#f8fafc',
                  outline: 'none', color: '#0f172a'
                }}
              />
              {otpError && (
                <div style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: 6, fontWeight: 600 }}>
                  {otpError}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => { setOtpDigits('849201'); setOtpError(''); }}
                style={{
                  background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 12px',
                  borderRadius: 6, fontSize: '0.74rem', color: '#475569', cursor: 'pointer', fontWeight: 700
                }}
              >
                1-Click Demo OTP (849201)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleVerifyAdminOtp}
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 8,
                  background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff', border: 'none', fontSize: '0.88rem', fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                }}
              >
                {isSubmitting ? 'Verifying Regulatory Key...' : 'Verify & Launch Admin Console'}
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: '0.8rem', cursor: 'pointer', padding: 6
                }}
              >
                Cancel Authentication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, maxWidth: 440, width: '100%',
            padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                Reset Password / MPIN
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {forgotSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <CheckCircle2 size={24} />
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#15803d' }}>
                  Reset Link Dispatched!
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  A verification link & temporary reset PIN have been sent to <strong>{forgotEmail}</strong>. Please check your SMS and email.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  style={{ marginTop: 20, width: '100%', padding: '9px 0', borderRadius: 8, background: '#15803d', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Enter your registered mobile number or official email address to receive a secure password recovery code.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                    Registered Email / Mobile:
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="E.g., santosh.shinde@agri.mh or 98224 81920"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#15803d', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Send Recovery Code
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
