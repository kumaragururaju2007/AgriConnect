import React, { useState, useEffect } from 'react';
import { 
  Truck, Navigation, MapPin, CheckCircle2, Clock, 
  Camera, ShieldCheck, AlertCircle, Phone, ArrowRight, 
  DollarSign, Scale, ExternalLink, RefreshCw, FileText,
  Compass, Radio, Sparkles, Send
} from 'lucide-react';
import { DRIVER_PROFILE, VEHICLE_DETAILS } from './driverData';

export default function DriverActiveTrip({
  activeJob,
  onConfirmPickup,
  onMarkDelivered,
  onOpenRatingModal,
  setActiveTab,
  lang = 'en'
}) {
  // Current Trip Stage (1 to 7)
  const [currentStage, setCurrentStage] = useState(() => {
    if (!activeJob) return 3;
    if (activeJob.status === 'COMPLETED' || activeJob.byProductStatus === 'COMPLETED') return 7;
    if (activeJob.status === 'DELIVERED_PENDING_CONFIRMATION' || activeJob.status === 'delivered' || activeJob.byProductStatus === 'DELIVERED_AWAITING_CONFIRMATION') return 6;
    if (activeJob.status === 'PICKED_UP' || activeJob.status === 'picked_up' || activeJob.byProductStatus === 'PICKED_UP_IN_TRANSIT') return 4;
    return 2;
  });

  // Keep stage synchronized when job status updates in global state
  useEffect(() => {
    if (!activeJob) return;
    if (activeJob.status === 'COMPLETED' || activeJob.byProductStatus === 'COMPLETED') {
      setCurrentStage(7);
    } else if (activeJob.status === 'DELIVERED_PENDING_CONFIRMATION' || activeJob.status === 'delivered' || activeJob.byProductStatus === 'DELIVERED_AWAITING_CONFIRMATION') {
      setCurrentStage(6);
    } else if (activeJob.status === 'PICKED_UP' || activeJob.status === 'picked_up' || activeJob.byProductStatus === 'PICKED_UP_IN_TRANSIT') {
      setCurrentStage(4);
    } else {
      setCurrentStage(2);
    }
  }, [activeJob?.status, activeJob?.byProductStatus, activeJob?.id]);

  // Telemetry simulation state
  const [simSpeed, setSimSpeed] = useState(44);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(8.2);
  const [etaMinutes, setEtaMinutes] = useState(16);
  const [isDriving, setIsDriving] = useState(true);

  // Weighbridge interactive calculator
  const [grossWeightKg, setGrossWeightKg] = useState('17450');
  const [tareWeightKg, setTareWeightKg] = useState('2450');
  const [weighbridgeSlipGenerated, setWeighbridgeSlipGenerated] = useState(true);

  // ePOD Camera & Delivery confirmation state
  const [photoProofUrl, setPhotoProofUrl] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80');
  const [deliveryNotes, setDeliveryNotes] = useState('All gunny sacks inspected and unloaded at facility. Weighed and verified on certified electronic weighbridge.');
  const [isSubmittingDelivery, setIsSubmittingDelivery] = useState(false);
  const [showWeighbridgeModal, setShowWeighbridgeModal] = useState(false);

  // Simulated live speed variations
  useEffect(() => {
    if (!isDriving) return;
    const interval = setInterval(() => {
      setSimSpeed((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = Math.max(32, Math.min(58, prev + delta));
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isDriving]);

  // Compute Net produce
  const grossNum = parseFloat(grossWeightKg) || 0;
  const tareNum = parseFloat(tareWeightKg) || 0;
  const netKg = Math.max(0, grossNum - tareNum);
  const netQtl = (netKg / 100).toFixed(2);

  // Fallback active job data if none passed
  const job = activeJob || {
    id: 1,
    job_code: 'JOB-2024-8841',
    deal_ref: 'AC-TXN-8841',
    commodity_summary: '150 Qtl Grade-A Red Onion (Nashik Gavran)',
    pickup_location: 'Farm Gate: Gut No. 142/B, Pimpalgaon, Niphad, Nashik',
    drop_location: 'AgroFresh Central Sourcing Hub, Lasalgaon Mandi Bay 4',
    distance_km: 18,
    delivery_fee: 8450.00,
    status: 'assigned',
    farmer_name: 'Santosh Bhaurao Shinde',
    farmer_phone: '+91 98224 81920',
    buyer_name: 'AgroFresh Supply Chain Ltd',
    escrow_ref: '#SBI-MH-ESC-8841029'
  };

  const handlePickup = async () => {
    if (onConfirmPickup) {
      await onConfirmPickup(job);
    }
    setCurrentStage(4);
  };

  const handleDelivery = async () => {
    setIsSubmittingDelivery(true);
    try {
      if (onMarkDelivered) {
        await onMarkDelivered(job, photoProofUrl, deliveryNotes);
      }
      setCurrentStage(7);
      if (onOpenRatingModal) {
        setTimeout(() => {
          onOpenRatingModal({
            id: job.id,
            name: job.farmer_name || 'Santosh Shinde',
            type: 'farmer',
            jobCode: job.job_code
          });
        }, 1200);
      }
    } finally {
      setIsSubmittingDelivery(false);
    }
  };

  const STAGES = [
    { num: 1, title: 'Schedule Locked', desc: 'Driver Assigned via APMC' },
    { num: 2, title: 'En Route to Field', desc: 'Navigating to Farm Gate' },
    { num: 3, title: 'Farm Pickup', desc: 'Count & Bag Strapping' },
    { num: 4, title: 'Highway Transit', desc: 'Fastag & Live GPS Link' },
    { num: 5, title: 'APMC Weighbridge', desc: 'Certified Tare / Gross Slip' },
    { num: 6, title: 'Dock Inspection', desc: 'Consignee Inward Clearance' },
    { num: 7, title: 'ePOD Settled', desc: '100% Escrow Vault Released' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner: Mission HUD & Live GPS Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: 20,
              background: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Radio size={12} /> LIVE TELEMETRY ACTIVE
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
              Job Ref: <strong style={{ color: '#ffffff' }}>{job.job_code}</strong>
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
              Deal: <strong style={{ color: '#38bdf8' }}>{job.deal_ref || 'AC-TXN-8841'}</strong>
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '8px 0 4px 0' }}>
            {job.commodity_summary || '150 Qtl Grade-A Red Onion (Nashik Gavran)'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
            Route: {job.pickup_location || 'Pimpalgaon Farm Gate'} ➔ {job.drop_location || 'Lasalgaon APMC Logistics Bay 4'} ({job.distance_km || 18} km corridor)
          </p>
        </div>

        {/* Telemetry Quick Gauges */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              CURRENT SPEED
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399' }}>
              {isDriving ? simSpeed : 0} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>km/h</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              REMAINING
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>
              {distanceRemainingKm} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>km</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              ESTIMATED ETA
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#facc15' }}>
              {etaMinutes} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>min</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Stage Interactive Logistics Stepper */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '22px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Consignment Progress Stepper
            </h3>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
              Stage {currentStage} of 7 • Statutory Chain-of-Custody Logged on Maharashtra e-Mandi
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
              disabled={currentStage <= 1}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: currentStage <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Prev Stage
            </button>
            <button
              onClick={() => setCurrentStage(Math.min(7, currentStage + 1))}
              disabled={currentStage >= 7}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: currentStage >= 7 ? 'not-allowed' : 'pointer'
              }}
            >
              Next Stage
            </button>
          </div>
        </div>

        {/* Stepper Steps Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 8,
          position: 'relative'
        }}>
          {STAGES.map((s) => {
            const isDone = currentStage > s.num;
            const isCurrent = currentStage === s.num;

            return (
              <div
                key={s.num}
                onClick={() => setCurrentStage(s.num)}
                style={{
                  cursor: 'pointer',
                  padding: '12px 10px',
                  borderRadius: 12,
                  background: isCurrent ? '#eff6ff' : isDone ? '#f0fdf4' : '#f8fafc',
                  border: isCurrent ? '2px solid #2563eb' : isDone ? '1px solid #86efac' : '1px solid #e2e8f0',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: isCurrent ? '#2563eb' : isDone ? '#16a34a' : '#cbd5e1',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isDone ? '✓' : s.num}
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, color: isCurrent ? '#2563eb' : isDone ? '#16a34a' : '#94a3b8' }}>
                    {isDone ? 'COMPLETED' : isCurrent ? 'LIVE NOW' : 'PENDING'}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2, lineHeight: 1.2 }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operational Actions Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
        
        {/* Column 1: Stage Operations & Actions */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              CURRENT MISSION STAGE ACTION
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0 0', color: '#0f172a' }}>
              {STAGES[currentStage - 1].title} — {STAGES[currentStage - 1].desc}
            </h3>
          </div>

          {/* Conditional Action Panels based on stage */}
          {currentStage <= 3 && (
            <div style={{
              background: '#f8fafc',
              borderRadius: 12,
              padding: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                Arrive at the farmer's field gate at Pimpalgaon. Count the 150 gunny sacks, inspect for moisture/sprouting, and ensure the load is strapped under the heavy 550 GSM aerated tarpaulin.
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={`tel:${job.farmer_phone || '+919822481920'}`}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={15} color="#2563eb" /> Call Farmer ({job.farmer_name || 'Santosh Shinde'})
                </a>

                <button
                  onClick={handlePickup}
                  style={{
                    flex: 1.2,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <CheckCircle2 size={16} /> Confirm Pickup & Start Transit
                </button>
              </div>
            </div>
          )}

          {currentStage === 4 && (
            <div style={{
              background: '#f0fdf4',
              borderRadius: 12,
              padding: '16px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803d', fontWeight: 700, fontSize: '0.86rem' }}>
                <Radio size={16} /> High-Speed Highway Transit in Progress
              </div>
              <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                Vehicle is en route to Lasalgaon APMC. Fastag toll is automatically registered. Live GPS coordinates are broadcasting to both farmer and receiving dock assayer.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setIsDriving(!isDriving)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#ffffff',
                    border: '1px solid #86efac',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#15803d',
                    cursor: 'pointer'
                  }}
                >
                  {isDriving ? 'Simulate Traffic Halt' : 'Resume Highway Speed'}
                </button>
                <button
                  onClick={() => setCurrentStage(5)}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Arrived at Mandi Weighbridge ➔
                </button>
              </div>
            </div>
          )}

          {currentStage >= 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Electronic Weighbridge Slip Module */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Scale size={18} color="#0284c7" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      Certified APMC Weighbridge Slip
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#dcfce7', color: '#15803d' }}>
                    Tolerance ±0.5% OK
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>GROSS WEIGHT (KG)</label>
                    <input
                      type="number"
                      value={grossWeightKg}
                      onChange={(e) => setGrossWeightKg(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        fontWeight: 700
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>TARE WEIGHT (KG)</label>
                    <input
                      type="number"
                      value={tareWeightKg}
                      onChange={(e) => setTareWeightKg(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        fontWeight: 700
                      }}
                    />
                  </div>
                  <div style={{ background: '#ffffff', padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>NET PRODUCE (QTL)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>
                      {netQtl} Qtl ({netKg.toLocaleString()} kg)
                    </div>
                  </div>
                </div>
              </div>

              {/* ePOD Photographic Proof Capture Studio */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Camera size={18} color="#2563eb" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      ePOD (Electronic Proof of Delivery)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb' }}>
                    Geo-tagged & Watermarked
                  </span>
                </div>

                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 160 }}>
                  <img
                    src={photoProofUrl}
                    alt="Delivery Unloading Proof"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Geotag Watermark Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(15, 23, 42, 0.85)',
                    padding: '6px 12px',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    lineHeight: 1.4,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div><strong>LAT/LONG:</strong> 20.1472° N, 74.0418° E (Lasalgaon Bay 4)</div>
                      <div><strong>TIME:</strong> {new Date().toLocaleTimeString()} IST • TRUCK: MH 15 EG 4402</div>
                    </div>
                    <div style={{ textAlign: 'right', color: '#4ade80', fontWeight: 700 }}>
                      ✓ GPS VERIFIED
                    </div>
                  </div>
                </div>

                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={2}
                  placeholder="Unloading remarks, dock inspection confirmation..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  disabled={isSubmittingDelivery || currentStage === 7}
                  onClick={handleDelivery}
                  style={{
                    padding: '12px',
                    borderRadius: 10,
                    background: currentStage === 7 ? '#16a34a' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: currentStage === 7 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {currentStage === 7 ? (
                    '✓ Delivery Completed & Escrow Release Logged'
                  ) : isSubmittingDelivery ? (
                    'Recording ePOD & Activating 48h SLA...'
                  ) : (
                    <>
                      <Send size={16} /> Submit ePOD & Confirm Delivery
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Dual Escrow Protection & Legal Assurances */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Dual-Escrow Financial Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '22px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={20} color="#16a34a" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                APMC Dual-Escrow Lock
              </h3>
            </div>

            <div style={{
              background: '#f0fdf4',
              borderRadius: 12,
              padding: '14px 16px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>
                  FREIGHT AMOUNT LOCKED IN ESCROW
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>
                  ₹{Number(job.delivery_fee || 8450).toLocaleString('en-IN')}
                </div>
                {job.product_escrow > 0 && (
                  <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: 4, fontWeight: 700 }}>
                    Dual Escrow: + ₹{Number(job.product_escrow).toLocaleString('en-IN')} Product Escrow (Farmer)
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#dcfce7', color: '#15803d' }}>
                  Vault Pre-Funded
                </span>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
                  {job.escrow_ref || '#SBI-MH-ESC-8841029'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
              Under the <strong>Maharashtra APMC Act Rule 24</strong>, zero freight advance is needed. 100% of your freight is safely held in State Bank of India escrow. Once the receiving dock confirms weighment or after 48 hours, payout is deposited directly via DBT to your SBI A/c *******4402.
            </div>

            {/* 48-Hour Auto-Confirmation SLA */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: 10,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <Clock size={16} color="#d97706" />
              <div style={{ fontSize: '0.74rem', color: '#92400e' }}>
                <strong>48-Hour Auto-Release Protection:</strong> If the buyer dock fails to confirm within 48h of ePOD upload, the APMC system auto-releases funds.
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, display: 'flex', gap: 10 }}>
              <button
                onClick={() => setActiveTab('earnings')}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#2563eb',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
              >
                <DollarSign size={14} /> View Escrow Ledger
              </button>
              <button
                onClick={() => setActiveTab('support')}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                File Detention Claim
              </button>
            </div>
          </div>

          {/* Consignee & Mandi Gate Details */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              CONSIGNEE RECEIVING DOCK
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
              {job.buyer_name || 'AgroFresh Supply Chain Pvt Ltd'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
              Lasalgaon APMC Cold Storage Bay 4 • Licensed APMC Inward Buyer #MH-9421 • Fast-track dock entry lane #2.
            </div>
            <div style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 600 }}>
              Dock Supervisor: Pravin B. Deshpande (+91 94221 77192)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
