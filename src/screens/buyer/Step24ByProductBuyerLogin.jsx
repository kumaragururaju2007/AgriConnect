import React, { useState } from 'react';
import { 
  Recycle, Leaf, ShieldCheck, Factory, Sparkles, ArrowRight, Lock, 
  Building2, MapPin, CreditCard, CheckCircle2, Phone, Mail, FileText, 
  HelpCircle, AlertCircle, Award, Flame, Zap, Truck, DollarSign, LogIn, UserPlus
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';
import { TRANSLATIONS } from '../../data/translations';

export default function Step24ByProductBuyerLogin({ setStep, setTerminal, setRole, lang }) {
  const { loginUser, registerUser, lang: ctxLang } = useAgri();
  const activeLang = ctxLang || lang || 'en';
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  // 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  
  // Login State
  const [identifier, setIdentifier] = useState('procurement@mahabiofuels.in');
  const [password, setPassword] = useState('biofuel1234');
  const [industryType, setIndustryType] = useState('cbg_biofuels');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State
  const [registerData, setRegisterData] = useState({
    companyName: 'Maha BioEnergy & Pellets Ltd',
    gstin: '27AABCM8812K1Z8',
    mpcbConsentNo: 'MPCB/RO-NSK/CONSENT-2024-8841',
    contactPerson: 'Sanjay Deshpande (Procurement Head)',
    email: 'procurement@mahabiofuels.in',
    phone: '+91 98220 77192',
    password: 'password123',
    industryCategory: 'Bio-CNG (CBG) & Briquette Manufacturing',
    plantDistrict: 'Nashik',
    plantLocation: 'Sinnar Industrial Estate, Nashik',
    monthlyDemandMT: 450,
    preferredBiomass: ['Sugarcane Trash', 'Cotton Stalks', 'Soyabean Straw', 'Onion Skins'],
    escrowBank: 'State Bank of India',
    escrowAccount: '39481029481',
    ifsc: 'SBIN0002148'
  });

  const DEMO_BUYERS = [
    {
      name: '🌿 Maha BioEnergy Ltd (CBG Plant)',
      email: 'procurement@mahabiofuels.in',
      pass: 'biofuel1234',
      type: 'Compressed Bio-Gas (CBG) / Bio-CNG',
      demand: '500 MT/month • Nashik'
    },
    {
      name: '🔥 GreenPower Pellets & Briquettes',
      email: 'sourcing@greenpowerpellets.in',
      pass: 'pellet1234',
      type: 'Industrial Biomass Pellets & Briquettes',
      demand: '350 MT/month • Pune'
    },
    {
      name: '📜 Deccan Pulp & Packaging Mills',
      email: 'biomass@deccanpulp.mh',
      pass: 'pulp1234',
      type: 'Agro-Residue Paper & Fiber Boards',
      demand: '800 MT/month • Kolhapur'
    }
  ];

  const handleQuickFill = (buyer) => {
    setIdentifier(buyer.email);
    setPassword(buyer.pass);
    setAuthMode('login');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      await loginUser({ usernameOrEmail: identifier, password }, 'buyer');
      if (setRole) setRole('apmc');
      if (setTerminal) setTerminal('apmc');
      setStep(23); // Navigate to By-Product Buyer Portal
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerUser(registerData, 'buyer');
      if (setRole) setRole('apmc');
      if (setTerminal) setTerminal('apmc');
      setStep(23); // Navigate to By-Product Buyer Portal
    } catch (err) {
      setLoginError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 900, margin: '0 auto', padding: '16px 12px 48px' }}>
      
      {/* Header Banner */}
      <div className="panel" style={{ 
        padding: '32px 24px', 
        textAlign: 'center', 
        marginBottom: 24, 
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0d9488 100%)',
        color: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 10px 25px -5px rgba(4, 120, 87, 0.4)'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8, 
          background: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(8px)',
          padding: '6px 16px', 
          borderRadius: 999, 
          marginBottom: 16,
          border: '1px solid rgba(255, 255, 255, 0.25)'
        }}>
          <Recycle size={18} style={{ color: '#a7f3d0' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ecfdf5', letterSpacing: '0.5px' }}>
            MAHARASHTRA AGRI-BIOMASS & BIOFUEL EXCHANGE GATEWAY
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.5px' }}>
          बायोमास व उप-उत्पादने खरेदीदार प्रवेशद्वार
        </h1>
        <p style={{ fontSize: '0.98rem', color: '#ccfbf1', maxWidth: 640, margin: '0 auto 20px', lineHeight: 1.5 }}>
          Authorized Industrial Procurement Portal for Bio-CNG (CBG) Plants, Pellet Manufacturers, Paper Mills & Industrial Boiler Operators.
        </p>

        {/* 1-Click Fast Fill Profiles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
            ⚡ 1-Click Verified Buyers:
          </span>
          {DEMO_BUYERS.map((b, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickFill(b)}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                color: '#065f46',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s'
              }}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="panel" style={{ padding: '32px', borderRadius: 16 }}>
        
        {/* Tab Toggle: Sign In vs Register */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: 28 }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setLoginError(''); }}
            style={{
              padding: '12px 28px',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: authMode === 'login' ? '#047857' : '#64748b',
              borderBottom: authMode === 'login' ? '3px solid #047857' : '3px solid transparent',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <LogIn size={18} />
            <span>Sign In (प्रवेश करा)</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setLoginError(''); }}
            style={{
              padding: '12px 28px',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: authMode === 'register' ? '#047857' : '#64748b',
              borderBottom: authMode === 'register' ? '3px solid #047857' : '3px solid transparent',
              background: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={18} />
            <span>Industrial Registration (नवीन उद्योग नोंदणी)</span>
          </button>
        </div>

        {loginError && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            color: '#991b1b', 
            padding: '12px 16px', 
            borderRadius: 8, 
            marginBottom: 20, 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertCircle size={18} />
            <span>{loginError}</span>
          </div>
        )}

        {/* ===================== TAB 1: LOGIN ===================== */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="animate-slide-in">
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
              <div style={{ 
                background: '#ecfdf5', 
                border: '1px solid #a7f3d0', 
                borderRadius: 10, 
                padding: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12 
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
                  <Factory size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#065f46' }}>Verified Industrial Escrow</div>
                  <div style={{ fontSize: '0.74rem', color: '#047857' }}>Instant SBI Escrow Contract Lock</div>
                </div>
              </div>

              <div style={{ 
                background: '#f0fdf4', 
                border: '1px solid #bbf7d0', 
                borderRadius: 10, 
                padding: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12 
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                  <Truck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#14532d' }}>Aggregated Farmgate Logistics</div>
                  <div style={{ fontSize: '0.74rem', color: '#15803d' }}>Pre-matched Biomass Tippers & Trucks</div>
                </div>
              </div>

              <div style={{ 
                background: '#ecfeff', 
                border: '1px solid #a5f3fc', 
                borderRadius: 10, 
                padding: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12 
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#cffafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891b2' }}>
                  <Leaf size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#155e75' }}>Zero Stubble Burning</div>
                  <div style={{ fontSize: '0.74rem', color: '#0e7490' }}>Carbon Offset & ESG Credit Ready</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Industrial Email Address / GSTIN ID (ईमेल किंवा जीएसटी क्र.)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0 12px' }}>
                <Mail size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. procurement@mahabiofuels.in or 27AABCM8812K1Z8"
                  required
                  style={{ width: '100%', padding: '11px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  Corporate Portal Password (पासवर्ड)
                </label>
                <span style={{ fontSize: '0.75rem', color: '#047857', cursor: 'pointer', fontWeight: 700 }}>
                  Forgot Password?
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0 12px' }}>
                <Lock size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter corporate access password"
                  required
                  style={{ width: '100%', padding: '11px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.96rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Recycle size={18} />
              <span>{isSubmitting ? 'Authenticating Corporate Credentials...' : 'Sign In to By-Product & Biomass Portal'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.84rem', color: '#64748b' }}>
              First time sourcing biomass directly from farmer clusters?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                style={{ color: '#047857', fontWeight: 800, textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Register your Processing Unit
              </button>
            </div>
          </form>
        )}

        {/* ===================== TAB 2: REGISTER ===================== */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="animate-slide-in">
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '14px 18px', marginBottom: 20, fontSize: '0.84rem', color: '#065f46' }}>
              <strong>🏭 Direct Farmgate Aggregation:</strong> Verified industrial buyers gain direct bidding access to farm residue lots (sugarcane trash, onion peels, soyabean straw, cotton stalks) with pre-negotiated freight logistics.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Company / Enterprise Name (कंपनीचे नाव)
                </label>
                <input
                  type="text"
                  value={registerData.companyName}
                  onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                  required
                  placeholder="e.g. Maha BioEnergy & Pellets Ltd"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  GSTIN Number (जीएसटी क्रमांक)
                </label>
                <input
                  type="text"
                  value={registerData.gstin}
                  onChange={(e) => setRegisterData({ ...registerData, gstin: e.target.value.toUpperCase() })}
                  required
                  placeholder="e.g. 27AABCM8812K1Z8"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Industry Category / Application (उद्योगाचा प्रकार)
                </label>
                <select
                  value={registerData.industryCategory}
                  onChange={(e) => setRegisterData({ ...registerData, industryCategory: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                >
                  <option value="Bio-CNG (CBG) & Briquette Manufacturing">Bio-CNG (CBG) & Briquette Manufacturing</option>
                  <option value="Industrial Biomass Pellets & Bio-Coal">Industrial Biomass Pellets & Bio-Coal</option>
                  <option value="Agro-Paper & Corrugated Packaging Pulp">Agro-Paper & Corrugated Packaging Pulp</option>
                  <option value="Ethanol Distilleries & Bio-Refineries">Ethanol Distilleries & Bio-Refineries</option>
                  <option value="Organic Fertilizer & Compost Processing">Organic Fertilizer & Compost Processing</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Plant District & Sourcing Zone (कारखाना जिल्हा)
                </label>
                <select
                  value={registerData.plantDistrict}
                  onChange={(e) => setRegisterData({ ...registerData, plantDistrict: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                >
                  <option value="Nashik">Nashik (नाशिक)</option>
                  <option value="Pune">Pune (पुणे)</option>
                  <option value="Ahmednagar">Ahmednagar (अहमदनगर)</option>
                  <option value="Solapur">Solapur (सोलापूर)</option>
                  <option value="Kolhapur">Kolhapur (कोल्हापूर)</option>
                  <option value="Sangli">Sangli (सांगली)</option>
                  <option value="Latur">Latur (लातूर)</option>
                  <option value="Aurangabad / Chh. Sambhajinagar">Chh. Sambhajinagar</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Monthly Biomass Demand (MT / महिना)
                </label>
                <input
                  type="number"
                  value={registerData.monthlyDemandMT}
                  onChange={(e) => setRegisterData({ ...registerData, monthlyDemandMT: Number(e.target.value) })}
                  required
                  placeholder="e.g. 450"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  MPCB Pollution Board Consent No.
                </label>
                <input
                  type="text"
                  value={registerData.mpcbConsentNo}
                  onChange={(e) => setRegisterData({ ...registerData, mpcbConsentNo: e.target.value })}
                  placeholder="e.g. MPCB/RO-NSK/CONSENT-2024-8841"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Authorized Officer / Contact Person
                </label>
                <input
                  type="text"
                  value={registerData.contactPerson}
                  onChange={(e) => setRegisterData({ ...registerData, contactPerson: e.target.value })}
                  required
                  placeholder="e.g. Sanjay Deshpande"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Official Mobile Contact
                </label>
                <input
                  type="text"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                  placeholder="+91 98220 77192"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Corporate Email (Login Username)
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  placeholder="procurement@mahabiofuels.in"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Escrow Bank Account (for Instant Deposit)
                </label>
                <input
                  type="text"
                  value={registerData.escrowAccount}
                  onChange={(e) => setRegisterData({ ...registerData, escrowAccount: e.target.value })}
                  required
                  placeholder="A/C Number: 39481029481"
                  style={{ width: '100%', padding: '9px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.96rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <CheckCircle2 size={18} />
              <span>{isSubmitting ? 'Registering Corporate Profile...' : 'Complete Registration & Open By-Product Exchange'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
