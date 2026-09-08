import React, { useState } from 'react';
import { 
  Building2, AlertTriangle, ShieldCheck, Scale, Clock, 
  CheckCircle2, ArrowRight, TrendingUp, Users, DollarSign, Eye, MapPin, Database
} from 'lucide-react';
import { MOCK_APMC_METRICS } from '../data/mockData';
import { useAgri } from '../context/AgriContext';

export default function Step12APMCOfficer({ setStep, setTerminal }) {
  const { grievances, resolveGrievance, lots, deals, livePriceData } = useAgri();
  const [resolvedDocketId, setResolvedDocketId] = useState(null);

  const lasalgaonPrice = Number(livePriceData?.find(p => p.market?.toLowerCase().includes('lasalgaon') && p.crop?.toLowerCase().includes('onion'))?.modal_price || 2490);
  const punePrice = Number(livePriceData?.find(p => p.market?.toLowerCase().includes('pune') && p.crop?.toLowerCase().includes('onion'))?.modal_price || 2510);
  const ahmednagarPrice = Number(livePriceData?.find(p => p.market?.toLowerCase().includes('ahmednagar') && p.crop?.toLowerCase().includes('onion'))?.modal_price || 2360);

  const handleEnforceRelease = async (id) => {
    setResolvedDocketId(id);
    await resolveGrievance(id, 'Statutory Decree Issued under Maharashtra APMC Act Sec 31-B: 100% Escrow released immediately to cultivator. Buyer statutory caution docket filed.');
  };

  return (
    <div className="animate-slide-in">
      
      {/* Top Red Statutory Urgent Alert Ribbon (as in APMC & BUYER.pdf) */}
      <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>
                STATUTORY REDRESSAL ALERT • MAHARASHTRA APMC ACT SEC 31-B URGENT
              </span>
              <span style={{ fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700 }}>48h SLA Action Required</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#7f1d1d', marginTop: 2, fontWeight: 600 }}>
              3 grievances approaching statutory 48h SLA deadline in Niphad & Malegaon jurisdictions. Automated buyer escrow holds enforced under Rule 24.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setStep(15)}
          className="btn-primary" 
          style={{ background: '#dc2626', fontSize: '0.8rem', padding: '6px 14px' }}>
          <span>Open Priority Docket #0419</span>
        </button>
      </div>

      {/* Main Title & Grid Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-gray">Directorate of Agricultural Marketing</span>
            <span className="badge badge-green">e-NAM Grid: 99.8% Synced</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-title)' }}>
            Executive Mandi Oversight & Redressal Grid
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Nashik Supervised Division • 5 Districts / 34 Krishi Mandis Live
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setStep(13)}
            className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            Buyer Dossier (#MH-9421)
          </button>
          <button 
            onClick={() => setStep(14)}
            className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            Enterprise Analytics
          </button>
        </div>
      </div>

      {/* 4 Big Statutory Metric Cards (matching APMC & BUYER.pdf) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        
        {/* 1. Verified Farmer Base */}
        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            VERIFIED FARMER BASE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
              4,28,940
            </span>
            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>+14.2% MoM</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            MahaDBT & PM-Kisan authenticated cultivators
          </div>
          <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600, marginTop: 4 }}>
            98.6% Aadhaar & 7/12 Synced (Div. Mandate: 95%)
          </div>
        </div>

        {/* 2. Active Yard Listings */}
        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ACTIVE YARD LISTINGS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#15803d', fontFamily: 'var(--font-heading)' }}>
              12,480
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lots</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            <strong>84,200 MT</strong> Physical Produce on Mandi floor
          </div>
          <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600, marginTop: 4 }}>
            Grade-A Assayed: 71.4% • 100% e-Weighed
          </div>
        </div>

        {/* 3. Cleared Escrow Volume */}
        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            CLEARED ESCROW VOLUME
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
              ₹84.62 Cr
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            100% Guaranteed Scheduled Payout
          </div>
          <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600, marginTop: 4 }}>
            Zero default rate across licensed buyers
          </div>
        </div>

        {/* 4. Statutory Active Disputes */}
        <div className="panel" style={{ padding: '20px', borderLeft: '3px solid #dc2626' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            STATUTORY ACTIVE DISPUTES
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '6px 0 2px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#dc2626', fontFamily: 'var(--font-heading)' }}>
              14 Cases
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#b91c1c', fontWeight: 600 }}>
            3 approaching statutory 48h SLA
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Escrow frozen under Rule 24
          </div>
        </div>

      </div>

      {/* Grid: Regional Mandi Price Trend vs District Clearance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
        
        {/* Left: Regional Mandi Price Trend */}
        <div className="panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-title)' }}>Regional Mandi Price Trend</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Benchmark price discovery vs MSP floor threshold (₹18,500 / Ton)
              </p>
            </div>
            <span className="badge badge-green">+28.6% Above MSP</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lasalgaon APMC (Nashik)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>₹{(lasalgaonPrice * 10).toLocaleString('en-IN')} / Ton</div>
              <div style={{ fontSize: '0.68rem', color: '#15803d' }}>+4.2% • High Demand</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ahmednagar APMC</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>₹{(ahmednagarPrice * 10).toLocaleString('en-IN')} / Ton</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>+1.8% • Regular Supply</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pune Market Yard</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>₹{(punePrice * 10).toLocaleString('en-IN')} / Ton</div>
              <div style={{ fontSize: '0.68rem', color: '#0284c7' }}>+2.1% • Moderate</div>
            </div>
          </div>

          <div style={{ height: 110, width: '100%', background: '#ffffff', borderRadius: 8, padding: '10px 14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>High: ₹26,500 / Ton</span>
              <span style={{ color: '#15803d' }}>Nashik Garwa Onion (Live APMC)</span>
              <span>MSP Floor: ₹18,500 / Ton</span>
            </div>
            <svg viewBox="0 0 500 55" style={{ width: '100%', height: 50, overflow: 'visible' }}>
              <path d="M 0,45 Q 60,35 120,40 T 240,25 T 360,18 T 500,8" fill="none" stroke="#15803d" strokeWidth="2.5" />
              <line x1="0" y1="48" x2="500" y2="48" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4,4" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <span>01 Sep</span>
              <span>03 Sep</span>
              <span>05 Sep</span>
              <span style={{ color: '#15803d', fontWeight: 700 }}>07 Sep (Today)</span>
            </div>
          </div>
        </div>

        {/* Right: District Escrow Trade Clearance */}
        <div className="panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-title)', marginBottom: 4 }}>
            District Escrow Trade Clearance
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            Cleared E-Payments under Maharashtra APMC Act
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { dist: 'Nashik District', val: '₹34.2 Cr', mt: '32,400 MT', pct: 85 },
              { dist: 'Ahmednagar District', val: '₹21.8 Cr', mt: '19,200 MT', pct: 65 },
              { dist: 'Jalgaon District', val: '₹14.6 Cr', mt: '13,800 MT', pct: 45 },
              { dist: 'Dhule District', val: '₹9.8 Cr', mt: '10,200 MT', pct: 32 },
              { dist: 'Nandurbar District', val: '₹4.8 Cr', mt: '5,600 MT', pct: 18 }
            ].map((d, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: '#0f172a' }}>{d.dist}</span>
                  <span style={{ color: '#15803d' }}>{d.val} ({d.mt})</span>
                </div>
                <div style={{ width: '100%', height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', background: '#15803d' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grievance SLA Compliance & Inspector Assignment Table */}
      <div className="panel" style={{ padding: '22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-title)' }}>
              Grievance SLA Compliance & Inspector Assignment
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Active statutory arbitration dockets under Maharashtra APMC Act, Section 31-B
            </p>
          </div>
          <span className="badge badge-red">3 Cases Approaching Deadline</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>DOCKET ID</th>
                <th>JURISDICTION</th>
                <th>COMPLAINANT & BUYER</th>
                <th>CATEGORY</th>
                <th>SLA DEADLINE</th>
                <th>ESCROW AT RISK</th>
                <th>ARBITRATOR</th>
                <th>STATUTORY ORDER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: '#0284c7' }}>#GRV-2024-0419</td>
                <td style={{ fontWeight: 600 }}>Nashik Krishi Mandi (Pimpalgaon Yard)</td>
                <td>
                  <div style={{ fontWeight: 600 }}>Santosh Ramdas Shinde</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>vs AgroFresh Supply Chain Ltd</div>
                </td>
                <td>Delayed Assayer Inward Certificate</td>
                <td>
                  <span className="badge badge-red" style={{ fontWeight: 800 }}>
                    03h 12m Left
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: '#15803d' }}>₹2,91,000</td>
                <td>Adv. S. Kulkarni</td>
                <td>
                  {(resolvedDocketId === 'GRV-2024-0419' || grievances.some(g => (g.ticket_code === 'GRV-2024-0419' || g.ticketId === 'GRV-2024-0419') && g.status?.includes('Resolved'))) ? (
                    <span className="badge badge-green">✓ Statutory Decree Issued</span>
                  ) : (
                    <button 
                      onClick={() => handleEnforceRelease('GRV-2024-0419')}
                      className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                      Enforce Escrow Release
                    </button>
                  )}
                </td>
              </tr>

              <tr>
                <td style={{ fontWeight: 700, color: '#0284c7' }}>#GRV-2024-0392</td>
                <td style={{ fontWeight: 600 }}>Malegaon APMC Yard</td>
                <td>
                  <div style={{ fontWeight: 600 }}>Dnyaneshwar Gaikwad</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>vs Kisan Fresh Aggregators</div>
                </td>
                <td>Transit Weight Discrepancy (1.4% Loss)</td>
                <td>
                  <span className="badge badge-amber">19h 45m</span>
                </td>
                <td style={{ fontWeight: 700, color: '#15803d' }}>₹2,42,000</td>
                <td>P. Deshmukh</td>
                <td>
                  <button 
                    onClick={() => alert('Docket #0392 details opened.')}
                    className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                    Review Evidence
                  </button>
                </td>
              </tr>

              <tr>
                <td style={{ fontWeight: 700, color: '#0284c7' }}>#GRV-2024-0388</td>
                <td style={{ fontWeight: 600 }}>Pune Market Yard (Gultekdi)</td>
                <td>
                  <div style={{ fontWeight: 600 }}>Ramesh Jadhav</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>vs MahaFood Processor Ltd</div>
                </td>
                <td>Payment Clearing Gatepass Delay</td>
                <td>
                  <span className="badge badge-gray">24h 10m</span>
                </td>
                <td style={{ fontWeight: 700, color: '#15803d' }}>₹3,15,000</td>
                <td>V. Shinde</td>
                <td>
                  <button 
                    onClick={() => alert('Gatepass verified.')}
                    className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                    Inspect Slip
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Roboflow Universe AI Quality Grading & Disagreement Audit Panel */}
      <div className="panel" style={{ padding: '22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-green">Roboflow Universe Integrated</span>
              <span className="badge badge-gray">Multi-Model Routing</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-title)' }}>
              AI Quality Grading & Model Routing Audit Grid
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Mandated quality inspection audit trail under Maharashtra APMC Rules. Disagreements automatically routed for officer review.
            </p>
          </div>
          <button
            onClick={() => setStep(6)}
            className="btn-secondary"
            style={{ fontSize: '0.75rem' }}
          >
            <span>Launch Lot Assayer</span>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>LOT CODE</th>
                <th>COMMODITY</th>
                <th>ROUTED MODEL</th>
                <th>GRADE & CONFIDENCE</th>
                <th>FALLBACK STATUS</th>
                <th>REVIEW STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {(lots && lots.length > 0 ? lots : [
                { lot_code: 'AC-892', crop_name: 'Onion (Red / लाल कांदा)', grade: 'Grade A', grade_confidence: 94.6, model_used: 'veg1-hcqsf-2/2', used_fallback_model: false, needs_review: false },
                { lot_code: 'AC-1049', crop_name: 'Nashik Red Onion (Lal Ghadva)', grade: 'Grade A', grade_confidence: 92.1, model_used: 'veg1-hcqsf-2/2', used_fallback_model: false, needs_review: false },
                { lot_code: 'AC-719', crop_name: 'Tomato (Abhinav F1)', grade: 'Grade B', grade_confidence: 86.4, model_used: 'freshness-fruits-and-vegetables/1', used_fallback_model: false, needs_review: false }
              ]).map((l, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: '#0284c7' }}>#{l.lot_code || `AC-${890 + i}`}</td>
                  <td style={{ fontWeight: 600 }}>{l.crop_name || 'Produce'}</td>
                  <td>
                    <code style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#334155' }}>
                      {l.model_used || (l.commodity_id === 'onion' || (l.crop_name || '').toLowerCase().includes('onion') ? 'veg1-hcqsf-2/2' : 'freshness-fruits-and-vegetables/1')}
                    </code>
                  </td>
                  <td>
                    <span className={`badge ${l.grade?.includes('A') ? 'badge-green' : (l.grade?.includes('B') ? 'badge-amber' : 'badge-red')}`}>
                      {l.grade || 'Grade A'} ({l.grade_confidence || l.confidence || 94.6}%)
                    </span>
                  </td>
                  <td>
                    {l.used_fallback_model ? (
                      <span className="badge badge-amber">⚠️ Fallback Used</span>
                    ) : (
                      <span className="badge badge-gray">Primary Model</span>
                    )}
                  </td>
                  <td>
                    {l.needs_review ? (
                      <span className="badge badge-red">⚠️ Physical Review Required</span>
                    ) : (
                      <span className="badge badge-green">✓ Assayed & Cleared</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Inspection Audit for Lot #${l.lot_code || l.id}:\nModel: ${l.model_used || 'veg1-hcqsf-2/2'}\nGrade: ${l.grade || 'Grade A'}\nFallback: ${l.used_fallback_model ? 'Yes' : 'No'}\nReview Needed: ${l.needs_review ? 'Yes' : 'No'}`)}
                      className="btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                    >
                      Audit Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
