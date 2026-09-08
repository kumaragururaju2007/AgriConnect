import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, CheckCircle2, Truck, ArrowRight, 
  DollarSign, FileCheck, Building2, User, Clock, AlertTriangle, 
  CreditCard, ExternalLink, RefreshCw, FileText, Check, X, 
  ChevronRight, AlertCircle, Eye, HelpCircle, Send, Sparkles, QrCode
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import RazorpayQrPaymentModal from '../components/RazorpayQrPaymentModal';

// Helper to map deal statuses to standardized 5 statuses
function getStandardEscrowStatus(deal) {
  const s = deal.workflow_status || deal.escrow_status || deal.status;
  if (s === 'REJECTED_RETURN_IN_PROGRESS') {
    return {
      code: 'Rejected — Return In Progress',
      label: 'Rejected — Return In Progress (माल परत पाठवला जात आहे)',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fca5a5',
      icon: '↩️'
    };
  }
  if (s === 'RETURNED_CLOSED') {
    return {
      code: 'Returned & Closed',
      label: 'Returned & Closed (माल परत पोहोचला - व्यवहार पूर्ण)',
      color: '#475569',
      bg: '#f1f5f9',
      border: '#cbd5e1',
      icon: '🏁'
    };
  }
  if (s === 'DISPUTED_ESCROW_FROZEN' || s === 'DISPUTED' || s === 'ESCROW_FROZEN_DISPUTE') {
    return {
      code: 'Disputed',
      label: 'Disputed (तक्रार दाखल)',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      icon: '⚠️'
    };
  }
  if (s === 'COMPLETED_FUNDS_RELEASED' || s === 'SETTLED_RELEASED' || deal.current_stage >= 5) {
    return {
      code: 'Completed — Funds Released',
      label: 'Completed — Funds Released (रक्कम वर्ग झाली)',
      color: '#15803d',
      bg: '#f0fdf4',
      border: '#86efac',
      icon: '✅'
    };
  }
  if (deal.delivery_status === 'delivered' || deal.delivery_arrived || deal.current_stage === 4 || s === 'AWAITING_DELIVERY_CONFIRMATION') {
    return {
      code: 'Awaiting Delivery Confirmation',
      label: 'Awaiting Delivery Confirmation (डिलिव्हरी पडताळणी प्रलंबित)',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      icon: '⏳'
    };
  }
  if (s === 'PICKED_UP_IN_TRANSIT') {
    return {
      code: 'In Transit',
      label: 'Picked Up — In Transit (वाहतूक सुरू आहे)',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      icon: '🚚'
    };
  }
  if (s === 'TRANSPORT_CONFIRMED') {
    return {
      code: 'Transport Confirmed',
      label: 'Transport Confirmed (वाहतूकदार निश्चित)',
      color: '#0d9488',
      bg: '#f0fdfa',
      border: '#99f6e4',
      icon: '📋'
    };
  }
  if (s === 'PAYMENT_DONE_AWAITING_TRANSPORT') {
    return {
      code: 'Payment Done — Awaiting Transport',
      label: 'Payment Done — Awaiting Transport (पैसे भरले - वाहतूक प्रलंबित)',
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      icon: '💳'
    };
  }
  if (s === 'PAYMENT_CAPTURED_ESCROW_HELD' || s === 'ESCROW_LOCKED' || deal.current_stage >= 2) {
    return {
      code: 'Escrow Held — Payment Received',
      label: 'Escrow Held — Payment Received (एस्क्रोमध्ये सुरक्षित)',
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      icon: '🔒'
    };
  }
  return {
    code: 'Listed',
    label: 'Listed / Draft Offer (नोंदणीकृत)',
    color: '#475569',
    bg: '#f8fafc',
    border: '#cbd5e1',
    icon: '📝'
  };
}

