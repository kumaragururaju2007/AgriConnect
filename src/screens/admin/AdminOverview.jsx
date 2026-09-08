import React from 'react';
import { 
  ShieldCheck, AlertTriangle, Clock, CheckCircle2, XCircle, FileText, 
  Building2, Users, ArrowUpRight, Scale, IndianRupee, AlertCircle, 
  ExternalLink, Search, ChevronRight, BarChart3, Award, Sparkles, Activity
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function AdminOverview({ onNavigateTab, onSelectBuyer, onSelectGrievance }) {
  const { buyerApplications, farmerApplications, adminGrievances, adminUser } = useAgri();

  // Metrics
  const pendingApprovals = (buyerApplications || []).filter(b => b.status === 'Pending');
  const approvedBuyers = (buyerApplications || []).filter(b => b.status === 'Approved');
  const pendingFarmerApprovals = (farmerApplications || []).filter(f => f.status === 'Pending');
  const approvedFarmers = (farmerApplications || []).filter(f => f.status === 'Approved');
  const activeGrievances = (adminGrievances || []).filter(g => g.status !== 'RESOLVED');
  const resolvedGrievances = (adminGrievances || []).filter(g => g.status === 'RESOLVED');
  const totalEscrowInDispute = activeGrievances.reduce((acc, curr) => acc + (curr.disputed_amount || curr.escrow_locked_amount || 0), 0);

  // Critical statutory docket (< 24 hrs remaining)
  const criticalDocket = activeGrievances.find(g => g.sla_hours_remaining && g.sla_hours_remaining <= 24) || activeGrievances[0] || null;

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Executive Jurisdiction Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 18,
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                APMC Executive Regulatory Command Center
              </h1>
              <span style={{
                background: '#10b981', color: '#064e3b',
                fontSize: '0.72rem', fontWeight: 900, padding: '3px 10px', borderRadius: 999,
                letterSpacing: '0.04em'
              }}>
                STATE GAZZETTED
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              {adminUser?.jurisdiction} • {adminUser?.department} ({adminUser?.badge})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                e-NAM Grid Gateway
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                34 Mandis Synchronized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Statutory SLA Warning Banner */}
      {criticalDocket && (
        <div style={{
          background: 'linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1px solid #fecdd3',
          borderLeft: '6px solid #e11d48',
          borderRadius: 14,
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: '#ffe4e6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#e11d48', flexShrink: 0
            }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.96rem', fontWeight: 900, color: '#9f1239' }}>
                  Statutory Arbitration Notice: Docket #{criticalDocket.docket_id || criticalDocket.ticket_code || 'DISP-01'}
                </span>
                <span style={{
                  background: '#e11d48', color: '#ffffff',
                  fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999
                }}>
                  {criticalDocket.sla_hours_remaining || 24}h REMAINING (APMC ACT SEC 31-B)
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#881337', lineHeight: 1.4 }}>
                Farmer <strong>{criticalDocket.farmer_name || 'Agriculturist'}</strong> vs Buyer <strong>{criticalDocket.buyer_firm || criticalDocket.buyer_name || 'Respondent'}</strong>. Consignment: {criticalDocket.crop_variety || criticalDocket.crop_name || 'Agri Lot'} ({criticalDocket.quantity_qtl || 100} Qtls). Disputed escrow: <strong>₹{(criticalDocket.disputed_amount || criticalDocket.escrow_locked_amount || 0).toLocaleString('en-IN')}</strong> held under state lien.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectGrievance) onSelectGrievance(criticalDocket);
              onNavigateTab('disputes');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#e11d48', color: '#ffffff',
              border: 'none', padding: '10px 20px', borderRadius: 8,
              fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(225, 29, 72, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Open Adjudication Dossier</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 5 High-Impact Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        
        {/* Pending Buyer Approvals */}
        <div 
          onClick={() => onNavigateTab('buyers')}
          className="card"
          style={{
            padding: '22px', borderRadius: 14, cursor: 'pointer',
            border: '1px solid #fed7aa', background: 'linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(194, 65, 12, 0.05)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c2410c' }}>
              <Building2 size={22} />
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#c2410c', background: '#fed7aa', padding: '3px 8px', borderRadius: 999 }}>
              BUYER QUEUE
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#9a3412', lineHeight: 1 }}>
            {pendingApprovals.length}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#7c2d12', marginTop: 6 }}>
            Pending Buyer KYC Approvals
          </div>
          <div style={{ fontSize: '0.74rem', color: '#ea580c', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            <span>Review Form-B & GST credentials</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Pending Farmer 7/12 Land KYC */}
        <div 
          onClick={() => onNavigateTab('farmers')}
          className="card"
          style={{
            padding: '22px', borderRadius: 14, cursor: 'pointer',
            border: '1px solid #a7f3d0', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.05)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Users size={22} />
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#065f46', background: '#a7f3d0', padding: '3px 8px', borderRadius: 999 }}>
              FARMER 7/12 QUEUE
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#065f46', lineHeight: 1 }}>
            {pendingFarmerApprovals.length}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#047857', marginTop: 6 }}>
            Pending Farmer 7/12 KYC
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            <span>Audit Gut No. & Mahabhulekh records</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Active Grievances */}
        <div 
          onClick={() => onNavigateTab('disputes')}
          className="card"
          style={{
            padding: '22px', borderRadius: 14, cursor: 'pointer',
            border: '1px solid #fecdd3', background: 'linear-gradient(180deg, #fff5f6 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.05)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
              <Scale size={22} />
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#be123c', background: '#fecdd3', padding: '3px 8px', borderRadius: 999 }}>
              UNDER ARBITRATION
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#9f1239', lineHeight: 1 }}>
            {activeGrievances.length}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#881337', marginTop: 6 }}>
            Active Grievance Dockets
          </div>
          <div style={{ fontSize: '0.74rem', color: '#be123c', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            <span>{resolvedGrievances.length} decrees issued this month</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Escrow Under Lien */}
        <div 
          className="card"
          style={{
            padding: '22px', borderRadius: 14,
            border: '1px solid #e2e8f0', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
              <IndianRupee size={22} />
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', background: '#e2e8f0', padding: '3px 8px', borderRadius: 999 }}>
              STATE LIEN
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            ₹{(totalEscrowInDispute / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155', marginTop: 6 }}>
            Disputed Escrow on Hold
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 6 }}>
            Protected in Maharashtra State Vault
          </div>
        </div>

        {/* Verified APMC Traders */}
        <div 
          onClick={() => onNavigateTab('buyers')}
          className="card"
          style={{
            padding: '22px', borderRadius: 14, cursor: 'pointer',
            border: '1px solid #bbf7d0', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.05)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <Award size={22} />
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#bbf7d0', padding: '3px 8px', borderRadius: 999 }}>
              ACCREDITED
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#166534', lineHeight: 1 }}>
            {approvedBuyers.length}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#14532d', marginTop: 6 }}>
            Verified Buyer Entities
          </div>
          <div style={{ fontSize: '0.74rem', color: '#15803d', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            <span>Form-B badges authenticated</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Dispute Resolution SLA */}
        <div 
          className="card"
          style={{
            padding: '22px', borderRadius: 14,
            border: '1px solid #bfdbfe', background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Clock size={22} />
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1d4ed8', background: '#dbeafe', padding: '3px 8px', borderRadius: 999 }}>
              COMPLIANCE
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#1e3a8a', lineHeight: 1 }}>
            18.4 hrs
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e40af', marginTop: 6 }}>
            Average Conciliation SLA
          </div>
          <div style={{ fontSize: '0.74rem', color: '#2563eb', marginTop: 6 }}>
            100% within statutory 48h limit
          </div>
        </div>

      </div>

      {/* Main Two Column Operational Grid: Pending Buyer Queue & Priority Disputes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
        
        {/* Left Column: Buyer Approval Queue Glance */}
        <div className="panel" style={{ padding: '24px', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏢 Buyer Verification Queue</span>
                <span style={{ background: '#ffedd5', color: '#c2410c', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
                  {pendingApprovals.length} Pending
                </span>
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Form-B licenses, corporate GSTIN, and Mandi shop deeds awaiting sign-off
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('buyers')}
              style={{
                fontSize: '0.78rem', fontWeight: 700, color: '#15803d',
                background: '#ecfdf5', border: '1px solid #bbf7d0',
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <span>Manage Queue</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {buyerApplications.slice(0, 3).map((buyer) => (
              <div
                key={buyer.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: buyer.status === 'Pending' ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  background: buyer.status === 'Pending' ? '#fffaf5' : '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      {buyer.firm_name}
                    </span>
                    {buyer.verified_badge && (
                      <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 3 }}>
                    Rep: {buyer.buyer_name} • Lic: <code style={{ color: '#0f172a', fontWeight: 700 }}>{buyer.apmc_license_no}</code> • {buyer.location}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                    background: buyer.status === 'Approved' ? '#dcfce7' : buyer.status === 'Pending' ? '#ffedd5' : buyer.status === 'More Info Requested' ? '#eff6ff' : '#fee2e2',
                    color: buyer.status === 'Approved' ? '#15803d' : buyer.status === 'Pending' ? '#c2410c' : buyer.status === 'More Info Requested' ? '#2563eb' : '#b91c1c'
                  }}>
                    {buyer.status}
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectBuyer) onSelectBuyer(buyer);
                      onNavigateTab('buyers');
                    }}
                    style={{
                      background: '#0f172a', border: 'none',
                      color: '#ffffff', padding: '6px 14px', borderRadius: 6,
                      fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Inspect KYC
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Grievances & Arbitration Dossiers Glance */}
        <div className="panel" style={{ padding: '24px', borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚖️ Arbitration Docket Bench</span>
                <span style={{ background: '#ffe4e6', color: '#be123c', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
                  {activeGrievances.length} Active
                </span>
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Disputes awaiting statutory conciliation decrees under Maharashtra APMC Act Sec 31-B
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('disputes')}
              style={{
                fontSize: '0.78rem', fontWeight: 700, color: '#e11d48',
                background: '#fff1f2', border: '1px solid #fecdd3',
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4
              }}
            >
              <span>Bench View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(adminGrievances || []).slice(0, 3).map((docket) => {
              const docketKey = docket.docket_id || docket.ticket_code || docket.id;
              const docketAmount = docket.disputed_amount || docket.escrow_locked_amount || 0;
              return (
              <div
                key={docketKey}
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: docket.status === 'UNDER_ARBITRATION' ? '1px solid #fecdd3' : '1px solid #e2e8f0',
                  background: docket.status === 'UNDER_ARBITRATION' ? '#fff5f6' : '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: '0.92rem', color: '#0f172a' }}>
                      #{docketKey}
                    </span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                      background: docket.status === 'RESOLVED' ? '#dcfce7' : '#ffe4e6',
                      color: docket.status === 'RESOLVED' ? '#15803d' : '#be123c'
                    }}>
                      {docket.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginTop: 3 }}>
                    {docket.farmer_name || 'Farmer'} ↔ {docket.buyer_firm || docket.buyer_name || 'Buyer'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    {docket.category || 'Dispute'} • Disputed Escrow: <strong style={{ color: '#be123c' }}>₹{docketAmount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {docket.sla_hours_remaining ? (
                    <div style={{ fontSize: '0.72rem', color: docket.sla_hours_remaining <= 24 ? '#e11d48' : '#d97706', fontWeight: 900, marginBottom: 4 }}>
                      ⏱️ {docket.sla_hours_remaining}h left
                    </div>
                  ) : null}
                  <button
                    onClick={() => {
                      if (onSelectGrievance) onSelectGrievance(docket);
                      onNavigateTab('disputes');
                    }}
                    style={{
                      background: '#be123c', color: '#ffffff',
                      border: 'none', padding: '6px 14px', borderRadius: 6,
                      fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(190, 18, 60, 0.25)'
                    }}
                  >
                    Adjudicate
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>

      </div>

      {/* APMC Mandi Supervised Division Grid Ticker */}
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={18} style={{ color: '#15803d' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
            Nashik Supervised Mandi Division:
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Lasalgaon (Onion Yard), Pimpalgaon Baswant, Yeola, Vashi Apex Terminal, Pune Gultekdi.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
            99.8% System Uptime
          </span>
        </div>
      </div>

    </div>
  );
}
