import React from 'react';
import { 
  Sparkles, TrendingUp, BarChart3, Globe, Award, ShieldCheck, 
  ArrowRight, CheckCircle2, DollarSign, MapPin, Layers, RefreshCw
} from 'lucide-react';

export default function Step14BuyerAnalytics({ setStep, setTerminal }) {
  return (
    <div className="animate-slide-in">
      
      {/* Top Banner (from APMC & BUYER.pdf) */}
      <div className="panel" style={{ padding: '24px 28px', marginBottom: 24, borderLeft: '4px solid #ea580c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-saffron">PREMIUM ENTERPRISE TIER</span>
              <span className="badge badge-green">Unlimited Next Renewal: Oct 2025</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-title)' }}>
              Premium Buyer Analytics & Predictive Mandi Sourcing
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              AgroFresh Supply Chain Ltd • Mandi Node Consolidation & AI Guided Farmgate Procurements
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={() => { setTerminal('farmer'); setStep(1); }}
              className="btn-primary" style={{ fontSize: '0.84rem' }}>
              <RefreshCw size={14} />
              <span>Restart Guided Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Big Enterprise KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TOTAL SOURCING VOLUME
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            1,420 MT
          </div>
          <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600 }}>
            +34.2% vs last quarter
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            18 APMC nodes consolidating
          </div>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            AVG. PRICE VS MODAL
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#15803d', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            4.8% Below
          </div>
          <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600 }}>
            Saved ₹14.85 Lakhs
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Through direct farmer bidding
          </div>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ACTIVE SUPPLIERS
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0284c7', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            86 FPOs
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Nashik, Pune, Solapur & Latur
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            100% verified KYC & land records
          </div>
        </div>

        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            PREDICTIVE QUALITY MATCH
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ea580c', margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
            96.4%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            High-confidence AI fit
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Grade-A export spec fulfilled
          </div>
        </div>
      </div>

      {/* Sourcing Trend & Price Arbitrage Spreads */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        
        {/* Left: Statewide Arbitrage Spreads */}
        <div className="panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-title)' }}>
                Statewide Mandi Price Arbitrage Spreads
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Real-time net margin after logistics and mandi cess
              </p>
            </div>
            <span className="badge badge-green">Onion Gavran</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { route: 'Ahmednagar APMC (₹21,900) ➔ Vashi APMC (₹26,800)', spread: '₹4,900 / Ton', logistics: '₹1,800 / Ton', net: '+₹3,100 / Ton', status: 'Optimal' },
              { route: 'Yeola APMC (₹22,100) ➔ Pune Market Yard (₹23,100)', spread: '₹1,000 / Ton', logistics: '₹1,200 / Ton', net: '-₹200 / Ton', status: 'Sub-Optimal' },
              { route: 'Lasalgaon APMC (₹23,800) ➔ Nagpur Grid (₹28,200)', spread: '₹4,400 / Ton', logistics: '₹2,200 / Ton', net: '+₹2,200 / Ton', status: 'Good Margin' },
              { route: 'Niphad Farmgate (₹24,250) ➔ AgroFresh Hub', spread: 'Factory Direct', logistics: '₹350 / Ton', net: 'Zero Brokerage', status: 'Core Route' }
            ].map((r, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{r.route}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Logistics: {r.logistics} • Gross Spread: {r.spread}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: r.net.startsWith('+') || r.net.includes('Zero') ? '#15803d' : '#dc2626' }}>
                    {r.net}
                  </div>
                  <span className={`badge ${r.net.startsWith('+') || r.net.includes('Zero') ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.62rem' }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Saved Supplier Lists & Priority FPO Partners */}
        <div className="panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-title)', marginBottom: 14 }}>
            Direct Farmgate Priority Sourcing Partners
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Santosh Ramdas Shinde', loc: 'Niphad, Nashik', crop: 'Nashik Red Onion (Grade-A)', avail: '120 Qtl Ready', score: '94/100', status: 'Active Lot #AC 892' },
              { name: 'Sangamner Takli Agri FPO', loc: 'Sangamner, Ahmednagar', crop: 'Soyabean JS-335', avail: '450 Qtl Ready', score: '98/100', status: 'Contracted' },
              { name: 'Dindori Grape Collective', loc: 'Dindori, Nashik', crop: 'Thompson Seedless', avail: '80 Qtl Ready', score: '96/100', status: 'Pre-Harvest' }
            ].map((s, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{s.name}</strong>
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Trust {s.score}</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {s.loc} • {s.crop}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803d' }}>
                    {s.avail}
                  </span>
                  <button 
                    onClick={() => { setTerminal('farmer'); setStep(8); }}
                    className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                    View Contract
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
