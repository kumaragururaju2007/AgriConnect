import React from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, Award, FileText, 
  DollarSign, ArrowRight, TrendingUp, Users, ExternalLink, Lock, MapPin
} from 'lucide-react';
import { MOCK_BUYERS } from '../data/mockData';

export default function Step13BuyerDossier({ setStep }) {
  const buyer = MOCK_BUYERS[0];

  return (
    <div className="animate-slide-in">
      
      {/* Top Compliant Banner (from APMC & BUYER.pdf) */}
      <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={20} style={{ color: '#15803d' }} />
          <div>
            <span style={{ fontWeight: 800, color: '#15803d', fontSize: '0.88rem' }}>
              APMC Sec 29 Licensed Institutional Buyer • FULLY COMPLIANT
            </span>
            <span style={{ fontSize: '0.75rem', color: '#166534', marginLeft: 8 }}>
              FY 2024-25 ACTIVE • Auth No. 2024/MH/881
            </span>
          </div>
        </div>
        <span className="badge badge-green">STATE VERIFIED ENTERPRISE</span>
      </div>

      {/* Corporate Overview & Trust Score Header */}
      <div className="panel" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 30, alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                🏢
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  {buyer.name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {buyer.type} • CIN: <strong>{buyer.cin}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 12 }}>
              <div>Primary Contact: <strong style={{ color: '#0f172a' }}>{buyer.contact}</strong></div>
              <div>Incorporated: <strong style={{ color: '#0f172a' }}>{buyer.incorporated}</strong></div>
              <div>APMC License: <strong style={{ color: '#15803d' }}>{buyer.license}</strong></div>
              <div>Registered Node: <strong style={{ color: '#0f172a' }}>Pimpalgaon Central (#MH-NSK-04)</strong></div>
            </div>
          </div>

          {/* Big Circular Trust Score Box */}
          <div style={{ background: '#f8fafc', padding: '18px 24px', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#15803d', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                91
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>
                Mandi Trust Score
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.72rem', color: '#334155' }}>
              <span style={{ color: '#15803d', fontWeight: 600 }}>✓ 100% Escrow Funded</span>
              <span style={{ color: '#15803d', fontWeight: 600 }}>✓ APMC License Valid</span>
              <span style={{ color: '#15803d', fontWeight: 600 }}>✓ GSTR-3B Tax Compliant</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Procurement Integrity & Mandi KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Fulfillment Rate', val: '99.4%', sub: 'Deliveries validated on-time', color: '#15803d' },
          { label: 'Delivery Quality Fit', val: '98.8%', sub: 'Zero assayer dispute claims', color: '#0284c7' },
          { label: 'Avg Escrow Speed', val: '2.4 Hours', sub: 'Post gate weighment check', color: '#15803d' },
          { label: 'Arbitration Dispute', val: '0.6%', sub: 'Mandi benchmark is 4.8%', color: '#ea580c' }
        ].map((kpi, idx) => (
          <div key={idx} className="panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: kpi.color, margin: '4px 0 2px', fontFamily: 'var(--font-heading)' }}>
              {kpi.val}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Recent APMC Transacted Lots Table */}
      <div className="panel" style={{ padding: '22px', marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: 14 }}>
          Recent APMC Transacted Lots & Settlements
        </h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>LOT ID</th>
              <th>COMMODITY</th>
              <th>FARMER / FPO</th>
              <th>QUANTITY</th>
              <th>CONTRACT VALUE</th>
              <th>ESCROW STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700, color: '#0284c7' }}>#AC-892</td>
              <td style={{ fontWeight: 600 }}>Nashik Red Onion (Garwa)</td>
              <td>Santosh Shinde (Niphad Yard)</td>
              <td>120 Qtl</td>
              <td style={{ fontWeight: 700, color: '#15803d' }}>₹2,91,000</td>
              <td>
                <span className="badge badge-green">Locked in Escrow</span>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#0284c7' }}>#AC-741</td>
              <td style={{ fontWeight: 600 }}>Soyabean JS-335 (Grade-A)</td>
              <td>Sangamner Taluka Grower FPO</td>
              <td>80 Qtl</td>
              <td style={{ fontWeight: 700, color: '#0f172a' }}>₹3,85,600</td>
              <td>
                <span className="badge badge-gray">Settled via DBT</span>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, color: '#0284c7' }}>#AC-618</td>
              <td style={{ fontWeight: 600 }}>Table Grapes (Thompson)</td>
              <td>Dindori Grape Collective</td>
              <td>40 Qtl</td>
              <td style={{ fontWeight: 700, color: '#0f172a' }}>₹2,88,000</td>
              <td>
                <span className="badge badge-gray">Settled via DBT</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Institutional Sourcing Capabilities */}
      <div className="panel" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: 14 }}>
          Institutional Sourcing Capabilities & Banking Limits
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>State Escrow Credit Facility</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803d' }}>₹5,00,00,000</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>State Bank of India APMC Guarantee</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dedicated Transport Fleets</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>14 GPS Reefer Trucks</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cold chain certified for transit</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assay Lab Integration</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>On-Site NIR Testing</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Instant moisture & brix verification</div>
          </div>
        </div>
      </div>

    </div>
  );
}
