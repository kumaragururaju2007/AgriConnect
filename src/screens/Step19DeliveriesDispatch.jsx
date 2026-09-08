import React, { useState } from 'react';
import { 
  Truck, Navigation, ShieldCheck, Phone, CheckCircle2, 
  MapPin, Clock, Camera, AlertCircle, ArrowRight, DollarSign, 
  RefreshCw, Check, User, Package, ExternalLink, Star
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';

export default function Step19DeliveriesDispatch({ setStep, setTerminal, lang = 'en' }) {
  const { 
    authUser, deliveryJobs, deals, confirmPickup, confirmDeliveryReceived, addToast,
    confirmPickupWorkflow, approveDeliveryReleaseWorkflow, rejectDeliveryReturnWorkflow, LOT_STAGES 
  } = useAgri();
  const isBuyer = authUser?.role === 'buyer';
  const isFarmer = authUser?.role === 'farmer' || !isBuyer;

  // Active delivery job
  const activeJob = deliveryJobs.find(j => j.status !== 'COMPLETED') || deliveryJobs[0];

  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [photoProofUrl, setPhotoProofUrl] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80');

  // Farmer Action: Confirm Pickup
  const handleFarmerPickup = async () => {
    setIsProcessingAction(true);
    await confirmPickup(
      activeJob?.id || activeJob?.job_code || 1,
      1,
      'Farmer confirmed loading and tare weighment at farm gate. 120 bags secured.'
    );
    confirmPickupWorkflow(activeJob?.id || activeJob?.job_code || 1);
    setIsProcessingAction(false);
  };

  // Buyer Action: Confirm Delivery Received & Approve
  const handleBuyerConfirmDelivery = async () => {
    setIsProcessingAction(true);
    await confirmDeliveryReceived(
      activeJob?.id || activeJob?.job_code || 1,
      authUser?.user?.name || 'AgroFresh APMC Receiving Supervisor',
      5,
      'All 120 bags received in good condition. Weighed at APMC weighbridge: 12.02 MT.'
    );
    approveDeliveryReleaseWorkflow(activeJob?.deal_ref);
    setIsProcessingAction(false);
  };

  // Buyer Action: Reject Delivery & Send Back
  const handleBuyerRejectDelivery = async () => {
    setIsProcessingAction(true);
    rejectDeliveryReturnWorkflow(
      activeJob?.deal_ref,
      activeJob?.delivery_fee || 8450,
      'Produce quality failed APMC Grade-A standards upon dock inspection'
    );
    setIsProcessingAction(false);
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>
      
      {/* Top Header */}
      <div className="panel" style={{ 
        padding: '24px 28px', marginBottom: 24, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #eff6ff 100%)', 
        border: '1px solid #bbf7d0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                <Truck size={13} />
                <span>STATE ESCROW LOGISTICS & TRANSIT</span>
              </span>
              <span className="badge badge-blue">Vahan Linked Vehicle Tracking</span>
              <span className="badge badge-amber">
                {isBuyer ? '🏢 Buyer Receiving Console' : '👨‍🌾 Farmer Dispatch Console'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-title)', letterSpacing: '-0.02em', margin: 0 }}>
              {isBuyer ? 'Incoming Inbound Deliveries & Acceptance' : 'Deliveries & Farm Gate Dispatch'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4, maxWidth: 900, lineHeight: 1.45 }}>
              {isBuyer
                ? 'Real-time live GPS tracking of consignments arriving at your APMC receiving dock, assayer weighment check, and dual escrow release.'
                : 'आपल्या शेतातून खरेदीदाराकडे जाणारा माल, नियुक्त वाहनचालक (ड्रायव्हर), थेट जीपीएस ट्रॅकिंग आणि सुरक्षित एस्क्रो वितरण व्यवस्था.'}
            </p>
          </div>

          <div style={{ textAlign: 'right', background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: 10 }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Active Shipment Reference</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e40af', marginTop: 2 }}>
              #{activeJob?.job_code || 'JOB-2024-8841'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>Linked Deal: #AC-TXN-8841</div>
          </div>
        </div>
      </div>

      {/* Main Delivery Panel */}
      <div className="panel" style={{ padding: '26px', marginBottom: 24, border: '2px solid #93c5fd', background: '#ffffff' }}>
        
        {/* Header Ribbon of Job */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#1e40af', color: '#fff', padding: '3px 9px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 800 }}>
                {activeJob?.status === 'COMPLETED' ? 'COMPLETED' : activeJob?.status === 'PICKED_UP' ? 'IN TRANSIT' : 'ASSIGNED'}
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {activeJob?.commodity || '120 Qtl Grade-A Red Onion (Nashik Export Lot)'}
              </h2>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 4 }}>
              Origin: <strong>{activeJob?.pickup_farmer_name || 'Santosh Shinde'} (Pimpalgaon Baswant)</strong> ➔ Destination: <strong>{activeJob?.drop_buyer_name || 'AgroFresh Supply Chain Ltd (Lasalgaon Hub)'}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right', background: '#f8fafc', padding: '10px 18px', borderRadius: 10, border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pre-funded Escrow Vault</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d' }}>
              ₹2,99,450.00
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              ₹2,91,000 (Farmer DBT) + ₹8,450 (Transporter Freight)
            </div>
          </div>
        </div>

        {/* Assigned Driver & Vehicle Card */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, alignItems: 'center' }}>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                    {activeJob?.driver_name || 'Rajesh Vitthal Patil'}
                  </strong>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                    🛡️ Vahan Verified
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Vehicle: <strong>{activeJob?.vehicle_type || 'Eicher Pro 2049 (6-Wheel Heavy Truck)'}</strong> • Reg: <strong style={{ color: '#1e40af' }}>{activeJob?.vehicle_reg || 'MH 15 EG 4402'}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Driver Phone: <strong>+91 98221 44021</strong> • Payload: <strong>4.5 MT Commercial</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <a 
                href="tel:+919822144021" 
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', padding: '8px 16px', textDecoration: 'none' }}
              >
                <Phone size={15} color="#2563eb" />
                <span>Call Driver</span>
              </a>

              {/* ROLE ACTION BUTTONS */}
              {isFarmer && (
                <button
                  type="button"
                  onClick={handleFarmerPickup}
                  disabled={isProcessingAction || activeJob?.status === 'PICKED_UP' || activeJob?.status === 'COMPLETED'}
                  className="btn-primary"
                  style={{
                    fontSize: '0.82rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6,
                    background: activeJob?.status === 'PICKED_UP' ? '#15803d' : 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                  }}
                >
                  {isProcessingAction ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Verifying Pickup...</span>
                    </>
                  ) : activeJob?.status === 'PICKED_UP' ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Pickup Confirmed (In Transit)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Confirm Farm Gate Pickup (माल लोड झाला)</span>
                    </>
                  )}
                </button>
              )}

              {isBuyer && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleBuyerConfirmDelivery}
                    disabled={isProcessingAction || activeJob?.status === 'COMPLETED' || activeJob?.workflow_status === LOT_STAGES?.COMPLETED_FUNDS_RELEASED}
                    className="btn-primary"
                    style={{
                      fontSize: '0.82rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 6,
                      background: (activeJob?.status === 'COMPLETED' || activeJob?.workflow_status === LOT_STAGES?.COMPLETED_FUNDS_RELEASED) ? '#15803d' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                    }}
                  >
                    {isProcessingAction ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Executing Dual Escrow...</span>
                      </>
                    ) : (activeJob?.status === 'COMPLETED' || activeJob?.workflow_status === LOT_STAGES?.COMPLETED_FUNDS_RELEASED) ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Delivery Accepted & Settled</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Approve Delivery & Release Payment</span>
                      </>
                    )}
                  </button>

                  {activeJob?.status !== 'COMPLETED' && activeJob?.workflow_status !== LOT_STAGES?.COMPLETED_FUNDS_RELEASED && activeJob?.workflow_status !== LOT_STAGES?.REJECTED_RETURN_IN_PROGRESS && (
                    <button
                      type="button"
                      onClick={handleBuyerRejectDelivery}
                      disabled={isProcessingAction}
                      style={{
                        fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6,
                        background: '#ffffff', border: '1px solid #f87171', color: '#dc2626', borderRadius: 8, cursor: 'pointer', fontWeight: 800
                      }}
                    >
                      <AlertCircle size={15} />
                      <span>Reject / Send Back</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 4-Stage Dual Escrow Progression Tracker */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase' }}>1. Load Assigned</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Driver Locked to Route</div>
            <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: 2 }}>MH 15 EG 4402 confirmed</div>
          </div>

          <div style={{ 
            background: activeJob?.status === 'PICKED_UP' || activeJob?.status === 'COMPLETED' ? '#ecfdf5' : '#eff6ff', 
            border: activeJob?.status === 'PICKED_UP' || activeJob?.status === 'COMPLETED' ? '1px solid #86efac' : '1px solid #93c5fd', 
            borderRadius: 8, padding: '12px 14px' 
          }}>
            <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>2. Farm Gate Pickup</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
              {activeJob?.status === 'PICKED_UP' || activeJob?.status === 'COMPLETED' ? '✓ Dispatched & In Transit' : 'Weighed & Stapped'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: 2 }}>₹0 released upfront to driver</div>
          </div>

          <div style={{ 
            background: activeJob?.status === 'COMPLETED' ? '#ecfdf5' : '#f8fafc', 
            border: activeJob?.status === 'COMPLETED' ? '1px solid #86efac' : '1px solid #e2e8f0', 
            borderRadius: 8, padding: '12px 14px' 
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>3. Dock Verification</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Lasalgaon Bay 4</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>Photo & Weight receipt log</div>
          </div>

          <div style={{ 
            background: activeJob?.status === 'COMPLETED' ? '#ecfdf5' : '#f8fafc', 
            border: activeJob?.status === 'COMPLETED' ? '1px solid #86efac' : '1px solid #e2e8f0', 
            borderRadius: 8, padding: '12px 14px' 
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>4. Dual Escrow Release</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
              {activeJob?.status === 'COMPLETED' ? '✓ Settled & Paid' : '₹2,91,000 + ₹8,450'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>Simultaneous bank release</div>
          </div>
        </div>

        {/* Settlement Success Banner if Completed */}
        {activeJob?.status === 'COMPLETED' && (
          <div style={{ background: '#ecfdf5', border: '2px solid #86efac', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <CheckCircle2 size={22} color="#15803d" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
                Dual Escrow Settlement Executed!
              </h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem' }}>
              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <span style={{ color: '#64748b' }}>Farmer DBT Settlement:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#15803d' }}>₹2,91,000.00</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Santosh Shinde (SBI A/C: *******4921)</div>
              </div>

              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <span style={{ color: '#64748b' }}>Transporter Freight Settlement:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1d4ed8' }}>₹8,450.00</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Rajesh Patil (Truck MH 15 EG 4402)</div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
