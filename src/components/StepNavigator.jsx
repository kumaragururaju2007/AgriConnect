import React from 'react';

export const ALL_STEPS = [
  { id: 7, label: '07. Procurement Terminal', role: 'Buyer', title: 'B2B Procurement Desk & Terminal' },
  { id: 18, label: '18. Mandi Pooling', role: 'Shared', title: 'Digital Mandi Pooling & Collective Bidding' },
  { id: 4, label: '04. Live Price Tracking', role: 'Shared', title: 'Live Price Tracking (Agmarknet Mandis)' },
  { id: 8, label: '08. Escrow Vault', role: 'Buyer', title: 'Escrow Deals & Settlement' },
  { id: 19, label: '19. Inbound Logistics', role: 'Shared', title: 'Incoming Deliveries & Gate Inward' },
  { id: 10, label: '10. Grievance Cell', role: 'APMC', title: 'APMC Dispute Cell (48h SLA)' },
  { id: 13, label: '13. Buyer Dossier', role: 'Buyer', title: 'Buyer Credentialing & APMC Lic' },
  { id: 14, label: '14. Enterprise AI', role: 'Enterprise', title: 'Predictive Arbitrage & Heatmaps' },
  { id: 12, label: '12. APMC Console', role: 'APMC', title: 'Statutory Redressal Sec 31-B' },
  { id: 15, label: '15. Arbitration Study', role: 'APMC', title: 'Sec 31-B Case Study #0419' },
];

export const BUYER_STEPS = ALL_STEPS;

export default function StepNavigator({ currentStep, setStep }) {
  const currentIndex = ALL_STEPS.findIndex(s => s.id === currentStep);
  const activeIndex = currentIndex !== -1 ? currentIndex : 0;
  const currentObj = ALL_STEPS[activeIndex] || ALL_STEPS[0];
  const isApmcStep = currentObj.role === 'APMC' || currentStep >= 12;

  return (
    <nav aria-label="Step navigation" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '8px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        
        {/* Current Step Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          <div>
            <span style={{ fontSize: '0.68rem', color: isApmcStep ? '#c2410c' : '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              STEP {activeIndex + 1} OF {ALL_STEPS.length} • {currentObj.role}
            </span>
            <h2 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {currentObj.title}
            </h2>
          </div>
        </div>

      </div>
    </nav>
  );
}
