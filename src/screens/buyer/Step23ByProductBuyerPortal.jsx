import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Truck, CheckCircle2, ArrowRight, 
  Download, Calendar, Clock, CreditCard, ShieldCheck, 
  Grid, List, FileText, ChevronRight, AlertCircle, ArrowLeft,
  DollarSign, Check, Phone, RefreshCw, X, Building, Share2,
  AlertTriangle, Scale, Users, Star, TrendingUp, Lock, History,
  Award, CheckCircle, ExternalLink, Sparkles, MessageSquare,
  Sprout, ThumbsUp, HelpCircle, FileCheck, Eye, PlusCircle,
  Recycle, Leaf, PhoneCall
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';
import RazorpayQrPaymentModal from '../../components/RazorpayQrPaymentModal';

export const REGISTERED_BYPRODUCT_TRUCKS = [
  {
    id: 'TRK-01',
    driverName: 'Rajesh Patil',
    phone: '+91 98221 44021',
    vehicleReg: 'MH 15 EG 4402',
    vehicleType: 'Eicher Pro 2049 (6-Wheel Open Tipper)',
    capacityMT: 5.0,
    ratePerKm: 30,
    rating: 4.9,
    trips: 84,
    vahanStatus: 'Vahan Verified (Fitness Valid)',
    badge: 'Fastest Farmgate Arrival (15 min away)'
  },
  {
    id: 'TRK-02',
    driverName: 'Suresh More',
    phone: '+91 98231 88402',
    vehicleReg: 'MH 15 EF 3810',
    vehicleType: 'Tata LPK 2518 (10 MT High-Side Biomass Tipper)',
    capacityMT: 10.0,
    ratePerKm: 34,
    rating: 4.8,
    trips: 112,
    vahanStatus: 'Vahan Verified (Heavy Commercial)',
    badge: 'Heavy Tipper (Recommended for 10+ MT)'
  },
  {
    id: 'TRK-03',
    driverName: 'Datta Gaikwad',
    phone: '+91 98229 11928',
    vehicleReg: 'MH 15 BX 7741',
    vehicleType: 'Ashok Leyland Ecomet 1215 (7 MT Tarpaulin Bed)',
    capacityMT: 7.0,
    ratePerKm: 32,
    rating: 4.9,
    trips: 67,
    vahanStatus: 'Vahan Verified (Covered Bed)',
    badge: 'Weatherproof Tarpaulin Covered'
  },
  {
    id: 'TRK-04',
    driverName: 'Mahendra Shinde',
    phone: '+91 98211 55902',
    vehicleReg: 'MH 15 AB 9912',
    vehicleType: 'BharatBenz 1217C (8.5 MT Multi-Axle Hauler)',
    capacityMT: 8.5,
    ratePerKm: 35,
    rating: 5.0,
    trips: 145,
    vahanStatus: 'Vahan Verified (APMC Fleet Enrolled)',
    badge: 'APMC Top Rated Hauler'
  }
];

