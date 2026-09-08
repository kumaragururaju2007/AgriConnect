import React from 'react';
import { 
  ShieldCheck, UserCheck, Award, FileText, CheckCircle2, 
  MapPin, Phone, Building, ArrowRight, DollarSign, Calendar, TrendingUp
} from 'lucide-react';
import { MOCK_FARMER } from '../data/mockData';

export default function Step11FarmerProfile({ setStep, setTerminal }) {
  return (
    <div className="animate-slide-in">
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-green">State Verified Digital Identity</span>
            <span className="badge badge-amber">MahaDBT Framework #{MOCK_FARMER.farmerId}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-title)' }}>
            Farmer Profile & Digital Credentials
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Nashik Krishi Mandi Jurisdiction • Niphad Taluka • Integrated Land & APMC Trading Records
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>APMC Trust Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>
            {MOCK_FARMER.trustScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, marginBottom: 24 }}>
        
        {/* Left Column: ID Card */}
        <div className="panel" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 10px' }}>
              {MOCK_FARMER.avatar}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{MOCK_FARMER.name}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>S/O {MOCK_FARMER.fatherName}</p>
            <span className="badge badge-green" style={{ marginTop: 6 }}>
              APMC Member #{MOCK_FARMER.apmcMemberNo}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Contact & Aadhaar</span>
              <strong>{MOCK_FARMER.mobile}</strong> • <span style={{ color: '#15803d', fontWeight: 600 }}>Aadhaar e-KYC Verified ✓</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Village & Taluka</span>
              <strong>{MOCK_FARMER.village}, {MOCK_FARMER.taluka} Taluka, {MOCK_FARMER.district}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Mahabhulekh 7/12 Land Record</span>
              <strong style={{ color: '#c2410c' }}>{MOCK_FARMER.landGutNo} ({MOCK_FARMER.landArea})</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Soil Health Card</span>
              <strong style={{ color: '#0284c7' }}>{MOCK_FARMER.soilHealthCard}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Aadhaar DBT Bank Account</span>
              <span style={{ color: 'var(--text-secondary)' }}>{MOCK_FARMER.bankAccount}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Records */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div className="panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-title)', marginBottom: 12 }}>
              Earned Badges & Sanctions
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>✓ 7/12 Land Verified</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Gut 142/B linked via Mahabhulekh</div>
              </div>
              <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.82rem' }}>✓ 100% On-Time Dispatch</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Across 34 APMC contracts</div>
              </div>
              <div style={{ background: '#fefce8', padding: '10px 12px', borderRadius: 6, border: '1px solid #fef08a' }}>
                <div style={{ fontWeight: 700, color: '#a16207', fontSize: '0.82rem' }}>✓ Zero Rejections</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Grade-A compliance</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem' }}>✓ Sustainable Practice</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Stubble monetization</div>
              </div>
            </div>
          </div>

          <div className="panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-title)', marginBottom: 12 }}>
              Transaction History & Performance
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Deals Settled</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>34 Contracts</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Disbursed via DBT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>₹41.80 Lakh</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Escrow Release</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>4.2 Hours</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
