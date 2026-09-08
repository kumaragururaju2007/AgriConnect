import React, { useState, useEffect } from 'react';
import { 
  Scale, AlertTriangle, Clock, CheckCircle2, FileText, ChevronRight, 
  ArrowRight, ShieldCheck, Printer, Download, Eye, Plus, Send, 
  IndianRupee, Building2, User, Camera, FileSpreadsheet, X, HelpCircle,
  Search, RefreshCw, AlertCircle, Award, Check
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function AdminDisputes({ selectedDocketFromDash, onClearSelection }) {
  const { 
    adminGrievances, 
    addGrievanceNote, 
    issueStatutoryDecree, 
    escalateGrievance,
    adminUser 
  } = useAgri();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Selected Docket ID & Active Tab
  const [selectedDocketId, setSelectedDocketId] = useState(
    selectedDocketFromDash?.docket_id || selectedDocketFromDash?.ticket_code || selectedDocketFromDash?.id || null
  );
  const [workbenchTab, setWorkbenchTab] = useState('overview'); // 'overview' | 'weighbridge' | 'evidence' | 'timeline' | 'notes' | 'decree'

  // Synchronize when selectedDocketFromDash changes externally (e.g. from Dashboard Overview)
  useEffect(() => {
    if (selectedDocketFromDash) {
      const key = selectedDocketFromDash.docket_id || selectedDocketFromDash.ticket_code || selectedDocketFromDash.id;
      setSelectedDocketId(key);
      setWorkbenchTab('overview');
    }
  }, [selectedDocketFromDash]);

  // Derive activeDocket reactively from adminGrievances so all updates (notes, decrees, escalations) reflect instantly
  const activeDocket = (adminGrievances || []).find(g => 
    g.docket_id === selectedDocketId || 
    g.ticket_code === selectedDocketId || 
    String(g.id) === String(selectedDocketId)
  ) || null;

  // Internal Notes State
  const [newNoteText, setNewNoteText] = useState('');

  // Statutory Decree Form State
  const [settlementType, setSettlementType] = useState('ORDER_100_PERCENT_ESCROW_FARMER');
  const [farmerAward, setFarmerAward] = useState(0);
  const [buyerRefund, setBuyerRefund] = useState(0);
  const [penalInterest, setPenalInterest] = useState('0');
  const [decreeFindings, setDecreeFindings] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Escalate to Higher Tribunal Modal State
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateTribunal, setEscalateTribunal] = useState('State Mandi Appellate Tribunal, Pune');
  const [escalateReason, setEscalateReason] = useState('Weighing discrepancy requiring physical re-calibration of destination bridge.');

  // Initialize/Reset Decree form values when activeDocket changes
  useEffect(() => {
    if (activeDocket) {
      const totalDisputed = activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0;
      setFarmerAward(totalDisputed);
      setBuyerRefund(0);
      setSettlementType('ORDER_100_PERCENT_ESCROW_FARMER');
      setPenalInterest('0');
      
      // Auto-populate relevant legal findings draft based on docket nature
      if (activeDocket.weighbridge_comparison) {
        const isTol = activeDocket.weighbridge_comparison.is_within_tolerance;
        const varKg = activeDocket.weighbridge_comparison.variance_kg;
        const varPct = activeDocket.weighbridge_comparison.variance_percent;
        const maxTol = activeDocket.weighbridge_comparison.natural_desiccation_allowed_percent;
        if (isTol) {
          setDecreeFindings(`Joint APMC scrutiny confirms recorded transit desiccation of ${varKg} kg (${varPct}%) is within the statutory ${maxTol}% tolerance limit under Maharashtra APMC Rules. Pre-dispatch AI Assay confirms Grade-A specs. Escrow hold is dismissed and 100% proceeds ordered released to Cultivator.`);
        } else {
          setDecreeFindings(`Recorded variance of ${varKg} kg (${varPct}%) exceeds natural transit tolerance (${maxTol}%). Parties concurred on mutual split conciliation pursuant to APMC Act Sec 31-B.`);
        }
      } else {
        setDecreeFindings(`Pursuant to summary hearing conducted under APMC Act Sec 31-B, consignee objections are adjudicated based on verified assay certificates and transaction docket.`);
      }
    }
  }, [activeDocket?.docket_id, activeDocket?.id]);

  // Filtering Logic
  const filteredDockets = (adminGrievances || []).filter(g => {
    const docketId = (g.docket_id || g.ticket_code || String(g.id) || '').toLowerCase();
    const farmer = (g.farmer_name || '').toLowerCase();
    const buyer = (g.buyer_firm || g.buyer_name || '').toLowerCase();
    const crop = (g.crop_variety || g.crop_name || '').toLowerCase();
    const category = (g.category || g.issue_type || '').toLowerCase();
    const search = (searchTerm || '').toLowerCase();

    const matchesSearch = 
      docketId.includes(search) ||
      farmer.includes(search) ||
      buyer.includes(search) ||
      crop.includes(search) ||
      category.includes(search);

    const matchesStatus = 
      statusFilter === 'ALL' || 
      g.status === statusFilter || 
      (statusFilter === 'UNDER_ARBITRATION' && (g.status === 'UNDER_ARBITRATION' || g.status === 'Under Review' || g.status === 'Open')) || 
      (statusFilter === 'RESOLVED' && (g.status === 'RESOLVED' || g.status === 'Resolved')) ||
      (statusFilter === 'ESCALATED' && (g.status === 'ESCALATED' || g.status === 'Escalated'));

    const matchesCategory = 
      categoryFilter === 'ALL' || 
      category.includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handlers
  const handleSelectDocket = (docket) => {
    const key = docket.docket_id || docket.ticket_code || docket.id;
    setSelectedDocketId(key);
    setWorkbenchTab(docket.status === 'RESOLVED' ? 'decree' : 'overview');
  };

  const handleCloseModal = () => {
    setSelectedDocketId(null);
    if (onClearSelection) onClearSelection();
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeDocket) return;
    const docketKey = activeDocket.docket_id || activeDocket.ticket_code || activeDocket.id;
    addGrievanceNote(docketKey, newNoteText, adminUser?.name || 'S. K. Deshmukh');
    setNewNoteText('');
  };

  const handleQuickPresetSplit = (ratio) => {
    if (!activeDocket) return;
    const total = activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0;
    if (ratio === 1.0) {
      setSettlementType('ORDER_100_PERCENT_ESCROW_FARMER');
      setFarmerAward(total);
      setBuyerRefund(0);
    } else if (ratio === 0.0) {
      setSettlementType('ORDER_RETURN_TRANSIT_PAYOUT');
      setFarmerAward(0);
      setBuyerRefund(total);
    } else {
      setSettlementType('COMPROMISE_SPLIT_SETTLEMENT');
      const fAward = Math.round(total * ratio);
      const bRefund = total - fAward;
      setFarmerAward(fAward);
      setBuyerRefund(bRefund);
    }
  };

  const handleIssueDecree = () => {
    if (!activeDocket) return;
    const totalDisputed = activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0;
    const fAward = settlementType === 'ORDER_100_PERCENT_ESCROW_FARMER' ? totalDisputed : Number(farmerAward);
    const bRefund = settlementType === 'ORDER_100_PERCENT_ESCROW_FARMER' ? 0 : Number(buyerRefund);

    const docketKey = activeDocket.docket_id || activeDocket.ticket_code || activeDocket.id;
    const decreePayload = {
      decree_no: `MH-APMC-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      settlement_type: settlementType,
      farmer_award_amount: fAward,
      buyer_refund_amount: bRefund,
      penal_interest_rate: penalInterest,
      findings_summary: decreeFindings || 'Analysis of origin vs destination weighbridge slips confirms transit desiccation within statutory APMC limits. Escrow released under APMC Act Sec 31-B.',
      act_clause: 'Sec 31-B, Maharashtra APMC (Regulation) Act, 1963',
      official_seal: 'SEAL - DISTRICT REGULATORY MAGISTRATE NASHIK',
      enforcement_deadline: '24 Hours via Automated Escrow Clearing'
    };

    issueStatutoryDecree(docketKey, decreePayload);
    setWorkbenchTab('decree');
  };

  const handleConfirmEscalate = () => {
    if (!activeDocket) return;
    const docketKey = activeDocket.docket_id || activeDocket.ticket_code || activeDocket.id;
    escalateGrievance(docketKey, escalateTribunal, escalateReason);
    setShowEscalateModal(false);
    setWorkbenchTab('decree');
  };

  // Normalized Resolution Object Helpers
  const resolution = activeDocket?.resolution || null;
  const resolvedDecreeNo = resolution?.decree_no || `MH-APMC-ORD-${activeDocket?.docket_id?.replace(/[^0-9]/g, '') || '2026'}`;
  const resolvedSection = resolution?.section || 'Sec 31-B, Maharashtra APMC (Regulation) Act, 1963';
  const resolvedAuthorizer = resolution?.issued_by || resolution?.authorizer || adminUser?.name || 'S. K. Deshmukh';
  const resolvedDesignation = resolution?.designation || adminUser?.designation || 'District APMC Regulatory Magistrate';
  const resolvedFarmerAward = resolution?.farmer_award_amount ?? resolution?.farmer_award ?? (activeDocket?.disputed_amount || 0);
  const resolvedBuyerRefund = resolution?.buyer_refund_amount ?? resolution?.buyer_refund ?? 0;
  const resolvedFindings = resolution?.findings_summary || resolution?.summary || resolution?.ruling || 'Amicable conciliation reached under APMC Statutory Arbitral Bench.';
  const resolvedDate = resolution?.issued_at || resolution?.date || 'Recent';

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Statutory Arbitration Bench (APMC Act Sec 31-B)</span>
            <span style={{ fontSize: '0.74rem', background: '#ffe4e6', color: '#be123c', padding: '3px 10px', borderRadius: 999, fontWeight: 800 }}>
              Judicial Conciliation Suite
            </span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Adjudicate consignment rejections, transit weighbridge variance disputes, and issue legally binding decrees under Problem Statement #26132.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9f1239', background: '#fff1f2', padding: '6px 14px', borderRadius: 8, border: '1px solid #fecdd3' }}>
            Active Arbitration Cases: <strong>{(adminGrievances || []).filter(g => g.status !== 'RESOLVED').length}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="panel" style={{ padding: '16px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12 }}>
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by Docket ID, Farmer, Buyer Firm, Crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.84rem', outline: 'none', background: '#ffffff' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600, background: '#ffffff', color: '#334155' }}
            >
              <option value="ALL">All Dockets ({(adminGrievances || []).length})</option>
              <option value="UNDER_ARBITRATION">Under Arbitration (Active)</option>
              <option value="RESOLVED">Resolved (Decree Issued)</option>
              <option value="ESCALATED">Escalated to Higher Tribunal</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600, background: '#ffffff', color: '#334155' }}
            >
              <option value="ALL">All Categories</option>
              <option value="weight">Weighbridge / Weight Variance</option>
              <option value="quality">Quality Grade & Sorting Dispute</option>
              <option value="escrow">Escrow Delay & Payment Default</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); }}
              style={{ fontSize: '0.78rem', color: '#dc2626', background: '#fee2e2', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Dockets Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 14 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Docket ID & Date</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Complainant (Cultivator)</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Respondent (Commercial Buyer)</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Dispute Category</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Disputed Escrow Sum</th>
                <th style={{ padding: '14px 18px', fontWeight: 800 }}>Statutory Status & SLA</th>
                <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDockets.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>⚖️</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#475569' }}>No arbitration dockets match specified criteria</div>
                  </td>
                </tr>
              ) : (
                filteredDockets.map((docket) => {
                  const docketKey = docket.docket_id || docket.ticket_code || docket.id;
                  const docketAmount = docket.disputed_amount || docket.escrow_locked_amount || 0;
                  const isSelected = activeDocket && (activeDocket.docket_id === docket.docket_id || activeDocket.id === docket.id);
                  const isResolved = docket.status === 'RESOLVED' || docket.status === 'Resolved';
                  const isEscalated = docket.status === 'ESCALATED' || docket.status === 'Escalated';

                  return (
                    <tr
                      key={docketKey}
                      onClick={() => handleSelectDocket(docket)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#fff1f2' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.9rem' }}>
                          #{docketKey}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                          Lodged: {docket.created_at || docket.filed_date || 'Recent'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          {docket.farmer_name || 'Cultivator'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {docket.farmer_gut || 'Mandi Jurisdiction'} • {docket.farmer_mandi || 'APMC Yard'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: '#334155' }}>
                          {docket.buyer_firm || docket.buyer_name || 'Buyer Firm'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Lic: <code style={{ color: '#0f172a' }}>{docket.buyer_license || 'APMC-LIC'}</code>
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: '#f1f5f9', color: '#334155' }}>
                          {docket.category || docket.issue_type || 'Dispute'}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                          {docket.crop_variety || docket.crop_name} ({docket.quantity_qtl || 100} Qtls)
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 900, color: '#b91c1c', fontSize: '0.92rem' }}>
                          ₹{docketAmount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>
                          Locked in SBI Escrow
                        </div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        {isResolved ? (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={12} />
                            <span>Decree Issued</span>
                          </span>
                        ) : isEscalated ? (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Scale size={12} />
                            <span>Escalated to Tribunal</span>
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{
                              fontSize: '0.72rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999,
                              background: (docket.sla_hours_remaining || 24) <= 24 ? '#fee2e2' : '#fef3c7',
                              color: (docket.sla_hours_remaining || 24) <= 24 ? '#dc2626' : '#d97706',
                              display: 'inline-block'
                            }}>
                              ⏱️ {docket.sla_hours_remaining ?? 24}h to statutory limit
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                              Mandate: APMC 48h SLA
                            </span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDocket(docket);
                          }}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: isResolved ? '#15803d' : isEscalated ? '#b45309' : '#be123c',
                            color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: 6,
                            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Scale size={13} />
                          <span>{isResolved ? 'Inspect Decree' : isEscalated ? 'View Dossier' : 'Adjudicate'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ARBITRATION WORKBENCH MODAL */}
      {/* ========================================================================= */}
      {activeDocket && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 1080, maxHeight: '94vh',
            display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', overflow: 'hidden'
          }}>
            
            {/* Header */}
            <div style={{
              background: '#0f172a', color: '#ffffff', padding: '18px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                    Docket #{activeDocket.docket_id || activeDocket.ticket_code || activeDocket.id}
                  </span>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999,
                    background: activeDocket.status === 'RESOLVED' ? '#10b981' : activeDocket.status === 'ESCALATED' ? '#f59e0b' : '#f43f5e',
                    color: '#ffffff'
                  }}>
                    {activeDocket.status}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                    Sec 31-B Statutory Arbitration
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 3 }}>
                  <strong>{activeDocket.farmer_name || 'Cultivator'}</strong> (Cultivator) ↔ <strong>{activeDocket.buyer_firm || activeDocket.buyer_name || 'Buyer'}</strong> (Buyer) • Disputed Escrow: <span style={{ color: '#f87171', fontWeight: 800 }}>₹{(activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeDocket.status === 'RESOLVED' && (
                  <button
                    onClick={() => setShowPrintModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)', color: '#ffffff', padding: '6px 14px', borderRadius: 6,
                      fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    <Printer size={14} />
                    <span>Print Official Decree</span>
                  </button>
                )}

                <button
                  onClick={handleCloseModal}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 6 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Workbench Navigation Tabs */}
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', gap: 16, overflowX: 'auto' }}>
              {[
                { id: 'overview', label: '1. Facts & Claims' },
                { id: 'weighbridge', label: '2. Weighbridge Comparison' },
                { id: 'evidence', label: `3. Evidence Gallery (${(activeDocket.evidence || []).length})` },
                { id: 'timeline', label: '4. Case Timeline' },
                { id: 'notes', label: `5. Magistrate Notes (${(activeDocket.internal_notes || []).length})` },
                { id: 'decree', label: activeDocket.status === 'RESOLVED' ? '⚖️ Issued Decree' : activeDocket.status === 'ESCALATED' ? '⚖️ Tribunal Dossier' : '⚖️ Issue Statutory Decree' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setWorkbenchTab(tab.id)}
                  style={{
                    padding: '12px 6px', fontSize: '0.82rem',
                    fontWeight: workbenchTab === tab.id ? 800 : 600,
                    color: workbenchTab === tab.id ? '#be123c' : '#64748b',
                    borderBottom: workbenchTab === tab.id ? '3px solid #be123c' : '3px solid transparent',
                    background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {/* TAB 1: FACTS & CLAIMS */}
              {workbenchTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>COMMODITY LOT</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: 3 }}>
                        {activeDocket.crop_variety || activeDocket.crop_name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        Lot #{activeDocket.lot_id || activeDocket.lot_code} • {((activeDocket.quantity_qtl || 100) * 0.1).toFixed(1)} Tons ({activeDocket.quantity_qtl || 100} Qtl)
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>CONTRACT PRICE</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: 3 }}>
                        ₹{((activeDocket.contracted_price_per_qtl || 0) * 10).toLocaleString('en-IN')} / Ton <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>(₹{activeDocket.contracted_price_per_qtl || 0}/qtl)</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                        Total Value: ₹{(activeDocket.total_contract_value || 0).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ background: '#fff1f2', padding: 14, borderRadius: 10, border: '1px solid #fecdd3' }}>
                      <div style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 700 }}>DISPUTED ESCROW</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#9f1239', marginTop: 3 }}>
                        ₹{(activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#881337' }}>
                        Escrow ID: <code>{activeDocket.escrow_id || 'SBI-ESC-VAULT'}</code>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{ padding: 18, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#991b1b', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={16} />
                      <span>Farmer Complaint Statement (तक्रारदार निवेदन):</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.6 }}>
                      "{activeDocket.complaint_statement || 'Consignment arrived on time. Full payment escrow withheld unilaterally without lawful joint assay inspection.'}"
                    </p>
                  </div>

                  <div className="panel" style={{ padding: 18, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Building2 size={16} />
                      <span>Buyer Rejection Defense (व्यापारी बाजू):</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                      "{activeDocket.buyer_response_statement || activeDocket.buyer_defense || 'Consignment showed moisture or weight discrepancy at destination yard. Seeking price conciliation before escrow release.'}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: WEIGHBRIDGE COMPARISON */}
              {workbenchTab === 'weighbridge' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {activeDocket.weighbridge_comparison ? (
                    <div className="panel" style={{ padding: 20, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 12 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileSpreadsheet size={18} style={{ color: '#2563eb' }} />
                        <span>APMC Electronic Weighbridge Slip Cross-Verification</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                        {/* Origin Slip */}
                        <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 10, border: '1px solid #bbf7d0' }}>
                          <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.85rem', marginBottom: 10 }}>
                            📍 Origin Mandi: {activeDocket.weighbridge_comparison.origin_slip.weighbridge_name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div>Slip No: <strong>{activeDocket.weighbridge_comparison.origin_slip.slip_no}</strong></div>
                            <div>Recorded Timestamp: <strong>{activeDocket.weighbridge_comparison.origin_slip.timestamp}</strong></div>
                            <div>Gross Weight: <strong>{activeDocket.weighbridge_comparison.origin_slip.gross_kg.toLocaleString('en-IN')} kg</strong></div>
                            <div>Tare Weight: <strong>{activeDocket.weighbridge_comparison.origin_slip.tare_kg.toLocaleString('en-IN')} kg</strong></div>
                            <div style={{ color: '#15803d', fontWeight: 900, fontSize: '0.92rem', marginTop: 4 }}>
                              Net Produce Weight: {activeDocket.weighbridge_comparison.origin_slip.net_kg.toLocaleString('en-IN')} kg
                            </div>
                          </div>
                        </div>

                        {/* Destination Slip */}
                        <div style={{ background: '#fffaf5', padding: 16, borderRadius: 10, border: '1px solid #fed7aa' }}>
                          <div style={{ fontWeight: 800, color: '#c2410c', fontSize: '0.85rem', marginBottom: 10 }}>
                            📍 Destination Mandi: {activeDocket.weighbridge_comparison.destination_slip.weighbridge_name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div>Slip No: <strong>{activeDocket.weighbridge_comparison.destination_slip.slip_no}</strong></div>
                            <div>Recorded Timestamp: <strong>{activeDocket.weighbridge_comparison.destination_slip.timestamp}</strong></div>
                            <div>Gross Weight: <strong>{activeDocket.weighbridge_comparison.destination_slip.gross_kg.toLocaleString('en-IN')} kg</strong></div>
                            <div>Tare Weight: <strong>{activeDocket.weighbridge_comparison.destination_slip.tare_kg.toLocaleString('en-IN')} kg</strong></div>
                            <div style={{ color: '#c2410c', fontWeight: 900, fontSize: '0.92rem', marginTop: 4 }}>
                              Net Produce Weight: {activeDocket.weighbridge_comparison.destination_slip.net_kg.toLocaleString('en-IN')} kg
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Variance & Legal Assessment */}
                      <div style={{
                        marginTop: 16,
                        background: activeDocket.weighbridge_comparison.is_within_tolerance ? '#eff6ff' : '#fef2f2',
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: activeDocket.weighbridge_comparison.is_within_tolerance ? '1px solid #bfdbfe' : '1px solid #fecaca'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: activeDocket.weighbridge_comparison.is_within_tolerance ? '#1e40af' : '#991b1b' }}>
                              Net Weight Variance: {activeDocket.weighbridge_comparison.variance_kg} kg ({activeDocket.weighbridge_comparison.variance_percent}%)
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: 2 }}>
                              Statutory Permissible Desiccation Tolerance: <strong>{activeDocket.weighbridge_comparison.natural_desiccation_allowed_percent}%</strong> (Maharashtra APMC Act Rule 19)
                            </div>
                          </div>

                          <span style={{
                            padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 900,
                            background: activeDocket.weighbridge_comparison.is_within_tolerance ? '#dcfce7' : '#fee2e2',
                            color: activeDocket.weighbridge_comparison.is_within_tolerance ? '#15803d' : '#b91c1c'
                          }}>
                            {activeDocket.weighbridge_comparison.is_within_tolerance ? '✅ WITHIN STATUTORY TOLERANCE' : '⚠️ EXCEEDS STATUTORY TOLERANCE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                      No separate weighbridge discrepancy reported for this docket.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: EVIDENCE GALLERY & QUALITY ASSAY */}
              {workbenchTab === 'evidence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {activeDocket.quality_assessment && (
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 18, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ShieldCheck size={18} style={{ color: '#16a34a' }} />
                        <span>Pre-Dispatch AI Quality Assay Certification</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: '0.8rem', color: '#334155' }}>
                        <div>Assay Grade: <strong>{activeDocket.quality_assessment.pre_dispatch_ai_grade}</strong></div>
                        <div>NIR Confidence: <strong>{activeDocket.quality_assessment.pre_dispatch_ai_confidence}%</strong></div>
                        <div>Lab Remarks: <em>{activeDocket.quality_assessment.pre_dispatch_lab_notes}</em></div>
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Camera size={16} />
                    <span>Certified Photographic & Documentary Evidence:</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    {(activeDocket.evidence || []).map((item, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ height: 140, background: '#0f172a' }}>
                          <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: 12 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0f172a' }}>{item.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>{item.caption}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CASE TIMELINE */}
              {workbenchTab === 'timeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>
                    Arbitration Conciliation & Dispatch Lifecycle
                  </div>

                  <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid #e2e8f0', marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {(activeDocket.timeline || []).map((tl, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute', left: -31, top: 2,
                          width: 12, height: 12, borderRadius: '50%',
                          background: idx === (activeDocket.timeline || []).length - 1 ? '#be123c' : '#15803d',
                          border: '2px solid #ffffff', boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
                        }} />
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                          {tl.timestamp || tl.time} • {tl.actor}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginTop: 2 }}>
                          {tl.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 2 }}>
                          {tl.description || tl.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PRIVILEGED NOTES */}
              {workbenchTab === 'notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 14px', borderRadius: 8, fontSize: '0.76rem', color: '#92400e' }}>
                    🔒 <strong>Privileged Regulatory Notepad:</strong> Entries recorded here are preserved under statutory conciliation confidentiality (APMC Act Sec 31-B).
                  </div>

                  <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <textarea
                      rows={3}
                      placeholder="Record judicial findings, physical weighbridge inspection remarks, or conciliation settlement notes..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', opacity: !newNoteText.trim() ? 0.6 : 1 }}
                      >
                        <Plus size={14} />
                        <span>Record Note</span>
                      </button>
                    </div>
                  </form>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(activeDocket.internal_notes || []).length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        No internal notes recorded yet for this docket.
                      </div>
                    ) : (
                      (activeDocket.internal_notes || []).map((note) => (
                        <div key={note.id} style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{note.author} ({note.role || 'Magistrate'})</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{note.timestamp}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>{note.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: STATUTORY DECREE OR RESOLUTION */}
              {workbenchTab === 'decree' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {activeDocket.status === 'RESOLVED' ? (
                    <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 12, padding: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <span style={{ background: '#15803d', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4 }}>
                            FINAL BINDING DECREE ISSUED
                          </span>
                          <h3 style={{ margin: '6px 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#14532d' }}>
                            Order #{resolvedDecreeNo}
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowPrintModal(true)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#15803d', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <Printer size={15} />
                          <span>Print Official Gazette Decree</span>
                        </button>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#166534', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div><strong>Act Provision:</strong> {resolvedSection}</div>
                        <div><strong>Magistrate:</strong> {resolvedAuthorizer} ({resolvedDesignation})</div>
                        <div><strong>Award Settlement:</strong> Release <strong>₹{resolvedFarmerAward.toLocaleString('en-IN')}</strong> from Escrow to Cultivator {resolvedBuyerRefund > 0 ? `(₹${resolvedBuyerRefund.toLocaleString('en-IN')} refunded to Buyer)` : ''}.</div>
                        <div><strong>Findings Summary:</strong> {resolvedFindings}</div>
                        <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: 4 }}>Filed on: {resolvedDate}</div>
                      </div>
                    </div>
                  ) : activeDocket.status === 'ESCALATED' ? (
                    <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: 12, padding: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <span style={{ background: '#b45309', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4 }}>
                          DOCKET TRANSFERRED TO APPELLATE TRIBUNAL
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 10px', fontSize: '1.15rem', fontWeight: 900, color: '#92400e' }}>
                        Referral to: {activeDocket.escalation_details?.tribunal || 'State Mandi Appellate Tribunal, Pune'}
                      </h3>
                      <p style={{ margin: '0 0 8px', fontSize: '0.84rem', color: '#78350f' }}>
                        <strong>Grounds for Transfer:</strong> {activeDocket.escalation_details?.reason || 'Complex consignment weighing discrepancy requiring higher arbitral hearing.'}
                      </p>
                      <div style={{ fontSize: '0.74rem', color: '#92400e' }}>
                        Escrow remains under protective lien pending Appellate Tribunal summons.
                      </div>
                    </div>
                  ) : (
                    /* DECREE ISSUANCE FORM */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', padding: '12px 16px', borderRadius: 8, fontSize: '0.8rem', color: '#991b1b' }}>
                        ⚖️ <strong>Authority to Issue Binding Decree:</strong> Under <strong>Maharashtra APMC Act Section 31-B</strong>, this order is binding on the buyer and cultivator, and clears the SBI escrow hold within 24 hours.
                      </div>

                      {/* Directive Option */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 6 }}>Arbitration Directive:</label>
                        <select
                          value={settlementType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettlementType(val);
                            const total = activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0;
                            if (val === 'ORDER_100_PERCENT_ESCROW_FARMER') {
                              setFarmerAward(total);
                              setBuyerRefund(0);
                            } else if (val === 'ORDER_RETURN_TRANSIT_PAYOUT') {
                              setFarmerAward(0);
                              setBuyerRefund(total);
                            }
                          }}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          <option value="ORDER_100_PERCENT_ESCROW_FARMER">Order 100% Escrow Release to Cultivator (Dismiss Buyer Rejection)</option>
                          <option value="COMPROMISE_SPLIT_SETTLEMENT">Conciliation Split Settlement (Partial Quality / Transit Allowance)</option>
                          <option value="ORDER_RETURN_TRANSIT_PAYOUT">Order Produce Return & Refund Escrow to Commercial Buyer</option>
                        </select>
                      </div>

                      {/* Split Presets and Custom Inputs */}
                      {settlementType === 'COMPROMISE_SPLIT_SETTLEMENT' && (
                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Quick Allocation Shortcuts:</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => handleQuickPresetSplit(0.5)}
                                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, background: '#e2e8f0', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                              >
                                50% / 50% Split
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickPresetSplit(0.8)}
                                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, background: '#e2e8f0', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                              >
                                80% Farmer / 20% Buyer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickPresetSplit(0.9)}
                                style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, background: '#e2e8f0', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                              >
                                90% Farmer / 10% Buyer
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#15803d', marginBottom: 4 }}>
                                Award to Cultivator (₹):
                              </label>
                              <input 
                                type="number" 
                                value={farmerAward} 
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setFarmerAward(val);
                                  const total = activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0;
                                  setBuyerRefund(Math.max(0, total - val));
                                }} 
                                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }} 
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#b91c1c', marginBottom: 4 }}>
                                Refund to Buyer (₹):
                              </label>
                              <input 
                                type="number" 
                                value={buyerRefund} 
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setBuyerRefund(val);
                                  const total = activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0;
                                  setFarmerAward(Math.max(0, total - val));
                                }} 
                                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }} 
                              />
                            </div>
                          </div>

                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Total Escrow Pool: ₹{(activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0).toLocaleString('en-IN')} (Allocation: ₹{(Number(farmerAward) + Number(buyerRefund)).toLocaleString('en-IN')})
                          </div>
                        </div>
                      )}

                      {/* Findings & Ground for Award */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 4 }}>Findings & Statutory Ground for Award:</label>
                        <textarea
                          rows={3}
                          placeholder="Analysis of certified weighbridge records and pre-dispatch AI grading report confirms produce specifications with normal transit desiccation. Unilateral rejection dismissed..."
                          value={decreeFindings}
                          onChange={(e) => setDecreeFindings(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none' }}
                        />
                      </div>

                      {/* Action Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => setShowEscalateModal(true)}
                          style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', padding: '9px 16px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Escalate to State Tribunal
                        </button>

                        <button
                          type="button"
                          onClick={handleIssueDecree}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(180deg, #be123c 0%, #9f1239 100%)',
                            color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer',
                            boxShadow: '0 3px 8px rgba(190, 18, 60, 0.3)'
                          }}
                        >
                          <Scale size={16} />
                          <span>Issue Statutory Decree (Sec 31-B)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT OFFICIAL GAZETTED DECREE MODAL */}
      {/* ========================================================================= */}
      {showPrintModal && activeDocket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, maxWidth: 780, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '36px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', fontFamily: 'serif' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a' }}>GOVERNMENT OF MAHARASHTRA</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>DIRECTORATE OF AGRICULTURAL MARKETING & APMC ARBITRATION BENCH</div>
              <div style={{ fontSize: '0.8rem', color: '#475569' }}>Nashik Supervised Division • Problem Statement ID 26132</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, marginTop: 10, color: '#991b1b', textDecoration: 'underline' }}>
                STATUTORY DISPUTE ARBITRATION DECREE (SEC 31-B)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: '0.85rem', marginBottom: 18, borderBottom: '1px dashed #cbd5e1', paddingBottom: 14 }}>
              <div>
                <strong>DOCKET NUMBER:</strong> #{activeDocket.docket_id || activeDocket.ticket_code || activeDocket.id}<br/>
                <strong>PRODUCE LOT:</strong> {activeDocket.lot_id || activeDocket.lot_code || 'LOT-REF'}<br/>
                <strong>ESCROW LIEN:</strong> {activeDocket.escrow_id || 'SBI-ESC-VAULT'}
              </div>
              <div>
                <strong>BENCH:</strong> District APMC Regulatory Magistrate, Nashik<br/>
                <strong>DATE OF ORDER:</strong> {resolvedDate}<br/>
                <strong>DISPUTED SUM:</strong> ₹{(activeDocket.disputed_amount || activeDocket.escrow_locked_amount || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 18 }}>
              <p>
                <strong>IN THE MATTER OF CONCILIATION:</strong><br/>
                <strong>Complainant (Cultivator):</strong> {activeDocket.farmer_name || 'Cultivator'}, {activeDocket.farmer_gut || 'Mandi Node'}.<br/>
                <strong>VERSUS</strong><br/>
                <strong>Respondent (Commercial Buyer):</strong> {activeDocket.buyer_firm || activeDocket.buyer_name || 'Buyer'} (APMC Lic #{activeDocket.buyer_license || 'APMC-LIC'}).
              </p>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#1e293b', marginBottom: 24 }}>
              <p style={{ fontWeight: 700 }}>FINDINGS AND DECRETAL ORDER:</p>
              <p>1. Origin APMC electronic weighbridge slip and pre-dispatch AI grading certificate verify grade compliance with transit desiccation within statutory bounds under Maharashtra APMC Rules.</p>
              <p>2. Findings: {resolvedFindings}</p>
              <p style={{ background: '#f8fafc', padding: 12, borderLeft: '4px solid #0f172a', fontWeight: 700 }}>
                ORDER: It is hereby ordered under Section 31-B of the Maharashtra APMC Act, 1963 that the sum of ₹{resolvedFarmerAward.toLocaleString('en-IN')} held in Escrow #{activeDocket.escrow_id || 'VAULT'} be credited directly to the Complainant Cultivator within 24 hours.
                {resolvedBuyerRefund > 0 ? ` The sum of ₹${resolvedBuyerRefund.toLocaleString('en-IN')} shall be refunded to the respondent commercial buyer.` : ''}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, paddingTop: 20, borderTop: '1px solid #cbd5e1' }}>
              <div style={{ border: '2px solid #15803d', padding: '6px 14px', borderRadius: 8, color: '#15803d', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Digitally Signed & Sealed<br/>APMC Regulatory Magistrate
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem' }}>
                <strong>{resolvedAuthorizer}</strong><br/>
                {resolvedDesignation}<br/>
                Govt. of Maharashtra (#MH-GOV-9142)
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
              <button onClick={() => setShowPrintModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                Close
              </button>
              <button onClick={() => window.print()} style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Printer size={15} />
                <span>Print PDF Decree</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRANSFER TO APPELLATE TRIBUNAL MODAL */}
      {/* ========================================================================= */}
      {showEscalateModal && activeDocket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#ffffff', borderRadius: 12, maxWidth: 480, width: '100%', padding: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#b45309' }}>
              Transfer Docket to Higher Judicial Tribunal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Select Tribunal Body:</label>
                <select value={escalateTribunal} onChange={(e) => setEscalateTribunal(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}>
                  <option value="State Mandi Appellate Tribunal, Pune">State Mandi Appellate Tribunal, Pune</option>
                  <option value="State Consumer Disputes Redressal Commission, Mumbai">State Consumer Disputes Redressal Commission, Mumbai</option>
                  <option value="District APMC Joint Conciliation Panel, Nashik">District APMC Joint Conciliation Panel, Nashik</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Grounds for Escalation:</label>
                <textarea rows={3} value={escalateReason} onChange={(e) => setEscalateReason(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowEscalateModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '7px 14px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleConfirmEscalate} style={{ background: '#b45309', color: '#ffffff', border: 'none', padding: '7px 18px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                Transfer Docket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
