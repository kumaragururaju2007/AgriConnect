import React, { useState } from 'react';
import { 
  TrendingUp, ShieldCheck, Cpu, Warehouse, Scale, Award, 
  ArrowRight, CheckCircle2, ChevronRight, Users, Sparkles, Building2, 
  Store, Lock, Calculator, Database, MapPin, Activity, Clock, FileCheck, Check
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import heroFarmingPhoto from '../assets/agri_hero_farming.jpg';

export default function Step01Landing({ setStep, setTerminal, setRole, openAdminPortal }) {
  const { dbStatus, lots, mandiPrices, deals, grievances, switchRole } = useAgri();

  // Interactive Calculator State
  const [calcCrop, setCalcCrop] = useState('onion');
  const [calcQty, setCalcQty] = useState(120);

  // Crop calculation parameters
  const cropData = {
    onion: { name: 'Nashik Red Onion (लाल कांदा)', mandiRate: 2380, corporateRate: 2450, msp: 1850, unit: 'Qtl', mandi: 'Lasalgaon APMC' },
    soyabean: { name: 'Latur Soyabean (सोयाबीन)', mandiRate: 4620, corporateRate: 4850, msp: 4600, unit: 'Qtl', mandi: 'Latur APMC' },
    cotton: { name: 'Akola Cotton (कापूस)', mandiRate: 7200, corporateRate: 7480, msp: 7020, unit: 'Qtl', mandi: 'Akola APMC' },
    tomato: { name: 'Narayangaon Tomato (टोमॅटो)', mandiRate: 1550, corporateRate: 1680, msp: 1200, unit: 'Qtl', mandi: 'Narayangaon APMC' },
    pomegranate: { name: 'Solapur Pomegranate (डाळिंब)', mandiRate: 8800, corporateRate: 9400, msp: 7500, unit: 'Qtl', mandi: 'Solapur APMC' }
  };

  const selectedCropObj = cropData[calcCrop];
  const traditionalTotal = calcQty * selectedCropObj.mandiRate;
  const traditionalBrokerage = Math.round(traditionalTotal * 0.06); // 6% intermediary deduction
  const traditionalNet = traditionalTotal - traditionalBrokerage;

  const directTotal = calcQty * selectedCropObj.corporateRate;
  const directNet = directTotal; // 0% brokerage on AgriConnect
  const netUplift = directNet - traditionalNet;
  const upliftPct = ((netUplift / traditionalNet) * 100).toFixed(1);

  // Interactive AI Crop Assayer Simulator State
  const [aiSample, setAiSample] = useState('onion');
  const [isScanning, setIsScanning] = useState(false);

  const sampleCrops = {
    onion: {
      name: 'Nashik Red Onion (Lot #AC-892)',
      grade: 'Grade A',
      moisture: '11.2%',
      defects: '1.2%',
      caliber: '58.4 mm',
      uniformity: '98.4%',
      spec: 'Agmark Grade-1 Export Parity',
      color: '#15803d',
      emoji: '🧅'
    },
    soyabean: {
      name: 'Latur Yellow Soyabean (Lot #AC-2041)',
      grade: 'Grade A',
      moisture: '10.4%',
      defects: '0.8%',
      caliber: '6.5 mm',
      uniformity: '99.1%',
      spec: 'Oilseed Processing Parity (JS-335)',
      color: '#d97706',
      emoji: '🌱'
    },
    cotton: {
      name: 'Akola BT Medium Staple (Lot #AC-3109)',
      grade: 'Grade A',
      moisture: '7.8%',
      defects: '1.4%',
      caliber: '28.5 mm staple',
      uniformity: '96.8%',
      spec: 'Textile Mill Spinning Standard',
      color: '#0284c7',
      emoji: '☁️'
    },
    tomato: {
      name: 'Narayangaon Hybrid Tomato (Lot #AC-4210)',
      grade: 'Grade A',
      moisture: '91.2%',
      defects: '2.0%',
      caliber: '62.0 mm',
      uniformity: '97.2%',
      spec: 'Pulp & Cold Chain Ready',
      color: '#dc2626',
      emoji: '🍅'
    }
  };

  const currentSample = sampleCrops[aiSample];

  const handleSimulateScan = (cropKey) => {
    setAiSample(cropKey);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Interactive Mandi Network Tabs
  const [activeMandi, setActiveMandi] = useState(0);
  const mandis = [
    { name: 'Lasalgaon APMC', dist: 'Nashik', commodity: 'Garwa Red Onion', modal: '₹23,800', arrivals: '1,420 Tons (14.2k Q)', status: 'Highest Rate', trend: '+4.2%' },
    { name: 'Pimpalgaon Baswant', dist: 'Nashik', commodity: 'Tomato & Grapes', modal: '₹22,400', arrivals: '980 Tons (9.8k Q)', status: 'Moderate', trend: '+1.5%' },
    { name: 'Pune Market Yard', dist: 'Pune', commodity: 'Mixed Produce', modal: '₹23,100', arrivals: '1,850 Tons (18.5k Q)', status: 'High Velocity', trend: '+2.1%' },
    { name: 'Latur APMC', dist: 'Latur', commodity: 'JS-335 Soyabean', modal: '₹48,200', arrivals: '2,240 Tons (22.4k Q)', status: 'Oilseed Hub', trend: '+3.2%' },
    { name: 'Akola Krishi Mandi', dist: 'Akola', commodity: 'Cotton & Pulses', modal: '₹74,100', arrivals: '1,610 Tons (16.1k Q)', status: 'Firm Demand', trend: '+1.8%' },
    { name: 'Solapur Mandi', dist: 'Solapur', commodity: 'Bhagwa Pomegranate', modal: '₹92,000', arrivals: '450 Tons (4.5k Q)', status: 'Export Premium', trend: '+4.5%' }
  ];

  return (
    <div className="animate-slide-in">
      
      {/* 1. Top System Live Status Ribbon */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, 
        padding: '8px 16px', marginBottom: 24, fontSize: '0.78rem', flexWrap: 'wrap', gap: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#15803d' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
            PostgreSQL 18 Database Active
          </span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span style={{ color: '#475569' }}>
            305 Mandis Connected via Agmarknet & e-NAM Maharashtra Grid
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
            SBI State Escrow Pool Secured
          </span>
          <span className="badge badge-red" style={{ fontSize: '0.68rem' }}>
            48h Statutory SLA under APMC Act Sec 31-B
          </span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="panel" style={{ 
        padding: '48px 44px', marginBottom: 32, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', 
        border: '1px solid #bbf7d0', position: 'relative', overflow: 'hidden' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.95fr', gap: 40, alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ padding: '4px 12px', fontSize: '0.74rem' }}>
                Government of Maharashtra Initiative
              </span>
              <span className="badge badge-saffron" style={{ padding: '4px 12px', fontSize: '0.74rem' }}>
                Smart India Hackathon #26132
              </span>
              <span className="badge badge-blue" style={{ padding: '4px 12px', fontSize: '0.74rem' }}>
                MSInS Innovation Sandbox
              </span>
            </div>

            <h1 style={{ fontSize: '3.1rem', lineHeight: 1.15, fontWeight: 900, color: '#0f172a', marginBottom: 18, letterSpacing: '-0.03em' }}>
              Fair Prices.<br />
              <span style={{ color: '#15803d' }}>Verified Buyers.</span><br />
              Guaranteed Escrow.
            </h1>

            <p style={{ fontSize: '1.08rem', color: '#334155', lineHeight: 1.6, marginBottom: 28, maxWidth: 580 }}>
              Connecting Maharashtra’s 4.28 Lakh+ cultivators directly to accredited corporate buyers, automated computer vision AI crop grading, and 100% pre-funded SBI state escrow payouts with statutory 48-hour dispute resolution.
            </p>

            {/* 4 Interactive Gateway Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              
              <div 
                onClick={() => { setTerminal('farmer'); setStep(2); }}
                style={{ 
                  background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 16px', 
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-xs)' 
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '1.3rem' }}>👨‍🌾</span>
                  <ArrowRight size={15} style={{ color: '#15803d' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Farmer Portal</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AI Grading, Lot Creation & Direct Bids</div>
              </div>

              <div 
                onClick={() => { setTerminal('apmc'); setStep(2); }}
                style={{ 
                  background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 10, padding: '14px 16px', 
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-xs)' 
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '1.3rem' }}>🏢</span>
                  <ArrowRight size={15} style={{ color: '#ea580c' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Corporate Buyer Desk</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AgroFresh, Sahyadri & Wholesale Hubs</div>
              </div>

              <div 
                id="landing-admin-portal-card"
                onClick={() => { 
                  if (openAdminPortal) {
                    openAdminPortal();
                  } else {
                    if (switchRole) switchRole('admin');
                    if (setTerminal) setTerminal('admin');
                    if (setRole) setRole('admin');
                    setStep(21); 
                  }
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', 
                  border: '1px solid #86efac', borderRadius: 10, padding: '14px 16px', 
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-xs)' 
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '1.3rem' }}>🏛️</span>
                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>APMC SEC 31-B</span>
                  </div>
                  <ArrowRight size={15} style={{ color: '#15803d' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#064e3b' }}>APMC Regulatory Admin</div>
                <div style={{ fontSize: '0.75rem', color: '#166534' }}>Buyer KYC Approvals, Arbitration Bench & Statutory Decrees</div>
              </div>

              <div 
                onClick={() => { setTerminal('farmer'); setStep(9); }}
                style={{ 
                  background: '#ffffff', border: '1px solid #bae6fd', borderRadius: 10, padding: '14px 16px', 
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-xs)' 
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '1.3rem' }}>🏬</span>
                  <ArrowRight size={15} style={{ color: '#0284c7' }} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>WDRA Storage & Subsidy</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>MSWC Godowns & 75% State Subsidy</div>
              </div>

              {/* 5. Driver / Transporter Portal Card */}
              <div 
                id="landing-driver-portal-card"
                onClick={() => { 
                  if (switchRole) switchRole('driver');
                  setTerminal('driver'); 
                  setStep(20); 
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)', 
                  border: '1px solid #93c5fd', borderRadius: 10, padding: '14px 16px', 
                  cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: 'var(--shadow-xs)',
                  gridColumn: 'span 2'
                }}
                className="hover-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.3rem' }}>🚚</span>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      VAHAN & APMC ACCREDITED FLEET CONSOLE
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1d4ed8', fontWeight: 800, fontSize: '0.82rem' }}>
                    <span>Launch Transportation Portal</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                  Accredited Transportation & Fleet Portal (मालवाहतूक डॅशबोर्ड)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Active Job Console, Nearby Loads Feed, Live Trip GPS, Fastag Escrow Payments & Vahan Profile (9 Tabs)
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: '#475569' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={16} style={{ color: '#15803d' }} /> Zero Brokerage Commission
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={16} style={{ color: '#15803d' }} /> 100% Escrow Vault Settlement
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={16} style={{ color: '#15803d' }} /> 7/12 Land Record Synced
              </span>
            </div>
          </div>

          {/* Right Hero: Agriculture Marketplace Photo Banner */}
          <div style={{ 
            position: 'relative', 
            borderRadius: 20, 
            overflow: 'hidden', 
            border: '1px solid #bbf7d0',
            boxShadow: '0 20px 40px -15px rgba(21, 128, 61, 0.22)',
            height: '100%',
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: '#f0fdf4'
          }}>
            <img 
              src={heroFarmingPhoto} 
              alt="Smart Agriculture and Direct Farmer Trading" 
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{
              position: 'relative',
              zIndex: 2,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.65) 55%, transparent 100%)',
              padding: '28px 22px 20px 22px',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-green" style={{ fontSize: '0.74rem', background: '#22c55e', color: '#ffffff', border: 'none', fontWeight: 700 }}>
                  Smart Agri Grid
                </span>
                <span style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                  Empowering 4.28L+ Cultivators
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
                Direct Farm-to-Buyer Digital Ecosystem
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                Instant AI Crop Quality Grading • 100% Guaranteed Escrow Settlements • Zero Middlemen
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Four Key System Impact Metric Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 36 }}>
        {[
          { num: '4,28,940+', label: 'Verified Cultivators', sub: 'Aadhaar e-KYC & 7/12 Land Linked', border: '#bbf7d0', color: '#15803d' },
          { num: '36 / 305', label: 'Districts & APMC Mandis', sub: 'e-NAM Central Oversight Grid', border: '#fed7aa', color: '#ea580c' },
          { num: '₹842.60 Cr', label: 'Escrow Volume Settled', sub: '100% Guaranteed Direct Benefit', border: '#bbf7d0', color: '#15803d' },
          { num: '+24.8%', label: 'Avg Realization Uplift', sub: 'Compared to Traditional Mandi Parity', border: '#bae6fd', color: '#0284c7' }
        ].map((m, i) => (
          <div key={i} className="panel" style={{ padding: '24px 20px', textAlign: 'center', border: `1px solid ${m.border}` }}>
            <div style={{ fontSize: '2.3rem', fontWeight: 900, color: m.color, fontFamily: 'var(--font-heading)' }}>
              {m.num}
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
              {m.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Interactive Live Mandi Rate & Profit Realization Calculator */}
      <div className="panel" style={{ padding: '32px', marginBottom: 36, border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-green">LIVE NET-PROFIT CALCULATOR</span>
              <span className="badge badge-amber">SARIMA AI Benchmark vs Traditional Mandi</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>
              Calculate Your Realized Income Boost
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.84rem' }}>
              Compare traditional middleman deductions vs AgriConnect 100% escrow direct sale.
            </p>
          </div>

          {/* Commodity Pill Selector */}
          <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 8, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            {Object.keys(cropData).map((key) => (
              <button
                key={key}
                onClick={() => setCalcCrop(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: calcCrop === key ? 800 : 500,
                  background: calcCrop === key ? '#15803d' : 'transparent',
                  color: calcCrop === key ? '#ffffff' : '#475569'
                }}
              >
                {cropData[key].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, alignItems: 'center' }}>
          
          {/* Controls */}
          <div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Harvest Lot Quantity: <strong style={{ color: '#15803d', fontSize: '1rem' }}>{calcQty} Quintals</strong> ({calcQty * 100} kg)
                </label>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Benchmark Mandi: {selectedCropObj.mandi}</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="500" 
                step="10" 
                value={calcQty} 
                onChange={(e) => setCalcQty(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#15803d' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                <span>2 Tons (20 Qtl)</span>
                <span>25 Tons (250 Qtl)</span>
                <span>50 Tons (500 Qtl)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>APMC Yard Modal Rate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>₹{(selectedCropObj.mandiRate * 10).toLocaleString('en-IN')} / Ton</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>MSP Floor: ₹{(selectedCropObj.msp * 10).toLocaleString('en-IN')} / Ton</div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.72rem', color: '#166534', textTransform: 'uppercase', fontWeight: 700 }}>AgriConnect Direct B2B Bid</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d' }}>₹{(selectedCropObj.corporateRate * 10).toLocaleString('en-IN')} / Ton</div>
                <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: 2 }}>Grade-A Assayed Parity</div>
              </div>
            </div>
          </div>

          {/* Comparison Realization Box */}
          <div style={{ 
            background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', 
            borderRadius: 12, padding: '24px', color: '#ffffff', boxShadow: 'var(--shadow-md)' 
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#86efac', fontWeight: 700, marginBottom: 8 }}>
              Realized Farmer Profit Comparison
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 10, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#dcfce7' }}>Traditional Mandi Net Payout</div>
                <div style={{ fontSize: '0.72rem', color: '#86efac' }}>(After -6% broker cut & delay)</div>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fca5a5' }}>
                ₹{traditionalNet.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#dcfce7' }}>AgriConnect 100% Escrow Payout</div>
                <div style={{ fontSize: '0.72rem', color: '#86efac' }}>(0% commission + Grade A rate)</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#86efac' }}>
                ₹{directNet.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#dcfce7' }}>Net Extra Take-Home Profit</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>
                  +₹{netUplift.toLocaleString('en-IN')}
                </div>
              </div>
              <span className="badge" style={{ background: '#22c55e', color: '#052e16', fontWeight: 900, fontSize: '0.82rem', padding: '4px 10px' }}>
                +{upliftPct}% MORE
              </span>
            </div>

            <button 
              onClick={() => { setTerminal('farmer'); setStep(5); }}
              style={{ 
                width: '100%', background: '#ffffff', color: '#15803d', fontWeight: 800, 
                padding: '11px', borderRadius: 8, fontSize: '0.88rem', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', gap: 6 
              }}
            >
              <span>List {calcQty} Qtl Lot at this Price</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* 5. Interactive AI Crop Quality Assayer Studio Preview */}
      <div className="panel" style={{ padding: '32px', marginBottom: 36, border: '1px solid #bbf7d0', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-green">AGRISCAN VISION v4.2 COMPUTER VISION</span>
              <span className="badge badge-gray">TFLite Neural Inference (30s)</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>
              Interactive AI Quality Grading Studio
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.84rem' }}>
              Select a sample harvest to simulate instant smartphone computer vision assaying and cryptographic certificate generation.
            </p>
          </div>

          {/* Sample Switcher */}
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(sampleCrops).map((cropKey) => (
              <button
                key={cropKey}
                onClick={() => handleSimulateScan(cropKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: aiSample === cropKey ? 800 : 500,
                  background: aiSample === cropKey ? '#15803d' : '#ffffff',
                  color: aiSample === cropKey ? '#ffffff' : '#334155',
                  border: aiSample === cropKey ? '1px solid #15803d' : '1px solid #cbd5e1'
                }}
              >
                <span>{sampleCrops[cropKey].emoji}</span>
                <span>{sampleCrops[cropKey].name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
          
          {/* Computer Vision Viewport */}
          <div style={{ 
            height: 280, borderRadius: 12, background: '#0a1420', position: 'relative', 
            overflow: 'hidden', border: '2px solid #22c55e', display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
          }}>
            <div style={{ fontSize: '6rem', opacity: isScanning ? 0.4 : 0.85, transition: 'opacity 0.2s ease' }}>
              {currentSample.emoji} {currentSample.emoji}
            </div>

            {/* Simulated Bounding Box 1 */}
            <div style={{ 
              position: 'absolute', top: 35, left: 60, width: 140, height: 130, 
              border: '2px dashed #22c55e', borderRadius: 8, background: 'rgba(34, 197, 94, 0.12)', 
              padding: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' 
            }}>
              <span style={{ background: '#22c55e', color: '#000', fontWeight: 900, fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, width: 'fit-content' }}>
                Sample #1: {currentSample.grade} (98.4%)
              </span>
              <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700 }}>
                {currentSample.caliber} • Zero Rot
              </span>
            </div>

            {/* Simulated Bounding Box 2 */}
            <div style={{ 
              position: 'absolute', top: 60, right: 60, width: 130, height: 120, 
              border: '2px dashed #22c55e', borderRadius: 8, background: 'rgba(34, 197, 94, 0.12)', 
              padding: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' 
            }}>
              <span style={{ background: '#22c55e', color: '#000', fontWeight: 900, fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, width: 'fit-content' }}>
                Sample #2: {currentSample.grade} (97.8%)
              </span>
              <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700 }}>
                Moisture: {currentSample.moisture}
              </span>
            </div>

            <div style={{ 
              position: 'absolute', bottom: 10, left: 12, right: 12, 
              background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', 
              padding: '6px 14px', borderRadius: 6, display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#fff' 
            }}>
              <span>{currentSample.name}</span>
              <span style={{ color: '#86efac', fontWeight: 700 }}>
                {isScanning ? '⚡ Processing Neural Inference...' : '✓ AI Assaying Verified'}
              </span>
            </div>
          </div>

          {/* Certificate & Analysis Breakdown */}
          <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Agmarknet Grade-1 Assayed</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {currentSample.name}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>{currentSample.grade}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Assayed Grade</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Moisture</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>{currentSample.moisture}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Defect %</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{currentSample.defects}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 6, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Uniformity</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>{currentSample.uniformity}</div>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: 8, border: '1px solid #bbf7d0', marginBottom: 16, fontSize: '0.78rem', color: '#166534', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Spec: {currentSample.spec}</span>
              <span style={{ fontWeight: 800 }}>QR Ready</span>
            </div>

            <button 
              onClick={() => { setTerminal('farmer'); setStep(6); }}
              className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
              <span>Launch Full AI Grading Studio</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* 6. Maharashtra Mandi Network Explorer */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          <span className="badge badge-green" style={{ marginBottom: 8 }}>MAHARASHTRA AGRI NETWORK</span>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Live Regional Mandi Intelligence</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Real-time modal prices and daily arrivals synchronized across major state trading yards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {mandis.map((m, idx) => (
            <div 
              key={idx} 
              className="panel" 
              style={{ 
                padding: '20px', 
                border: activeMandi === idx ? '2px solid #15803d' : '1px solid #e2e8f0', 
                cursor: 'pointer' 
              }}
              onClick={() => setActiveMandi(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>{m.dist} District</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{m.name}</h3>
                </div>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{m.trend}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#475569' }}>Modal Rate</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d' }}>{m.modal} / Ton</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Commodity: {m.commodity}</span>
                <span>Arrivals: {m.arrivals}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Comprehensive 6 Core Modules Grid */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <span className="badge badge-green" style={{ marginBottom: 8 }}>END-TO-END PLATFORM ARCHITECTURE</span>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Unified Agricultural Ecosystem</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Built to government standards under the Maharashtra APMC Regulation & Development Act, 1963.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            {
              badge: 'Vision AI Engine',
              title: '1. AI Crop Quality Grading',
              desc: 'Upload harvest photo via smartphone. Neural model estimates size uniformity, discolouration, and moisture, generating Grade A/B/C QR certificate within 30 seconds.',
              link: 'Instant Cert Verification',
              step: 6
            },
            {
              badge: 'Live Mandi Feed',
              title: '2. Real-time Mandi Price Discovery',
              desc: 'Access modal, min, and max rates straight from 305+ APMC mandis. SARIMA price forecast helps time sales before seasonal price drops.',
              link: 'Explore Live Price Grid',
              step: 4
            },
            {
              badge: 'B2B Exchange',
              title: '3. Direct Buyer Marketplace',
              desc: 'Connect directly with vetted agro-processing corporations, modern retail aggregators, and exporters without predatory middleman markups.',
              link: 'View Active Buyers',
              step: 7
            },
            {
              badge: 'Guaranteed Payout',
              title: '4. Escrow Secured Settlements',
              desc: 'Buyer deposits 100% funds into an institutional escrow hold before harvest pickup. Funds released instantly upon digital weighbridge inward confirmation.',
              link: 'Review Escrow Protocol',
              step: 8
            },
            {
              badge: 'Govt Godowns',
              title: '5. WDRA Storage Locator',
              desc: 'Discover accredited state warehouses and cold storage facilities. Check live capacity, apply for state subsidies, and access pledge financing.',
              link: 'Locate MSWC Warehouses',
              step: 9
            },
            {
              badge: 'Statutory Cell',
              title: '6. 48-Hour Grievance Redressal',
              desc: 'Integrated dispute filing with time-stamped evidence. Mandatory 48-hour statutory resolution SLA with APMC grievance officer arbitration.',
              link: 'Access Arbitration Docket',
              step: 10
            }
          ].map((m, idx) => (
            <div key={idx} className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-gray" style={{ marginBottom: 12 }}>{m.badge}</span>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: 8, fontWeight: 800 }}>{m.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: 18 }}>
                  {m.desc}
                </p>
              </div>
              <button 
                onClick={() => { setTerminal('farmer'); setStep(m.step); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 800, fontSize: '0.84rem' }}>
                <span>{m.link}</span>
                <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Testimonials Section: Real Impact, Real Prosperity */}
      <div className="panel" style={{ padding: '36px', marginBottom: 36, background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="badge badge-green" style={{ marginBottom: 6 }}>PROVEN FIELD RESULTS</span>
          <h3 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800 }}>Real Impact. Real Prosperity.</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Real farmers, digital escrow speed, and zero traditional middlemen.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
              "For three generations, we sold our onion harvest to middlemen who dictated prices and delayed payments for weeks. With AgriConnect, I received five binding corporate bids within two hours of uploading my harvest photo. Escrow payment was in my SBI account before the truck cleared the yard gate."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                SP
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Santosh Patil</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Onion Cultivator, Niphad (Nashik) • +22% Net Realization</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
              "As a woman farmer leading a 140-member FPO, accessing fair market prices was always our biggest bottleneck. AgriConnect gave us an uncontested digital scale and matched us directly with AgroFresh processing hubs. Our member farmers earned ₹18 Lakhs higher than local mandi averages."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#ffedd5', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                SB
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Sunita Bhor</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>President, Sahyadri Women FPO (Khed, Pune)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Bottom CTA Banner */}
      <div className="panel" style={{ 
        padding: '36px', textAlign: 'center', 
        background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)', 
        color: '#ffffff', borderRadius: 14 
      }}>
        <h3 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: 10, fontWeight: 900 }}>
          Start Trading in Under 5 Minutes
        </h3>
        <p style={{ color: '#dcfce7', fontSize: '0.95rem', maxWidth: 650, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Link your 7/12 land record, get your harvest AI-graded via smartphone, and receive binding escrow bids from verified wholesale buyers.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setTerminal('farmer'); setStep(2); }}
            style={{ 
              background: '#ffffff', color: '#15803d', fontWeight: 800, 
              padding: '12px 30px', borderRadius: 8, fontSize: '0.98rem', 
              boxShadow: 'var(--shadow-md)' 
            }}
          >
            Create Your Free Farmer Account
          </button>
          <button 
            onClick={() => { setTerminal('apmc'); setStep(2); }}
            style={{ 
              background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 700, 
              padding: '12px 26px', borderRadius: 8, fontSize: '0.98rem', 
              border: '1px solid rgba(255,255,255,0.3)' 
            }}
          >
            Buyer & Trader Gateway
          </button>
        </div>
      </div>

    </div>
  );
}