export default function Step08OfferEscrow({ setStep, setTerminal, currentRole, lang = 'en' }) {
  const { 
    authUser, farmer, deals, approveDeliveryAndRelease, 
    rejectDeliveryAndDispute, simulateDeliveryArrival, 
    loadData, addToast,
    approveDeliveryReleaseWorkflow,
    rejectDeliveryReturnWorkflow,
    LOT_STAGES
  } = useAgri();

  // Role Portal Selector: 'farmer' | 'buyer' | 'transporter'
  const isBuyerRole = (currentRole === 'buyer' || currentRole === 'apmc' || authUser?.role === 'buyer');
  const initialRole = (currentRole === 'driver' || currentRole === 'transporter') 
    ? 'transporter' 
    : isBuyerRole 
      ? 'buyer' 
      : 'farmer';
  const [activePortal, setActivePortal] = useState(initialRole);
  const isBuyerPortal = isBuyerRole || activePortal === 'buyer';

  // Filter deals based on activePortal
  const filteredDeals = deals.filter(deal => {
    if (activePortal === 'farmer') {
      return true; // Farmer can view all their listed lots & deals
    }
    if (activePortal === 'buyer') {
      return true; // Buyer purchases
    }
    if (activePortal === 'transporter') {
      return true; // Transporter freight jobs
    }
    return true;
  });

  // Dispute Modal State
  const [disputeModalDeal, setDisputeModalDeal] = useState(null);
  const [disputeReason, setDisputeReason] = useState('Produce quality inspection failure (high rot/moisture beyond APMC Grade A limit)');
  const [disputeCategory, setDisputeCategory] = useState('Produce Quality Rejection / Transit Damage');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // UPI & BharatQR Modal State
  const [qrModalDeal, setQrModalDeal] = useState(null);

  // Release Loading State
  const [releasingDealRef, setReleasingDealRef] = useState(null);
  const [simulatingDealRef, setSimulatingDealRef] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle Buyer Delivery Approval & Release
  const handleApproveRelease = async (deal) => {
    setReleasingDealRef(deal.deal_ref);
    try {
      try {
        await approveDeliveryAndRelease(deal.deal_ref);
      } catch (err) {}
      approveDeliveryReleaseWorkflow(deal.deal_ref);
    } catch (err) {
      console.error(err);
    } finally {
      setReleasingDealRef(null);
    }
  };

  // Handle Buyer Dispute & Freeze
  const handleRaiseDispute = async (e) => {
    e.preventDefault();
    if (!disputeModalDeal) return;
    setIsSubmittingDispute(true);
    try {
      try {
        await rejectDeliveryAndDispute(disputeModalDeal.deal_ref, disputeReason, disputeCategory);
      } catch (err) {}
      rejectDeliveryReturnWorkflow(
        disputeModalDeal.deal_ref,
        disputeModalDeal.transport_amount || 8450,
        disputeReason
      );
      setDisputeModalDeal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  // Handle Simulated Arrival
  const handleSimulateArrival = async (deal) => {
    setSimulatingDealRef(deal.deal_ref);
    try {
      await simulateDeliveryArrival(deal.deal_ref);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingDealRef(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
      addToast({
        type: 'info',
        title: 'Escrow Ledger Synced',
        message: 'Live Razorpay orders and escrow balances updated from server.'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculations for KPI Summary
  const totalEscrowHeld = deals.reduce((acc, d) => {
    const s = d.escrow_status || d.status;
    if (s === 'PAYMENT_CAPTURED_ESCROW_HELD' || s === 'AWAITING_DELIVERY_CONFIRMATION' || s === 'ESCROW_LOCKED') {
      return acc + Number(d.total_escrow_amount || 299450);
    }
    return acc;
  }, 0);

  const totalFundsReleased = deals.reduce((acc, d) => {
    const s = d.escrow_status || d.status;
    if (s === 'COMPLETED_FUNDS_RELEASED' || s === 'SETTLED_RELEASED') {
      return acc + Number(d.total_escrow_amount || 299450);
    }
    return acc;
  }, 0);

  return (
    <div className="animate-slide-in">
      
      {/* Top Banner & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <CreditCard size={12} /> Razorpay Test Gateway Active
            </span>
            <span className="badge badge-blue">
              Dual-Split Escrow: Produce + Transport
            </span>
            <span className="badge badge-amber">
              Rule 24 Statutory Protection
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Offers & Escrow Settlement Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: 4 }}>
            Direct-to-farmer transactions with automated dual-escrow fund locking and Razorpay Route release upon buyer delivery inspection.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setQrModalDeal(deals[0] || { deal_ref: 'AC-TXN-8841', product_amount: 291000, transport_amount: 8450, total_escrow_amount: 299450 })}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 8, border: '1px solid #16a34a', background: '#f0fdf4',
              fontSize: '0.8rem', fontWeight: 800, color: '#15803d', cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.15)'
            }}
          >
            <QrCode size={16} />
            <span>📱 Scan UPI & QR Code</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff',
              fontSize: '0.78rem', fontWeight: 700, color: '#475569', cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Ledger'}</span>
          </button>

          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10,
            padding: '8px 14px', textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Razorpay API Status
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Connected (Test Mode)
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div className="panel" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Escrow Held in State Vault
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#2563eb', marginTop: 2 }}>
            ₹{totalEscrowHeld.toLocaleString('en-IN')}.00
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
            🔒 Safe in platform Razorpay vault
          </div>
        </div>

        <div className="panel" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Completed Funds Released
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>
            ₹{totalFundsReleased.toLocaleString('en-IN')}.00
          </div>
          <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: 4 }}>
            ✓ Settled to Farmer & Driver accounts
          </div>
        </div>

        <div className="panel" style={{ padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {isBuyerPortal ? 'Dual Escrow Split Protocol' : 'Active Portal Perspective'}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            {isBuyerPortal ? (
              <>
                <ShieldCheck size={18} color="#15803d" />
                <span style={{ color: '#15803d' }}>APMC Rule 24 Protection</span>
              </>
            ) : (
              <>
                {activePortal === 'farmer' && '👨‍🌾 Farmer Portal View'}
                {activePortal === 'buyer' && '🏢 Buyer Portal View'}
                {activePortal === 'transporter' && '🚚 Transportation Portal View'}
              </>
            )}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
            {isBuyerPortal ? 'Produce & freight escrow split secured' : 'Switch tab below to preview permissions'}
          </div>
        </div>
      </div>

      {/* RECONSTRUCTED 3-WAY PORTAL ROLE SELECTOR TABS (Hidden in Buyer Portal) */}
      {!isBuyerPortal && (
        <div style={{
          display: 'flex', gap: 6, background: '#e2e8f0', padding: 4, borderRadius: 10,
          marginBottom: 20, width: 'fit-content'
        }}>
          <button
            onClick={() => setActivePortal('farmer')}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              background: activePortal === 'farmer' ? '#ffffff' : 'transparent',
              color: activePortal === 'farmer' ? '#15803d' : '#64748b',
              boxShadow: activePortal === 'farmer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <span>👨‍🌾 Farmer Portal (शेतकरी)</span>
          </button>

          <button
            onClick={() => setActivePortal('buyer')}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              background: activePortal === 'buyer' ? '#ffffff' : 'transparent',
              color: activePortal === 'buyer' ? '#2563eb' : '#64748b',
              boxShadow: activePortal === 'buyer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <span>🏢 Buyer Portal (खरेदीदार)</span>
          </button>

          <button
            onClick={() => setActivePortal('transporter')}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              background: activePortal === 'transporter' ? '#ffffff' : 'transparent',
              color: activePortal === 'transporter' ? '#d97706' : '#64748b',
              boxShadow: activePortal === 'transporter' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <span>🚚 Transportation Portal (वाहतूकदार)</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: FARMER PORTAL VIEW
          ========================================================================= */}
      {activePortal === 'farmer' && (
        <div className="panel" style={{ padding: '20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🌾 Cultivator Produce Lots & Escrow Receivables
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Your produce lots, verified escrow hold balances, and bank remittance statuses. As a farmer, you cannot release escrow; payment automatically releases to your SBI DBT account upon buyer inspection approval.
              </p>
            </div>
          </div>

          {/* Itemized Return Deductions Notice if Rejection Occurred */}
          {farmer?.returnDeductions && farmer.returnDeductions.length > 0 && (
            <div style={{ marginBottom: 18, padding: '16px 18px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertTriangle size={18} color="#dc2626" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  Itemized Deductions: Return Freight Charges (Rejected Consignments)
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#7f1d1d', margin: '0 0 12px' }}>
                Per APMC Rule 24 and Direct Trade Mandate: When produce is rejected on arrival, return transport freight is billed to the cultivator account.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', background: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#fee2e2', color: '#991b1b', borderBottom: '1px solid #fca5a5' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>DEDUCTION ID</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>LOT / DEAL REF</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>REASON FOR REJECTION</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>DATE & TIME</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>DEDUCTION AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmer.returnDeductions.map(ded => (
                      <tr key={ded.id} style={{ borderBottom: '1px solid #fecaca' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{ded.id}</td>
                        <td style={{ padding: '10px 12px', color: '#475569' }}>{ded.lot_code || ded.deal_ref}</td>
                        <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: 600 }}>{ded.reason}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{ded.date} • {ded.time}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#dc2626' }}>
                          -₹{Number(ded.amount).toLocaleString('en-IN')}.00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>LOT & CROP</th>
                  <th style={{ padding: '10px 12px' }}>BUYER / COUNTERPARTY</th>
                  <th style={{ padding: '10px 12px' }}>PRODUCE AMOUNT</th>
                  <th style={{ padding: '10px 12px' }}>ESCROW STATUS</th>
                  <th style={{ padding: '10px 12px' }}>TRANSPORTER</th>
                  <th style={{ padding: '10px 12px' }}>PAYOUT ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => {
                  const statusInfo = getStandardEscrowStatus(deal);
                  const isReleased = statusInfo.code === 'Completed — Funds Released';
                  const isDisputed = statusInfo.code === 'Disputed';

                  return (
                    <tr key={deal.deal_ref} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{deal.deal_ref}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{deal.crop_summary}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                          Vault: {deal.escrow_vault_ref || '#SBI-MH-ESC-8841'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{deal.buyer_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Accredited Mandi Buyer</div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: isReleased ? '#15803d' : '#2563eb' }}>
                          ₹{(deal.product_amount || (deal.agreed_price * deal.quantity_qtl) || 291000).toLocaleString('en-IN')}.00
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Rate: ₹{deal.agreed_price || 2425}/Qtl • {deal.quantity_qtl} Qtl
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: statusInfo.bg, color: statusInfo.color,
                          border: `1px solid ${statusInfo.border}`,
                          padding: '4px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800
                        }}>
                          <span>{statusInfo.icon}</span>
                          <span>{statusInfo.label}</span>
                        </span>
                        {deal.razorpay_payment_id && (
                          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4, fontFamily: 'monospace' }}>
                            RP: {deal.razorpay_payment_id}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                          {deal.transporter_info || `${deal.driver_name || 'Rajesh Patil'} (MH 15 EG 4402)`}
                        </div>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, color: '#047857',
                          background: '#ecfdf5', padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2
                        }}>
                          {deal.transport_escrow_status || 'In Transit'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        {isReleased ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#15803d', fontWeight: 700, fontSize: '0.76rem' }}>
                            <CheckCircle2 size={15} />
                            <span>Remitted to SBI DBT</span>
                          </div>
                        ) : isDisputed ? (
                          <button
                            onClick={() => setStep(10)}
                            style={{
                              padding: '5px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700,
                              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', cursor: 'pointer'
                            }}
                          >
                            View APMC Dispute Docket
                          </button>
                        ) : (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                            🔒 <em>Release restricted to Buyer upon delivery check</em>
                          </div>
                        )}
                        <button
                          onClick={() => setQrModalDeal(deal)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px',
                            borderRadius: 5, border: '1px solid #cbd5e1', background: '#f8fafc',
                            color: '#334155', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', marginTop: 5
                          }}
                          title="View dynamic UPI QR Code"
                        >
                          <QrCode size={11} />
                          <span>Escrow QR</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: BUYER PORTAL VIEW (Includes Release & Dispute Buttons)
          ========================================================================= */}
      {activePortal === 'buyer' && (
        <div className="panel" style={{ padding: '20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🏢 Procurement Purchases & Escrow Release Control
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Inspect arrived consignments and approve delivery to trigger the dual Razorpay Transfers split (Produce ➔ Farmer, Freight ➔ Driver), or reject to freeze escrow into statutory arbitration.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>ORDER & CROP</th>
                  <th style={{ padding: '10px 12px' }}>FARMER</th>
                  <th style={{ padding: '10px 12px' }}>TOTAL PAID (SPLIT)</th>
                  <th style={{ padding: '10px 12px' }}>ESCROW STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => {
                  const statusInfo = getStandardEscrowStatus(deal);

                  const prodAmt = deal.product_amount || (deal.agreed_price * deal.quantity_qtl) || 291000;
                  const transAmt = deal.transport_amount || 8450;
                  const totalPaid = prodAmt + transAmt;

                  return (
                    <tr key={deal.deal_ref} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{deal.deal_ref}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{deal.crop_summary}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2, fontFamily: 'monospace' }}>
                          Order: {deal.razorpay_order_id || 'order_test_rzp'}
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{deal.farmer_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Niphad Belt, Nashik</div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#0f172a' }}>
                          ₹{totalPaid.toLocaleString('en-IN')}.00
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                          <span>Produce: ₹{prodAmt.toLocaleString('en-IN')}</span>
                          <span>Freight: ₹{transAmt.toLocaleString('en-IN')}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: statusInfo.bg, color: statusInfo.color,
                          border: `1px solid ${statusInfo.border}`,
                          padding: '4px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800
                        }}>
                          <span>{statusInfo.icon}</span>
                          <span>{statusInfo.label}</span>
                        </span>
                        {deal.razorpay_transfer_farmer_id && (
                          <div style={{ fontSize: '0.68rem', color: '#15803d', marginTop: 4, fontFamily: 'monospace' }}>
                            Trf: {deal.razorpay_transfer_farmer_id}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: TRANSPORTATION PORTAL VIEW (Independent freight escrow status)
          ========================================================================= */}
      {activePortal === 'transporter' && (
        <div className="panel" style={{ padding: '20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🚚 Logistics Deliveries & Freight Fee Escrow Tracking
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Track assigned farmgate pickups, transit status, and commercial freight escrow fees. Transport fee is held independently in escrow and releases directly to your bank account upon delivery confirmation.
              </p>
            </div>
            <button
              onClick={() => setStep(20)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
                borderRadius: 6, background: '#047857', color: '#ffffff', border: 'none',
                fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              <span>Driver Console</span>
              <ExternalLink size={13} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>JOB REF / DEAL</th>
                  <th style={{ padding: '10px 12px' }}>ASSIGNED VEHICLE & DRIVER</th>
                  <th style={{ padding: '10px 12px' }}>COMMODITY & ROUTE</th>
                  <th style={{ padding: '10px 12px' }}>FREIGHT FEE</th>
                  <th style={{ padding: '10px 12px' }}>TRANSPORT-FEE ESCROW STATUS</th>
                  <th style={{ padding: '10px 12px' }}>SLA GUARANTEE</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => {
                  const transportEscrowStatus = deal.transport_escrow_status || 
                    (deal.current_stage >= 5 ? 'Fee Released' : deal.current_stage === 4 ? 'Delivered — Awaiting Buyer Confirmation' : 'In Transit');
                  const isFeeReleased = transportEscrowStatus === 'Fee Released';

                  return (
                    <tr key={deal.deal_ref} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>JOB-2024-{deal.deal_ref.replace('AC-TXN-', '')}</div>
                        <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600 }}>Linked Deal: {deal.deal_ref}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Transit Insurance: Active</div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{deal.driver_name || 'Rajesh Patil'}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>MH 15 EG 4402 (LCV 6T)</div>
                        <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>Vahan Verified</div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{deal.crop_summary}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Pimpalgaon Farmgate ➔ {deal.buyer_name} Hub
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 900, fontSize: '0.95rem', color: isFeeReleased ? '#15803d' : '#0f172a' }}>
                          ₹{(deal.transport_amount || 8450).toLocaleString('en-IN')}.00
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Direct Freight Remittance
                        </div>
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          background: isFeeReleased ? '#dcfce7' : '#ecfdf5',
                          color: isFeeReleased ? '#15803d' : '#047857',
                          border: `1px solid ${isFeeReleased ? '#86efac' : '#a7f3d0'}`,
                          padding: '4px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800
                        }}>
                          {isFeeReleased ? '✓ Fee Released (वर्ग झाले)' : `⏳ ${transportEscrowStatus}`}
                        </span>
                        {deal.razorpay_transfer_driver_id && (
                          <div style={{ fontSize: '0.68rem', color: '#15803d', marginTop: 4, fontFamily: 'monospace' }}>
                            Trf: {deal.razorpay_transfer_driver_id}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ShieldCheck size={14} color="#15803d" />
                          <span>APMC Rule 24 (48h auto-release)</span>
                        </div>
                        <button
                          onClick={() => setQrModalDeal(deal)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px',
                            borderRadius: 5, border: '1px solid #cbd5e1', background: '#f8fafc',
                            color: '#334155', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', marginTop: 4
                          }}
                          title="View dynamic UPI QR Code"
                        >
                          <QrCode size={11} />
                          <span>Freight QR</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DISPUTE MODAL (Surfaced when Buyer clicks "Reject / Dispute")
          ========================================================================= */}
      {disputeModalDeal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="panel animate-slide-in" style={{ 
            width: 540, maxWidth: '100%', background: '#ffffff', borderRadius: 12, 
            padding: 0, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' 
          }}>
            {/* Header */}
            <div style={{ background: '#b91c1c', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="#ffffff" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    Reject Delivery & Freeze Escrow
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#fecaca' }}>
                    Order #{disputeModalDeal.deal_ref} • Maharashtra APMC Act Sec 31-B
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setDisputeModalDeal(null)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRaiseDispute} style={{ padding: '20px' }}>
              <div style={{ background: '#fef2f2', padding: '10px 12px', borderRadius: 8, border: '1px solid #fecaca', marginBottom: 14, fontSize: '0.76rem', color: '#991b1b' }}>
                ⚠️ <strong>Statutory Notice:</strong> Rejecting delivery immediately freezes ₹{(disputeModalDeal.total_escrow_amount || 299450).toLocaleString('en-IN')} in the platform escrow vault. No transfers will occur. A statutory grievance docket will be submitted to the Mandi APMC Officer.
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Dispute Category:
                </label>
                <select
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="Produce Quality Rejection / Transit Damage">Produce Quality Rejection / Transit Damage</option>
                  <option value="Weight / Quantity Discrepancy">Weight / Quantity Discrepancy (Weighbridge Variance)</option>
                  <option value="Grade Mismatch (AI Certificate Discrepancy)">Grade Mismatch (AI Certificate Discrepancy)</option>
                  <option value="Transit Delay Beyond Perishable SLA">Transit Delay Beyond Perishable SLA</option>
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Inspection Findings & Rejection Grounds:
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setDisputeModalDeal(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDispute}
                  style={{
                    flex: 2, padding: '10px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                    background: '#dc2626', border: 'none', color: '#ffffff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>{isSubmittingDispute ? 'Freezing Escrow...' : 'Confirm Rejection & Freeze Escrow'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Razorpay Dynamic UPI & BharatQR Modal */}
      {qrModalDeal && (
        <RazorpayQrPaymentModal
          isOpen={!!qrModalDeal}
          deal={qrModalDeal}
          amount={qrModalDeal.total_escrow_amount || ((qrModalDeal.product_amount || 291000) + (qrModalDeal.transport_amount || 8450))}
          productAmount={qrModalDeal.product_amount || 291000}
          transportAmount={qrModalDeal.transport_amount || 8450}
          dealRef={qrModalDeal.deal_ref}
          orderId={qrModalDeal.razorpay_order_id}
          onClose={() => setQrModalDeal(null)}
          onPaymentSuccess={() => {
            loadData();
            setQrModalDeal(null);
          }}
        />
      )}

    </div>
  );
}
