import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, ShieldCheck, PlusCircle, Sparkles, Scale, Warehouse, 
  FileText, AlertTriangle, ArrowRight, CheckCircle2, DollarSign, Clock, 
  MapPin, ChevronRight, Database, Truck, Phone, Navigation, ExternalLink, Info,
  BrainCircuit, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip, XAxis, YAxis
} from 'recharts';
import { useAgri } from '../context/AgriContext';

const DASHBOARD_COMMODITIES = [
  { 
    id: 'onion', 
    name: 'Onion', 
    nameMr: 'कांदा', 
    variety: 'Nashik Garwa (Grade-A)',
    icon: '🧅', 
    defaultMsp: 1850,
    primaryMandi: 'Lasalgaon APMC',
    mandis: [
      { label: 'Lasalgaon APMC (Primary)', search: 'lasalgaon', defaultPrice: 2490, note: '+4.2% • High Demand', primary: true },
      { label: 'Pune Market Yard APMC', search: 'pune', defaultPrice: 2510, note: '+2.1% • Moderate', primary: false },
      { label: 'Pimpalgaon Baswant APMC', search: 'pimpalgaon', defaultPrice: 2460, note: '+3.5% • Steady Inflow', primary: false }
    ],
    fallbackHistory: [
      { display_date: '01 Sep', price: 2253 },
      { display_date: '02 Sep', price: 2246 },
      { display_date: '03 Sep', price: 2293 },
      { display_date: '04 Sep', price: 2280 },
      { display_date: '05 Sep', price: 2281 },
      { display_date: '06 Sep', price: 2380 },
      { display_date: '07 Sep', price: 2490 }
    ]
  },
  { 
    id: 'soybean', 
    name: 'Soyabean', 
    nameMr: 'सोयाबीन', 
    variety: 'Yellow Soyabean (Grade-I)',
    icon: '🌱', 
    defaultMsp: 4892,
    primaryMandi: 'Latur APMC',
    mandis: [
      { label: 'Latur APMC (Primary)', search: 'latur', defaultPrice: 4820, note: '+3.2% • Firm Demand', primary: true },
      { label: 'Akola APMC', search: 'akola', defaultPrice: 4780, note: '+1.9% • Good Inflow', primary: false },
      { label: 'Jalna APMC', search: 'jalna', defaultPrice: 4750, note: '+2.4% • Active Trading', primary: false }
    ],
    fallbackHistory: [
      { display_date: '01 Sep', price: 4680 },
      { display_date: '02 Sep', price: 4700 },
      { display_date: '03 Sep', price: 4720 },
      { display_date: '04 Sep', price: 4710 },
      { display_date: '05 Sep', price: 4735 },
      { display_date: '06 Sep', price: 4740 },
      { display_date: '07 Sep', price: 4820 }
    ]
  },
  { 
    id: 'cotton', 
    name: 'Cotton', 
    nameMr: 'कापूस', 
    variety: 'Medium Staple (Shanker-6)',
    icon: '🌾', 
    defaultMsp: 7121,
    primaryMandi: 'Akola APMC',
    mandis: [
      { label: 'Akola APMC (Primary)', search: 'akola', defaultPrice: 7440, note: '+2.8% • Heavy Inflow', primary: true },
      { label: 'Amravati APMC', search: 'amravati', defaultPrice: 7390, note: '+1.5% • Steady', primary: false },
      { label: 'Wardha APMC', search: 'wardha', defaultPrice: 7350, note: '+2.1% • Firm Bid', primary: false }
    ],
    fallbackHistory: [
      { display_date: '01 Sep', price: 7280 },
      { display_date: '02 Sep', price: 7300 },
      { display_date: '03 Sep', price: 7320 },
      { display_date: '04 Sep', price: 7310 },
      { display_date: '05 Sep', price: 7350 },
      { display_date: '06 Sep', price: 7380 },
      { display_date: '07 Sep', price: 7440 }
    ]
  },
  { 
    id: 'tomato', 
    name: 'Tomato', 
    nameMr: 'टोमॅटो', 
    variety: 'Hybrid Vaishali (Grade-A)',
    icon: '🍅', 
    defaultMsp: 1400,
    primaryMandi: 'Narayangaon APMC',
    mandis: [
      { label: 'Narayangaon APMC (Primary)', search: 'narayangaon', defaultPrice: 1480, note: '+4.5% • High Inflow', primary: true },
      { label: 'Nashik APMC', search: 'nashik', defaultPrice: 1510, note: '+3.1% • Firm', primary: false },
      { label: 'Pune Market Yard APMC', search: 'pune', defaultPrice: 1530, note: '+2.8% • Active Demand', primary: false }
    ],
    fallbackHistory: [
      { display_date: '01 Sep', price: 1620 },
      { display_date: '02 Sep', price: 1600 },
      { display_date: '03 Sep', price: 1580 },
      { display_date: '04 Sep', price: 1590 },
      { display_date: '05 Sep', price: 1560 },
      { display_date: '06 Sep', price: 1580 },
      { display_date: '07 Sep', price: 1480 }
    ]
  }
];