export default function Step23ByProductBuyerPortal({ 
  setStep, 
  setTerminal, 
  setRole, 
  lang,
  byProductTab = 'listings',
  setByProductTab 
}) {
  const { 
    byProductLots = [], 
    lockByProductEscrow, 
    confirmByProductPayment, 
    assignByProductTransport, 
    dispatchByProductLot,
    arriveByProductDelivery,
    confirmByProductDelivery, 
    disputeByProductDelivery, 
    BYPRODUCT_STAGES, 
    addToast,
    authUser,
    switchRole
  } = useAgri();

  // Synchronized section: driven by byProductTab from Sidebar or internal navigation
  const [internalSection, setInternalSection] = useState('listings');
  const activeSection = byProductTab || internalSection;
  const setActiveSection = (section) => {
    setInternalSection(section);
    if (setByProductTab) setByProductTab(section);
  };

  // Additional Sub-module UI States
  const [transportViewTab, setTransportViewTab] = useState('dispatch'); // 'dispatch' | 'pickups'
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryResidueFilter, setDirectoryResidueFilter] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newPickupFarmer, setNewPickupFarmer] = useState('Santosh Shinde');
  const [newPickupCrop, setNewPickupCrop] = useState('Onion Stalks & Leaves');
  const [newPickupQty, setNewPickupQty] = useState(25);
  const [newPickupDate, setNewPickupDate] = useState('2026-09-09');
  const [calcCoalMT, setCalcCoalMT] = useState(100);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeLotCode, setDisputeLotCode] = useState('BIO-103');
  const [disputeReason, setDisputeReason] = useState('moisture_excess');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');

  // Listings UI State
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [maxDistanceFilter, setMaxDistanceFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('all');

  // Active Selected Lot
  const [selectedLotId, setSelectedLotId] = useState('BIO-101');
  const selectedLot = byProductLots.find(l => l.id === selectedLotId) || byProductLots[0] || {};
  const [orderQuantityMT, setOrderQuantityMT] = useState(selectedLot.quantityMT || 25);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'bank' | 'escrow'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Transportation Form State & Registered Truck Selection
  const [deliveryAddress, setDeliveryAddress] = useState('AgroPower Pellets Facility, Plot 42 MIDC Ambad, Nashik 422010');
  const [transportChoice, setTransportChoice] = useState('partner'); // 'self' | 'partner'
  const [selectedTruckId, setSelectedTruckId] = useState('TRK-02');
  const selectedTruck = REGISTERED_BYPRODUCT_TRUCKS.find(t => t.id === selectedTruckId) || REGISTERED_BYPRODUCT_TRUCKS[1];
  const [pickupDate, setPickupDate] = useState('2026-09-08');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('09:00 AM - 12:00 PM');

  // 2. Filter: Only lots with GRADED_LISTED or later should query/render in Buyer Portal
  const availableLots = byProductLots.filter(lot => lot.status !== BYPRODUCT_STAGES?.LISTED_PENDING_GRADING);

  const filteredLots = availableLots.filter(lot => {
    const matchesSearch = 
      lot.cropType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.village?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.farmerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = 
      selectedCropFilter === 'all' || 
      lot.cropType?.toLowerCase().includes(selectedCropFilter.toLowerCase());

    let matchesDistance = true;
    if (maxDistanceFilter === '20') matchesDistance = (lot.distanceKm || 0) <= 20;
    else if (maxDistanceFilter === '30') matchesDistance = (lot.distanceKm || 0) <= 30;
    else if (maxDistanceFilter === '50') matchesDistance = (lot.distanceKm || 0) <= 50;

    return matchesSearch && matchesCrop && matchesDistance;
  }).sort((a, b) => {
    if (priceSort === 'low-high') return (a.pricePerMT || 0) - (b.pricePerMT || 0);
    if (priceSort === 'high-low') return (b.pricePerMT || 0) - (a.pricePerMT || 0);
    return 0;
  });

  // Calculate order totals
  const currentQty = orderQuantityMT || selectedLot.quantityMT || 20;
  const currentRate = selectedLot.pricePerMT || 1200;
  const subtotal = currentQty * currentRate;
  const transportRatePerKm = transportChoice === 'partner' ? selectedTruck.ratePerKm : 0;
  const estimatedTransportCost = transportChoice === 'partner' ? Math.round((selectedLot.distanceKm || 18) * transportRatePerKm) : 0;
  const grandTotal = subtotal + estimatedTransportCost;

  // 3. Buyer clicks "Buy Direct" -> update status to ESCROW_LOCKED_AWAITING_PAYMENT, lock agreed amount, route to Payment screen
  const handleSelectLotForPurchase = (lot) => {
    setSelectedLotId(lot.id);
    setOrderQuantityMT(lot.quantityMT);
    if (lot.status === BYPRODUCT_STAGES?.GRADED_LISTED) {
      lockByProductEscrow(lot.id, { quantityMT: lot.quantityMT });
    }
    setActiveSection('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Buyer completes Payment -> update status to PAYMENT_CONFIRMED, mark product escrow funded, route to Transport screen
  const handlePayAndConfirm = () => {
    setShowRazorpayModal(true);
  };

  const handleRazorpaySuccess = () => {
    setShowRazorpayModal(false);
    confirmByProductPayment(selectedLot.id, { paymentMethod: 'razorpay' });
    setActiveSection('transport');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast({
      type: 'success',
      role: 'buyer',
      title: '🎉 Escrow Payment Locked via Razorpay!',
      message: `₹${grandTotal.toLocaleString('en-IN')} held securely in APMC Escrow Vault. Now select your transport vehicle.`
    });
  };

  // 5. Buyer selects a Transport option and confirms -> update status to TRANSPORT_ASSIGNED, lock transport escrow, notify Farmer
  const handleConfirmTransport = () => {
    assignByProductTransport(selectedLot.id, {
      transportChoice,
      transportCost: estimatedTransportCost,
      transporter: transportChoice === 'partner' ? {
        id: selectedTruck.id,
        driverName: selectedTruck.driverName,
        vehicleNumber: selectedTruck.vehicleReg,
        contact: selectedTruck.phone,
        truckType: selectedTruck.vehicleType,
        capacityMT: selectedTruck.capacityMT,
        rating: selectedTruck.rating
      } : null,
      pickupDate,
      pickupTimeSlot,
      deliveryAddress
    });
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case BYPRODUCT_STAGES?.GRADED_LISTED:
        return { label: 'GRADED & LISTED', bg: '#dbeafe', color: '#1d4ed8' };
      case BYPRODUCT_STAGES?.ESCROW_LOCKED_AWAITING_PAYMENT:
        return { label: 'ESCROW LOCKED (AWAITING PAYMENT)', bg: '#fef3c7', color: '#b45309' };
      case BYPRODUCT_STAGES?.PAYMENT_CONFIRMED:
        return { label: 'PAYMENT CONFIRMED (FUNDED)', bg: '#dcfce7', color: '#15803d' };
      case BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED:
        return { label: 'TRANSPORT ASSIGNED', bg: '#f3e8ff', color: '#7e22ce' };
      case BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT:
        return { label: 'PICKED UP (IN TRANSIT)', bg: '#e0f2fe', color: '#0369a1' };
      case BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION:
        return { label: 'DELIVERED (AWAITING CONFIRMATION)', bg: '#fed7aa', color: '#c2410c' };
      case BYPRODUCT_STAGES?.COMPLETED:
        return { label: 'COMPLETED & RELEASED', bg: '#dcfce7', color: '#15803d' };
      case BYPRODUCT_STAGES?.DISPUTED:
        return { label: 'DISPUTED (ESCROW FROZEN)', bg: '#fee2e2', color: '#b91c1c' };
      default:
        return { label: status || 'ACTIVE', bg: '#f1f5f9', color: '#475569' };
    }
  };

  const currentStatusInfo = getStatusBadge(selectedLot.status);

  // Dedicated By-Product Portal Navigation Modules
  const sidebarNavItems = [
    { id: 'listings', label: 'Biomass Marketplace', icon: Grid, badge: `${availableLots.length} Lots`, desc: 'Live residue lots' },
    { id: 'transport', label: 'Logistics & Vahan Fleets', icon: Truck, badge: 'Live Grid', desc: 'Dispatch & haulers' },
    { id: 'pickups', label: 'Farmgate Pickups', icon: Calendar, badge: '3 Sched', desc: 'Cluster pickups' },
    { id: 'payment', label: 'Escrow & Settlements', icon: CreditCard, badge: 'Direct', desc: '100% Protected' },
    { id: 'grievance', label: 'Dispute Redressal Desk', icon: Scale, badge: '48h SLA', desc: 'Adjustment protocol' },
    { id: 'history', label: 'Procurement History', icon: History, badge: 'Invoices', desc: 'Orders & GST bills' }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flex: 1, 
      width: '100%', 
      minHeight: 'calc(100vh - 105px)', 
      height: 'calc(100vh - 105px)', 
      background: '#f8fafc',
      overflow: 'hidden'
    }}>
      {/* ========================================================================= */}
      {/* DEDICATED BIOMASS & BY-PRODUCT BUYER PORTAL EXECUTIVE SIDEBAR */}
      {/* ========================================================================= */}
      <aside style={{
        width: 275,
        minWidth: 275,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '18px 14px',
        borderRight: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '4px 0 20px -2px rgba(15, 23, 42, 0.04)',
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto'
      }}>
        <div>
          {/* Official Biomass Offtake Crest */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid rgba(226, 232, 240, 0.7)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', color: '#ffffff', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.3)'
            }}>
              🌾
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, letterSpacing: '-0.01em', color: '#0f172a' }}>
                Biomass Sourcing
              </div>
              <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                MahaUrja Grid #26132
              </div>
            </div>
          </div>

          {/* Sourcing Region Box */}
          <div style={{
            margin: '12px 0',
            padding: '10px 12px',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: 10
          }}>
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              SOURCING JURISDICTION
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 800, color: '#14532d' }}>
              <MapPin size={13} style={{ color: '#15803d' }} />
              <span>Nashik & Pune Biomass Belt</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#166534', marginTop: 2 }}>
              Niphad • Yeola • Baramati Hubs
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sidebarNavItems.map((item) => {
              const isActive = activeSection === item.id || (item.id === 'transport' && activeSection === 'pickups');
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`byproduct-sidebar-btn-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive
                      ? 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)'
                      : 'transparent',
                    color: isActive ? '#15803d' : '#475569',
                    border: isActive ? '1px solid #a7f3d0' : '1px solid transparent',
                    boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(21,128,61,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Icon size={16} style={{ color: isActive ? '#15803d' : '#64748b' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      fontSize: '0.64rem',
                      padding: '2px 7px',
                      borderRadius: 6,
                      fontWeight: 800,
                      background: isActive ? '#15803d' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#64748b'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Offtaker Identity, Support & Produce Switcher */}
        <div style={{ paddingTop: 14, borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
          {/* Biomass Diverted Impact Mini-pill */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 10px', background: '#f8fafc', borderRadius: 8,
            border: '1px solid #e2e8f0', marginBottom: 12, fontSize: '0.72rem'
          }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>CO₂ Offset Total</span>
            <span style={{ color: '#15803d', fontWeight: 800 }}>🌱 31.4 T CO₂e</span>
          </div>

          {/* Offtaker Profile Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(180deg, #ecfdf5 0%, #dcfce7 100%)',
              color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.95rem',
              border: '1px solid #bbf7d0', boxShadow: 'inset 0 1px 1px #fff'
            }}>
              🏢
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                AgroFresh Supply Chain
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Biomass Buyer • Lic #MH-9421
              </div>
            </div>
          </div>

          {/* Quick Switch Button to Main Direct Produce Buyer Desk */}
          <button
            id="byproduct-sidebar-switch-produce-btn"
            onClick={() => {
              if (switchRole) switchRole('buyer');
              if (setRole) setRole('apmc');
              if (setTerminal) setTerminal('apmc');
              if (setStep) setStep(7);
            }}
            title="Switch over to Main Direct Produce Buyer Desk"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #fed7aa',
              background: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)',
              color: '#c2410c',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              marginBottom: 10
            }}
          >
            <span>🏢</span>
            <span>Switch to Produce Desk</span>
          </button>

          {/* Support Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>
            <PhoneCall size={12} />
            <span>MahaUrja Desk: 1800-120-8040</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Vertical Scroll */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        padding: '24px 32px 60px'
      }}>
        <div style={{ maxWidth: 1260, margin: '0 auto', width: '100%' }}>
          
          {/* Minimal Section Context Bar */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: 16, 
            border: '1px solid #e2e8f0', 
            padding: '16px 24px', 
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ 
                  background: '#dcfce7', 
                  color: '#15803d', 
                  fontWeight: 800, 
                  fontSize: '0.75rem', 
                  padding: '3px 8px', 
                  borderRadius: 6 
                }}>
                  BIOMASS SOURCING
                </span>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeSection === 'listings' ? 'By-Product & Crop Residue Marketplace' :
                   activeSection === 'transport' ? 'Transportation, Dispatch & Fleet Booking' :
                   activeSection === 'pickups' ? 'Scheduled Farmgate Residue Pickups' :
                   activeSection === 'payment' ? 'Biomass Escrow Vault & Payment Settlement' :
                   activeSection === 'directory' ? 'Verified Farmer Biomass Clusters' :
                   activeSection === 'advisor' ? 'Thermal Power & Bio-Coal Pricing Advisor' :
                   activeSection === 'ratings' ? 'Farmer Reliability & Moisture Integrity Ratings' :
                   activeSection === 'grievance' ? 'Dispute & Grievance Redressal Desk' :
                   'Procurement Order History & Invoices'}
                </h1>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Purchase crop residue, stubble & straw directly from verified local farmers • 100% Escrow Protected
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', background: '#f8fafc',
                borderRadius: 8, border: '1px solid #e2e8f0',
                fontSize: '0.78rem', color: '#475569', fontWeight: 700
              }}>
                <ShieldCheck size={15} color="#15803d" />
                <span>State Escrow Protected</span>
              </div>

              <button
                id="byproduct-header-switch-buyer-desk-btn"
                onClick={() => {
                  if (switchRole) switchRole('buyer');
                  if (setRole) setRole('apmc');
                  if (setTerminal) setTerminal('apmc');
                  if (setStep) setStep(7);
                }}
                title="Switch over to Direct Produce Buyer Desk"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: '1px solid #fed7aa',
                  background: '#fff7ed',
                  color: '#c2410c',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 2px rgba(234, 88, 12, 0.08)'
                }}
              >
                <span>🏢</span>
                <span>Buyer Desk</span>
              </button>
            </div>
          </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BY-PRODUCT LISTINGS PAGE */}
      {/* ========================================================================= */}
      {activeSection === 'listings' && (
        <div>
          {/* Simple Search & Filters Bar */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: 14, 
            border: '1px solid #e2e8f0', 
            padding: 16, 
            marginBottom: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 12, 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search by residue type, village, or farmer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#f8fafc'
                  }}
                />
              </div>

              {/* Filters Group */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                {/* Crop Type Filter */}
                <select
                  value={selectedCropFilter}
                  onChange={(e) => setSelectedCropFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    background: '#ffffff',
                    color: '#334155',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Residue Types</option>
                  <option value="onion">Onion Husk</option>
                  <option value="cotton">Cotton Stalks</option>
                  <option value="soyabean">Soyabean Straw</option>
                  <option value="sugarcane">Sugarcane Trash</option>
                </select>

                {/* Distance Filter */}
                <select
                  value={maxDistanceFilter}
                  onChange={(e) => setMaxDistanceFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    background: '#ffffff',
                    color: '#334155',
                    outline: 'none'
                  }}
                >
                  <option value="all">Any Distance</option>
                  <option value="20">Within 20 km</option>
                  <option value="30">Within 30 km</option>
                  <option value="50">Within 50 km</option>
                </select>

                {/* Price Sort */}
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    background: '#ffffff',
                    color: '#334155',
                    outline: 'none'
                  }}
                >
                  <option value="all">Sort Price: Default</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>

                {/* View Mode Toggle: Card vs Table */}
                <div style={{ display: 'flex', background: '#f1f5f9', padding: 2, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => setViewMode('card')}
                    title="Card View"
                    style={{
                      border: 'none',
                      background: viewMode === 'card' ? '#ffffff' : 'transparent',
                      color: viewMode === 'card' ? '#0f172a' : '#64748b',
                      borderRadius: 6,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="Table View"
                    style={{
                      border: 'none',
                      background: viewMode === 'table' ? '#ffffff' : 'transparent',
                      color: viewMode === 'table' ? '#0f172a' : '#64748b',
                      borderRadius: 6,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Container: Card View */}
          {viewMode === 'card' ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', 
              gap: 20 
            }}>
              {filteredLots.map(lot => {
                const badge = getStatusBadge(lot.status);
                const isBuyable = lot.status === BYPRODUCT_STAGES?.GRADED_LISTED;

                return (
                  <div 
                    key={lot.id} 
                    style={{ 
                      background: '#ffffff', 
                      borderRadius: 14, 
                      border: '1px solid #e2e8f0', 
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    {/* Photo with Overlay Badge */}
                    <div style={{ position: 'relative', width: '100%', height: 180, background: '#f1f5f9' }}>
                      <img 
                        src={lot.image} 
                        alt={lot.cropType} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 6
                      }}>
                        Lot #{lot.id}
                      </div>

                      <div style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: badge.bg,
                        color: badge.color,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 6,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        {badge.label}
                      </div>

                      <div style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        background: '#15803d',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 6,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {lot.distanceKm} km away
                      </div>
                    </div>

                    {/* Lot Details */}
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                          {lot.cropType}
                        </h3>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 12 }}>
                        {lot.marathi} • {lot.balingStatus}
                      </div>

                      {/* Quantity and Price Grid */}
                      <div style={{ 
                        background: '#f8fafc', 
                        borderRadius: 10, 
                        padding: '10px 12px', 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: 8,
                        marginBottom: 14,
                        border: '1px solid #f1f5f9'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>AVAILABLE</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            {lot.quantityMT} <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>MT</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>PRICE / MT</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803d' }}>
                            ₹{lot.pricePerMT?.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Farmer and Location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#334155', marginBottom: 6 }}>
                        <MapPin size={14} style={{ color: '#64748b', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{lot.village}</span>
                        <span style={{ color: '#94a3b8' }}>•</span>
                        <span style={{ color: '#64748b' }}>{lot.taluka}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 16 }}>
                        Farmer: <span style={{ fontWeight: 600, color: '#334155' }}>{lot.farmerName}</span>
                      </div>

                      {/* Action Button: Relevant to Current Status */}
                      <div style={{ marginTop: 'auto' }}>
                        {isBuyable ? (
                          <button
                            onClick={() => handleSelectLotForPurchase(lot)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                              background: '#15803d',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 8,
                              padding: '10px 14px',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <span>Buy Direct</span>
                            <ArrowRight size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedLotId(lot.id);
                              setActiveSection(
                                lot.status === BYPRODUCT_STAGES?.ESCROW_LOCKED_AWAITING_PAYMENT ? 'payment' : 'transport'
                              );
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              background: '#f8fafc',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              borderRadius: 8,
                              padding: '10px 14px',
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <span>View Active Workflow</span>
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '12px 16px' }}>Residue / Crop</th>
                      <th style={{ padding: '12px 16px' }}>Quantity</th>
                      <th style={{ padding: '12px 16px' }}>Price / MT</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Farmer & Location</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLots.map((lot, idx) => {
                      const badge = getStatusBadge(lot.status);
                      const isBuyable = lot.status === BYPRODUCT_STAGES?.GRADED_LISTED;

                      return (
                        <tr key={lot.id} style={{ borderBottom: idx < filteredLots.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img src={lot.image} alt={lot.cropType} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                              <div>
                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{lot.cropType}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lot #{lot.id} • {lot.distanceKm} km</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                            {lot.quantityMT} MT
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 800, color: '#15803d' }}>
                            ₹{lot.pricePerMT?.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: badge.bg, color: badge.color }}>
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, color: '#334155' }}>{lot.farmerName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lot.village}</div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            {isBuyable ? (
                              <button
                                onClick={() => handleSelectLotForPurchase(lot)}
                                style={{
                                  background: '#15803d',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '8px 14px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Buy Direct
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedLotId(lot.id);
                                  setActiveSection('transport');
                                }}
                                style={{
                                  background: '#f1f5f9',
                                  color: '#334155',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: 6,
                                  padding: '8px 12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                View Order
                              </button>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: PAYMENT PAGE */}
      {/* ========================================================================= */}
      {activeSection === 'payment' && (
        <div>
          {/* Back to Listings bar */}
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setActiveSection('listings')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to By-Product Listings</span>
            </button>

            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 8, background: currentStatusInfo.bg, color: currentStatusInfo.color, fontWeight: 800 }}>
              LOT STATUS: {currentStatusInfo.label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            
            {/* Left Column: Order Summary & Quantity adjustment */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: 14, 
              border: '1px solid #e2e8f0', 
              padding: 24,
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                1. Order Summary
              </h2>

              {/* Selected Lot Header */}
              <div style={{ 
                display: 'flex', 
                gap: 16, 
                alignItems: 'center', 
                paddingBottom: 16, 
                borderBottom: '1px solid #f1f5f9',
                marginBottom: 16
              }}>
                <img 
                  src={selectedLot.image} 
                  alt={selectedLot.cropType} 
                  style={{ width: 68, height: 68, borderRadius: 10, objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                    Lot #{selectedLot.id}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedLot.cropType}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Farmer: {selectedLot.farmerName} • {selectedLot.village} ({selectedLot.distanceKm} km)
                  </div>
                </div>
              </div>

              {/* Quantity Selection */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Purchase Quantity (Metric Tons)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="number"
                    min={selectedLot.minOrderMT || 5}
                    max={selectedLot.quantityMT || 50}
                    value={orderQuantityMT}
                    onChange={(e) => setOrderQuantityMT(Math.max(1, Math.min(selectedLot.quantityMT || 50, Number(e.target.value))))}
                    style={{
                      width: 120,
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#f8fafc'
                    }}
                  />
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Available: <strong>{selectedLot.quantityMT} MT</strong>
                  </span>
                </div>
              </div>

              {/* Cost Breakdown & Escrow Line Items */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#475569', marginBottom: 8 }}>
                  <span>Residue Rate</span>
                  <span>₹{selectedLot.pricePerMT?.toLocaleString('en-IN')} / MT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#475569', marginBottom: 8 }}>
                  <span>Product Escrow Line Item ({orderQuantityMT} MT)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    ₹{subtotal.toLocaleString('en-IN')} 
                    <span style={{ fontSize: '0.72rem', color: selectedLot.escrow?.productStatus === 'FUNDED' ? '#15803d' : '#d97706', marginLeft: 6 }}>
                      ({selectedLot.escrow?.productStatus || 'PENDING'})
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#475569', marginBottom: 8 }}>
                  <span>Estimated Transport</span>
                  <span>{transportChoice === 'partner' ? `₹${estimatedTransportCost.toLocaleString('en-IN')}` : 'Self-Arranged (₹0)'}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.05rem', 
                  fontWeight: 800, 
                  color: '#0f172a', 
                  paddingTop: 10, 
                  borderTop: '1px solid #e2e8f0', 
                  marginTop: 8 
                }}>
                  <span>Total Escrow Lock</span>
                  <span style={{ color: '#15803d' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Status Indicator */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                  Payment Escrow Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    background: currentStatusInfo.bg,
                    color: currentStatusInfo.color
                  }}>
                    <span>{currentStatusInfo.label}</span>
                  </div>

                  {selectedLot.escrow?.productStatus === 'FUNDED' && (
                    <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                      ✓ Funds safely held in escrow
                    </span>
                  )}
                </div>
              </div>

              {/* Farmer: Release Funds Panel — visible when delivery confirmed by buyer */}
              {selectedLot.status === BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION && (
                <div style={{ marginTop: 16, background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '2px solid #86efac', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#15803d', fontSize: '0.9rem', marginBottom: 6 }}>
                    <Lock size={16} />
                    <span>🔐 Farmer: Escrow Ready to Release</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#166534', marginBottom: 12 }}>
                    Buyer has confirmed delivery. Releasing escrow will transfer
                    <strong> ₹{subtotal.toLocaleString('en-IN')}</strong> to your bank account and
                    <strong> ₹{estimatedTransportCost.toLocaleString('en-IN')}</strong> to the transporter. Order status will automatically update to <strong>Completed</strong>.
                  </div>
                  <button
                    onClick={() => {
                      confirmByProductDelivery(selectedLot.id);
                      addToast({ type: 'success', role: 'farmer', title: '✅ Escrow Released!', message: `₹${subtotal.toLocaleString('en-IN')} transferred to your bank. Order #${selectedLot.id} is now Completed.` });
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 9,
                      fontSize: '0.92rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(21, 128, 61, 0.35)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Release Funds to Farmer & Transporter (Auto-Complete Order)</span>
                  </button>
                </div>
              )}

              {/* Completed: Show settlement receipt */}
              {selectedLot.status === BYPRODUCT_STAGES?.COMPLETED && (
                <div style={{ marginTop: 16, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <CheckCircle2 size={16} /> Escrow Fully Released — Order Completed
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                    ₹{subtotal.toLocaleString('en-IN')} deposited to farmer • ₹{estimatedTransportCost.toLocaleString('en-IN')} paid to transporter
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Payment Method Selection & Action */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: 14, 
              border: '1px solid #e2e8f0', 
              padding: 24,
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                2. Select Payment Method
              </h2>

              {/* Payment Methods */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {/* Method 1: UPI */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: paymentMethod === 'upi' ? '2px solid #15803d' : '1px solid #e2e8f0',
                  background: paymentMethod === 'upi' ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    style={{ accentColor: '#15803d', width: 16, height: 16 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Instant UPI (GPay / PhonePe / BHIM)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Zero transaction fee, direct bank-to-escrow link</div>
                  </div>
                </label>

                {/* Method 2: Bank Transfer */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: paymentMethod === 'bank' ? '2px solid #15803d' : '1px solid #e2e8f0',
                  background: paymentMethod === 'bank' ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    style={{ accentColor: '#15803d', width: 16, height: 16 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Bank Transfer (NEFT / RTGS / Virtual Account)</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Corporate NEFT with automatic reconciliation</div>
                  </div>
                </label>

                {/* Method 3: Escrow Held Payment */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: paymentMethod === 'escrow' ? '2px solid #15803d' : '1px solid #e2e8f0',
                  background: paymentMethod === 'escrow' ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'escrow'}
                    onChange={() => setPaymentMethod('escrow')}
                    style={{ accentColor: '#15803d', width: 16, height: 16 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Direct Escrow Account</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Funds released only after physical weight & quality check</div>
                  </div>
                </label>
              </div>

              {/* Pay & Confirm Button */}
              <div style={{ marginTop: 'auto' }}>
                {selectedLot.status === BYPRODUCT_STAGES?.ESCROW_LOCKED_AWAITING_PAYMENT ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                    <button
                      onClick={handlePayAndConfirm}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.96rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)'
                      }}
                    >
                      <CreditCard size={18} />
                      <span>Pay & Confirm with Razorpay (₹{grandTotal.toLocaleString('en-IN')})</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div style={{ marginBottom: 12, padding: '12px', borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.9rem' }}>
                      ✓ Product Escrow Line Item Funded
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: 2 }}>
                      Amount of ₹{subtotal.toLocaleString('en-IN')} held securely in APMC Escrow Vault.
                    </div>
                  </div>
                )}

                {/* Receipt and Proceed to Transportation Options */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={15} />
                    <span>Download Receipt</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('transport')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      background: '#15803d',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Proceed to Transport</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Razorpay Escrow Checkout Modal */}
      {showRazorpayModal && (
        <RazorpayQrPaymentModal
          isOpen={showRazorpayModal}
          lot={{
            ...selectedLot,
            crop_name: `${selectedLot.cropType} (${selectedLot.marathi || 'Crop Residue'})`,
            farmer_name: selectedLot.farmerName,
            quantity_qtl: (orderQuantityMT || selectedLot.quantityMT) * 10,
            asking_price: Math.round((selectedLot.pricePerMT || 1200) / 10)
          }}
          amount={grandTotal}
          productAmount={subtotal}
          transportAmount={estimatedTransportCost}
          dealRef={selectedLot.id}
          orderId={`order_bio_${selectedLot.id}_${Date.now().toString().slice(-4)}`}
          onClose={() => setShowRazorpayModal(false)}
          onPaymentSuccess={handleRazorpaySuccess}
        />
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: TRANSPORTATION PAGE */}
      {/* ========================================================================= */}
      {activeSection === 'transport' && (
        <div>
          {/* Back button */}
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setActiveSection('listings')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Listings</span>
            </button>

            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 8, background: currentStatusInfo.bg, color: currentStatusInfo.color, fontWeight: 800 }}>
              LOT #{selectedLot.id} • {currentStatusInfo.label}
            </span>
          </div>

          {/* Sub-view toggle: Delivery Booking vs Farmgate Pickup Scheduling */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 20, background: '#ffffff',
            padding: 5, borderRadius: 12, border: '1px solid #e2e8f0', width: 'fit-content'
          }}>
            <button
              onClick={() => setTransportViewTab('dispatch')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: transportViewTab === 'dispatch' ? '#15803d' : 'transparent',
                color: transportViewTab === 'dispatch' ? '#ffffff' : '#475569',
                fontWeight: transportViewTab === 'dispatch' ? 700 : 600,
                fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.15s ease'
              }}
            >
              <Truck size={15} />
              <span>Fleet Dispatch & Delivery Booking</span>
            </button>

            <button
              onClick={() => setTransportViewTab('pickups')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: transportViewTab === 'pickups' ? '#15803d' : 'transparent',
                color: transportViewTab === 'pickups' ? '#ffffff' : '#475569',
                fontWeight: transportViewTab === 'pickups' ? 700 : 600,
                fontSize: '0.84rem', cursor: 'pointer', transition: 'all 0.15s ease'
              }}
            >
              <Calendar size={15} />
              <span>Farmgate Pickup Scheduling (3 Scheduled)</span>
            </button>
          </div>

          {transportViewTab === 'dispatch' && (
            <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
              
              {/* Left: Pickup & Delivery Location + Transport Option */}
              <div style={{ 
                background: '#ffffff', 
              borderRadius: 14, 
              border: '1px solid #e2e8f0', 
              padding: 24,
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Addresses & Vehicle Arrangement
              </h2>

              {/* Farmer's Pickup Location (Auto-filled) */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                  Pickup Address (Auto-filled from Farmer)
                </label>
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 10, 
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10
                }}>
                  <MapPin size={18} style={{ color: '#15803d', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                      {selectedLot.farmerName}'s Farmgate Barn
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {selectedLot.village}, Taluka {selectedLot.taluka}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                      Farmer Contact: {selectedLot.farmerPhone || '+91 98231 44521'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer's Delivery Address */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                  Delivery Address (Buyer Facility)
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    outline: 'none',
                    background: '#ffffff',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Choose Transport Option */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                  Transport Option
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    onClick={() => setTransportChoice('self')}
                    style={{
                      padding: '12px',
                      borderRadius: 10,
                      border: transportChoice === 'self' ? '2px solid #15803d' : '1px solid #cbd5e1',
                      background: transportChoice === 'self' ? '#f0fdf4' : '#ffffff',
                      color: transportChoice === 'self' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>Self-Pickup</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b', marginTop: 2 }}>Buyer sends own vehicle</div>
                  </button>

                  <button
                    onClick={() => setTransportChoice('partner')}
                    style={{
                      padding: '12px',
                      borderRadius: 10,
                      border: transportChoice === 'partner' ? '2px solid #15803d' : '1px solid #cbd5e1',
                      background: transportChoice === 'partner' ? '#f0fdf4' : '#ffffff',
                      color: transportChoice === 'partner' ? '#15803d' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div>Logistics Partner</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b', marginTop: 2 }}>Assigned truck & driver</div>
                  </button>
                </div>
              </div>

              {/* Registered Truck Selection Grid (shown when Logistics Partner is chosen) */}
              {transportChoice === 'partner' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
                    Select Registered Vahan Truck
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {REGISTERED_BYPRODUCT_TRUCKS.map((truck) => {
                      const isSelected = selectedTruckId === truck.id;
                      const truckFee = Math.round((selectedLot.distanceKm || 18) * truck.ratePerKm);
                      return (
                        <div
                          key={truck.id}
                          onClick={() => setSelectedTruckId(truck.id)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 10,
                            border: isSelected ? '2px solid #15803d' : '1px solid #e2e8f0',
                            background: isSelected ? '#f0fdf4' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 0 0 3px rgba(21,128,61,0.1)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{truck.driverName}</span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', background: '#dbeafe', padding: '1px 6px', borderRadius: 4 }}>{truck.vehicleReg}</span>
                                {isSelected && <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', padding: '1px 6px', borderRadius: 4 }}>✓ SELECTED</span>}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 2 }}>{truck.vehicleType}</div>
                              <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: '0.72rem', color: '#64748b' }}>
                                <span>⭐ {truck.rating} ({truck.trips} trips)</span>
                                <span>•</span>
                                <span>{truck.capacityMT} MT capacity</span>
                                <span>•</span>
                                <span style={{ color: '#7e22ce', fontWeight: 600 }}>{truck.vahanStatus}</span>
                              </div>
                              <div style={{ fontSize: '0.71rem', color: '#b45309', fontWeight: 600, marginTop: 2, background: '#fef9c3', padding: '1px 6px', borderRadius: 4, display: 'inline-block' }}>
                                🏅 {truck.badge}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Est. Fee</div>
                              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: isSelected ? '#15803d' : '#0f172a' }}>₹{truckFee.toLocaleString('en-IN')}</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>₹{truck.ratePerKm}/km</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Distance and Estimated Cost */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: 10, 
                padding: '12px 14px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: '1px solid #f1f5f9'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated Distance</div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{selectedLot.distanceKm || 18} km</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Transport Escrow Fee</div>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>
                    {transportChoice === 'partner' ? `₹${estimatedTransportCost.toLocaleString('en-IN')}` : '₹0 (Self)'}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Date/Time Scheduler & Assigned Transporter */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: 14, 
              border: '1px solid #e2e8f0', 
              padding: 24,
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Pickup Scheduling
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                    Time Window
                  </label>
                  <select
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none'
                    }}
                  >
                    <option value="08:00 AM - 11:00 AM">Morning (08:00 - 11:00 AM)</option>
                    <option value="11:00 AM - 02:00 PM">Noon (11:00 AM - 02:00 PM)</option>
                    <option value="02:00 PM - 05:00 PM">Afternoon (02:00 - 05:00 PM)</option>
                    <option value="05:00 PM - 08:00 PM">Evening (05:00 - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Assigned Partner Vehicle Card — shows selectedTruck */}
              {transportChoice === 'partner' && (
                <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', borderRadius: 10, padding: 14, border: '2px solid #bbf7d0', marginBottom: 20 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Truck size={13} /> Assigned Transport Vehicle
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {selectedTruck.driverName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 2 }}>
                        {selectedTruck.vehicleReg} • {selectedTruck.vehicleType}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                        ⭐ {selectedTruck.rating} • {selectedTruck.capacityMT} MT • {selectedTruck.vahanStatus}
                      </div>
                    </div>
                    <a 
                      href={`tel:${selectedTruck.phone}`}
                      style={{ 
                        padding: '7px 14px', 
                        background: '#15803d', 
                        border: 'none', 
                        borderRadius: 8, 
                        fontSize: '0.78rem', 
                        fontWeight: 700, 
                        color: '#ffffff',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        boxShadow: '0 2px 6px rgba(21,128,61,0.25)'
                      }}
                    >
                      <Phone size={13} />
                      <span>Call Driver</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Confirm Transport Action Button (Shown when PAYMENT_CONFIRMED) */}
              <div style={{ marginTop: 'auto' }}>
                {selectedLot.status === BYPRODUCT_STAGES?.PAYMENT_CONFIRMED && (
                  <button
                    onClick={handleConfirmTransport}
                    style={{
                      width: '100%', padding: '12px', background: '#15803d', color: '#ffffff',
                      border: 'none', borderRadius: 10, fontSize: '0.92rem', fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, boxShadow: '0 4px 10px rgba(21, 128, 61, 0.25)'
                    }}
                  >
                    <Truck size={18} />
                    <span>Confirm Transport & Notify Farmer</span>
                  </button>
                )}

                {selectedLot.status === BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED && (
                  <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1.5px solid #bae6fd', borderRadius: 9, color: '#1d4ed8', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={15} />
                    <span>Transport assigned. Farmer will confirm farmgate pickup from their portal.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* === UNIFIED ASSIGNED TRANSPORTER DISPATCH CARD === */}
          {selectedLot && [BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED, BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT, BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION, BYPRODUCT_STAGES?.COMPLETED].includes(selectedLot.status) && (
            <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 18px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              {/* Trip Header */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#334155', color: '#94a3b8', padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800 }}>TRIP #JOB-{selectedLot.id}-BP</span>
                  <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800 }}>VAHAN VERIFIED COMMERCIAL FLEET</span>
                  <span style={{ background: '#fef9c3', color: '#92400e', padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800 }}>ESCROW LOCKED: ₹{(subtotal + estimatedTransportCost).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: selectedLot.status === BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED ? '#fde68a' : selectedLot.status === BYPRODUCT_STAGES?.COMPLETED ? '#86efac' : '#fdba74' }}>
                  {selectedLot.status === BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED ? '⏳ Awaiting Farm Gate Pickup' :
                   selectedLot.status === BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT ? '🚚 Vehicle In Transit — Buyer Verify on Arrival' :
                   selectedLot.status === BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION ? '📍 Arrived at Buyer Dock — Release Escrow' : '✅ Completed'}
                </div>
              </div>

              {/* Title + Route */}
              <div style={{ padding: '12px 20px 10px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 900, fontSize: '1.0rem', color: '#0f172a', marginBottom: 3 }}>
                  Assigned Transporter Dispatch <span style={{ fontWeight: 500, fontSize: '0.8rem', color: '#64748b' }}>(सध्या सुरू असलेली वाहतूक)</span>
                </div>
                <div style={{ fontSize: '0.79rem', color: '#475569' }}>
                  Transporting <strong>{selectedLot.quantityMT} MT {selectedLot.cropType}</strong> from <strong>{selectedLot.village || 'Pimpalgaon Farm Gate'}</strong> to <strong>AgroFresh Receiving Dock ({pickupLocation || 'Lasalgaon Bay 4'})</strong>
                </div>
              </div>

              {/* Driver + Action buttons row */}
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={18} style={{ color: '#1d4ed8' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{selectedTruck.driverName} (Assigned Driver)</span>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 4, fontSize: '0.67rem', fontWeight: 800 }}>Vahan Verified</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 2 }}>Vehicle: {selectedTruck.vehicleType} • Reg: <strong>{selectedTruck.vehicleReg}</strong></div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href={`tel:${selectedTruck.phone}`} style={{ padding: '7px 13px', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, color: '#334155', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Phone size={13} /> Call Driver ({selectedTruck.phone})
                  </a>
                  {selectedLot.status === BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT && (
                    <button
                      onClick={() => { arriveByProductDelivery(selectedLot.id); addToast({ type: 'success', role: 'buyer', title: '📍 Buyer Dock Verified!', message: `Lot #${selectedLot.id} marked delivered. Escrow ready for release.` }); }}
                      style={{ padding: '7px 14px', background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(29,78,216,0.3)' }}
                    >
                      <MapPin size={14} /> Verify Buyer Dock Receipt
                    </button>
                  )}
                  {selectedLot.status === BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION && (
                    <button
                      onClick={() => confirmByProductDelivery(selectedLot.id)}
                      style={{ padding: '7px 14px', background: 'linear-gradient(135deg, #15803d, #166534)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(21,128,61,0.3)' }}
                    >
                      <CheckCircle2 size={14} /> Confirm Quality & Release Escrow
                    </button>
                  )}
                </div>
              </div>

              {/* 4-Step Workflow */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                  { num: 1, label: 'STEP 1: DRIVER ASSIGNED', title: 'Locked to Route', detail: `${selectedTruck.vehicleReg} confirmed`, done: true, active: false, role: null },
                  { num: 2, label: 'STEP 2: FARM GATE PICKUP', title: 'Weighment & In-Transit', detail: 'Zero upfront cost to farmer',
                    done: [BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT, BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION, BYPRODUCT_STAGES?.COMPLETED].includes(selectedLot.status),
                    active: selectedLot.status === BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED, role: 'FARMER' },
                  { num: 3, label: 'STEP 3: BUYER DOCK VERIFICATION', title: pickupLocation || 'Lasalgaon Bay 4', detail: 'Photo & Weight receipt log',
                    done: [BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION, BYPRODUCT_STAGES?.COMPLETED].includes(selectedLot.status),
                    active: selectedLot.status === BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT, role: 'BUYER' },
                  { num: 4, label: 'STEP 4: DUAL ESCROW SPLIT', title: `₹${subtotal.toLocaleString('en-IN')} + ₹${estimatedTransportCost.toLocaleString('en-IN')}`, detail: 'Simultaneous bank release',
                    done: selectedLot.status === BYPRODUCT_STAGES?.COMPLETED,
                    active: selectedLot.status === BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION, role: 'AUTO' }
                ].map((s, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: s.done ? '#f0fdf4' : s.active ? '#eff6ff' : '#f8fafc', borderTop: `3px solid ${s.done ? '#22c55e' : s.active ? '#3b82f6' : '#e2e8f0'}` }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 900, color: s.done ? '#15803d' : s.active ? '#1d4ed8' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {s.done ? <Check size={10} /> : s.active ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} /> : <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }} />}
                      {s.label}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.83rem', color: s.done ? '#166534' : s.active ? '#1e3a8a' : '#64748b', marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: '0.72rem', color: s.done ? '#16a34a' : s.active ? '#3b82f6' : '#94a3b8' }}>{s.detail}</div>
                    {s.role === 'FARMER' && !s.done && <div style={{ marginTop: 5, fontSize: '0.63rem', fontWeight: 800, color: '#7e22ce', background: '#f3e8ff', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>🌾 Farmer Portal Action</div>}
                    {s.role === 'BUYER' && !s.done && <div style={{ marginTop: 5, fontSize: '0.63rem', fontWeight: 800, color: '#1d4ed8', background: '#dbeafe', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>🏭 Your Action (Buyer)</div>}
                    {s.role === 'AUTO' && !s.done && <div style={{ marginTop: 5, fontSize: '0.63rem', fontWeight: 800, color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>⚡ Auto on Release</div>}
                  </div>
                ))}
              </div>

              {/* Dispute */}
              {selectedLot.status === BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION && (
                <div style={{ padding: '10px 20px', borderTop: '1px solid #fee2e2', background: '#fff5f5', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => { disputeByProductDelivery(selectedLot.id, 'Quality rejection at buyer dock'); setStep(10); }} style={{ padding: '6px 13px', background: '#fff', border: '1.5px solid #f87171', color: '#dc2626', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Scale size={13} /> Raise Quality Dispute
                  </button>
                </div>
              )}

              {/* Completed Banner */}
              {selectedLot.status === BYPRODUCT_STAGES?.COMPLETED && (
                <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderTop: '2px solid #86efac' }}>
                  <div style={{ fontWeight: 900, color: '#15803d', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <CheckCircle2 size={17} /> Dual Escrow Released — Order Completed
                  </div>
                  <div style={{ fontSize: '0.79rem', color: '#166534' }}>
                    💰 ₹{subtotal.toLocaleString('en-IN')} → Farmer {selectedLot.farmerName} &nbsp;|&nbsp; 🚛 ₹{estimatedTransportCost.toLocaleString('en-IN')} → {selectedTruck.driverName} (Transporter)
                  </div>
                </div>
              )}
            </div>
          )}

          </>
          )}

          {transportViewTab === 'pickups' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Top Banner inside Pickups */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: 16, padding: '22px 26px', color: '#ffffff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                      VAHAN LOGISTICS FLEET
                    </span>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                      3 Scheduled Pickups
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>
                    Scheduled Farmgate Pickups & Bulk Hauler Allocation
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                    Automated farmgate loading and certified weighbridge tare tracking for baled residues.
                  </p>
                </div>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  style={{
                    padding: '9px 18px', background: '#15803d', color: '#ffffff',
                    borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.84rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
                  }}
                >
                  <PlusCircle size={15} />
                  <span>+ Schedule Pickup</span>
                </button>
              </div>

              {/* 3 Metric Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Fleet In Transit</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>3 Vehicles</div>
                  <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: 2, fontWeight: 600 }}>100% Vahan GPS Connected</div>
                </div>
                <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Volume in Dispatch Pipeline</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>75.0 MT</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>High-density compressed bales</div>
                </div>
                <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Tare Weighbridge SLA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369a1', marginTop: 4 }}>&lt; 45 Mins</div>
                  <div style={{ fontSize: '0.76rem', color: '#0369a1', marginTop: 2, fontWeight: 600 }}>MIDC Ambad Scales</div>
                </div>
                <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Zero Burning SLA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', marginTop: 4 }}>100% Clean</div>
                  <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: 2, fontWeight: 600 }}>Field Diversion Certificate</div>
                </div>
              </div>

              {/* Active Scheduled Pickups — live lots from context + static demo pickups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Live lots from byProductLots that have TRANSPORT_ASSIGNED or later status */}
                {byProductLots
                  .filter(lot => [
                    BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED,
                    BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT,
                    BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION
                  ].includes(lot.status))
                  .map(lot => {
                    const statusBadge = getStatusBadge(lot.status);
                    const lotTruck = lot.escrow?.transporter || selectedTruck;
                    return (
                      <div key={lot.id} style={{ background: '#ffffff', borderRadius: 14, border: '2px solid #bbf7d0', padding: 20, boxShadow: '0 2px 10px rgba(21,128,61,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Lot #{lot.id}</span>
                              <span style={{ background: statusBadge.bg, color: statusBadge.color, padding: '2px 8px', borderRadius: 6, fontSize: '0.73rem', fontWeight: 800 }}>
                                {statusBadge.label}
                              </span>
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700 }}>LIVE</span>
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginTop: 4 }}>
                              {lot.cropType} • <strong style={{ color: '#15803d' }}>{lot.quantityMT} MT</strong>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', padding: '6px 12px', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                            <MapPin size={13} />
                            <span>{lot.village || 'Pimpalgaon Baswant'}</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.82rem', marginBottom: 14 }}>
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Farmer:</div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{lot.farmerName || 'Santosh Shinde'}</div>
                            <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{lot.village}, {lot.taluka}</div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Assigned Hauler:</div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{lotTruck?.driverName || selectedTruck.driverName}</div>
                            <div style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.76rem' }}>{lotTruck?.vehicleNumber || selectedTruck.vehicleReg}</div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Scheduled Pickup:</div>
                            <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{lot.tracking?.scheduledDate || pickupDate}</div>
                            <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{lot.tracking?.timeSlot || pickupTimeSlot}</div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Escrow:</div>
                            <div style={{ fontWeight: 800, color: '#15803d', marginTop: 2 }}>₹{(lot.escrow?.productAmount || 0).toLocaleString('en-IN')}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{lot.escrow?.productStatus || 'LOCKED'}</div>
                          </div>
                        </div>

                        {/* Role-based delivery workflow buttons */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {lot.status === BYPRODUCT_STAGES?.TRANSPORT_ASSIGNED && (
                            <div style={{ flex: 1, padding: '9px 12px', background: '#eff6ff', border: '1px solid #bae6fd', borderRadius: 8, color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Clock size={14} /> Awaiting farmer dispatch from their portal
                            </div>
                          )}
                          {lot.status === BYPRODUCT_STAGES?.PICKED_UP_IN_TRANSIT && (
                            <button
                              onClick={() => {
                                setSelectedLotId(lot.id);
                                arriveByProductDelivery(lot.id);
                                addToast({ type: 'info', role: 'buyer', title: '📍 Arrival Confirmed', message: `Lot #${lot.id} marked delivered. Release escrow to complete.` });
                              }}
                              style={{ flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #b45309, #92400e)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                              <MapPin size={15} /> 📍 Buyer: Confirm Consignment Received
                            </button>
                          )}
                          {lot.status === BYPRODUCT_STAGES?.DELIVERED_AWAITING_CONFIRMATION && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedLotId(lot.id);
                                  disputeByProductDelivery(lot.id, 'Quality rejection at facility');
                                }}
                                style={{ padding: '10px 14px', background: '#fff', border: '1.5px solid #f87171', color: '#dc2626', borderRadius: 8, fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                              >
                                <Scale size={15} /> Reject / Dispute
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedLotId(lot.id);
                                  confirmByProductDelivery(lot.id);
                                }}
                                style={{ flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #15803d, #166534)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.83rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 6px rgba(21,128,61,0.3)' }}
                              >
                                <CheckCircle2 size={15} /> ✅ Buyer: Confirm Quality & Release Escrow (Auto-Complete)
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => addToast({ type: 'info', title: `GPS: Lot #${lot.id} vehicle on route.`, message: '' })}
                            style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                          >
                            <RefreshCw size={13} /> Track GPS
                          </button>
                        </div>
                      </div>
                    );
                  })
                }

                {/* Static demo scheduled pickups */}
                {[
                  {
                    id: 'BIO-PK-801', crop: 'Onion Stalks & Leaves', qty: '25 MT', farmer: 'Santosh Shinde',
                    village: 'Gut 142/B, Pimpalgaon Baswant, Niphad', truck: 'Tata LPT 1618 (10-Wheeler)',
                    regNo: 'MH-15-EG-4412', driver: 'Ganesh Jadhav', driverPhone: '+91 98220 11942',
                    slotTime: 'Tomorrow • 08:30 AM - 11:30 AM', weighbridge: 'MIDC Ambad Yard Weighbridge #02',
                    status: 'Driver Dispatched & En Route', badgeBg: '#dbeafe', badgeColor: '#1d4ed8'
                  },
                  {
                    id: 'BIO-PK-802', crop: 'Cotton Stalks / Parati', qty: '30 MT', farmer: 'Rameshwar Patil',
                    village: 'Gut 89/1, Wardha Biomass Cluster', truck: 'Eicher Pro 3019 (High Volume Bulker)',
                    regNo: 'MH-31-CB-9021', driver: 'Vijay Gholap', driverPhone: '+91 98229 55012',
                    slotTime: '9 Sept 2026 • 10:00 AM - 01:00 PM', weighbridge: 'Wardha APMC Computerized Tare Bridge',
                    status: 'Baler & Loading Crew Assigned', badgeBg: '#fef3c7', badgeColor: '#b45309'
                  },
                  {
                    id: 'BIO-PK-803', crop: 'Soyabean Straw / Bhusa', qty: '20 MT', farmer: 'Dnyaneshwar Gaikwad',
                    village: 'Gut 304/A, Renapur, Latur', truck: 'BharatBenz 1923 (Heavy Duty Rigid)',
                    regNo: 'MH-24-AX-5519', driver: 'Sachin Kadam', driverPhone: '+91 98225 33819',
                    slotTime: '10 Sept 2026 • 02:00 PM - 05:00 PM', weighbridge: 'Latur Agro Industrial Tare Scales',
                    status: 'Farmgate Loading Slotted', badgeBg: '#f3e8ff', badgeColor: '#7e22ce'
                  }
                ].map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0',
                      padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{p.id}</span>
                          <span style={{ background: p.badgeBg, color: p.badgeColor, padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                            {p.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginTop: 4 }}>
                          {p.crop} • <strong style={{ color: '#15803d' }}>{p.qty}</strong>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#f8fafc', padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
                        fontSize: '0.8rem', color: '#334155', fontWeight: 600
                      }}>
                        <Clock size={14} style={{ color: '#64748b' }} />
                        <span>{p.slotTime}</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12,
                      background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0',
                      fontSize: '0.82rem'
                    }}>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Farmgate Origin:</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.farmer}</div>
                        <div style={{ color: '#64748b', fontSize: '0.76rem' }}>{p.village}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Assigned Hauler:</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.truck}</div>
                        <div style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.76rem' }}>{p.regNo}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Driver & Contact:</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.driver}</div>
                        <a href={`tel:${p.driverPhone}`} style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none', fontSize: '0.76rem' }}>
                          {p.driverPhone}
                        </a>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Tare Weighbridge:</div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.weighbridge}</div>
                        <div style={{ color: '#16a34a', fontSize: '0.76rem', fontWeight: 600 }}>Zero Disparity SLA</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                      <button
                        onClick={() => { addToast({ type: 'info', title: 'GPS refresh', message: 'Vehicle is on schedule.' }); }}
                        style={{ padding: '7px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <RefreshCw size={13} />
                        <span>Track Live GPS</span>
                      </button>
                      <button
                        onClick={() => { addToast({ type: 'success', title: 'Download', message: `Weighbridge slip for ${p.id} downloaded.` }); }}
                        style={{ padding: '7px 14px', background: '#15803d', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <Download size={13} />
                        <span>Download Weighbridge Slip</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: FARMER DIRECTORY & PROFILES (148 VERIFIED BIOMASS GROWERS) */}
      {/* ========================================================================= */}
      {activeSection === 'directory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            borderRadius: 16, padding: '24px 28px', color: '#ffffff',
            boxShadow: '0 4px 14px rgba(21, 128, 61, 0.18)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  DIRECT FARMGATE NETWORK
                </span>
                <span style={{ background: '#fef08a', color: '#854d0e', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  148 Verified Farmers
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>
                Biomass & Crop Residue Grower Directory
              </h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: '#bbf7d0', maxWidth: 650 }}>
                Source baled onion husks, cotton stalks, soybean straw, and sugarcane trash straight from verified local farmers with zero middleman markups.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setActiveSection('listings')}
                style={{
                  padding: '9px 18px', background: '#ffffff', color: '#15803d',
                  borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <Grid size={15} />
                <span>Browse All Lots</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div style={{
            background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0',
            padding: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
            justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ position: 'relative', flex: '1 1 300px', minWidth: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by farmer name, village, or gut number..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px 9px 36px',
                  borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Crops' },
                { id: 'onion', label: 'Onion Husk & Leaves' },
                { id: 'cotton', label: 'Cotton Stalks' },
                { id: 'soyabean', label: 'Soyabean Straw' },
                { id: 'sugarcane', label: 'Sugarcane Trash' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setDirectoryResidueFilter(f.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem',
                    fontWeight: directoryResidueFilter === f.id ? 700 : 500,
                    background: directoryResidueFilter === f.id ? '#15803d' : '#f8fafc',
                    color: directoryResidueFilter === f.id ? '#ffffff' : '#475569',
                    border: directoryResidueFilter === f.id ? '1px solid #15803d' : '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
            {[
              {
                id: 'FARM-01', lotId: 'BIO-101', name: 'Santosh Shinde', village: 'Pimpalgaon Baswant', taluka: 'Niphad, Nashik',
                gutNo: 'Gut 142/B', residueType: 'Onion Stalks & Leaves', availableMT: 25, pricePerMT: 1200,
                moisture: '10.8%', baledStatus: 'Machine Baled & Poly-Covered', haulerAccess: '10-Wheeler Reachable',
                rating: 4.9, reviewsCount: 42, phone: '+91 98224 81920', cropKey: 'onion'
              },
              {
                id: 'FARM-02', lotId: 'BIO-102', name: 'Rameshwar Patil', village: 'Wardha Biomass Cluster', taluka: 'Deoli, Wardha',
                gutNo: 'Gut 89/1', residueType: 'Cotton Stalks / Parati', availableMT: 30, pricePerMT: 1850,
                moisture: '9.4%', baledStatus: 'PTO Shredded & Compacted', haulerAccess: 'Multi-axle Clearance',
                rating: 4.8, reviewsCount: 38, phone: '+91 98221 44021', cropKey: 'cotton'
              },
              {
                id: 'FARM-03', lotId: 'BIO-103', name: 'Dnyaneshwar Gaikwad', village: 'Renapur Farmgate Belt', taluka: 'Renapur, Latur',
                gutNo: 'Gut 304/A', residueType: 'Soyabean Straw / Bhusa', availableMT: 20, pricePerMT: 2100,
                moisture: '10.2%', baledStatus: 'Aerated Shed Stored', haulerAccess: 'FTL Tar Road',
                rating: 4.9, reviewsCount: 51, phone: '+91 98226 77140', cropKey: 'soyabean'
              },
              {
                id: 'FARM-04', lotId: 'BIO-104', name: 'Balasaheb Jagtap', village: 'Bawda Sugarcane Belt', taluka: 'Indapur, Pune',
                gutNo: 'Gut 512', residueType: 'Sugarcane Trash / Pachat', availableMT: 35, pricePerMT: 1650,
                moisture: '11.5%', baledStatus: 'High-Density Rectangular Bales', haulerAccess: 'Heavy Trailer Suitable',
                rating: 4.9, reviewsCount: 29, phone: '+91 98228 10924', cropKey: 'sugarcane'
              },
              {
                id: 'FARM-05', lotId: 'BIO-101', name: 'Popatlal Chavan', village: 'Yeola Agro Sub-district', taluka: 'Yeola, Nashik',
                gutNo: 'Gut 74', residueType: 'Onion Stalks & Leaves', availableMT: 18, pricePerMT: 1200,
                moisture: '11.0%', baledStatus: 'Sun-Dried & Clean', haulerAccess: '6-Wheeler Tar Road',
                rating: 4.7, reviewsCount: 22, phone: '+91 98230 55182', cropKey: 'onion'
              },
              {
                id: 'FARM-06', lotId: 'BIO-104', name: 'Vitthalrao Deshmukh', village: 'Malegaon Khurd', taluka: 'Baramati, Pune',
                gutNo: 'Gut 198/2', residueType: 'Sugarcane Trash / Pachat', availableMT: 40, pricePerMT: 1650,
                moisture: '12.0%', baledStatus: 'Fresh Post-Harvest Bales', haulerAccess: 'Tractor Trolley & FTL',
                rating: 4.8, reviewsCount: 34, phone: '+91 98231 66299', cropKey: 'sugarcane'
              }
            ].filter(farmer => {
              const matchesSearch = farmer.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
                farmer.village.toLowerCase().includes(directorySearch.toLowerCase()) ||
                farmer.residueType.toLowerCase().includes(directorySearch.toLowerCase());
              const matchesFilter = directoryResidueFilter === 'all' || farmer.cropKey === directoryResidueFilter;
              return matchesSearch && matchesFilter;
            }).map((farmer) => (
              <div
                key={farmer.id}
                style={{
                  background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0',
                  padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{farmer.name}</span>
                        <CheckCircle size={14} style={{ color: '#16a34a' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                        <MapPin size={13} style={{ color: '#94a3b8' }} />
                        <span>{farmer.village} ({farmer.gutNo}), {farmer.taluka}</span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 8,
                      fontSize: '0.78rem', fontWeight: 800
                    }}>
                      <Star size={13} fill="#b45309" />
                      <span>{farmer.rating}</span>
                      <span style={{ color: '#92400e', fontSize: '0.7rem' }}>({farmer.reviewsCount})</span>
                    </div>
                  </div>

                  <div style={{
                    background: '#f8fafc', borderRadius: 10, padding: 12, border: '1px solid #e2e8f0',
                    marginBottom: 14, fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>Residue / Crop:</span>
                      <strong style={{ color: '#0f172a' }}>{farmer.residueType}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>Stock Available:</span>
                      <strong style={{ color: '#15803d' }}>{farmer.availableMT} MT Ready</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>Rate per MT:</span>
                      <strong style={{ color: '#0f172a' }}>₹{farmer.pricePerMT} / MT</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>Moisture Level:</span>
                      <span style={{ color: '#0369a1', fontWeight: 700 }}>{farmer.moisture} (Certified Dry)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Hauler Access:</span>
                      <span style={{ color: '#334155', fontWeight: 600 }}>{farmer.haulerAccess}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <a
                    href={`tel:${farmer.phone}`}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8,
                      background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                      fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <Phone size={14} />
                    <span>Call Farmer</span>
                  </a>
                  <button
                    onClick={() => {
                      const lot = byProductLots.find(l => l.id === farmer.lotId) || byProductLots[0];
                      if (lot) handleSelectLotForPurchase(lot);
                    }}
                    style={{
                      flex: 1.4, padding: '9px', borderRadius: 8,
                      background: '#15803d', color: '#ffffff', border: 'none',
                      fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 2px 4px rgba(21, 128, 61, 0.2)'
                    }}
                  >
                    <span>Procure Lot</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: FARMGATE PICKUP SCHEDULING (3 SCHEDULED) */}
      {/* ========================================================================= */}
      {activeSection === 'pickups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Banner */}
          <div style={{
            background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  VAHAN BIOMASS FLEET LOGISTICS
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  3 Pickups Scheduled
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                Farmgate Pickup Scheduling & Dispatch Desk
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Manage bulky biomass hauling, tractor-trolley pickups, and weighbridge tare slips directly from farmgates.
              </p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              style={{
                padding: '10px 20px', background: '#15803d', color: '#ffffff',
                borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.85rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
              }}
            >
              <PlusCircle size={16} />
              <span>Schedule New Pickup</span>
            </button>
          </div>

          {/* 3 Metric Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Fleet In Transit</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>3 Vehicles</div>
              <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: 2, fontWeight: 600 }}>100% Vahan GPS Connected</div>
            </div>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Volume in Dispatch Pipeline</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>75.0 MT</div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>High-density compressed bales</div>
            </div>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Weighbridge Verification SLA</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369a1', marginTop: 4 }}>&lt; 45 Mins</div>
              <div style={{ fontSize: '0.76rem', color: '#0369a1', marginTop: 2, fontWeight: 600 }}>MIDC Ambad Tare Scales</div>
            </div>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Stubble Burning Prevention</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', marginTop: 4 }}>100% Clean</div>
              <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: 2, fontWeight: 600 }}>Zero Field Burning Guarantee</div>
            </div>
          </div>

          {/* Active Scheduled Pickups List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                id: 'BIO-PK-801', crop: 'Onion Stalks & Leaves', qty: '25 MT', farmer: 'Santosh Shinde',
                village: 'Gut 142/B, Pimpalgaon Baswant, Niphad', truck: 'Tata LPT 1618 (10-Wheeler)',
                regNo: 'MH-15-EG-4412', driver: 'Ganesh Jadhav', driverPhone: '+91 98220 11942',
                slotTime: 'Tomorrow • 08:30 AM - 11:30 AM', weighbridge: 'MIDC Ambad Yard Weighbridge #02',
                status: 'Driver Dispatched & En Route', badgeBg: '#dbeafe', badgeColor: '#1d4ed8'
              },
              {
                id: 'BIO-PK-802', crop: 'Cotton Stalks / Parati', qty: '30 MT', farmer: 'Rameshwar Patil',
                village: 'Gut 89/1, Wardha Biomass Cluster', truck: 'Eicher Pro 3019 (High Volume Bulker)',
                regNo: 'MH-31-CB-9021', driver: 'Vijay Gholap', driverPhone: '+91 98229 55012',
                slotTime: '9 Sept 2026 • 10:00 AM - 01:00 PM', weighbridge: 'Wardha APMC Computerized Tare Bridge',
                status: 'Baler & Loading Crew Assigned', badgeBg: '#fef3c7', badgeColor: '#b45309'
              },
              {
                id: 'BIO-PK-803', crop: 'Soyabean Straw / Bhusa', qty: '20 MT', farmer: 'Dnyaneshwar Gaikwad',
                village: 'Gut 304/A, Renapur, Latur', truck: 'BharatBenz 1923 (Heavy Duty Rigid)',
                regNo: 'MH-24-AX-5519', driver: 'Sachin Kadam', driverPhone: '+91 98225 33819',
                slotTime: '10 Sept 2026 • 02:00 PM - 05:00 PM', weighbridge: 'Latur Agro Industrial Tare Scales',
                status: 'Farmgate Loading Slotted', badgeBg: '#f3e8ff', badgeColor: '#7e22ce'
              }
            ].map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0',
                  padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{p.id}</span>
                      <span style={{ background: p.badgeBg, color: p.badgeColor, padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginTop: 4 }}>
                      {p.crop} • <strong style={{ color: '#15803d' }}>{p.qty}</strong>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#f8fafc', padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
                    fontSize: '0.8rem', color: '#334155', fontWeight: 600
                  }}>
                    <Clock size={14} style={{ color: '#64748b' }} />
                    <span>{p.slotTime}</span>
                  </div>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12,
                  background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0',
                  fontSize: '0.82rem'
                }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Farmgate Origin:</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.farmer}</div>
                    <div style={{ color: '#64748b', fontSize: '0.76rem' }}>{p.village}</div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Assigned Hauler:</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.truck}</div>
                    <div style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.76rem' }}>{p.regNo}</div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Driver & Contact:</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.driver}</div>
                    <a href={`tel:${p.driverPhone}`} style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none', fontSize: '0.76rem' }}>
                      {p.driverPhone}
                    </a>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.74rem' }}>Tare Weighbridge:</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{p.weighbridge}</div>
                    <div style={{ color: '#16a34a', fontSize: '0.76rem', fontWeight: 600 }}>Zero Disparity SLA</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                  <button
                    onClick={() => {
                      addToast('Driver tracking refreshed. Vehicle is on schedule.', 'info');
                    }}
                    style={{
                      padding: '7px 14px', background: '#ffffff', border: '1px solid #cbd5e1',
                      borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: '#334155', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5
                    }}
                  >
                    <RefreshCw size={13} />
                    <span>Track Live GPS</span>
                  </button>
                  <button
                    onClick={() => {
                      addToast(`Weighbridge tare slip downloaded for ${p.id}`, 'success');
                    }}
                    style={{
                      padding: '7px 14px', background: '#15803d', border: 'none',
                      borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5
                    }}
                  >
                    <Download size={13} />
                    <span>Download Weighbridge Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: FAIR PRICE ADVISOR (AGMARKNET & MAHAURJA) */}
      {/* ========================================================================= */}
      {activeSection === 'advisor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            borderRadius: 16, padding: '24px 28px', color: '#ffffff',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                AGMARKNET & MEDA BENCHMARKS
              </span>
              <span style={{ background: '#bbf7d0', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                Live Industrial Parity Index
              </span>
            </div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 900 }}>
              Biomass & Crop Residue Fair Price Advisor
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.86rem', color: '#e0f2fe', maxWidth: 700 }}>
              Official benchmark rates, calorific fuel value indices, and direct cost-benefit comparisons against industrial steam coal.
            </p>
          </div>

          {/* 4 Commodity Rate Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                crop: 'Onion Stalks & Leaves', price: 1200, agmarknet: 1150, calorific: '3,450 kcal/kg',
                ash: '< 5.8%', moisture: '< 11.5%', usage: 'Bio-Briquettes & Pellet Blends', color: '#15803d', bg: '#f0fdf4'
              },
              {
                crop: 'Cotton Stalks / Parati', price: 1850, agmarknet: 1800, calorific: '4,120 kcal/kg',
                ash: '< 3.9%', moisture: '< 10.0%', usage: 'High-Heat Thermal Power Boilers', color: '#b45309', bg: '#fefce8'
              },
              {
                crop: 'Soyabean Straw / Bhusa', price: 2100, agmarknet: 2050, calorific: '3,900 kcal/kg',
                ash: '< 6.2%', moisture: '< 10.5%', usage: 'Cattle Feed Pellets & Bio-Coal', color: '#0369a1', bg: '#f0f9ff'
              },
              {
                crop: 'Sugarcane Trash / Pachat', price: 1650, agmarknet: 1600, calorific: '3,680 kcal/kg',
                ash: '< 7.0%', moisture: '< 12.0%', usage: 'Sugar Mill Co-Gen Boilers', color: '#7e22ce', bg: '#faf5ff'
              }
            ].map((c) => (
              <div
                key={c.crop}
                style={{
                  background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0',
                  padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{c.crop}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '8px 0 12px 0' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: c.color }}>₹{c.price}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>/ Metric Tonne</span>
                </div>

                <div style={{ background: c.bg, padding: 12, borderRadius: 10, fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Agmarknet Modal:</span>
                    <strong>₹{c.agmarknet} / MT</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Calorific Value:</span>
                    <strong>{c.calorific}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Ash Content:</span>
                    <strong>{c.ash}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Moisture Cap:</span>
                    <strong>{c.moisture}</strong>
                  </div>
                </div>

                <div style={{ marginTop: 12, fontSize: '0.76rem', color: '#64748b' }}>
                  <strong>Best For:</strong> {c.usage}
                </div>
              </div>
            ))}
          </div>

          {/* Boiler Fuel Savings Interactive Calculator */}
          <div style={{
            background: '#ffffff', borderRadius: 16, border: '1px solid #bbf7d0',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  INTERACTIVE BOILER PARITY SIMULATOR
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Industrial Boiler Fuel Savings vs Steam Coal
                </h3>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Benchmark: Grade B Steam Coal @ ₹8,500/MT vs Biomass Briquettes @ ₹2,800/MT
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Monthly Boiler Coal Consumption:</span>
                  <strong style={{ color: '#0369a1', fontSize: '1.05rem' }}>{calcCoalMT} Metric Tonnes</strong>
                </label>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={calcCoalMT}
                  onChange={(e) => setCalcCoalMT(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0369a1', margin: '12px 0 6px 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8' }}>
                  <span>20 MT (Small Boiler)</span>
                  <span>250 MT (Standard Plant)</span>
                  <span>500 MT (Heavy Unit)</span>
                </div>

                <div style={{ marginTop: 16, background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155' }}>
                  <div>• Current Coal Spend: <strong>₹{(calcCoalMT * 8500).toLocaleString('en-IN')}</strong> / month</div>
                  <div style={{ marginTop: 4 }}>• Equivalent Biomass Needed: <strong>{Math.round(calcCoalMT * 1.35)} MT</strong> (at 1.35x calorific ratio)</div>
                  <div style={{ marginTop: 4 }}>• Biomass Spend: <strong>₹{Math.round(calcCoalMT * 1.35 * 2800).toLocaleString('en-IN')}</strong> / month</div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                color: '#ffffff', borderRadius: 14, padding: 24, textAlign: 'center',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
              }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#bbf7d0', fontWeight: 800 }}>
                  Estimated Monthly Cash Savings
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, margin: '8px 0' }}>
                  ₹{((calcCoalMT * 8500) - Math.round(calcCoalMT * 1.35 * 2800)).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#86efac', fontWeight: 700 }}>
                  ~ 55.5% Direct Energy Cost Reduction
                </div>
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: 8, fontSize: '0.78rem' }}>
                  🌿 Plus <strong>{Math.round(calcCoalMT * 1.8)} T CO₂e</strong> Clean Energy Carbon Credits
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: TRUST & RATINGS (4.9 ★) */}
      {/* ========================================================================= */}
      {activeSection === 'ratings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header */}
          <div style={{
            background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                    COMMUNITY REPUTATION INDEX
                  </span>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                    218 Verified Farmgate Dispatches
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                  Biomass Grower Trust & Quality Ratings
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                  Real feedback from industrial buyers on moisture compliance, bale compaction, and weighbridge accuracy.
                </p>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fffbeb', border: '1px solid #fde68a', padding: '12px 20px', borderRadius: 12
              }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#b45309', lineHeight: 1 }}>
                  4.9
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, color: '#b45309' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={15} fill="#b45309" />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#92400e', fontWeight: 700, marginTop: 2 }}>
                    Overall Network Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Compliance Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>MOISTURE SLA COMPLIANCE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>98.4%</div>
              <div style={{ fontSize: '0.76rem', color: '#166534', marginTop: 2 }}>Average moisture under 11.2%</div>
            </div>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>RESIDUE PURITY RATING</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0369a1', marginTop: 4 }}>99.2%</div>
              <div style={{ fontSize: '0.76rem', color: '#0369a1', marginTop: 2 }}>Zero stones or foreign matter</div>
            </div>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>ON-TIME FARMGATE LOADING</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', marginTop: 4 }}>96.8%</div>
              <div style={{ fontSize: '0.76rem', color: '#92400e', marginTop: 2 }}>Within slotted hauler window</div>
            </div>
            <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>ESCROW DISPUTE-FREE RATE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#7e22ce', marginTop: 4 }}>99.1%</div>
              <div style={{ fontSize: '0.76rem', color: '#6b21a8', marginTop: 2 }}>Seamless instant settlement</div>
            </div>
          </div>

          {/* Verified Buyer Reviews */}
          <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 22 }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
              Recent Industrial Buyer Reviews
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {[
                {
                  reviewer: 'Sunil Mehta', role: 'Operations Head', company: 'Maha Urja Pellets Ltd.',
                  farmer: 'Santosh Shinde', crop: '25 MT Onion Stalks', rating: 5,
                  comment: 'Santosh Shinde’s onion stalks were properly dried under poly-tunnels. Moisture tested 10.4%, zero deduction. Clean loading for our 10-wheeler.'
                },
                {
                  reviewer: 'Dr. Rahul Kulkarni', role: 'Technical Director', company: 'Vidarbha Bio-Energy Hub',
                  farmer: 'Rameshwar Patil', crop: '30 MT Cotton Stalks', rating: 5,
                  comment: 'Procured 30 MT of cotton stalks. Perfectly shredded using tractor PTO chopper, high calorific heat output in our fluidized bed boiler.'
                },
                {
                  reviewer: 'Mahesh Jadhav', role: 'Procurement Lead', company: 'Sahyadri Cattle Feed & Pellets',
                  farmer: 'Dnyaneshwar Gaikwad', crop: '20 MT Soyabean Straw', rating: 5,
                  comment: 'Dnyaneshwar’s soyabean straw is consistently dry and golden. Excellent compaction, zero fungus or dust. Will re-order regularly.'
                }
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{r.reviewer}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{r.role}, {r.company}</div>
                      </div>
                      <div style={{ display: 'flex', color: '#b45309' }}>
                        {[...Array(r.rating)].map((_, idx) => (
                          <Star key={idx} size={13} fill="#b45309" />
                        ))}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', fontStyle: 'italic', lineHeight: 1.45 }}>
                      "{r.comment}"
                    </p>
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Farmer: <strong style={{ color: '#15803d' }}>{r.farmer}</strong></span>
                    <span>{r.crop}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: GRIEVANCE REDRESSAL (DIRECT DESK) */}
      {/* ========================================================================= */}
      {activeSection === 'grievance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header */}
          <div style={{
            background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  24 - 48H RESOLUTION SLA
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  Escrow Protection Active
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                By-Product Dispute & Grievance Redressal Desk
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Direct desk for moisture excess deductions, weighbridge tare reconciliation, and contamination settlements.
              </p>
            </div>

            <button
              onClick={() => setShowDisputeModal(true)}
              style={{
                padding: '10px 18px', background: '#dc2626', color: '#ffffff',
                borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.85rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
              }}
            >
              <AlertTriangle size={16} />
              <span>Raise New Claim</span>
            </button>
          </div>

          {/* Dispute Resolution Policy Overview */}
          <div style={{
            background: '#fff7ed', borderRadius: 14, border: '1px solid #ffedd5',
            padding: 18, display: 'flex', gap: 16, alignItems: 'flex-start'
          }}>
            <Scale size={24} style={{ color: '#ea580c', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.84rem', color: '#9a3412' }}>
              <strong style={{ color: '#c2410c' }}>Automated Pro-Rata Moisture Adjustment Protocol:</strong> Rather than rejecting whole truckloads of bulky biomass, any lot with moisture above the 12% contractual threshold automatically qualifies for a pro-rata rate deduction from the escrow balance, refunding the difference to the buyer while immediately releasing the adjusted fair amount to the farmer.
            </div>
          </div>

          {/* Ticket Logs */}
          <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 22 }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              Recent Claim & Grievance Log
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                {
                  ticketId: 'TKT-BIO-441', lotId: 'BIO-103', type: 'Moisture Excess (+2.3%)',
                  description: 'Factory halogen assay registered 12.8% moisture vs 10.5% declared in digital certificate.',
                  resolution: 'Pro-rata weight adjustment applied: ₹966 refunded from escrow to buyer account.',
                  time: 'Resolved in 14 hours', status: 'RESOLVED', badgeBg: '#dcfce7', badgeColor: '#15803d'
                },
                {
                  ticketId: 'TKT-BIO-389', lotId: 'BIO-098', type: 'Weighbridge Tare Disparity (140 kg)',
                  description: 'Variance between farmgate mobile scale and factory automated weighbridge.',
                  resolution: 'Calibrated against MIDC government tare slip. Final net weight settled at 24.86 MT.',
                  time: 'Resolved in 18 hours', status: 'RESOLVED', badgeBg: '#dcfce7', badgeColor: '#15803d'
                }
              ].map((t) => (
                <div
                  key={t.ticketId}
                  style={{
                    padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{t.ticketId}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Lot #{t.lotId}</span>
                      <span style={{ background: t.badgeBg, color: t.badgeColor, padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800 }}>
                        {t.status}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.84rem', marginTop: 4 }}>
                      {t.type}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {t.description}
                    </p>
                    <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                      ✓ {t.resolution}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600 }}>
                    {t.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 9: VERIFIED BUYER PROFILE (VERIFIED) */}
      {/* ========================================================================= */}
      {activeSection === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header */}
          <div style={{
            background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, background: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d'
              }}>
                <Building size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                    AgroPower Pellets & Bio-Energy Corp
                  </h2>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                    ✓ VERIFIED BUYER
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 3 }}>
                  Plot 42, Sector D, MIDC Ambad Industrial Area, Nashik 422010 • GSTIN: 27AABCA4412K1Z9
                </div>
              </div>
            </div>

            <div style={{
              background: '#f8fafc', padding: '8px 16px', borderRadius: 10, border: '1px solid #e2e8f0',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>DIRECT ESCROW BALANCE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803d' }}>₹5,00,000.00</div>
            </div>
          </div>

          {/* 3 Detail Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Card 1: Facility & Intake */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Factory size={16} style={{ color: '#15803d' }} />
                <span>Intake & Processing Capacity</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Monthly Intake:</span>
                  <strong>850 MT Biomass</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Weighbridge:</span>
                  <strong>60 MT Dual In-Motion</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Unloading SLA:</span>
                  <strong>&lt; 35 mins per truck</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Accepted Residues:</span>
                  <strong>Onion, Cotton, Straw, Cane</strong>
                </div>
              </div>
            </div>

            {/* Card 2: Legal & Licenses */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} style={{ color: '#0369a1' }} />
                <span>Compliance & Pollution Clearances</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>CPCB Reg No:</span>
                  <strong>CPCB/BIO/2023/8821</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>MPCB Category:</span>
                  <strong>Orange CTO Active</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Boiler Feed:</span>
                  <strong>100% Zero-Coal Certified</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>MEDA Status:</span>
                  <strong>Enrolled Bio-Energy Unit</strong>
                </div>
              </div>
            </div>

            {/* Card 3: Financial Settlement */}
            <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={16} style={{ color: '#b45309' }} />
                <span>Direct Bank Escrow Standing</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Escrow Bank:</span>
                  <strong>SBI Industrial Ambad</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Farmer Payout Speed:</span>
                  <strong>Avg 2.4 Hours</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <strong>Instant NEFT / RTGS / UPI</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Farmer Rating:</span>
                  <strong style={{ color: '#b45309' }}>5.0 ★ Prompt Paymaster</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 10: ORDER HISTORY (LOG) */}
      {/* ========================================================================= */}
      {activeSection === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header */}
          <div style={{
            background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0',
            padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  PROCUREMENT LEDGER
                </span>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  110 MT Total Transacted
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                By-Product Procurement Order History & Invoices
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Complete ledger of all farmgate biomass purchases, invoices, and direct settlement receipts.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'completed', 'transit', 'escrow'].map(f => (
                <button
                  key={f}
                  onClick={() => setHistoryFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem',
                    fontWeight: historyFilter === f ? 700 : 500,
                    background: historyFilter === f ? '#15803d' : '#f8fafc',
                    color: historyFilter === f ? '#ffffff' : '#475569',
                    border: historyFilter === f ? '1px solid #15803d' : '1px solid #cbd5e1',
                    cursor: 'pointer', textTransform: 'capitalize'
                  }}
                >
                  {f === 'all' ? 'All Orders' : f === 'completed' ? 'Delivered & Paid' : f === 'transit' ? 'In Transit' : 'Escrow Locked'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Residue Lot</th>
                    <th style={{ padding: '12px 16px' }}>Farmer & Origin</th>
                    <th style={{ padding: '12px 16px' }}>Quantity</th>
                    <th style={{ padding: '12px 16px' }}>Total Escrow</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      orderId: 'BIO-ORD-2024-001', lotId: 'BIO-101', crop: 'Onion Stalks & Leaves', farmer: 'Santosh Shinde',
                      village: 'Pimpalgaon Baswant', qty: 25, price: 30000, status: 'completed', statusLabel: 'Delivered & Paid',
                      badgeBg: '#dcfce7', badgeColor: '#15803d', date: '4 Sept 2026'
                    },
                    {
                      orderId: 'BIO-ORD-2024-002', lotId: 'BIO-102', crop: 'Cotton Stalks / Parati', farmer: 'Rameshwar Patil',
                      village: 'Wardha Biomass Cluster', qty: 30, price: 55500, status: 'transit', statusLabel: 'In Transit',
                      badgeBg: '#e0f2fe', badgeColor: '#0369a1', date: '6 Sept 2026'
                    },
                    {
                      orderId: 'BIO-ORD-2024-003', lotId: 'BIO-103', crop: 'Soyabean Straw / Bhusa', farmer: 'Dnyaneshwar Gaikwad',
                      village: 'Renapur, Latur', qty: 20, price: 42000, status: 'escrow', statusLabel: 'Escrow Locked',
                      badgeBg: '#fef3c7', badgeColor: '#b45309', date: '7 Sept 2026'
                    },
                    {
                      orderId: 'BIO-ORD-2024-004', lotId: 'BIO-104', crop: 'Sugarcane Trash / Pachat', farmer: 'Balasaheb Jagtap',
                      village: 'Bawda, Indapur', qty: 35, price: 57750, status: 'completed', statusLabel: 'Delivered & Paid',
                      badgeBg: '#dcfce7', badgeColor: '#15803d', date: '2 Sept 2026'
                    }
                  ].filter(o => {
                    if (historyFilter === 'all') return true;
                    return o.status === historyFilter;
                  }).map((ord) => (
                    <tr key={ord.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>{ord.orderId}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{ord.crop}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Lot #{ord.lotId}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{ord.farmer}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{ord.village}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#15803d' }}>{ord.qty} MT</td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>₹{ord.price.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: ord.badgeBg, color: ord.badgeColor, padding: '3px 8px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 800 }}>
                          {ord.statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.78rem' }}>{ord.date}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setSelectedLotId(ord.lotId);
                            setShowReceiptModal(true);
                          }}
                          style={{
                            padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1',
                            borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 5
                          }}
                        >
                          <Download size={13} />
                          <span>PDF Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDULE PICKUP MODAL */}
      {/* ========================================================================= */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 9999
        }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>Schedule Farmgate Residue Pickup</div>
              <button onClick={() => setShowScheduleModal(false)} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Select Verified Farmer & Farmgate</label>
                <select
                  value={newPickupFarmer}
                  onChange={(e) => setNewPickupFarmer(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Santosh Shinde">Santosh Shinde (Gut 142/B, Pimpalgaon Baswant)</option>
                  <option value="Rameshwar Patil">Rameshwar Patil (Gut 89/1, Wardha Cluster)</option>
                  <option value="Dnyaneshwar Gaikwad">Dnyaneshwar Gaikwad (Gut 304/A, Renapur, Latur)</option>
                  <option value="Balasaheb Jagtap">Balasaheb Jagtap (Gut 512, Bawda, Indapur)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Crop Residue / Biomass Type</label>
                <select
                  value={newPickupCrop}
                  onChange={(e) => setNewPickupCrop(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Onion Stalks & Leaves">Onion Stalks & Leaves (कांदा पात व टरफले)</option>
                  <option value="Cotton Stalks / Parati">Cotton Stalks / Parati (कापूस पराटी)</option>
                  <option value="Soyabean Straw / Bhusa">Soyabean Straw / Bhusa (सोयाबीन भुसा)</option>
                  <option value="Sugarcane Trash / Pachat">Sugarcane Trash / Pachat (ऊस पाचट)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Quantity (MT)</label>
                  <input
                    type="number"
                    value={newPickupQty}
                    onChange={(e) => setNewPickupQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Pickup Date</label>
                  <input
                    type="date"
                    value={newPickupDate}
                    onChange={(e) => setNewPickupDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  onClick={() => {
                    addToast(`Pickup scheduled with ${newPickupFarmer} for ${newPickupQty} MT. Vahan hauler slotted.`, 'success');
                    setShowScheduleModal(false);
                  }}
                  style={{ flex: 1, padding: 10, background: '#15803d', color: '#ffffff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Confirm & Dispatch Hauler
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RAISE DISPUTE MODAL */}
      {/* ========================================================================= */}
      {showDisputeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 9999
        }}>
          <div style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={18} />
                <span>File Biomass Quality Dispute</span>
              </div>
              <button onClick={() => setShowDisputeModal(false)} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Select Biomass Lot</label>
                <select
                  value={disputeLotCode}
                  onChange={(e) => setDisputeLotCode(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="BIO-101">Lot #BIO-101 (25 MT Onion Stalks - Santosh Shinde)</option>
                  <option value="BIO-102">Lot #BIO-102 (30 MT Cotton Stalks - Rameshwar Patil)</option>
                  <option value="BIO-103">Lot #BIO-103 (20 MT Soyabean Straw - Dnyaneshwar Gaikwad)</option>
                  <option value="BIO-104">Lot #BIO-104 (35 MT Sugarcane Trash - Balasaheb Jagtap)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Dispute Ground / Cause</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="moisture_excess">Moisture Exceeds 12% SLA (Pro-rata deduction requested)</option>
                  <option value="weight_disparity">Weighbridge Tare Disparity (Scale difference &gt; 100 kg)</option>
                  <option value="foreign_matter">Contamination / Stones in Bales</option>
                  <option value="delay">Logistics / Farmgate Loading Delayed</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Supporting Observation / Tare Slip Note</label>
                <textarea
                  rows={3}
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  placeholder="Enter weighbridge slip number, measured moisture %, or specific details..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  onClick={() => {
                    disputeByProductDelivery(disputeLotCode, { disputeReason, disputeNotes });
                    addToast(`Dispute ticket filed for Lot #${disputeLotCode}. Escrow frozen for resolution.`, 'warning');
                    setShowDisputeModal(false);
                  }}
                  style={{ flex: 1, padding: 10, background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Submit & Freeze Escrow
                </button>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  style={{ padding: '10px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DOWNLOADABLE RECEIPT MODAL */}
      {/* ========================================================================= */}
      {showReceiptModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          zIndex: 9999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            width: '100%',
            maxWidth: 480,
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                Payment Receipt & Invoice
              </div>
              <button 
                onClick={() => setShowReceiptModal(false)}
                style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div style={{ padding: 24 }}>
              <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '1px dashed #cbd5e1' }}>
                <div style={{ fontWeight: 900, color: '#15803d', fontSize: '1.2rem' }}>
                  AgriConnect Maharashtra
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Direct Agricultural Residue / Biomass Purchase Receipt
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                  Receipt #: AGRI-RES-{selectedLot.id} • Status: {selectedLot.status}
                </div>
              </div>

              <div style={{ margin: '16px 0', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Item / Crop Residue:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedLot.cropType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Quantity:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentQty} MT</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Product Escrow:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{subtotal.toLocaleString('en-IN')} ({selectedLot.escrow?.productStatus || 'FUNDED'})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Transport Escrow:</span>
                  <span>₹{estimatedTransportCost.toLocaleString('en-IN')} ({selectedLot.escrow?.transportStatus || 'UNLOCKED'})</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  paddingTop: 10, 
                  borderTop: '1px solid #e2e8f0', 
                  fontWeight: 800, 
                  fontSize: '1rem', 
                  color: '#0f172a',
                  marginTop: 8
                }}>
                  <span>Total Escrow Amount:</span>
                  <span style={{ color: '#15803d' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => {
                    window.print();
                    setShowReceiptModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  style={{
                    padding: '10px 16px',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
}
