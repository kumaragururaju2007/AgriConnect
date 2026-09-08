import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, ExternalLink } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { useAgri } from '../context/AgriContext';

export default function Footer({ lang, setStep }) {
  const { lang: ctxLang } = useAgri();
  const t = TRANSLATIONS[ctxLang || lang] || TRANSLATIONS.en;

  return (
    <footer style={{ background: '#050c13', borderTop: '1px solid var(--border-subtle)', padding: '40px 20px 24px', marginTop: 60, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        
        {/* Statutory Banner */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 12, padding: '14px 20px', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 14 }}>
          <AlertTriangle size={24} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <div>
            <span style={{ color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              {t.statutoryNotice}
            </span>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: 2 }}>
              All transactions executed on AgriConnect are protected under the Maharashtra Agricultural Produce Marketing (Development and Regulation) Act and backed by automated 100% State Escrow release protocols.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 30, marginBottom: 30 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: '1.4rem' }}>🌾</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                Agri<span style={{ color: '#10b981' }}>Connect</span> Maharashtra
              </span>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: 12 }}>
              Unified digital e-Mandi, AI Quality Grading, and State Escrow Vault platform connecting 1.4 Crore+ farmers with verified institutional buyers and APMC mandis.
            </p>
            <span className="badge badge-green">Government of Maharashtra Initiative</span>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Emergency Helplines & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8' }}>
                <PhoneCall size={14} /> Kisan Call Center: <strong>1800-180-1551</strong> (Toll-Free 24x7)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                <PhoneCall size={14} /> MahaDBT Technical Desk: <strong>022-49150800</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                <PhoneCall size={14} /> APMC Arbitration Helpline: <strong>1800-120-8040</strong>
              </li>
              <li style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 4 }}>
                HQ: Directorate of Agricultural Marketing, Central Building, Pune 411001.
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Quick Workflows (14-Step Tour)</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { s: 1, name: 'Landing' },
                { s: 3, name: 'Farmer Dashboard' },
                { s: 4, name: 'Mandi Rates & ROI' },
                { s: 6, name: 'AI Grading' },
                { s: 7, name: 'Marketplace' },
                { s: 8, name: 'Escrow Vault' },
                { s: 9, name: 'Storage & Subsidies' },
                { s: 10, name: 'Grievance Desk' },
                { s: 12, name: 'APMC Officer' },
                { s: 13, name: 'Buyer Dossier' },
                { s: 14, name: 'Buyer Analytics' }
              ].map(item => (
                <button 
                  key={item.s}
                  onClick={() => setStep(item.s)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: 12 }}>Official Integrations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem' }}>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} /> MahaDBT & Mahabhulekh (7/12 Land Registry)
              </span>
              <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} /> Agmarknet & e-NAM Maharashtra Grid
              </span>
              <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} /> Maharashtra State Warehousing Corp (MSWC)
              </span>
              <span style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} /> NPCI UPI / RBI Escrow Scheduled Release
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.78rem' }}>
          <p>© 2024–2026 AgriConnect Maharashtra. Department of Agriculture & Maharashtra State Innovation Society (MSInS). Smart India Hackathon #26132.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span>256-Bit TLS Encryption</span>
            <span>•</span>
            <span>WDRA Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