export default function Step03FarmerDashboard({ setStep, setTerminal }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'deliveries'
  const [selectedCrop, setSelectedCrop] = useState('onion');
  const [timeRange, setTimeRange] = useState('7 Days');
  const [priceUnit, setPriceUnit] = useState('ton'); // 'ton' | 'qtl' (defaults to 'ton')

  const unitMult = priceUnit === 'ton' ? 10 : 1;
  const unitLabel = priceUnit === 'ton' ? 'Ton' : 'Q';
  const unitLabelFull = priceUnit === 'ton' ? 'Tons' : 'Qtl';

  const activeCrop = useMemo(() => {
    return DASHBOARD_COMMODITIES.find(c => c.id === selectedCrop) || DASHBOARD_COMMODITIES[0];
  }, [selectedCrop]);

  const { 
    farmer, lots, deals, grievances, dbStatus, deliveryJobs, confirmPickup,
    livePriceData, dailyAverageData, forecastData,
    fetchLivePrices, fetchDailyAverages, fetchCropForecast,
    confirmPickupWorkflow, LOT_STAGES
  } = useAgri();

  useEffect(() => {
    fetchLivePrices(selectedCrop, 'all', false);
    fetchDailyAverages(selectedCrop, timeRange === '30 Days' ? 30 : 7);
    fetchCropForecast(selectedCrop, activeCrop.primaryMandi, timeRange === '30 Days' ? 30 : 14, false);
  }, [selectedCrop, timeRange, activeCrop.primaryMandi]);

  // Mandi rates for active crop
  const mandiRates = useMemo(() => {
    return activeCrop.mandis.map(m => {
      const rec = (livePriceData?.records || []).find(r => 
        (r.mandi_name || '').toLowerCase().includes(m.search) &&
        (r.commodity || '').toLowerCase().includes(selectedCrop === 'soybean' ? 'soya' : selectedCrop.toLowerCase())
      );
      return {
        ...m,
        price: rec ? Number(rec.modal_price) : m.defaultPrice
      };
    });
  }, [activeCrop, livePriceData, selectedCrop]);

  const primaryPrice = mandiRates[0]?.price || activeCrop.mandis[0].defaultPrice;

  // Real trend points from Agmarknet historical actuals & Forecasting LLM ensemble scaled by unit
  const trendPoints = useMemo(() => {
    const history = (dailyAverageData || []).filter(d => d.average !== null).map(d => ({
      date: d.date,
      display_date: d.display_date,
      price: Math.round(d.average * unitMult),
      type: 'Actual Agmarknet',
      isForecast: false
    }));

    const baseHistory = history.length ? history : activeCrop.fallbackHistory.map(f => ({
      ...f,
      price: Math.round((f.display_date === '07 Sep' ? primaryPrice : f.price) * unitMult),
      type: f.display_date === '07 Sep' ? `Today (${activeCrop.primaryMandi})` : 'Actual Agmarknet',
      isForecast: false
    }));

    if (timeRange === '7 Days') {
      return baseHistory;
    }

    const horizonCount = timeRange === '15 Days' ? 8 : 23;
    const llmForecast = (forecastData?.forecast || []).slice(0, horizonCount).map(f => ({
      date: f.date,
      display_date: f.display_date,
      price: Math.round(f.predicted_price * unitMult),
      type: 'Forecasting LLM (Lag-Llama + SARIMA)',
      isForecast: true
    }));

    return [...baseHistory, ...llmForecast];
  }, [dailyAverageData, forecastData, timeRange, activeCrop, primaryPrice, unitMult]);

  const dailyHighPrice = useMemo(() => {
    if (!trendPoints.length) return primaryPrice * unitMult;
    return Math.max(...trendPoints.map(p => p.price));
  }, [trendPoints, primaryPrice, unitMult]);

  const totalMarketedQtl = lots.reduce((acc, l) => acc + (Number(l.quantity_qtl) || 0), 0);
  const activeEscrowDeal = deals.find(d => d.status === 'ESCROW_LOCKED');
  const lockedEscrowVal = activeEscrowDeal ? Number(activeEscrowDeal.total_escrow_amount) : 291000;

  // Active delivery job for the farmer
  const activeDelivery = deliveryJobs.find(j => j.status !== 'COMPLETED') || deliveryJobs[0];

  return (
    <div className="animate-slide-in">
      
      {/* Personalized Header Ribbon with Glassmorphism */}
      <div className="panel" style={{ 
        padding: '22px 26px', marginBottom: 22, 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.85)', 
        borderLeft: '5px solid #15803d', 
        borderRadius: 18, 
        boxShadow: '0 10px 32px -4px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-title)', letterSpacing: '-0.02em' }}>
                Namaskar, {farmer.name || 'Santosh Shinde'}
              </h2>
              <span className="badge badge-green">Aadhaar & Maha eSeva Verified</span>
              <span className="badge badge-amber">APMC Member #{farmer.farmer_code || 'MH-NAS-2024-8821'}</span>
              <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Database size={11} style={{ color: '#15803d' }} />
                <span>PostgreSQL DB Synced</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>{farmer.taluka || 'Niphad'} Taluka, {farmer.district || 'Nashik'} District</span>
              <span>•</span>
              <strong style={{ color: '#0f172a' }}>7/12 Extract: {farmer.land_gut_no || 'Gut No. 142/B'} ({farmer.land_area || '4.20 Acres'})</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('deliveries')}
              style={{
                background: activeTab === 'deliveries' ? 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                border: activeTab === 'deliveries' ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                boxShadow: activeTab === 'deliveries' ? 'inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 6px rgba(37, 99, 235, 0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.04)',
                color: activeTab === 'deliveries' ? '#1d4ed8' : '#334155',
                padding: '9px 16px', borderRadius: 10, fontSize: '0.84rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Truck size={16} color="#2563eb" />
              <span>Deliveries & Dispatch ({deliveryJobs.filter(j => j.status !== 'COMPLETED').length || 1})</span>
            </button>
            <button 
              onClick={() => setStep(5)}
              className="btn-primary" style={{ fontSize: '0.84rem', padding: '9px 16px' }}>
              <PlusCircle size={16} />
              <span>List New Produce</span>
            </button>
            <button 
              onClick={() => setStep(4)}
              className="btn-secondary" style={{ fontSize: '0.84rem', padding: '9px 16px' }}>
              <span>Check Mandi Rates</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle Strip with Web 2.0 Glossy Controls */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '7px 16px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800,
              background: activeTab === 'overview' ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)' : 'rgba(241, 245, 249, 0.8)',
              color: activeTab === 'overview' ? '#ffffff' : '#64748b',
              border: activeTab === 'overview' ? '1px solid #14532d' : '1px solid rgba(203, 213, 225, 0.7)',
              boxShadow: activeTab === 'overview' ? 'inset 0 1px 1px rgba(255,255,255,0.45), 0 2px 6px rgba(21, 128, 61, 0.25)' : 'none',
              cursor: 'pointer', transition: 'all 0.15s ease'
            }}
          >
            📊 Dashboard Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deliveries')}
            style={{
              padding: '7px 16px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800,
              background: activeTab === 'deliveries' ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(241, 245, 249, 0.8)',
              color: activeTab === 'deliveries' ? '#ffffff' : '#64748b',
              border: activeTab === 'deliveries' ? '1px solid #1e40af' : '1px solid rgba(203, 213, 225, 0.7)',
              boxShadow: activeTab === 'deliveries' ? 'inset 0 1px 1px rgba(255,255,255,0.45), 0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
              display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', transition: 'all 0.15s ease'
            }}
          >
            <Truck size={14} />
            <span>Assigned Driver & Deliveries (वाहतूक व्यवस्था)</span>
            <span style={{ 
              background: activeTab === 'deliveries' ? 'rgba(255,255,255,0.25)' : '#dbeafe', 
              color: activeTab === 'deliveries' ? '#ffffff' : '#1d4ed8', 
              padding: '2px 8px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 800 
            }}>
              MH 15 EG 4402
            </span>
          </button>
        </div>
      </div>

      {/* VIEW A: DELIVERIES & TRANSPORTER DISPATCH TAB */}
      {activeTab === 'deliveries' && (
        <div className="panel" style={{ 
          padding: '26px 28px', marginBottom: 24, 
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(147, 197, 253, 0.8)', 
          borderRadius: 18,
          boxShadow: '0 12px 36px -4px rgba(37, 99, 235, 0.07), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ 
                  background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)', 
                  color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800,
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 4px rgba(30, 64, 175, 0.25)' 
                }}>
                  TRIP #{activeDelivery?.job_code || 'JOB-2024-8841'}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Assigned Transporter Dispatch (नियुक्त वाहतूकदार व मालाची पाठवणी)
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>
                Commercial goods carrier assigned for <strong>Lot #AC-892 (12 Tons Grade-A Red Onion / 120 Qtl)</strong> to <strong>AgroFresh Supply Chain Ltd</strong>.
              </p>
            </div>

            <div style={{ 
              textAlign: 'right', background: 'rgba(239, 246, 255, 0.85)', 
              backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: 12, 
              border: '1px solid rgba(191, 219, 254, 0.85)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8), 0 2px 6px rgba(37, 99, 235, 0.06)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Delivery Freight Fee</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e40af' }}>
                ₹{Number(activeDelivery?.delivery_fee || 8450).toLocaleString('en-IN')}.00
              </div>
              <div style={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>Pre-funded 100% by Buyer in Escrow</div>
            </div>
          </div>

          {/* Assigned Driver Card */}
          <div style={{ background: 'rgba(248, 250, 252, 0.75)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: 14, border: '1px solid rgba(226, 232, 240, 0.85)', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'center' }}>
              
              {/* Driver Info & 3-Tier Vahan Badge */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                  <Truck size={28} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {activeDelivery?.driver_name || 'Rajesh Patil'}
                    </h4>
                    <span className="badge badge-blue">Vahan Certified Driver</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 3 }}>
                    Truck: <strong>{activeDelivery?.vehicle_reg || 'MH 15 EG 4402'}</strong> ({activeDelivery?.vehicle_type || 'Tata 407 (4.5 MT)'})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={13} />
                    <span>DL, Commercial Permit & Goods Transit Insurance Verified</span>
                  </div>
                </div>
              </div>

              {/* Live Status & ETA */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Current Transit Status</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: activeDelivery?.status === 'IN_TRANSIT' ? '#2563eb' : '#15803d' }}>
                    {activeDelivery?.status === 'IN_TRANSIT' ? '🚚 In Transit to Buyer Dock' : activeDelivery?.status === 'ASSIGNED' ? '📍 Arriving at Farm Gate' : '✓ Completed'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                    ETA: ~45 mins to AgroFresh Warehouse
                  </div>
                </div>

                <a 
                  href={`tel:${activeDelivery?.driver_phone || '9822044021'}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)', 
                    border: '1px solid #cbd5e1', color: '#15803d', textDecoration: 'none',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <Phone size={14} />
                  <span>Call Driver ({activeDelivery?.driver_phone || '98220 44021'})</span>
                </a>
              </div>

            </div>
          </div>

          {/* Critical Escrow Clarification */}
          <div style={{ 
            background: 'rgba(240, 253, 244, 0.85)', 
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(134, 239, 172, 0.9)', 
            borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: '0.8rem', color: '#14532d' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, marginBottom: 2 }}>
              <Info size={15} color="#15803d" />
              <span>Maharashtra State Escrow Protection:</span>
            </div>
            <div>
              Confirming pickup marks the cargo dispatched in transit. <strong>₹0 funds release upon pickup</strong> (100% of your ₹2,91,000 lot payment and the driver's ₹8,450 freight fee remain safely locked in the vault until buyer arrival confirmation).
            </div>
          </div>

          {/* Farmer Pickup Action Button */}
          {activeDelivery?.status === 'ASSIGNED' ? (
            <div style={{ textAlign: 'center', background: 'rgba(236, 253, 245, 0.9)', padding: '20px', borderRadius: 12, border: '1px solid #86efac' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46', marginBottom: 4 }}>
                Has Driver Rajesh Patil arrived to load your 120 Qtl Onion?
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#047857', marginBottom: 14 }}>
                Click below after loading and counting sacks to authorize dispatch into the state transit corridor.
              </p>
              <button
                type="button"
                onClick={() => {
                  confirmPickup(activeDelivery.id || activeDelivery.job_code, activeDelivery.driver_id, 'Farmer verified 120 bags loaded.');
                  confirmPickupWorkflow(activeDelivery.id || activeDelivery.job_code);
                }}
                className="btn-primary"
                style={{ padding: '12px 30px', fontSize: '0.95rem' }}
              >
                <CheckCircle2 size={18} />
                <span>Confirm Farm Pickup & Authorize Dispatch (₹0 Escrow Release)</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(240, 253, 244, 0.9)', padding: '14px 18px', borderRadius: 10, border: '1px solid #86efac' }}>
              <CheckCircle2 size={22} color="#15803d" />
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#14532d' }}>
                  Farm Gate Pickup Confirmed • Dispatched with Truck MH 15 EG 4402
                </strong>
                <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                  Trip is active in transit. Buyer (AgroFresh Ltd) has been notified for inward gate receiving.
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW B: DASHBOARD METRICS & OVERVIEW */}
      {activeTab === 'overview' && (
      <div>
      {/* 4 Key Dashboard Metric Cards with Glassmorphism */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        
        {/* 1. Benchmark Rate */}
        <div className="panel" style={{ 
          padding: '22px 20px', 
          background: 'rgba(255, 255, 255, 0.78)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.85)', 
          borderRadius: 16,
          boxShadow: '0 8px 24px -3px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            BENCHMARK RATE
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-title)', marginTop: 2 }}>
            Lasalgaon Mandi • Onion Red
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', fontFamily: 'var(--font-heading)' }}>
              ₹{(2380 * unitMult).toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {unitLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
            <span>▲ +4.2% vs yesterday</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            MSP Floor: ₹{(1850 * unitMult).toLocaleString('en-IN')}/{unitLabel}
          </div>
        </div>

        {/* 2. Live Listings */}
        <div className="panel" style={{ 
          padding: '22px 20px', 
          background: 'rgba(255, 255, 255, 0.78)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.85)', 
          borderRadius: 16,
          boxShadow: '0 8px 24px -3px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            LIVE LOTS LISTED
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-title)', marginTop: 2 }}>
            Active Crop Listings
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
              {lots.length} Lots
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong>{(totalMarketedQtl * 0.1).toFixed(1)} Tons Marketed</strong> in APMC Grid ({totalMarketedQtl} Qtl)
          </div>
          <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
            Synced with PostgreSQL backend
          </div>
        </div>

        {/* 3. Total Earnings This Season */}
        <div className="panel" style={{ 
          padding: '20px', 
          background: 'rgba(255, 255, 255, 0.78)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.85)', 
          borderRadius: 16,
          boxShadow: '0 8px 24px -3px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                SEASON REVENUE
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                ▲ +22.4%
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-title)', marginTop: 2 }}>
              Total Earnings This Season
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '4px 0 0' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', fontFamily: 'var(--font-heading)' }}>
                ₹{(684250).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Small Sparkline Trend Graph */}
          <div style={{ width: '100%', height: 32, margin: '4px 0 2px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { m: 'M1', val: 120000 },
                { m: 'M2', val: 245000 },
                { m: 'M3', val: 390000 },
                { m: 'M4', val: 510000 },
                { m: 'M5', val: 684250 }
              ]} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsSparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#16a34a" 
                  strokeWidth={2} 
                  fill="url(#earningsSparkGrad)" 
                  dot={false}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <span>Across <strong>4 completed deals</strong></span>
            <span style={{ color: '#15803d', fontWeight: 700 }}>100% Escrow Settled</span>
          </div>
        </div>

        {/* 4. Trust & Statutory Protection */}
        <div className="panel" style={{ 
          padding: '22px 20px', 
          background: 'rgba(255, 255, 255, 0.78)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.85)', 
          borderRadius: 16,
          boxShadow: '0 8px 24px -3px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            APMC REPUTATION
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-title)', marginTop: 2 }}>
            Farmer Trust Score
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', fontFamily: 'var(--font-heading)' }}>
              98 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
            </span>
            <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>TIER 1</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <strong>100% Escrow Delivery Rate</strong>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            MahaAPMC Act Sec 31-B Protected
          </div>
        </div>

      </div>

      {/* Itemized Return Deductions Banner if Buyer Rejection occurred */}
      {farmer?.returnDeductions && farmer.returnDeductions.length > 0 && (
        <div className="panel animate-slide-in" style={{ 
          marginBottom: 24, padding: '20px 24px', 
          background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)', 
          border: '1px solid #fca5a5', borderRadius: 16,
          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={20} color="#dc2626" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                  Itemized Return Transport Deductions (परतावा वाहतूक कपात तपशील)
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#7f1d1d' }}>
                  Statutory APMC Rule 24: Buyer rejection return trip charges deducted from cultivator escrow balance
                </span>
              </div>
            </div>
            <span className="badge badge-red" style={{ fontSize: '0.85rem', fontWeight: 900, padding: '6px 14px' }}>
              Total Deducted: -₹{(farmer.totalReturnCharges || 8450).toLocaleString('en-IN')}.00
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: '#ffffff', borderRadius: 8, overflow: 'hidden', border: '1px solid #fecaca' }}>
              <thead>
                <tr style={{ background: '#fee2e2', color: '#991b1b', borderBottom: '1px solid #fca5a5' }}>
                  <th style={{ padding: '9px 12px', textAlign: 'left' }}>DEDUCTION ID</th>
                  <th style={{ padding: '9px 12px', textAlign: 'left' }}>LOT / ORDER</th>
                  <th style={{ padding: '9px 12px', textAlign: 'left' }}>REASON STATED BY BUYER</th>
                  <th style={{ padding: '9px 12px', textAlign: 'left' }}>TIMESTAMP</th>
                  <th style={{ padding: '9px 12px', textAlign: 'right' }}>DEDUCTION AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {farmer.returnDeductions.map(ded => (
                  <tr key={ded.id} style={{ borderBottom: '1px solid #fef2f2' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{ded.id}</td>
                    <td style={{ padding: '10px 12px', color: '#475569', fontWeight: 700 }}>{ded.lot_code || ded.deal_ref}</td>
                    <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: 600 }}>{ded.reason}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{ded.date} • {ded.time}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#dc2626', fontSize: '0.9rem' }}>
                      -₹{Number(ded.amount).toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid: Live APMC Price Trend vs Active Listings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 24 }}>
        
        {/* Left: Live APMC Price Trend with Product Identity & Commodity Switcher */}
        <div className="panel" style={{ 
          padding: '24px', 
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          borderRadius: 18,
          boxShadow: '0 10px 32px -4px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Live APMC Price Trend vs Market Demand
                </h3>
                <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: '0.72rem' }}>
                  <span>{activeCrop.icon}</span>
                  <span>Product: {activeCrop.name} ({activeCrop.nameMr})</span>
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Real-time daily modal rates & AI forecasting for <strong>{activeCrop.name} • {activeCrop.variety}</strong>
              </p>
            </div>

            {/* Controls: Unit Switcher (Tons vs Q) & Time Horizon Switcher */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Unit Toggle: Default to Tons */}
              <div style={{ 
                display: 'flex', gap: 2, background: 'rgba(241, 245, 249, 0.85)', 
                padding: 3, borderRadius: 10, border: '1px solid rgba(203, 213, 225, 0.7)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
              }}>
                <button
                  type="button"
                  onClick={() => setPriceUnit('ton')}
                  style={{
                    padding: '5px 12px', borderRadius: 7, fontSize: '0.72rem',
                    fontWeight: priceUnit === 'ton' ? 800 : 600,
                    background: priceUnit === 'ton' ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)' : 'transparent',
                    color: priceUnit === 'ton' ? '#ffffff' : '#64748b',
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  Tons (MT)
                </button>
                <button
                  type="button"
                  onClick={() => setPriceUnit('qtl')}
                  style={{
                    padding: '5px 12px', borderRadius: 7, fontSize: '0.72rem',
                    fontWeight: priceUnit === 'qtl' ? 800 : 600,
                    background: priceUnit === 'qtl' ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)' : 'transparent',
                    color: priceUnit === 'qtl' ? '#ffffff' : '#64748b',
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  Quintals (Q)
                </button>
              </div>

              {/* Time Horizon Switcher */}
              <div style={{ 
                display: 'flex', gap: 2, background: 'rgba(241, 245, 249, 0.85)', 
                padding: 3, borderRadius: 10, border: '1px solid rgba(203, 213, 225, 0.7)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
              }}>
                {['7 Days', '15 Days', '30 Days'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 7,
                      fontSize: '0.72rem',
                      fontWeight: timeRange === r ? 800 : 600,
                      background: timeRange === r ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)' : 'transparent',
                      color: timeRange === r ? '#ffffff' : '#64748b',
                      border: 'none',
                      boxShadow: timeRange === r ? 'inset 0 1px 1px rgba(255,255,255,0.4), 0 2px 4px rgba(21, 128, 61, 0.25)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Selector Strip (Switch Between Commodities) */}
          <div style={{ 
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 14,
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>
              Select Commodity:
            </span>
            {DASHBOARD_COMMODITIES.map(c => {
              const isSel = selectedCrop === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 11px', borderRadius: 16,
                    fontSize: '0.74rem', fontWeight: isSel ? 800 : 600,
                    background: isSel ? 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)' : 'rgba(248, 250, 252, 0.8)',
                    color: isSel ? '#1d4ed8' : '#475569',
                    border: isSel ? '1.5px solid #3b82f6' : '1px solid #cbd5e1',
                    boxShadow: isSel ? '0 2px 6px rgba(59, 130, 246, 0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{c.icon}</span>
                  <span>{c.name} ({c.nameMr})</span>
                </button>
              );
            })}
          </div>

          {/* Mandi Comparison Strip (Dynamic per Product & Scaled in Tons) */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, 
            background: 'rgba(248, 250, 252, 0.75)', backdropFilter: 'blur(8px)',
            padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(226, 232, 240, 0.85)', 
            marginBottom: 16, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.8)' 
          }}>
            {mandiRates.map((m, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.label}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: m.primary ? '#15803d' : '#0f172a' }}>
                  ₹{(m.price * unitMult).toLocaleString('en-IN')} / {unitLabel}
                </div>
                <div style={{ fontSize: '0.68rem', color: m.primary ? '#16a34a' : '#0284c7', fontWeight: 700 }}>
                  {m.note}
                </div>
              </div>
            ))}
          </div>

          {/* Real Recharts Price Trend & Forecasting LLM Curve */}
          <div style={{ 
            minHeight: 140, width: '100%', background: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(226, 232, 240, 0.8)', 
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              <span>Daily High: <strong>₹{dailyHighPrice.toLocaleString('en-IN')} / {unitLabel}</strong></span>
              <span style={{ color: timeRange === '7 Days' ? '#15803d' : '#4f46e5', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <BrainCircuit size={12} />
                {timeRange === '7 Days' ? `${activeCrop.name} Modal Rate Curve (${unitLabelFull})` : `Forecasting LLM Trajectory (${activeCrop.name})`}
              </span>
              <span>MSP Floor: <strong>₹{(activeCrop.defaultMsp * unitMult).toLocaleString('en-IN')} / {unitLabel}</strong></span>
            </div>

            <div style={{ height: 75, width: '100%' }}>
              <ResponsiveContainer width="100%" height={75}>
                <AreaChart data={trendPoints} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="realTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#15803d" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#15803d" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="realForecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div style={{
                            background: '#0f172a', color: '#ffffff', padding: '6px 10px',
                            borderRadius: 6, fontSize: '0.72rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            border: '1px solid #334155'
                          }}>
                            <div style={{ fontWeight: 700, color: d.isForecast ? '#818cf8' : '#4ade80' }}>
                              {d.display_date} • {d.type}
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, marginTop: 2 }}>
                              ₹{Number(d.price).toLocaleString('en-IN')} / {unitLabel}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={timeRange === '7 Days' ? '#15803d' : '#4f46e5'}
                    strokeWidth={2.5}
                    fill={timeRange === '7 Days' ? 'url(#realTrendGrad)' : 'url(#realForecastGrad)'}
                    dot={{ r: 2.5, fill: timeRange === '7 Days' ? '#15803d' : '#4f46e5' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>{trendPoints[0]?.display_date || '01 Sep'}</span>
              <span>{trendPoints[Math.floor(trendPoints.length / 2)]?.display_date || '04 Sep'}</span>
              <span>{trendPoints[trendPoints.length - 1]?.display_date || '07 Sep'}</span>
              <span style={{ color: '#15803d', fontWeight: 800 }}>
                Today: ₹{(primaryPrice * unitMult).toLocaleString('en-IN')} / {unitLabel} ({activeCrop.primaryMandi})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active Crop Listings (Reactive) with Frosted Glass */}
        <div className="panel" style={{ 
          padding: '24px', 
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          borderRadius: 18,
          boxShadow: '0 10px 32px -4px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>Your Active Crop Listings</h3>
              <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>● {lots.length} Lots in PostgreSQL</span>
            </div>
            <button 
              onClick={() => setStep(18)}
              style={{ 
                fontSize: '0.75rem', color: '#15803d', fontWeight: 800, 
                background: 'rgba(236, 253, 245, 0.8)', padding: '5px 10px', 
                borderRadius: 8, border: '1px solid #a7f3d0', cursor: 'pointer' 
              }}>
              Digital Pooling View
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 310, overflowY: 'auto' }}>
            {lots.map((lot, idx) => {
              const isPendingGrading = lot.status === LOT_STAGES?.CREATED_PENDING_GRADING;
              const isMarketplace = lot.status === LOT_STAGES?.LISTED_MARKETPLACE;
              const isPool = lot.status === LOT_STAGES?.LISTED_POOL;
              const isAwaitingTransport = lot.status === LOT_STAGES?.PAYMENT_DONE_AWAITING_TRANSPORT;
              const isTransportConfirmed = lot.status === LOT_STAGES?.TRANSPORT_CONFIRMED;
              const isInTransit = lot.status === LOT_STAGES?.PICKED_UP_IN_TRANSIT;
              const isCompleted = lot.status === LOT_STAGES?.COMPLETED_FUNDS_RELEASED || lot.status === 'ESCROW_LOCKED';
              const isRejected = lot.status === LOT_STAGES?.REJECTED_RETURN_IN_PROGRESS;
              const isReturnedClosed = lot.status === LOT_STAGES?.RETURNED_CLOSED;

              let badgeClass = 'badge badge-blue';
              if (isPendingGrading || isPool) badgeClass = 'badge badge-amber';
              else if (isCompleted) badgeClass = 'badge badge-green';
              else if (isRejected) badgeClass = 'badge badge-red';
              else if (isTransportConfirmed || isInTransit) badgeClass = 'badge badge-purple';
              else if (isReturnedClosed) badgeClass = 'badge badge-gray';

              let actionButtonLabel = 'View Lot';
              let actionStep = 7;
              if (isPendingGrading) {
                actionButtonLabel = 'Grade Produce';
                actionStep = 6;
              } else if (isPool) {
                actionButtonLabel = 'View Pool';
                actionStep = 18;
              } else if (isMarketplace) {
                actionButtonLabel = 'In Market';
                actionStep = 7;
              } else if (isAwaitingTransport || isTransportConfirmed || isInTransit) {
                actionButtonLabel = 'Track Vahan';
                actionStep = 17;
              } else if (isCompleted || isRejected || isReturnedClosed) {
                actionButtonLabel = 'Ledger';
                actionStep = 8;
              }

              return (
                <div key={lot.id || idx} style={{ 
                  background: 'rgba(248, 250, 252, 0.8)', padding: '14px 16px', 
                  borderRadius: 12, border: '1px solid rgba(226, 232, 240, 0.85)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{lot.crop_name}</strong>
                    <span className={badgeClass} style={{ fontSize: '0.65rem', fontWeight: 800 }}>
                      {lot.status || 'LISTED_MARKETPLACE'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Lot #{lot.lot_code} • {priceUnit === 'ton' ? `${(lot.quantity_qtl * 0.1).toFixed(1)} Tons (${lot.quantity_qtl} Qtl)` : `${lot.quantity_qtl} Qtl`} • {lot.grade || 'Grade A'} • {lot.mandi || 'Lasalgaon'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Ask: <strong style={{ color: '#15803d' }}>₹{(lot.asking_price * unitMult).toLocaleString('en-IN')} / {unitLabel}</strong>
                    </span>
                    <button 
                      onClick={() => setStep(actionStep)}
                      className={isCompleted ? 'btn-primary' : 'btn-secondary'} 
                      style={{ padding: '5px 12px', fontSize: '0.75rem' }}>
                      {actionButtonLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Prominent Digital Mandi Pooling Cluster Feature Banner on Farmer Dashboard */}
      <div className="panel" style={{ 
        padding: '20px 26px', marginBottom: 24, 
        border: '1px solid rgba(134, 239, 172, 0.85)', 
        borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 10px 30px -4px rgba(22, 101, 52, 0.07), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 14, 
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', 
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)' 
          }}>
            👥
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Digital Mandi Pooling • Pimpalgaon Cluster #04
              </h3>
              <span className="badge badge-green">Active (120/150 Qtl)</span>
              <span className="badge badge-amber">+₹120/Qtl Bulk Uplift</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#166534', margin: '4px 0 0' }}>
              Your 30 Qtl is contributed to the collective onion pool with 4 neighbor farmers. Top corporate bid: <strong>₹2,425/Qtl</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep(18)}
          className="btn-primary"
          style={{ padding: '9px 20px', fontSize: '0.84rem' }}
        >
          <span>Open Digital Mandi Pooling</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Farmer Quick Action Hub */}
      <div className="panel" style={{ 
        padding: '22px 26px', 
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        borderRadius: 18,
        boxShadow: '0 10px 30px -4px rgba(15, 23, 42, 0.05), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: 16 }}>
          Farmer Quick Action Hub
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { label: 'List New Produce', sub: 'Create lot with 7/12 Geohash', step: 5, icon: '➕' },
            { label: 'Check Mandi Rates', sub: 'Compare Lasalgaon vs Pune', step: 4, icon: '📈' },
            { label: 'Digital Mandi Pooling', sub: 'Join Cluster (+₹120/Qtl)', step: 18, icon: '👥' },
            { label: 'Book Cold Storage', sub: 'MSWC Niphad & Subsidies', step: 9, icon: '🏢' },
            { label: 'Statutory Redressal', sub: 'APMC Sec 31-B Arbitration', step: 10, icon: '⚖️' }
          ].map((a, i) => (
            <div 
              key={i}
              onClick={() => setStep(a.step)}
              style={{ 
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)', 
                padding: '16px 18px', borderRadius: 14, 
                border: '1px solid rgba(226, 232, 240, 0.85)', 
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.02)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, 
                transition: 'all 0.15s ease' 
              }}>
              <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{a.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      )}

    </div>
  );
}
