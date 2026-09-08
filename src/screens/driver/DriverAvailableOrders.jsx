import React, { useState } from 'react';
import { 
  Package, MapPin, DollarSign, Clock, ShieldCheck, 
  AlertCircle, CheckCircle2, Filter, Search, ArrowRight, 
  Users, Check, ExternalLink, Phone
} from 'lucide-react';
import { MOCK_AVAILABLE_LOADS, VEHICLE_DETAILS } from './driverData';

export default function DriverAvailableOrders({
  deliveryJobs,
  onAcceptJob,
  activeJob,
  setActiveTab,
  lang = 'en'
}) {
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptingId, setAcceptingId] = useState(null);

  // Combine context available jobs with rich mock loads
  const allLoads = MOCK_AVAILABLE_LOADS;

  const filteredLoads = allLoads.filter(load => {
    // Commodity filter
    if (selectedCommodity !== 'all') {
      const matchCommodity = load.commodity.toLowerCase().includes(selectedCommodity.toLowerCase());
      if (!matchCommodity) return false;
    }

    // Distance filter
    if (selectedDistance === 'near' && load.distance_km > 20) return false;
    if (selectedDistance === 'medium' && (load.distance_km <= 20 || load.distance_km > 50)) return false;
    if (selectedDistance === 'long' && load.distance_km <= 50) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = load.commodity.toLowerCase().includes(q)
        || load.pickup_location.toLowerCase().includes(q)
        || load.drop_location.toLowerCase().includes(q)
        || load.farmer_name.toLowerCase().includes(q)
        || load.buyer_name.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleAccept = async (load) => {
    setAcceptingId(load.id);
    try {
      if (onAcceptJob) {
        await onAcceptJob(load);
      }
      setTimeout(() => {
        setAcceptingId(null);
        setActiveTab('active_trip');
      }, 600);
    } catch (e) {
      setAcceptingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        borderRadius: 16,
        padding: '22px 26px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(2, 132, 199, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.2)' }}>
              MAHARASHTRA APMC FREIGHT EXCHANGE
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e0f2fe' }}>
              • Zero Commission Transporter Portal
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
            Available Orders & Pre-Funded Cargo
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#bae6fd' }}>
            Direct farm-gate and mandi-to-mandi procurement loads with 100% state escrow vault protection.
          </p>
        </div>

        {/* Driver Vehicle Limit Badge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          padding: '10px 16px',
          borderRadius: 12,
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#e0f2fe', fontWeight: 700, textTransform: 'uppercase' }}>
            YOUR TRUCK PAYLOAD LIMIT
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
            {VEHICLE_DETAILS.reg_no} ({VEHICLE_DETAILS.max_payload_tonnes} MT)
          </div>
          <div style={{ fontSize: '0.74rem', color: '#bbf7d0', fontWeight: 600 }}>
            Up to {VEHICLE_DETAILS.max_payload_qtl} Qtl Single Batch
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 10,
            padding: '7px 12px',
            minWidth: 240,
            flex: '1 1 240px'
          }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search by crop, farmer, or drop mandi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.84rem'
              }}
            />
          </div>

          {/* Commodity Dropdown */}
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Commodities</option>
            <option value="onion">Red Onion (कांदा)</option>
            <option value="soyabean">Soyabean (सोयाबीन)</option>
            <option value="tomato">Tomato (टोमॅटो)</option>
            <option value="pomegranate">Pomegranate (डाळिंब)</option>
            <option value="grapes">Export Grapes (द्राक्षे)</option>
          </select>

          {/* Distance Filter */}
          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <option value="all">Any Distance</option>
            <option value="near">Local (Under 20 km)</option>
            <option value="medium">Regional (20 - 50 km)</option>
            <option value="long">Long Haul (50+ km)</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
          Showing <strong>{filteredLoads.length}</strong> available loads
        </div>
      </div>

      {/* Available Load Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
        {filteredLoads.map((load) => {
          const isPooled = load.is_pooled;
          const isAccepting = acceptingId === load.id;

          return (
            <div
              key={load.id}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {/* Card Header: Commodity & Urgency */}
              <div style={{
                padding: '16px 20px',
                background: isPooled ? 'linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%)' : '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                      {load.commodity}
                    </span>
                    {isPooled && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 10,
                        background: '#15803d',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <Users size={10} /> Pooled Lot
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                    {load.variety} • Code: {load.job_code}
                  </div>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 20,
                  background: load.urgency === 'HIGH' ? '#fee2e2' : '#f1f5f9',
                  color: load.urgency === 'HIGH' ? '#b91c1c' : '#475569'
                }}>
                  {load.urgency === 'HIGH' ? 'Immediate Dispatch' : 'Scheduled'}
                </span>
              </div>

              {/* Card Body: Route, Load Details, Farmer Info */}
              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Weight & Distance Badges */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    Weight: {load.quantity_qtl} Qtl ({load.weight_tonnes} MT)
                  </span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    Distance: {load.distance_km} km ({load.est_transit_time})
                  </span>
                </div>

                {/* Pickup & Drop Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <MapPin size={15} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Pickup Point
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                        {load.pickup_location}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 1 }}>
                        Consignor: <strong>{load.farmer_name}</strong> ({load.farmer_phone})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Destination (APMC / Processing Dock)
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                        {load.drop_location}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 1 }}>
                        Consignee: <strong>{load.buyer_name}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {load.special_notes && (
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    color: '#92400e',
                    lineHeight: 1.4
                  }}>
                    <strong>Cargo Requirement:</strong> {load.special_notes}
                  </div>
                )}

                {/* Financials & Pre-funded Escrow Pill */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Freight Fee (Govt APMC Fixed)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>
                      ₹{load.freight_fee.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 12,
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <ShieldCheck size={11} /> 100% Locked in Escrow
                    </span>
                    <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: 2 }}>
                      Ref: {load.escrow_ref}
                    </div>
                  </div>
                </div>

                {/* Accept Button */}
                <button
                  disabled={isAccepting}
                  onClick={() => handleAccept(load)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 10,
                    border: 'none',
                    background: isAccepting ? '#94a3b8' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isAccepting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  {isAccepting ? (
                    'Locking Schedule with APMC...'
                  ) : (
                    <>
                      <Check size={16} /> Accept Load & Lock Schedule
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
