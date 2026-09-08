import React, { useState } from 'react';
import { 
  HelpCircle, Phone, Scale, AlertTriangle, CheckCircle2, 
  ChevronDown, ChevronUp, Clock, FileText, Shield, MapPin, Truck, ExternalLink
} from 'lucide-react';
import { APMC_FAQS } from './driverData';

export default function DriverSupport({ lang = 'en' }) {
  const [openFaq, setOpenFaq] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.2)' }}>
              MAHARASHTRA APMC ACT SEC 31-B
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#bfdbfe' }}>
              • Statutory Transporter Grievance & Assistance
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
            Transportation & Logistics Helpdesk
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#dbeafe' }}>
            24/7 Mandi flying squads, highway patrol assistance, weighbridge dispute mediation, and toll clearance support.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '12px 18px',
          borderRadius: 12,
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#dbeafe', fontWeight: 700 }}>
            24/7 TOLL-FREE HELPLINE
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
            1800-220-4402
          </div>
          <div style={{ fontSize: '0.72rem', color: '#bfdbfe' }}>
            Dedicated APMC Transporter Support
          </div>
        </div>
      </div>

      {/* Main Grid: Emergency Helplines & Statutory Protections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
        
        {/* Left: 24/7 Emergency Flying Squad & Support Directory */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={18} color="#dc2626" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              24/7 APMC Emergency Hotline & Flying Squad
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
            Direct emergency escalation channels for commercial freight vehicles operating on Maharashtra Mandi corridors.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#991b1b' }}>
                  APMC Flying Squad Patrol (Highway 4 / NH-60)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>Transit Breakdown & Mandi Gate Escalation</div>
              </div>
              <a
                href="tel:+919822100412"
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                Call Patrol
              </a>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e293b' }}>
                  Lasalgaon APMC Control Desk
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Dock Inward & Weighbridge Supervision</div>
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb' }}>
                0253-2410920
              </span>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e293b' }}>
                  NHAI / Fastag Toll Dispute Helpline
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Toll plaza double charge & RFID tag resolution</div>
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb' }}>
                1033 (Toll Free)
              </span>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e293b' }}>
                  Maharashtra Agri-Logistics Helpdesk
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>State logistics nodal officer & e-way bill inquiries</div>
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb' }}>
                1800-220-4402
              </span>
            </div>
          </div>
        </div>

        {/* Right: Statutory Rights & Legal Escrow Guarantees */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '22px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
              LEGAL ESCROW GUARANTEE
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
              Statutory Protection under Maharashtra APMC Rules
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
              Commercial transporters operating on AgriConnect are accredited state contractors. In the event of buyer insolvency or consignee dispute, freight is disbursed from the pre-funded vault upon assayer inward report.
            </div>

            <div style={{
              marginTop: 4,
              background: '#f0fdf4',
              borderRadius: 10,
              padding: '12px 14px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700, fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} /> 100% Pre-funded Freight Guarantee
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700, fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} /> Fastag & Diesel Surcharge Covered
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700, fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} /> Direct SBI DBT Bank Account Transfer
              </div>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
              GREEN CORRIDOR PRIORITY PASS
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              Perishable Produce Express Clearance
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>
              All AgriConnect verified vehicles carry digital QR gate passes granting priority entry at Lasalgaon, Pimpalgaon, and Vashi APMC Mandis without queueing delays.
            </div>
          </div>
        </div>
      </div>

      {/* APMC Legal FAQs Accordion */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '22px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Transporter Legal Rights & Mandi Regulations FAQ
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {APMC_FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  style={{
                    padding: '12px 16px',
                    background: isOpen ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    color: '#0f172a'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>

                {isOpen && (
                  <div style={{ padding: '12px 16px', background: '#f8fafc', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, borderTop: '1px solid #e2e8f0' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
