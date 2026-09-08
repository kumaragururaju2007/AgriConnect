import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle2, XCircle, AlertCircle, Eye, ShieldCheck, 
  FileText, Building2, MapPin, Phone, Mail, Calendar, Award, ExternalLink, 
  Clock, ArrowUpDown, ChevronDown, Check, X, HelpCircle, ZoomIn
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function AdminBuyerKYC({ selectedBuyerFromDash, onClearSelection }) {
  const { 
    buyerApplications, 
    approveBuyerApp, 
    rejectBuyerApp, 
    requestBuyerInfoApp 
  } = useAgri();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Active Inspector Modal
  const [activeApp, setActiveApp] = useState(selectedBuyerFromDash || null);
  const [inspectorTab, setInspectorTab] = useState('documents'); // 'documents' | 'audit'
  const [selectedDocKey, setSelectedDocKey] = useState('license');

  // Action Dialogs
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionClause, setRejectionClause] = useState('APMC Act Rules 14-A (Mandatory Licensing)');
  const [rejectionReason, setRejectionReason] = useState('Incomplete / Uncertified Form-B License');
  const [rejectionCustomNotes, setRejectionCustomNotes] = useState('');

  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [missingDocs, setMissingDocs] = useState([]);
  const [moreInfoInstructions, setMoreInfoInstructions] = useState('');

  // Filtered List
  const filteredApps = buyerApplications.filter(app => {
    const matchesSearch = 
      app.firm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.apmc_license_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesRegion = regionFilter === 'ALL' || app.region.toLowerCase().includes(regionFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Handlers
  const handleApprove = () => {
    if (!activeApp) return;
    approveBuyerApp(activeApp.id, approvalNotes);
    setShowApproveConfirm(false);
    setApprovalNotes('');
    setActiveApp(prev => ({
      ...prev,
      status: 'Approved',
      verified_badge: true
    }));
  };

  const handleReject = () => {
    if (!activeApp) return;
    const notes = rejectionCustomNotes ? `${rejectionReason} — ${rejectionCustomNotes}` : rejectionReason;
    rejectBuyerApp(activeApp.id, notes, rejectionClause);
    setShowRejectModal(false);
    setRejectionCustomNotes('');
    setActiveApp(prev => ({
      ...prev,
      status: 'Rejected',
      verified_badge: false
    }));
  };

  const handleRequestMoreInfo = () => {
    if (!activeApp) return;
    requestBuyerInfoApp(activeApp.id, missingDocs, moreInfoInstructions);
    setShowMoreInfoModal(false);
    setMissingDocs([]);
    setMoreInfoInstructions('');
    setActiveApp(prev => ({
      ...prev,
      status: 'More Info Requested'
    }));
  };

  const toggleMissingDoc = (title) => {
    if (missingDocs.includes(title)) {
      setMissingDocs(missingDocs.filter(d => d !== title));
    } else {
      setMissingDocs([...missingDocs, title]);
    }
  };

  const regions = ['ALL', 'Nashik', 'Vashi', 'Pune', 'Vidarbha', 'Nagpur'];

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Verified Buyer Accreditation & KYC Queue</span>
            <span style={{ fontSize: '0.74rem', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 999, fontWeight: 800 }}>
              Form-B & GST Engine
            </span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Verify institutional traders against state APMC directories, grant verified badges, or issue formal rejection orders.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '6px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            Applications in Registry: <strong>{buyerApplications.length}</strong>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="panel" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12 }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by Firm, Rep Name, APMC Lic # or Mandi Yard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px 9px 38px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600, background: '#ffffff', color: '#334155' }}
            >
              <option value="ALL">All Statuses ({buyerApplications.length})</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved / Verified</option>
              <option value="More Info Requested">More Info Requested</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Region:</span>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600, background: '#ffffff', color: '#334155' }}
            >
              {regions.map(r => (
                <option key={r} value={r}>{r === 'ALL' ? 'All Mandi Divisions' : r}</option>
              ))}
            </select>
          </div>

          {(searchTerm || statusFilter !== 'ALL' || regionFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setRegionFilter('ALL'); }}
              style={{
                fontSize: '0.78rem', color: '#dc2626', background: '#fee2e2',
                border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: 6,
                cursor: 'pointer', fontWeight: 700
              }}
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* Applications Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 14 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Business / Firm Name</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Applicant & Contact</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>APMC License No.</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Mandi / Location</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Submitted</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Status & Badge</th>
                <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🔍</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#475569' }}>No applications matching search criteria</div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: activeApp?.id === app.id ? '#f0fdf4' : '#ffffff',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                        {app.firm_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                        CIN: {app.cin || 'N/A'} • {app.business_type}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#334155' }}>
                        {app.buyer_name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {app.phone}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <code style={{ background: '#f1f5f9', color: '#0f172a', padding: '3px 8px', borderRadius: 4, fontWeight: 700, fontSize: '0.78rem' }}>
                        {app.apmc_license_no}
                      </code>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#475569' }}>
                        <MapPin size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <span>{app.location}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        Region: {app.region}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {app.submitted_date}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                          background: app.status === 'Approved' ? '#dcfce7' : app.status === 'Pending' ? '#ffedd5' : app.status === 'More Info Requested' ? '#eff6ff' : '#fee2e2',
                          color: app.status === 'Approved' ? '#15803d' : app.status === 'Pending' ? '#c2410c' : app.status === 'More Info Requested' ? '#2563eb' : '#b91c1c'
                        }}>
                          {app.status}
                        </span>

                        {app.verified_badge && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            fontSize: '0.68rem', fontWeight: 800, color: '#15803d',
                            background: '#ecfdf5', border: '1px solid #bbf7d0',
                            padding: '1px 6px', borderRadius: 4
                          }}>
                            <ShieldCheck size={11} />
                            <span>Verified Trader</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setActiveApp(app);
                          setInspectorTab('documents');
                          setSelectedDocKey('license');
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: '#0f172a', color: '#ffffff',
                          border: 'none', padding: '7px 14px', borderRadius: 6,
                          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.2)'
                        }}
                      >
                        <Eye size={13} />
                        <span>Inspect KYC</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIDE-BY-SIDE KYC DOCUMENT INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {activeApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            width: '100%',
            maxWidth: 1000,
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            
            {/* Modal Header */}
            <div style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                    {activeApp.firm_name}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                    background: activeApp.status === 'Approved' ? '#10b981' : activeApp.status === 'Pending' ? '#f59e0b' : '#ef4444',
                    color: '#ffffff'
                  }}>
                    {activeApp.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 3 }}>
                  Dossier ID: <code>{activeApp.id}</code> • APMC License: <code>{activeApp.apmc_license_no}</code> • Rep: {activeApp.buyer_name}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.12)', padding: 3, borderRadius: 8 }}>
                  <button
                    onClick={() => setInspectorTab('documents')}
                    style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                      background: inspectorTab === 'documents' ? '#ffffff' : 'transparent',
                      border: 'none', color: inspectorTab === 'documents' ? '#0f172a' : '#cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    KYC Documents (4)
                  </button>
                  <button
                    onClick={() => setInspectorTab('audit')}
                    style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                      background: inspectorTab === 'audit' ? '#ffffff' : 'transparent',
                      border: 'none', color: inspectorTab === 'audit' ? '#0f172a' : '#cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    Audit Trail ({activeApp.audit_log?.length || 0})
                  </button>
                </div>

                <button
                  onClick={() => { setActiveApp(null); if (onClearSelection) onClearSelection(); }}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 6 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {inspectorTab === 'documents' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
                  
                  {/* Left: Document List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                      Verification Checklist
                    </div>

                    {[
                      { key: 'license', title: '📜 APMC Form-B License', badge: 'VERIFIED', no: activeApp.documents?.license?.certNo, valid: activeApp.documents?.license?.validity },
                      { key: 'gst', title: '🏢 GST Registration', badge: 'ACTIVE', no: activeApp.documents?.gst?.gstin, valid: activeApp.documents?.gst?.state },
                      { key: 'pan', title: '💳 Corporate PAN Card', badge: 'MATCHED', no: activeApp.documents?.pan?.panNo, valid: 'Entity Verified' },
                      { key: 'address', title: '📍 Yard Allotment Lease', badge: 'LOCATED', no: activeApp.documents?.address?.documentNo, valid: 'Shop Allotted' }
                    ].map(item => (
                      <div
                        key={item.key}
                        onClick={() => setSelectedDocKey(item.key)}
                        style={{
                          padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                          border: selectedDocKey === item.key ? '2px solid #15803d' : '1px solid #e2e8f0',
                          background: selectedDocKey === item.key ? '#f0fdf4' : '#ffffff'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{item.title}</span>
                          <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                            {item.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                          Doc Ref: {item.no}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#15803d', marginTop: 2, fontWeight: 600 }}>
                          Status: {item.valid}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: Document Preview */}
                  <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                          {activeApp.documents?.[selectedDocKey]?.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Cross-referenced against Maharashtra e-NAM APMC Ledger
                        </div>
                      </div>

                      <a 
                        href={activeApp.documents?.[selectedDocKey]?.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: '0.76rem', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
                      >
                        <span>Open High-Res</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <div style={{
                      flex: 1, minHeight: 280, borderRadius: 8, overflow: 'hidden',
                      border: '1px solid #cbd5e1', background: '#0f172a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <img
                        src={activeApp.documents?.[selectedDocKey]?.fileUrl}
                        alt="KYC Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 340 }}
                      />
                    </div>

                    <div style={{ marginTop: 12, background: '#ffffff', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.76rem', color: '#475569' }}>
                      <strong>Issuing Entity:</strong> {activeApp.documents?.[selectedDocKey]?.issuingAuthority || 'Govt of Maharashtra APMC Directorate'}<br/>
                      <strong>Cryptographic Stamp:</strong> e-NAM Digital Hash Verified.
                    </div>
                  </div>

                </div>
              ) : (
                /* Audit Log */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569' }}>
                    Historical Review Ledger
                  </div>
                  {activeApp.audit_log?.length > 0 ? (
                    activeApp.audit_log.map((log) => (
                      <div key={log.id} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: 14 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          📜
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{log.action}</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>by {log.admin_name} • {log.timestamp}</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#334155' }}>{log.notes}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem', padding: 20, textAlign: 'center' }}>
                      No regulatory actions recorded yet.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div style={{
              background: '#f8fafc',
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Endorsement enables full wholesale bidding and escrow contracting privileges across 34 Mandis.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setShowMoreInfoModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', cursor: 'pointer' }}
                >
                  <HelpCircle size={14} />
                  <span>Request More Info</span>
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer' }}
                >
                  <XCircle size={14} />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => setShowApproveConfirm(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                    background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', border: '1px solid #14532d', color: '#ffffff',
                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Approve & Grant Badge</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* APPROVE DIALOG */}
      {showApproveConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 14, maxWidth: 500, width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
              Confirm Accreditation Approval
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#475569' }}>
              Entity: <strong>{activeApp?.firm_name}</strong>
            </p>
            <textarea
              rows={2}
              placeholder="KYC verified against e-NAM state database. Form B validated."
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowApproveConfirm(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '7px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleApprove} style={{ background: '#15803d', color: '#ffffff', border: 'none', padding: '7px 18px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                Confirm & Issue Badge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT DIALOG */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 14, maxWidth: 520, width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 900, color: '#991b1b' }}>
              Statutory Rejection Order
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>APMC Statutory Clause:</label>
                <select value={rejectionClause} onChange={(e) => setRejectionClause(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}>
                  <option value="APMC Act Rules 14-A (Mandatory Licensing)">APMC Act Rules 14-A (Mandatory Licensing)</option>
                  <option value="APMC Act Sec 30 (Defaulted Trader / Solvency)">APMC Act Sec 30 (Defaulted Trader / Solvency)</option>
                  <option value="e-NAM Circular #412 (Invalid Corporate Entity)">e-NAM Circular #412 (Invalid Corporate Entity)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: '#475569', marginBottom: 4 }}>Findings:</label>
                <textarea rows={3} placeholder="Provide specific regulatory grounds..." value={rejectionCustomNotes} onChange={(e) => setRejectionCustomNotes(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowRejectModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '7px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleReject} style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '7px 18px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                Issue Rejection Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST INFO DIALOG */}
      {showMoreInfoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 14, maxWidth: 500, width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 900, color: '#1e3a8a' }}>
              Request KYC Clarification
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0' }}>
              {['Renewed APMC Form-B Trading License', 'Active GSTIN Challan / Filing', 'Color Scan of Corporate PAN Card', 'Mandi Shop Allotment Letter'].map(doc => (
                <label key={doc} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={missingDocs.includes(doc)} onChange={() => toggleMissingDoc(doc)} />
                  <span>{doc}</span>
                </label>
              ))}
            </div>
            <textarea rows={3} placeholder="Clarification instructions for buyer..." value={moreInfoInstructions} onChange={(e) => setMoreInfoInstructions(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowMoreInfoModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '7px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleRequestMoreInfo} style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '7px 18px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
