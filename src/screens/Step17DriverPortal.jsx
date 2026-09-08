import React, { useState } from 'react';
import { 
  Truck, Navigation, ShieldCheck, MapPin, Clock, CheckCircle2, 
  AlertCircle, Camera, Star, ArrowRight, DollarSign, RefreshCw, 
  ChevronRight, ExternalLink, Calendar, Phone, User, Package, 
  Layers, Info, ShieldAlert, Sparkles, Award, LayoutDashboard, 
  History, Bell, HelpCircle, FileText, AlertTriangle, Check, 
  Search, Download, Wrench, Fuel, Shield, MessageSquare, Send, ChevronDown, Scale
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';

// Import Reconstructed Modular Sub-Screens
import DriverDashboard from './driver/DriverDashboard';
import DriverAvailableOrders from './driver/DriverAvailableOrders';
import DriverActiveTrip from './driver/DriverActiveTrip';
import DriverTripHistory from './driver/DriverTripHistory';
import DriverEarnings from './driver/DriverEarnings';
import DriverVehicleProfile from './driver/DriverVehicleProfile';
import DriverTrustReviews from './driver/DriverTrustReviews';
import DriverNotifications from './driver/DriverNotifications';
import DriverSupport from './driver/DriverSupport';
import DriverRatingModal from './driver/DriverRatingModal';
import { DRIVER_PROFILE, VEHICLE_DETAILS } from './driver/driverData';

export default function Step17DriverPortal({
  setStep,
  setTerminal,
  lang = 'mr',
  driverTab = 'home',
  setDriverTab,
  onSwitchToFarmer
}) {
  const { 
    authUser, 
    deliveryJobs = [], 
    deals = [],
    byProductLots = [],
    BYPRODUCT_STAGES,
    dispatchByProductLot,
    arriveByProductDelivery,
    acceptDeliveryJob, 
    confirmPickup, 
    markDelivered, 
    driverPayouts = [],
    ratings = [],
    submitRating,
    addToast,
    confirmPickupWorkflow,
    markDeliveryArrivedWorkflow,
    confirmReturnCompletedWorkflow,
    LOT_STAGES
  } = useAgri();

  // Active tab state in sync with sidebar
  const [internalTab, setInternalTab] = useState('home');
  const activeTab = driverTab || internalTab;
  const setActiveTab = (tab) => {
    if (setDriverTab) setDriverTab(tab);
    setInternalTab(tab);
  };

  // Selected driver job ID (supports switching between active loads)
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Active by-product transport lots
  const byProductJobs = byProductLots
    .filter((lot) =>
      [
        BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED,
        BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT,
        BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION
      ].includes(lot.status)
    )
    .map((lot) => ({
      id: lot.id,
      job_code: `JOB-${lot.id}`,
      deal_ref: `BP-TXN-${lot.id}`,
      commodity_summary: `${lot.quantityMT} MT ${lot.cropType}`,
      pickup_location: lot.tracking?.pickupAddress || `Farm Gate: ${lot.farmerName}, ${lot.village}`,
      drop_location: lot.tracking?.deliveryAddress || 'AgroPower Pellets Processing Hub, MIDC Ambad',
      distance_km: lot.distanceKm || 28,
      delivery_fee: lot.escrow?.transportAmount || 1824,
      product_escrow: lot.escrow?.productAmount || 0,
      total_escrow: lot.escrow?.totalEscrow || 0,
      status:
        lot.status === BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED
          ? 'assigned'
          : lot.status === BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT
          ? 'picked_up'
          : 'delivered',
      farmer_name: lot.farmerName,
      farmer_phone: lot.farmerPhone,
      buyer_name: 'Direct By-Product Processing Buyer',
      escrow_ref: `#ESC-${lot.id}`,
      isByProduct: true,
      byProductId: lot.id,
      byProductStatus: lot.status
    }));

  // Combined jobs list
  const allActiveJobs = [...byProductJobs, ...deliveryJobs];

  // Duty status
  const [dutyStatus, setDutyStatus] = useState('ON_DELIVERY');

  // Rating modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState({ id: 1, name: 'Santosh Shinde (Farmer)', type: 'farmer', jobCode: 'JOB-2024-8841' });

  // Current active job
  const activeJob =
    (selectedJobId && allActiveJobs.find((j) => j.id === selectedJobId || j.job_code === selectedJobId)) ||
    byProductJobs.find((j) => j.status === 'assigned' || j.status === 'picked_up' || j.status === 'delivered') ||
    deliveryJobs.find(
      (j) =>
        j.status === 'ASSIGNED' ||
        j.status === 'PICKED_UP' ||
        j.status === 'DELIVERED_PENDING_CONFIRMATION' ||
        j.status === 'assigned' ||
        j.status === 'picked_up' ||
        j.status === 'delivered'
    ) ||
    deliveryJobs[0] ||
    byProductJobs[0];

  // Available jobs for marketplace
  const availableJobs = deliveryJobs.filter(
    (j) => j.status === 'AVAILABLE' || j.status === 'PENDING_DRIVER_ACCEPTANCE' || !j.driver_id
  );

  // Tab configurations matching Sidebar.jsx
  const DRIVER_TABS = [
    { id: 'home', label: 'Dashboard', sub: 'डॅशबोर्ड', icon: LayoutDashboard, badge: 'Overview' },
    { id: 'available_orders', label: 'Available Orders', sub: 'नव्या ऑर्डर्स', icon: Package, badge: `${availableJobs.length || 4} New` },
    { id: 'active_trip', label: 'Active Trip', sub: 'चालू फेरी व GPS', icon: Truck, badge: activeJob ? 'Live' : 'Idle' },
    { id: 'trip_history', label: 'Trip History', sub: 'फेरी इतिहास', icon: History, badge: '84 Done' },
    { id: 'earnings', label: 'Earnings & Payouts', sub: 'उत्पन्न व पेमेंट्स', icon: DollarSign, badge: '₹8.4k' },
    { id: 'vehicle_profile', label: 'Vehicle Profile', sub: 'वाहन पडताळणी', icon: ShieldCheck, badge: 'Vahan' },
    { id: 'trust_reviews', label: 'Trust & Reviews', sub: 'ग्राहक अभिप्राय', icon: Star, badge: `${DRIVER_PROFILE.rating_avg} ★` },
    { id: 'notifications', label: 'Notifications', sub: 'सूचना', icon: Bell, badge: '3 New' },
    { id: 'support', label: 'APMC Support', sub: 'मदत व निवारण', icon: HelpCircle, badge: '24/7 Desk' },
  ];

  // Handlers for context actions
  const handleAcceptJob = async (job) => {
    try {
      if (acceptDeliveryJob) {
        await acceptDeliveryJob(job.id || job.job_code, DRIVER_PROFILE.id);
      }
      addToast({
        type: 'success',
        title: 'Load Confirmed & Locked!',
        message: `Consignment #${job.job_code || 'JOB-NEW'} locked to vehicle ${VEHICLE_DETAILS.reg_no}. Proceed to pickup.`
      });
      setActiveTab('active_trip');
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmPickup = async (job) => {
    try {
      if (job?.isByProduct || job?.byProductId || String(job?.id).startsWith('BIO-')) {
        const lotId = job.byProductId || job.id;
        if (dispatchByProductLot) {
          dispatchByProductLot(lotId);
        }
        return;
      }
      if (confirmPickup) {
        await confirmPickup(job.id || job.job_code, DRIVER_PROFILE.id, 'Gunny sacks counted and strapped under aerated tarpaulin.');
      }
      confirmPickupWorkflow(job.id || job.job_code);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkDelivered = async (job, photoUrl, notes) => {
    try {
      if (job?.isReturnJob) {
        confirmReturnCompletedWorkflow(job.id || job.job_code);
        addToast({
          type: 'success',
          title: 'Return Trip Delivered to Farmgate!',
          message: 'Consignment delivered back to farmer. Buyer refund processed. Status: RETURNED_CLOSED.'
        });
        return;
      }
      if (job?.isByProduct || job?.byProductId || String(job?.id).startsWith('BIO-')) {
        const lotId = job.byProductId || job.id;
        if (arriveByProductDelivery) {
          arriveByProductDelivery(lotId);
        }
        return;
      }
      if (markDelivered) {
        await markDelivered(job.id || job.job_code, photoUrl, notes);
      }
      markDeliveryArrivedWorkflow(job.id || job.job_code, photoUrl, notes);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      if (submitRating) {
        await submitRating(ratingData);
      }
      addToast({
        type: 'success',
        title: 'Verified Review Published!',
        message: `Thank you for rating ${ratingData.target_name}. Score logged to APMC Mandi Ledger.`
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      maxWidth: 1400,
      margin: '0 auto',
      padding: '20px 24px 60px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>


      {/* Active Consignment Switcher (supports toggling between Commodity loads and By-Product biomass consignments) */}
      {byProductJobs.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#ffffff',
          borderRadius: 12,
          padding: '10px 16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Truck size={14} color="#16a34a" /> Transporter Loads:
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {allActiveJobs.map((j) => {
              const isSelected = (activeJob?.id === j.id || activeJob?.job_code === j.job_code);
              return (
                <button
                  key={j.id || j.job_code}
                  onClick={() => {
                    setSelectedJobId(j.id || j.job_code);
                    setActiveTab('active_trip');
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isSelected ? (j.isByProduct ? '#15803d' : '#0284c7') : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? 'none' : '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{j.commodity_summary || j.job_code}</span>
                  {j.isByProduct ? (
                    <span style={{
                      fontSize: '0.66rem',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#dcfce7',
                      color: isSelected ? '#ffffff' : '#15803d',
                      padding: '1px 6px',
                      borderRadius: 10,
                      fontWeight: 800
                    }}>
                      By-Product ({j.byProductStatus || j.status})
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.66rem',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#e0f2fe',
                      color: isSelected ? '#ffffff' : '#0369a1',
                      padding: '1px 6px',
                      borderRadius: 10,
                      fontWeight: 800
                    }}>
                      Mandi
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Screen Renderer */}
      {activeTab === 'home' && (
        <DriverDashboard
          dutyStatus={dutyStatus}
          setDutyStatus={setDutyStatus}
          activeJob={activeJob}
          availableJobs={availableJobs}
          setActiveTab={setActiveTab}
          onAcceptJob={handleAcceptJob}
          lang={lang}
        />
      )}

      {activeTab === 'available_orders' && (
        <DriverAvailableOrders
          deliveryJobs={availableJobs}
          onAcceptJob={handleAcceptJob}
          activeJob={activeJob}
          setActiveTab={setActiveTab}
          lang={lang}
        />
      )}

      {activeTab === 'active_trip' && (
        <DriverActiveTrip
          activeJob={activeJob}
          onConfirmPickup={handleConfirmPickup}
          onMarkDelivered={handleMarkDelivered}
          onOpenRatingModal={(target) => {
            setRatingTarget(target);
            setRatingModalOpen(true);
          }}
          setActiveTab={setActiveTab}
          lang={lang}
        />
      )}

      {activeTab === 'trip_history' && (
        <DriverTripHistory lang={lang} />
      )}

      {activeTab === 'earnings' && (
        <DriverEarnings lang={lang} setStep={setStep} />
      )}

      {activeTab === 'vehicle_profile' && (
        <DriverVehicleProfile lang={lang} />
      )}

      {activeTab === 'trust_reviews' && (
        <DriverTrustReviews lang={lang} />
      )}

      {activeTab === 'notifications' && (
        <DriverNotifications setActiveTab={setActiveTab} lang={lang} />
      )}

      {activeTab === 'support' && (
        <DriverSupport lang={lang} />
      )}

      {/* Global 3-Way Rating Modal */}
      <DriverRatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        target={ratingTarget}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
}
