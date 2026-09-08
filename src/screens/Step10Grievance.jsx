import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Clock, ShieldCheck, CheckCircle2, FileText, 
  ArrowRight, UploadCloud, UserCheck, Lock, AlertCircle, Database,
  Camera, Check, X, Building2, Scale, ExternalLink, HelpCircle,
  Eye, RefreshCw, ChevronRight, User, ShieldAlert
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';

const GRIEVANCE_CATEGORIES = [
  'Weight/Quantity Discrepancy',
  'Quality Grade Dispute',
  'Payment Delay',
  'Non-Delivery',
  'Transit Damage',
  'Process/Certificate Delay',
  'Other'
];

const PHOTO_MANDATORY_CATEGORIES = [
  'Quality Grade Dispute',
  'Transit Damage',
  'Weight/Quantity Discrepancy'
];

export default function Step10Grievance({ setStep }) {
  const { authUser, grievances, submitGrievance, deals, addToast } = useAgri();

  const isBuyer = authUser?.role === 'buyer';
  const isDriver = authUser?.role === 'driver';
  const isFarmer = authUser?.role === 'farmer' || (!isBuyer && !isDriver);

  const currentUserName = authUser?.user?.name || (isFarmer ? 'Santosh Shinde' : isBuyer ? 'AgroFresh Supply Chain Pvt Ltd' : 'Rajesh Patil');
  const currentUserRole = authUser?.role || 'farmer';

  // Filter available deals for the logged-in user
  const userDeals = (deals && deals.length > 0 ? deals : [
    {
      id: 1,
      deal_ref: 'AC-TXN-8841',
      buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
      farmer_name: 'Santosh Shinde',
      crop_summary: 'Lot #LOT-2024-0941 (120 Qtl Grade-A Red Onion)',
      total_escrow_amount: 291000,
      status: 'ESCROW_LOCKED'
    },
    {
      id: 2,
      deal_ref: 'AC-TXN-8890',
      buyer_name: 'Sahyadri Farmer Producer Co',
      farmer_name: 'Santosh Shinde',
      crop_summary: 'Lot #LOT-2024-0812 (45 Qtl Yellow Soyabean JS-335)',
      total_escrow_amount: 216000,
      status: 'ESCROW_LOCKED'
    },
    {
      id: 3,
      deal_ref: 'AC-TXN-9021',
      buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
      farmer_name: 'Santosh Shinde',
      crop_summary: 'Lot #LOT-2024-0610 (80 Qtl Export Thompson Seedless Grapes)',
      total_escrow_amount: 596000,
      status: 'ESCROW_LOCKED'
    }
  ]).filter(d => {
    if (!authUser) return true;
    if (isFarmer) {
      return !d.farmer_name || d.farmer_name.toLowerCase().includes('santosh') || d.farmer_name === currentUserName;
    }
    if (isBuyer) {
      return !d.buyer_name || d.buyer_name.toLowerCase().includes('agrofresh') || d.buyer_name === currentUserName;
    }
    return true;
  });

  // Modal / Form state
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [selectedDealRef, setSelectedDealRef] = useState(userDeals[0]?.deal_ref || 'AC-TXN-8841');
  const [category, setCategory] = useState(GRIEVANCE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState('');
  const [evidencePreview, setEvidencePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Tab filter for docket list: 'my' (scoped to user) vs 'all' (statutory oversight)
  const [viewFilter, setViewFilter] = useState('my');

  // Real-time second tick for dynamic SLA countdown
  const [, setClockTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Selected deal details
  const activeDeal = userDeals.find(d => d.deal_ref === selectedDealRef) || userDeals[0] || {
    deal_ref: 'AC-TXN-8841',
    crop_summary: 'Lot #LOT-2024-0941 (120 Qtl Grade-A Red Onion)',
    total_escrow_amount: 291000,
    farmer_name: 'Santosh Shinde',
    buyer_name: 'AgroFresh Supply Chain Pvt Ltd'
  };

  // Automated severity computation
  const computeSeverity = (cat, amount) => {
    const amt = Number(amount) || 0;
    if (cat === 'Non-Delivery' || cat === 'Payment Delay' || amt > 50000) {
      return {
        level: 'HIGH',
        color: '#dc2626',
        badgeClass: 'badge-red',
        explanation: amt > 50000 
          ? `Deal escrow amount ₹${amt.toLocaleString('en-IN')} exceeds ₹50,000 statutory threshold.` 
          : `${cat} triggers priority emergency arbitration under APMC rules.`
      };
    }
    if (cat === 'Weight/Quantity Discrepancy' || cat === 'Transit Damage') {
      return {
        level: 'MEDIUM',
        color: '#d97706',
        badgeClass: 'badge-amber',
        explanation: 'Technical weight/transit discrepancy <= ₹50,000. Joint inspection queued.'
      };
    }
    return {
      level: 'LOW',
      color: '#2563eb',
      badgeClass: 'badge-blue',
      explanation: 'Administrative or certification inquiry. Resolved via digital document verification.'
    };
  };

  const currentSeverity = computeSeverity(category, activeDeal.total_escrow_amount);
  const isPhotoMandatory = PHOTO_MANDATORY_CATEGORIES.includes(category);

  // Counterparty resolution
  const counterpartyName = isFarmer 
    ? (activeDeal.buyer_name || 'AgroFresh Supply Chain Pvt Ltd') 
    : (activeDeal.farmer_name || 'Santosh Shinde');

  // Photo handling
  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePhoto(reader.result);
        setEvidencePreview(reader.result);
        setValidationError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateCamera = () => {
    const samplePhoto = category === 'Transit Damage'
      ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
      : category === 'Quality Grade Dispute'
      ? 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=80';
    setEvidencePhoto(samplePhoto);
    setEvidencePreview(samplePhoto);
    setValidationError('');
  };

  // Form Submission
  const handleFilingSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (isPhotoMandatory && !evidencePhoto) {
      setValidationError(`Photo evidence is MANDATORY for ${category} under APMC statutory filing rules.`);
      return;
    }

    setSubmitting(true);
    try {
      await submitGrievance({
        category,
        description: description || `Statutory dispute filed under APMC Act Sec 31-B regarding ${category.toLowerCase()} for deal ${activeDeal.deal_ref}.`,
        deal_ref: activeDeal.deal_ref,
        farmer_name: activeDeal.farmer_name || 'Santosh Shinde',
        buyer_name: activeDeal.buyer_name || 'AgroFresh Supply Chain Pvt Ltd',
        filer_role: currentUserRole,
        filer_name: currentUserName,
        counterparty_name: counterpartyName,
        escrow_locked_amount: activeDeal.total_escrow_amount || 291000,
        evidence_url: evidencePhoto || null
      });

      setShowFilingModal(false);
      setDescription('');
      setEvidencePhoto('');
      setEvidencePreview('');
    } catch (err) {
      console.error('Failed to submit grievance:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter grievances based on user role and view toggle
  const filteredGrievances = grievances.filter(g => {
    if (viewFilter === 'all') return true;
    if (!authUser) return true;
    const nameLower = currentUserName.toLowerCase();
    const gFiler = (g.filer_name || '').toLowerCase();
    const gCounter = (g.counterparty_name || '').toLowerCase();
    const gFarmer = (g.farmer_name || '').toLowerCase();
    const gBuyer = (g.buyer_name || '').toLowerCase();

    if (isFarmer) {
      return gFiler.includes('santosh') || gCounter.includes('santosh') || gFarmer.includes('santosh') || !g.farmer_name;
    }
    if (isBuyer) {
      return gFiler.includes('agrofresh') || gCounter.includes('agrofresh') || gBuyer.includes('agrofresh') || !g.buyer_name;
    }
    return true;
  });

  // Calculate live remaining SLA
  const formatSlaClock = (g) => {
    if (g.status && g.status.toLowerCase().includes('resolved')) {
      return { text: 'Resolved by Decree', isExpired: false, isResolved: true };
    }

    const deadlineMs = g.sla_deadline 
      ? new Date(g.sla_deadline).getTime() 
      : (new Date(g.filed_at || g.created_at || Date.now()).getTime() + 48 * 3600 * 1000);
    
    const remainingMs = deadlineMs - Date.now();

    if (remainingMs <= 0) {
      return { text: 'SLA Expired • Escalated', isExpired: true, isResolved: false };
    }

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return {
      text: `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`,
      isExpired: false,
      isResolved: false
    };
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>
      
      {/* Top Banner & Header */}
      <div className="panel" style={{ 
        padding: '24px 28px', marginBottom: 24, 
        background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 50%, #fff7ed 100%)', 
        border: '1px solid #fecaca', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                <Scale size={13} />
                <span>APMC STATUTORY DISPUTE REDRESSAL CELL</span>
              </span>
              <span className="badge badge-amber">Maharashtra APMC Act Sec 31-B</span>
              <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Database size={11} style={{ color: '#15803d' }} />
                <span>Immutable Escrow Freeze Ledger</span>
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-title)', margin: '0 0 6px' }}>
              Grievance & Arbitration Dossier
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0, maxWidth: 840, lineHeight: 1.5 }}>
              Statutory 48-Hour SLA Guarantee. Filing a complaint immediately freezes the counterparty's linked SBI escrow payout in the State Vault until arbitrated by the District APMC Officer.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              id="file-grievance-btn"
              onClick={() => {
                setShowFilingModal(true);
                setValidationError('');
              }}
              className="btn-primary" 
              style={{ 
                background: '#dc2626', 
                padding: '10px 18px', 
                fontSize: '0.88rem', 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              <ShieldAlert size={16} />
              <span>+ File Dispute Ticket</span>
            </button>
          </div>
        </div>

        {/* User Scope Indicator Bar */}
        <div style={{ 
          marginTop: 18, 
          padding: '10px 14px', 
          background: '#ffffff', 
          borderRadius: 8, 
          border: '1px solid #fed7aa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
            <User size={15} style={{ color: isFarmer ? '#15803d' : '#ea580c' }} />
            <span>Active Filer Identity: <strong style={{ color: '#0f172a' }}>{currentUserName}</strong> ({isFarmer ? 'Registered Farmer' : isBuyer ? 'APMC Licensed Buyer' : 'Accredited Transporter'})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Filter Scope:</span>
            <button
              onClick={() => setViewFilter('my')}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.76rem',
                fontWeight: viewFilter === 'my' ? 700 : 500,
                background: viewFilter === 'my' ? '#dc2626' : '#f1f5f9',
                color: viewFilter === 'my' ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}>
              My Dockets ({grievances.length})
            </button>
            <button
              onClick={() => setViewFilter('all')}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.76rem',
                fontWeight: viewFilter === 'all' ? 700 : 500,
                background: viewFilter === 'all' ? '#0f172a' : '#f1f5f9',
                color: viewFilter === 'all' ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}>
              All APMC Division Dockets
            </button>
          </div>
        </div>
      </div>

      {/* FILING MODAL / POPUP */}
      {showFilingModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(4px)', 
          zIndex: 9999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '16px' 
        }}>
          <div className="panel" style={{ 
            width: '100%', 
            maxWidth: 680, 
            maxHeight: '92vh', 
            overflowY: 'auto', 
            padding: '24px 28px', 
            borderRadius: 14, 
            border: '2px solid #dc2626', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            background: '#ffffff'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="badge badge-red">FORM 7-B • STATUTORY COMPLAINT</span>
                  <span className="badge badge-gray">{currentUserRole.toUpperCase()} FILING</span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                  File Dispute Ticket under APMC Act Sec 31-B
                </h2>
              </div>
              <button 
                onClick={() => setShowFilingModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} style={{ color: '#64748b' }} />
              </button>
            </div>

            {/* Escrow Freeze Warning Banner */}
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: 8, 
              padding: '12px 14px', 
              marginBottom: 18,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10
            }}>
              <AlertTriangle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.8rem', color: '#991b1b', lineHeight: 1.45 }}>
                <strong>Automated State Vault Escrow Freeze Notice:</strong> Submitting this ticket will immediately freeze{' '}
                <strong>₹{(activeDeal.total_escrow_amount || 291000).toLocaleString('en-IN')}</strong> in the State Escrow Vault for deal <strong>#{activeDeal.deal_ref}</strong>. Neither party can disburse funds until an APMC Arbitrator passes decree.
              </div>
            </div>

            {validationError && (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #ef4444', 
                borderRadius: 8, 
                padding: '10px 14px', 
                marginBottom: 16, 
                color: '#b91c1c', 
                fontSize: '0.82rem', 
                fontWeight: 700 
              }}>
                {validationError}
              </div>
            )}

            <form onSubmit={handleFilingSubmit}>
              
              {/* 1. Linked Transaction Selection (Auto-populated dropdown, no manual typing) */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  1. Select Linked Transaction / Deal (Auto-Populated from Past Deals) *
                </label>
                <select 
                  id="grievance-deal-select"
                  value={selectedDealRef}
                  onChange={e => setSelectedDealRef(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    background: '#f8fafc', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: 8, 
                    fontSize: '0.85rem', 
                    color: '#0f172a',
                    fontWeight: 600
                  }}>
                  {userDeals.map(d => (
                    <option key={d.deal_ref} value={d.deal_ref}>
                      {d.deal_ref} • {d.crop_summary || 'Commodity Lot'} • Escrow: ₹{(d.total_escrow_amount || 291000).toLocaleString('en-IN')} ({isFarmer ? `Buyer: ${d.buyer_name}` : `Farmer: ${d.farmer_name}`})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                  Counterparty: <strong>{counterpartyName}</strong> • Frozen Escrow: <strong>₹{(activeDeal.total_escrow_amount || 291000).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* 2. Dispute Category Dropdown */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  2. Grievance Category *
                </label>
                <select 
                  id="grievance-category-select"
                  value={category}
                  onChange={e => {
                    setCategory(e.target.value);
                    setValidationError('');
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    background: '#ffffff', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: 8, 
                    fontSize: '0.85rem', 
                    color: '#0f172a',
                    fontWeight: 600
                  }}>
                  {GRIEVANCE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 3. Severity Auto-Assignment Badge (Not user-selectable) */}
              <div style={{ 
                marginBottom: 18, 
                padding: '12px 14px', 
                background: currentSeverity.level === 'HIGH' ? '#fef2f2' : currentSeverity.level === 'MEDIUM' ? '#fffbeb' : '#eff6ff', 
                borderRadius: 8, 
                border: `1px solid ${currentSeverity.color}40` 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Statutory Severity Auto-Assignment (Sec 31-B Algorithm)
                  </span>
                  <span className={`badge ${currentSeverity.badgeClass}`} style={{ fontWeight: 800, fontSize: '0.74rem' }}>
                    {currentSeverity.level} PRIORITY
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: currentSeverity.color, fontWeight: 600 }}>
                  {currentSeverity.explanation}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>
                  * Severity is system-locked based on statutory loss quantum to prevent arbitrary queue jumping.
                </div>
              </div>

              {/* 4. Mandatory Photo Evidence Upload */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                    3. Photo Evidence {isPhotoMandatory ? <span style={{ color: '#dc2626' }}>* (MANDATORY)</span> : <span style={{ color: '#64748b' }}>(Optional)</span>}
                  </label>
                  <span className={isPhotoMandatory ? 'badge badge-red' : 'badge badge-gray'} style={{ fontSize: '0.7rem' }}>
                    {isPhotoMandatory ? 'MANDATORY PHOTO REQUIRED' : 'OPTIONAL FOR THIS CATEGORY'}
                  </span>
                </div>

                <div style={{ 
                  border: isPhotoMandatory && !evidencePhoto ? '2px dashed #f87171' : '2px dashed #cbd5e1', 
                  borderRadius: 8, 
                  padding: '16px', 
                  background: '#f8fafc',
                  textAlign: 'center'
                }}>
                  {evidencePreview ? (
                    <div>
                      <img 
                        src={evidencePreview} 
                        alt="Dispute evidence preview" 
                        style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 6, marginBottom: 8 }} 
                      />
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        <button 
                          type="button" 
                          onClick={() => { setEvidencePhoto(''); setEvidencePreview(''); }}
                          style={{ padding: '4px 10px', fontSize: '0.74rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, cursor: 'pointer' }}>
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Camera size={28} style={{ color: '#94a3b8', margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: 8 }}>
                        Upload clear photo of weighbridge ticket, damaged bags, or crop discoloration
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <label style={{ 
                          padding: '6px 14px', 
                          background: '#ffffff', 
                          border: '1px solid #cbd5e1', 
                          borderRadius: 6, 
                          fontSize: '0.78rem', 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          <UploadCloud size={14} /> Browse Photo
                          <input type="file" accept="image/*" onChange={handlePhotoFileChange} style={{ display: 'none' }} />
                        </label>
                        <button 
                          type="button"
                          onClick={handleSimulateCamera}
                          style={{ 
                            padding: '6px 14px', 
                            background: '#eff6ff', 
                            border: '1px solid #bfdbfe', 
                            color: '#1d4ed8', 
                            borderRadius: 6, 
                            fontSize: '0.78rem', 
                            fontWeight: 600, 
                            cursor: 'pointer' 
                          }}>
                          Load Sample {category.split(' ')[0]} Evidence
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Detailed Description */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  4. Detailed Grievance Statement *
                </label>
                <textarea 
                  id="grievance-desc-input"
                  rows="3"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Specify weighbridge slip number, arrival timestamp, or discrepancy quantum in detail..."
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    background: '#ffffff', 
                    border: '1.5px solid #cbd5e1', 
                    borderRadius: 8, 
                    fontSize: '0.85rem', 
                    color: '#0f172a' 
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button"
                  onClick={() => setShowFilingModal(false)}
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    background: '#f1f5f9', 
                    border: '1px solid #cbd5e1', 
                    borderRadius: 8, 
                    fontWeight: 600, 
                    fontSize: '0.85rem', 
                    color: '#475569', 
                    cursor: 'pointer' 
                  }}>
                  Cancel
                </button>
                <button 
                  id="submit-grievance-btn"
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary" 
                  style={{ 
                    flex: 2, 
                    background: '#dc2626', 
                    padding: '10px', 
                    fontWeight: 700, 
                    fontSize: '0.85rem', 
                    justifyContent: 'center',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}>
                  {submitting ? 'Registering with APMC Office...' : 'Confirm Filing & Freeze Escrow (48h SLA)'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DOCKETS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredGrievances.length === 0 ? (
          <div className="panel" style={{ padding: '40px 20px', textAlign: 'center', background: '#ffffff' }}>
            <ShieldCheck size={44} style={{ color: '#15803d', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: 6 }}>
              No Active Grievance Dockets for {currentUserName}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: 480, margin: '0 auto 18px' }}>
              All your past crop deliveries and escrow settlements are clear without active disputes.
            </p>
            <button 
              onClick={() => setShowFilingModal(true)}
              className="btn-primary" style={{ background: '#dc2626', fontSize: '0.82rem' }}>
              + File Dispute Ticket
            </button>
          </div>
        ) : (
          filteredGrievances.map((g) => {
            const isResolved = g.status && g.status.toLowerCase().includes('resolved');
            const slaInfo = formatSlaClock(g);
            const severityLevel = (g.priority || 'HIGH').toUpperCase();
            const frozenAmount = g.escrow_locked_amount || 291000;

            return (
              <div 
                key={g.ticket_code || g.ticketId || g.id} 
                className="panel" 
                style={{ 
                  padding: '22px 24px', 
                  borderLeft: isResolved ? '5px solid #15803d' : severityLevel === 'HIGH' ? '5px solid #dc2626' : '5px solid #d97706',
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-title)' }}>
                        Docket #{g.ticket_code || g.ticketId || 'GRV-2024-0419'}
                      </span>
                      <span className={isResolved ? 'badge badge-green' : severityLevel === 'HIGH' ? 'badge badge-red' : 'badge badge-amber'} style={{ fontWeight: 800 }}>
                        {isResolved ? 'RESOLVED' : `${severityLevel} SEVERITY`}
                      </span>
                      <span className="badge badge-gray" style={{ fontWeight: 700 }}>
                        {g.deal_ref || 'AC-TXN-8841'}
                      </span>
                      {g.filer_role && (
                        <span className="badge badge-blue" style={{ textTransform: 'uppercase', fontSize: '0.68rem' }}>
                          Filed by {g.filer_role}
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: '1.05rem', color: isResolved ? '#15803d' : '#991b1b', margin: 0, fontWeight: 800 }}>
                      {g.category}
                    </h3>
                  </div>

                  {/* Statutory SLA Countdown Clock */}
                  <div style={{ 
                    textAlign: 'right', 
                    background: isResolved ? '#ecfdf5' : slaInfo.isExpired ? '#fef2f2' : '#fff7ed', 
                    padding: '10px 16px', 
                    borderRadius: 8, 
                    border: isResolved ? '1px solid #bbf7d0' : slaInfo.isExpired ? '1px solid #fecaca' : '1px solid #fed7aa',
                    minWidth: 200
                  }}>
                    <div style={{ fontSize: '0.68rem', color: isResolved ? '#15803d' : slaInfo.isExpired ? '#991b1b' : '#c2410c', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                      {isResolved ? 'Statutory Disposition' : 'Statutory 48h SLA Clock'}
                    </div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 900, 
                      color: isResolved ? '#15803d' : slaInfo.isExpired ? '#b91c1c' : '#c2410c', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      justifyContent: 'flex-end',
                      marginTop: 2
                    }}>
                      <Clock size={16} /> 
                      <span>{slaInfo.text}</span>
                    </div>
                    {!isResolved && !slaInfo.isExpired && (
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2 }}>
                        Binding Sec 31-B APMC Deadline
                      </div>
                    )}
                  </div>
                </div>

                {/* Grievance Statement */}
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14 }}>
                  {g.description}
                </p>

                {/* Evidence Thumbnail if present */}
                {g.evidence_url && (
                  <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', width: 'fit-content' }}>
                    <Camera size={16} style={{ color: '#64748b' }} />
                    <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>Attached Evidence:</span>
                    <a href={g.evidence_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#2563eb', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
                      View Photo Proof <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Decree Notes if resolved */}
                {g.resolution_notes && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: '0.82rem', color: '#166534' }}>
                    <div style={{ fontWeight: 800, marginBottom: 2 }}>APMC Statutory Officer Decree:</div>
                    <div>{g.resolution_notes}</div>
                  </div>
                )}

                {/* Footer Metadata & Counterparty Details */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid #f1f5f9', 
                  paddingTop: 12, 
                  flexWrap: 'wrap', 
                  gap: 12, 
                  fontSize: '0.82rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>Filer: <strong style={{ color: '#0f172a' }}>{g.filer_name || g.farmer_name || 'Santosh Shinde'}</strong></span>
                    <span>•</span>
                    <span>Counterparty: <strong style={{ color: '#0f172a' }}>{g.counterparty_name || g.buyer_name || 'AgroFresh Supply Chain Pvt Ltd'}</strong></span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lock size={13} style={{ color: '#dc2626' }} />
                      <span>Frozen Escrow: <strong style={{ color: '#dc2626' }}>₹{Number(frozenAmount).toLocaleString('en-IN')}</strong></span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      id={`escalate-grid-btn-${g.ticket_code || '0419'}`}
                      onClick={() => setStep(12)}
                      className="btn-secondary" 
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.78rem', 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                      <Building2 size={14} />
                      <span>Open APMC Officer Grid</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
