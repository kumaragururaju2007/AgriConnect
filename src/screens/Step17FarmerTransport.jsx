import React, { useState } from 'react';
import { 
  Truck, ShieldCheck, MapPin, Phone, Star, CheckCircle2, 
  ArrowRight, ExternalLink, Filter, Search, Clock, DollarSign, 
  AlertCircle, ChevronRight, Navigation, Sparkles, X, Info,
  Package, Calendar, Check, Award, RefreshCw
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { MOCK_TRANSPORT_COMPANIES, TALUKA_OPTIONS, VEHICLE_CATEGORY_OPTIONS } from '../data/mockTransportCompanies';

export default function Step17FarmerTransport({ setStep, setTerminal, lang = 'mr', onOpenDriverPortal }) {
  const { 
    authUser, farmer, lots, deals, deliveryJobs, confirmPickup, addToast, switchRole,
    confirmTransportSelection, activeWorkflowLotId, LOT_STAGES 
  } = useAgri();

  // Active view tabs: 'directory' (Company List) | 'active_dispatches' | 'rates_subsidies'
  const [activeTab, setActiveTab] = useState('directory');

  // Filters
  const [selectedTaluka, setSelectedTaluka] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState('lot_onion');
  const [selectedDestination, setSelectedDestination] = useState('lasalgaon');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Recent Bookings made in this session
  const [bookedDispatches, setBookedDispatches] = useState([]);

  // Active existing delivery from AgriContext (e.g. MH 15 EG 4402)
  const activeDelivery = deliveryJobs.find(j => j.status !== 'COMPLETED') || deliveryJobs[0];

  // Available lots of the farmer to choose for transport
  const farmerLots = [
    { id: 'lot_onion', code: 'LOT-2024-0941', crop: 'Red Onion (लाल कांदा - Grade A)', qty: '120 Qtl (12 MT)', location: 'Gut No. 142/B, Pimpalgaon Field', dealWith: 'AgroFresh Supply Chain Ltd' },
    { id: 'lot_soya', code: 'LOT-2024-0812', crop: 'Yellow Soyabean (सोयाबीन - JS-335)', qty: '45 Qtl (4.5 MT)', location: 'Gut No. 142/B, Niphad Shivar', dealWith: 'MahaOilseed Processors' },
    { id: 'lot_grapes', code: 'LOT-2024-0610', crop: 'Thompson Seedless Grapes (द्राक्षे - Export)', qty: '80 Qtl (8.0 MT)', location: 'Dindori Highland Vineyard', dealWith: 'Direct APMC Lasalgaon' },
    { id: 'lot_custom', code: 'CUSTOM-FARM-GATE', crop: 'Custom Harvest Farm-Gate Load', qty: 'Open Quantity (प्रति क्विंटल)', location: 'Farmer Field Gate Pickup', dealWith: 'Open Market Direct Transport' }
  ];

  // Destinations with distances from Niphad/Farmer field
  const destinationOptions = [
    { id: 'lasalgaon', name: 'Lasalgaon APMC Market Yard (लासलगाव कांदा मार्केट)', distanceKm: 14, estTime: '25 mins', baseToll: 0 },
    { id: 'pimpalgaon', name: 'Pimpalgaon Baswant APMC Yard (पिंपळगाव टोमॅटो/भाजीपाला मार्केट)', distanceKm: 8, estTime: '15 mins', baseToll: 0 },
    { id: 'mswc_godown', name: 'MSWC Cold Storage Godown #4 (महाराष्ट्र राज्य वखार महामंडळ)', distanceKm: 18, estTime: '30 mins', baseToll: 50 },
    { id: 'agrofresh_hub', name: 'AgroFresh Central Processing Hub (अॅग्रोफ्रेश वेअरहाऊस नाशिक)', distanceKm: 22, estTime: '35 mins', baseToll: 80 },
    { id: 'vashi_mumbai', name: 'Vashi APMC Market, Navi Mumbai (वाशी मुंबई मुख्य कृषी बाजार)', distanceKm: 172, estTime: '4h 15m', baseToll: 420 }
  ];

  // Filter companies
  const filteredCompanies = MOCK_TRANSPORT_COMPANIES.filter(company => {
    // Taluka filter
    if (selectedTaluka !== 'all') {
      if (company.areaKey !== selectedTaluka && company.areaKey !== 'all') {
        return false;
      }
    }
    // Vehicle type filter
    if (selectedVehicleType !== 'all') {
      if (company.category !== selectedVehicleType && company.category !== 'all') {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = company.name.toLowerCase().includes(q) || company.localName.toLowerCase().includes(q);
      const matchTaluka = company.taluka.toLowerCase().includes(q);
      const matchSpecialty = company.specialties.some(s => s.toLowerCase().includes(q));
      const matchCrops = company.cropsSupported.some(c => c.toLowerCase().includes(q));
      return matchName || matchTaluka || matchSpecialty || matchCrops;
    }
    return true;
  });

  // Open booking modal for a specific company
  const handleOpenBooking = (company) => {
    setSelectedCompany(company);
    setSelectedVehicleModel(company.primaryVehicles[0]?.model || 'Standard Commercial Truck');
    setBookingModalOpen(true);
  };

  // Calculate freight price in booking modal
  const selectedDestObj = destinationOptions.find(d => d.id === selectedDestination) || destinationOptions[0];
  const selectedLotObj = farmerLots.find(l => l.id === selectedLotId) || farmerLots[0];
  const calculatedDistance = selectedDestObj.distanceKm;
  const ratePerKm = selectedCompany?.baseRatePerKm || 24;
  const rawFreight = Math.max(1200, calculatedDistance * ratePerKm);
  const tollAmount = selectedDestObj.baseToll;
  const govtSubsidy = Math.round(rawFreight * 0.30); // 30% MahaDBT transit subsidy
  const netPayableEscrow = rawFreight + tollAmount - govtSubsidy;

  // Confirm booking
  const handleConfirmBooking = () => {
    setIsSubmittingBooking(true);
    setTimeout(() => {
      const newBooking = {
        bookingId: `TRP-MH-${Math.floor(1000 + Math.random() * 9000)}`,
        companyName: selectedCompany.name,
        companyPhone: selectedCompany.phone,
        contactPerson: selectedCompany.contactPerson,
        lot: selectedLotObj,
        destination: selectedDestObj,
        vehicleModel: selectedVehicleModel,
        freightAmount: netPayableEscrow,
        subsidyAmount: govtSubsidy,
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eta: `${selectedCompany.avgArrivalMinutes} minutes`,
        assignedTruckReg: selectedCompany.primaryVehicles[0]?.reg || 'MH 15 EG 4402',
        status: 'DISPATCHED_EN_ROUTE'
      };

      setBookedDispatches(prev => [newBooking, ...prev]);
      setIsSubmittingBooking(false);
      setBookingModalOpen(false);

      confirmTransportSelection(activeWorkflowLotId || selectedLotObj.id, {
        companyName: selectedCompany.name,
        contactPerson: selectedCompany.contactPerson,
        phone: selectedCompany.phone,
        vehicleModel: selectedVehicleModel,
        assignedTruckReg: selectedCompany.primaryVehicles[0]?.reg || 'MH 15 EG 4402',
        destinationName: selectedDestObj.name,
        freightAmount: netPayableEscrow
      });

      addToast({
        type: 'success',
        title: 'वाहतूकदार यशस्वीरित्या निवडला! (Transporter Booked)',
        message: `${selectedCompany.name} कडे वाहन क्रमांक ${newBooking.assignedTruckReg} बुक झाले आहे. ड्रायव्हर शेतात पोहोचत आहे. (Status: TRANSPORT_CONFIRMED)`
      });
    }, 800);
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>
      
      {/* 1. TOP HERO RIBBON */}
      <div className="panel" style={{ 
        padding: '24px 28px', marginBottom: 24, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #eff6ff 100%)', 
        border: '1px solid #bbf7d0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                <ShieldCheck size={13} />
                <span>VAHAN & APMC ACCREDITED FLEETS</span>
              </span>
              <span className="badge badge-blue">Nashik Division 04 (नाशिक विभाग)</span>
              <span className="badge badge-amber">100% Dual Escrow Protected (सुरक्षित एस्क्रो)</span>
            </div>
            
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-title)', letterSpacing: '-0.02em', margin: 0 }}>
              Accredited Transportation Companies & Fleets
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4, maxWidth: 880, lineHeight: 1.45 }}>
              शेतकरी बांधवांसाठी अधिकृत कृषी माल वाहतूक कंपन्यांची यादी. आपल्या परिसरातील (निफाड, लासलगाव, पिंपळगाव, दिंडोरी) वाहने निवडा, थेट शेतावर ट्रक बोलवा व एस्क्रो सुरक्षेसह माल बाजार समितीत पोहोचवा.
            </p>
          </div>

          {/* Quick Metrics & Driver Portal Action */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#15803d' }}>
                {MOCK_TRANSPORT_COMPANIES.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Active Fleets</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #93c5fd', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1d4ed8' }}>
                57+
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Available Trucks</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#c2410c' }}>
                ~22 min
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Avg. Arrival</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(22, 101, 52, 0.12)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('directory')}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
              background: activeTab === 'directory' ? '#15803d' : '#ffffff',
              color: activeTab === 'directory' ? '#ffffff' : '#334155',
              border: activeTab === 'directory' ? '1px solid #166534' : '1px solid #cbd5e1',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: activeTab === 'directory' ? '0 2px 6px rgba(21, 128, 61, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Truck size={15} />
            <span>Available Transport Companies ({MOCK_TRANSPORT_COMPANIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_dispatches')}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
              background: activeTab === 'active_dispatches' ? '#2563eb' : '#ffffff',
              color: activeTab === 'active_dispatches' ? '#ffffff' : '#334155',
              border: activeTab === 'active_dispatches' ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: activeTab === 'active_dispatches' ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Navigation size={15} />
            <span>My Bookings & Dispatches ({bookedDispatches.length + (activeDelivery ? 1 : 0)})</span>
            {bookedDispatches.length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, padding: '1px 7px', fontSize: '0.68rem' }}>
                New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rates_subsidies')}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
              background: activeTab === 'rates_subsidies' ? '#ea580c' : '#ffffff',
              color: activeTab === 'rates_subsidies' ? '#ffffff' : '#334155',
              border: activeTab === 'rates_subsidies' ? '1px solid #c2410c' : '1px solid #cbd5e1',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: activeTab === 'rates_subsidies' ? '0 2px 6px rgba(234, 88, 12, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <DollarSign size={15} />
            <span>APMC Freight Rate Card & MahaDBT 50% Subsidy</span>
          </button>
        </div>
      </div>

      {/* RECENT BOOKING SUCCESS BANNER (If booked recently) */}
      {bookedDispatches.length > 0 && activeTab === 'directory' && (
        <div className="panel" style={{ 
          padding: '18px 22px', marginBottom: 24, 
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)', 
          border: '2px solid #86efac', borderRadius: 12 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Check size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#14532d' }}>
                    Active Booking: {bookedDispatches[0].companyName}
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                    TRUCK EN ROUTE TO FARM GATE
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: 2 }}>
                  Booking ID: <strong>{bookedDispatches[0].bookingId}</strong> • Assigned Vehicle: <strong>{bookedDispatches[0].assignedTruckReg}</strong> • Driver ETA: <strong>{bookedDispatches[0].eta}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <a 
                href={`tel:${bookedDispatches[0].companyPhone}`} 
                className="btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
              >
                <Phone size={14} /> Call Driver ({bookedDispatches[0].companyPhone})
              </a>
              <button 
                onClick={() => setActiveTab('active_dispatches')} 
                className="btn-primary" 
                style={{ fontSize: '0.78rem', padding: '6px 16px' }}
              >
                <span>Track Live Dispatch</span> <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB 1: TRANSPORT COMPANIES DIRECTORY */}
      {activeTab === 'directory' && (
        <>
          {/* SEARCH & FILTERS BAR */}
          <div className="panel" style={{ padding: '18px 20px', marginBottom: 20, background: '#ffffff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Row 1: Search and Vehicle Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                
                {/* Search input */}
                <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by company name, taluka, crop specialty (e.g. Sahyadri, Lasalgaon, Onion, Grapes)..."
                    style={{
                      width: '100%', padding: '9px 14px 9px 36px', borderRadius: 8,
                      border: '1px solid #cbd5e1', fontSize: '0.86rem', outline: 'none'
                    }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Vehicle type filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>
                    Vehicle Type:
                  </span>
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    style={{
                      padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1',
                      fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', background: '#f8fafc',
                      outline: 'none', cursor: 'pointer'
                    }}
                  >
                    {VEHICLE_CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Taluka Quick Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} color="#15803d" />
                  <span>Area / Taluka (तालुका):</span>
                </span>
                
                {TALUKA_OPTIONS.map(t => {
                  const isSelected = selectedTaluka === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setSelectedTaluka(t.key)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: '0.76rem',
                        fontWeight: isSelected ? 800 : 500,
                        background: isSelected ? '#15803d' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        border: isSelected ? '1px solid #166534' : '1px solid #e2e8f0',
                        cursor: 'pointer', transition: 'all 0.12s ease'
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* RESULTS COUNT & STATUS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              Showing <strong style={{ color: '#0f172a' }}>{filteredCompanies.length}</strong> accredited transport companies in selected area
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)' }}></span>
              <span>Live Fleet Tracking Connected</span>
            </div>
          </div>

          {/* COMPANIES GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(430px, 1fr))', gap: 20 }}>
            {filteredCompanies.map(company => (
              <div 
                key={company.id}
                className="panel hover-lift"
                style={{
                  padding: '22px', borderRadius: 12, background: '#ffffff',
                  border: company.id === 'sahyadri_agro' || company.id === 'lasalgaon_syndicate' ? '2px solid #86efac' : '1px solid #e2e8f0',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative'
                }}
              >
                {/* Highlight ribbon for top recommended */}
                {(company.id === 'sahyadri_agro' || company.id === 'lasalgaon_syndicate') && (
                  <div style={{
                    position: 'absolute', top: 0, right: 24, transform: 'translateY(-50%)',
                    background: '#15803d', color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                    padding: '2px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em'
                  }}>
                    ★ APMC Top Rated Carrier
                  </div>
                )}

                <div>
                  {/* Company Header & Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {company.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, marginTop: 2 }}>
                        {company.localName}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fef9c3', border: '1px solid #fde047', padding: '3px 8px', borderRadius: 6 }}>
                      <Star size={13} fill="#eab308" color="#eab308" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#854d0e' }}>
                        {company.rating}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#a16207' }}>
                        ({company.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Verification & Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    <span className="badge badge-green" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <ShieldCheck size={11} /> {company.vahanStatus}
                    </span>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                      {company.apmcAccreditation}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {company.taluka}
                    </span>
                  </div>

                  {/* Fleet Availability & Arrival Meter */}
                  <div style={{ 
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, 
                    padding: '10px 12px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Available Trucks Now
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                        <span>{company.availableTrucksNow} Trucks Ready in {company.taluka.split('&')[0].trim()}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Farm Gate Arrival
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={13} color="#2563eb" />
                        <span>~{company.avgArrivalMinutes} Mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Vehicles / Models */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>
                      Available Fleet in Area:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {company.primaryVehicles.map((v, i) => (
                        <span 
                          key={i}
                          style={{
                            background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 5,
                            fontSize: '0.72rem', fontWeight: 600, border: '1px solid #cbd5e1'
                          }}
                        >
                          🚛 {v.model} ({v.capacity})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Crop Specialties */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 5 }}>
                      Specialized For:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {company.specialties.map((s, i) => (
                        <span 
                          key={i}
                          style={{
                            background: '#ecfdf5', color: '#166534', padding: '2px 7px', borderRadius: 4,
                            fontSize: '0.7rem', fontWeight: 600
                          }}
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Insurance Sub-box */}
                  <div style={{ 
                    borderTop: '1px solid #f1f5f9', paddingTop: 12, marginBottom: 16, 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>APMC Transparent Rate</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                        ₹{company.baseRatePerKm}<span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#64748b' }}>/km</span>{' '}
                        <span style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 700 }}>
                          (₹{company.flatRatePerQtlMandi}/Qtl)
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                        🛡️ {company.insuranceCover.split('(')[0]}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Bottom Actions */}
                <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => handleOpenBooking(company)}
                    className="btn-primary"
                    style={{
                      flex: 1, padding: '10px 14px', fontSize: '0.84rem', fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                      boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
                    }}
                  >
                    <span>Select & Book Transporter (वाहतूकदार निवडा)</span>
                    <ArrowRight size={15} />
                  </button>

                  <a
                    href={`tel:${company.phone}`}
                    className="btn-secondary"
                    style={{
                      padding: '10px 12px', fontSize: '0.8rem', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
                    }}
                    title={`Call Dispatch: ${company.phone}`}
                  >
                    <Phone size={15} color="#2563eb" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </>
      )}

      {/* 3. TAB 2: MY BOOKINGS & ACTIVE DISPATCHES */}
      {activeTab === 'active_dispatches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Active Trip Console (Direct Link to ongoing delivery e.g. Rajesh Patil) */}
          <div className="panel" style={{ padding: '24px', border: '2px solid #93c5fd', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: '#1e40af', color: '#fff', padding: '3px 9px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                    TRIP #{activeDelivery?.job_code || 'JOB-2024-8841'}
                  </span>
                  <span className="badge badge-green">VAHAN VERIFIED COMMERCIAL FLEET</span>
                  <span className="badge badge-amber">ESCROW LOCKED: ₹14,800</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: 6, margin: 0 }}>
                  Assigned Transporter Dispatch (सध्या सुरू असलेली वाहतूक)
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 4 }}>
                  Transporting <strong>120 Qtl Grade-A Red Onion (Nashik Export Lot)</strong> from <strong>Pimpalgaon Farm Gate</strong> to <strong>AgroFresh Receiving Dock (Lasalgaon Bay 4)</strong>.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Driver Live Status</div>
                <span className="badge badge-green" style={{ fontSize: '0.82rem', padding: '5px 12px', marginTop: 4 }}>
                  ✓ Farm Gate Arrival in 12 Mins
                </span>
              </div>
            </div>

            {/* Assigned Driver & Vehicle Identity Box */}
            <div style={{ 
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, 
              padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Truck size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Rajesh Vitthal Patil (Assigned Driver)
                    </h4>
                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Vahan Verified</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: 2 }}>
                    Vehicle: <strong>Eicher Pro 2049 (6-Wheel Heavy Truck)</strong> • Reg: <strong style={{ color: '#1d4ed8' }}>MH 15 EG 4402</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <a 
                  href="tel:+919822144021" 
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', padding: '8px 16px', textDecoration: 'none' }}
                >
                  <Phone size={15} color="#2563eb" />
                  <span>Call Driver (+91 98221 44021)</span>
                </a>
                
                <button
                  onClick={() => confirmPickup(activeDelivery?.id || activeDelivery?.job_code || 1, 1, 'Farmer confirmed loading and tare weighment at farm gate.')}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  <CheckCircle2 size={15} />
                  <span>Confirm Farm Gate Pickup (माल लोड झाला)</span>
                </button>
              </div>
            </div>

            {/* 4-Stage Dual Escrow Progression Tracker */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase' }}>Step 1: Driver Assigned</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Locked to Route</div>
                <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: 2 }}>MH 15 EG 4402 confirmed</div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>Step 2: Farm Gate Pickup</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Weighment & In-Transit</div>
                <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: 2 }}>Zero upfront cost to farmer</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Step 3: Buyer Dock Verification</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>Lasalgaon Bay 4</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>Photo & Weight receipt log</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Step 4: Dual Escrow Split</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>₹2,91,000 + ₹14,800</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>Simultaneous bank release</div>
              </div>
            </div>
          </div>

          {/* List of Session Booked Dispatches */}
          {bookedDispatches.length > 0 && (
            <div className="panel" style={{ padding: '20px', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
                Recent Bookings Made in this Session
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bookedDispatches.map((b, idx) => (
                  <div key={idx} style={{ 
                    padding: '14px 16px', borderRadius: 8, background: '#f8fafc', 
                    border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.85rem' }}>{b.bookingId}</span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>{b.companyName}</span>
                        <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{b.status}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                        Lot: <strong>{b.lot.crop}</strong> • Destination: <strong>{b.destination.name}</strong> • Vehicle: <strong>{b.assignedTruckReg}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#15803d' }}>
                        ₹{b.freightAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        MahaDBT Subsidy: -₹{b.subsidyAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. TAB 3: APMC FREIGHT RATES & MAHADBT SUBSIDY */}
      {activeTab === 'rates_subsidies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-green">GOVERNMENT OF MAHARASHTRA • APMC STATUTORY RULES</span>
              <span className="badge badge-blue">Nashik Mandi Zone Rate Card</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Official Ceiling Freight Rates (शासकीय प्रमाणित कृषी वाहतूक दर)
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 4 }}>
              Maharashtra APMC Act Section 31-B mandates transparent freight rates for registered commercial carriers transporting agricultural produce from farm gates to APMC market yards.
            </p>

            {/* Rate Cards Table */}
            <div style={{ overflowX: 'auto', marginTop: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 800, color: '#334155' }}>Vehicle Category</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800, color: '#334155' }}>Payload Capacity</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800, color: '#334155' }}>APMC Standard Rate</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800, color: '#334155' }}>Flat Mandi Rate (≤25 km)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800, color: '#334155' }}>Transit Cover Included</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>Pickup / Mini Truck (Bolero / Tata Ace)</td>
                    <td style={{ padding: '12px 14px' }}>1.0 - 2.0 MT (10 - 20 Qtl)</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>₹16 - ₹18 / km</td>
                    <td style={{ padding: '12px 14px' }}>₹600 - ₹900 flat</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-green">₹3.5 Lakh</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>Medium Goods Vehicle (Eicher Pro 2049 / Tata 407)</td>
                    <td style={{ padding: '12px 14px' }}>4.0 - 6.0 MT (40 - 60 Qtl)</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>₹22 - ₹24 / km</td>
                    <td style={{ padding: '12px 14px' }}>₹1,400 - ₹2,000 flat</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-green">₹6.0 Lakh</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>Heavy Multi-Axle Truck (Tata LPT 1613 / 1920)</td>
                    <td style={{ padding: '12px 14px' }}>10.0 - 16.0 MT (100 - 160 Qtl)</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#15803d' }}>₹24 - ₹26 / km</td>
                    <td style={{ padding: '12px 14px' }}>₹3,200 - ₹4,500 flat</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-green">₹10.0 Lakh</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>Reefer Cold Chain Van (2°C to 8°C Insulated)</td>
                    <td style={{ padding: '12px 14px' }}>5.0 - 8.0 MT (50 - 80 Qtl)</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1d4ed8' }}>₹30 - ₹34 / km</td>
                    <td style={{ padding: '12px 14px' }}>₹2,800 - ₹3,800 flat</td>
                    <td style={{ padding: '12px 14px' }}><span className="badge badge-blue">₹12.0 Lakh (Pre-cooling)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MahaDBT Subsidy Card */}
          <div className="panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)', border: '1px solid #fed7aa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-amber">MAHADBT SCHEME #MH-AGRI-TRANS-2024</span>
              <span className="badge badge-green">Direct Bank DBT Active</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
              50% Transportation Subsidy for Small & Marginal Farmers
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#7c2d12', marginTop: 4, lineHeight: 1.45 }}>
              Under the Maharashtra State Agri-Marketing Board (MSAMB) scheme, farmers with landholding below 5 acres (holding verified 7/12 extract) receive a <strong>30% to 50% instant freight subsidy</strong> when booking Vahan-verified transport to accredited APMCs or WDRA godowns.
            </p>

            <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
              <div style={{ background: '#fff', border: '1px solid #fdba74', padding: '10px 16px', borderRadius: 8 }}>
                <div style={{ fontSize: '0.72rem', color: '#9a3412', fontWeight: 700 }}>Eligible Talukas</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#431407', marginTop: 2 }}>Niphad, Dindori, Sinnar, Malegaon, Yeola</div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #fdba74', padding: '10px 16px', borderRadius: 8 }}>
                <div style={{ fontSize: '0.72rem', color: '#9a3412', fontWeight: 700 }}>Subsidy Deduction</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d', marginTop: 2 }}>Automatically discounted in State Escrow</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 5. INTERACTIVE BOOKING MODAL */}
      {bookingModalOpen && selectedCompany && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div className="animate-scale-in" style={{
            background: '#ffffff', borderRadius: 16, maxWidth: 640, width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: 14, marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Vahan Verified</span>
                  <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{selectedCompany.taluka}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Select & Book: {selectedCompany.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600 }}>
                  {selectedCompany.localName}
                </div>
              </div>

              <button
                onClick={() => setBookingModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Modal Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Step 1: Select Lot */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>
                  1. Select Produce / Lot to Transport (वाहनात भरण्यासाठी शेतमाल निवडा):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {farmerLots.map(lot => (
                    <div
                      key={lot.id}
                      onClick={() => setSelectedLotId(lot.id)}
                      style={{
                        padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                        border: selectedLotId === lot.id ? '2px solid #15803d' : '1px solid #cbd5e1',
                        background: selectedLotId === lot.id ? '#f0fdf4' : '#ffffff',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                          {lot.crop}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Qty: <strong>{lot.qty}</strong> • Location: {lot.location}
                        </div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: selectedLotId === lot.id ? '5px solid #15803d' : '2px solid #cbd5e1', background: '#fff' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Pickup & Destination */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Pickup Location (उचलण्याचे ठिकाण):
                  </label>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem', color: '#0f172a' }}>
                    📍 <strong>{farmer.land_gut_no || 'Gut No. 142/B'}</strong>, {farmer.village || 'Pimpalgaon Baswant'}, {farmer.taluka || 'Niphad'}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Destination (गंतव्य स्थान / बाजार समिती):
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1',
                      fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', outline: 'none'
                    }}
                  >
                    {destinationOptions.map(dest => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name} ({dest.distanceKm} km)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Vehicle Type Selection */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Assigned Vehicle Model from Fleet:
                </label>
                <select
                  value={selectedVehicleModel}
                  onChange={(e) => setSelectedVehicleModel(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1',
                    fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', outline: 'none'
                  }}
                >
                  {selectedCompany.primaryVehicles.map((v, idx) => (
                    <option key={idx} value={v.model}>
                      {v.model} ({v.capacity}) — {v.reg} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 4: Transparent Freight & Escrow Calculation */}
              <div style={{ 
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, 
                padding: '14px 16px' 
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Fare & Escrow Breakdown (वाहतूक भाडे व एस्क्रो)</span>
                  <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>MahaDBT Applied</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.8rem', color: '#475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Estimated Distance ({selectedDestObj.distanceKm} km × ₹{ratePerKm}/km):</span>
                    <span>₹{rawFreight.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Highway Toll / Mandi Cess:</span>
                    <span>₹{tollAmount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803d', fontWeight: 700 }}>
                    <span>MahaDBT 30% Govt Freight Subsidy:</span>
                    <span>-₹{govtSubsidy.toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #cbd5e1', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 900, color: '#0f172a' }}>
                    <span>Total Net Freight in Escrow:</span>
                    <span style={{ color: '#15803d' }}>₹{netPayableEscrow.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ marginTop: 10, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 10px', fontSize: '0.72rem', color: '#1e40af', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <ShieldCheck size={14} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span>
                    <strong>Dual Escrow Protection:</strong> शेतकर्‍याला आगाऊ १ रुपयाही द्यावा लागत नाही. माल बाजार समितीत किंवा खरेदीदाराकडे उतरवून वजन पावती मिळाल्यानंतरच एस्क्रोमधून वाहनचालकाला थेट पैसे वर्ग होतात.
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px 16px', fontSize: '0.85rem' }}
              >
                Cancel (रद्द करा)
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isSubmittingBooking}
                className="btn-primary"
                style={{
                  flex: 2, padding: '10px 16px', fontSize: '0.85rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                }}
              >
                {isSubmittingBooking ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Dispatching Truck...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Confirm Booking & Dispatch Truck (वाहतूक निश्चित करा)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
