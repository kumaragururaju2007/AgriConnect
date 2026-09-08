import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldCheck, Scale, Clock, CheckCircle2, 
  ArrowRight, FileText, QrCode, UserCheck, Lock, Download
} from 'lucide-react';

export default function Step12DisputeCaseStudy({ setStep }) {
  const [orderIssued, setOrderIssued] = useState(false);

  const handleIssueDecree = () => {
    setOrderIssued(true);
    alert('Statutory Order Enforced under Maharashtra APMC Act Sec 31-B:\n1. Full Escrow Payout of ₹2,91,000 released to Farmer Santosh Ramdas Shinde.\n2. Buyer AgroFresh Supply Chain Ltd assessed ₹14,500 statutory demurrage penalty.');
  };

  return (
    <div className="animate-slide-in">
      
      {/* Statutory 48H SLA Warning Banner */}
      <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>🚨</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>STATUTORY 48H SLA WARNING</span>
              <strong style={{ color: '#991b1b', fontSize: '0.85rem' }}>03h 12m Left</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: 2 }}>
              Lodged: 05 Sep 2026, 09:30 AM (Open 44h 48m) • Governed under Maharashtra APMC Regulation & Development Act, 1963
            </p>
          </div>
        </div>

        <button 
          onClick={() => setStep(12)}
          className="btn-secondary" style={{ fontSize: '0.78rem' }}>
          Back to APMC Grid
        </button>
      </div>

      {/* Case Header */}
      <div className="panel" style={{ padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="badge badge-gray" style={{ marginBottom: 4 }}>APMC ARBITRATION DOCKET #GRV-2024-0419</span>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-title)' }}>
              Produce Lot Rejection & Escrow Lien Arbitration
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Deal Ref: <strong>#AC-TXN 8841</strong> • Lot: <strong>#LOT-NSK-4920 (Nashik Red Onion, 12 Tons / 120 Qtl)</strong> • Node: <strong>Pimpalgaon Central Yard #MH-NSK-04</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Escrow Lien Locked in Vault</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>
              ₹2,91,000.00
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18 }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Contract Value</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>₹2,81,634</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>12 Tons @ ₹23,200/Ton (120 Qtl @ ₹2,320/Qtl)</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tested Moisture</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>11.2% FAQ Pass</div>
            <div style={{ fontSize: '0.68rem', color: '#dc2626' }}>Buyer claims &gt; 14.0%</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lead Arbitrator</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Adv. S. Kulkarni</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Chief Mandi Arbitrator</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>APMC Commissioner</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Dr. Vikram Patil, IAS</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Divisional Commissioner</div>
          </div>
        </div>
      </div>

      {/* Litigant Profiles & Evidence Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, marginBottom: 24 }}>
        
        {/* Left: Mandi Evidence & Assayer Records */}
        <div className="panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: 14 }}>
            Mandi Evidence & Certified Assayer Records
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.88rem', color: '#15803d' }}>NIR Hyperspectral Assayer Cert #NIR-892</strong>
                <span className="badge badge-green">Grade-A Pass</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.4 }}>
                Certified by Dr. R. Kulkarni (APMC Senior Chemist). Moisture content tested at 11.2% (Agmark threshold &lt;12.0%). Skin retention 98.4%. Rejection unfounded.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Calibrated Weighbridge Slip #WB-0419-882</strong>
                <span className="badge badge-gray">e-Weighed</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 4 }}>
                <div>Gross: <strong>15,420 kg</strong></div>
                <div>Tare: <strong>3,420 kg</strong></div>
                <div>Net Weight: <strong style={{ color: '#15803d' }}>12,000 kg (12 Tons / 120 Q)</strong></div>
              </div>
            </div>

            <div style={{ background: '#fff1f2', padding: '14px', borderRadius: 8, border: '1px solid #fecdd3' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: '0.88rem', color: '#be123c' }}>Buyer Rejection Memo (Disputed)</strong>
                <span className="badge badge-red">Unilateral Deduction</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#9f1239' }}>
                Buyer claimed 14.8% moisture without running official APMC assay lab re-check, violating Rule 24.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Statutory Findings & Decree */}
        <div className="panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: 14 }}>
            Statutory Audit Findings & Regulatory Decree
          </h3>

          <div style={{ fontSize: '0.82rem', lineHeight: 1.8, color: '#334155', marginBottom: 18 }}>
            <div><strong>Complainant:</strong> Santosh Ramdas Shinde (Niphad, Nashik)</div>
            <div><strong>Respondent:</strong> AgroFresh Supply Chain Ltd (Lasalgaon APMC)</div>
            <div><strong>Statutory Violation:</strong> Maharashtra APMC Act, Section 31-B (Unwarranted Rejection)</div>
            <div><strong>Findings:</strong> Independent secondary assay check confirmed 11.2% moisture. Produce meets Grade A export parameters in full.</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 18 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-title)' }}>
              Arbitration Cell Order:
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: 4 }}>
              Order payment release of ₹2,91,000 from State Escrow Vault to farmer bank account immediately. Direct buyer to take delivery at Lasalgaon Gate 3 within 6 hours.
            </p>
          </div>

          {orderIssued ? (
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', padding: '12px', borderRadius: 8, textAlign: 'center', color: '#15803d', fontWeight: 700, fontSize: '0.85rem' }}>
              ✓ Official Statutory Decree Executed • Escrow Disbursed
            </div>
          ) : (
            <button 
              onClick={handleIssueDecree}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}>
              <CheckCircle2 size={16} />
              <span>Issue Statutory Order & Disburse Escrow</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
