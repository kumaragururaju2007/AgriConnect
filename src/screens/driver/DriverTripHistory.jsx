import React, { useState } from 'react';
import { 
  History, Search, Filter, MapPin, CheckCircle2, 
  DollarSign, FileText, Download, Star, ExternalLink, 
  Scale, Calendar, X, ShieldCheck
} from 'lucide-react';
import { COMPLETED_TRIPS_HISTORY, DRIVER_PROFILE } from './driverData';

export default function DriverTripHistory({ lang = 'en' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');

  const filteredTrips = COMPLETED_TRIPS_HISTORY.filter((trip) => {
    if (selectedCropFilter !== 'all') {
      if (!trip.commodity.toLowerCase().includes(selectedCropFilter.toLowerCase())) {
        return false;
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = trip.commodity.toLowerCase().includes(q)
        || trip.trip_code.toLowerCase().includes(q)
        || trip.origin.toLowerCase().includes(q)
        || trip.destination.toLowerCase().includes(q)
        || trip.consignor.toLowerCase().includes(q)
        || trip.consignee.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: 16,
        padding: '22px 26px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(30, 41, 59, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.15)' }}>
              OFFICIAL MANDI AUDIT LOG
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#cbd5e1' }}>
              • All 84 Trips Verified with GST e-Way Bills
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
            Completed Consignment Archive
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
            Complete historical record of dispatches, APMC weighbridge receipts, and settled DBT bank remittances.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '10px 16px',
          borderRadius: 12,
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
            LIFETIME FREIGHT DISBURSED
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4ade80' }}>
            ₹1,84,650.00
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
            100% DBT to SBI A/c *******4402
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 10,
            padding: '7px 12px',
            minWidth: 260,
            flex: '1 1 260px'
          }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search by trip code, crop, route, or buyer..."
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

          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
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
            <option value="onion">Red Onion</option>
            <option value="grapes">Grapes</option>
            <option value="tomatoes">Tomatoes</option>
            <option value="soybeans">Soybeans</option>
            <option value="pomegranates">Pomegranates</option>
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>
          Showing <strong>{filteredTrips.length}</strong> archived trips
        </div>
      </div>

      {/* Trips Cards Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            style={{
              background: '#ffffff',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              padding: '18px 22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              transition: 'all 0.2s'
            }}
          >
            {/* Top row: Trip Code, Date, Rating, Payout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                    {trip.commodity}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: '#eff6ff',
                    color: '#2563eb'
                  }}>
                    {trip.trip_code}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                  Completed on {trip.completed_at} • Distance: {trip.distance_km} km
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803d' }}>
                  ₹{trip.net_payout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <CheckCircle2 size={12} /> Settled to DBT • UTR: {trip.bank_utr}
                </div>
              </div>
            </div>

            {/* Middle Row: Route & Weighbridge Tare/Gross */}
            <div style={{
              background: '#f8fafc',
              borderRadius: 10,
              padding: '12px 14px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
              gap: 14
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Transit Corridor
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                  {trip.origin} ➔ {trip.destination}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                  Consignor: <strong>{trip.consignor}</strong> • Consignee: <strong>{trip.consignee}</strong>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Weighbridge Certified Scale
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                  Tare: {trip.tare_weight_kg.toLocaleString()} kg | Gross: {trip.gross_weight_kg.toLocaleString()} kg
                </div>
                <div style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 700, marginTop: 2 }}>
                  Net Produce: {(trip.net_produce_kg / 100).toFixed(2)} Qtl ({trip.net_produce_kg.toLocaleString()} kg)
                </div>
              </div>
            </div>

            {/* Bottom Row: Actions (View Documents, ePOD thumbnail) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#475569'
                }}>
                  e-Way Bill: {trip.eway_bill_no}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#475569'
                }}>
                  Gate Pass: {trip.gate_pass_no}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.78rem', fontWeight: 700, color: '#d97706' }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" /> {trip.driver_rating}.0 Rated
                </span>
              </div>

              <button
                onClick={() => setSelectedTrip(trip)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <FileText size={14} /> View Official Dossier & ePOD
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Dossier & ePOD Modal */}
      {selectedTrip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 18,
            width: '100%',
            maxWidth: 620,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px 28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  MAHARASHTRA APMC OFFICIAL GATE AUDIT DOSSIER
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0f172a' }}>
                  Consignment #{selectedTrip.trip_code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            {/* ePOD Photo */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                UNLOADED CARGO PHOTO (ELECTRONIC PROOF OF DELIVERY)
              </div>
              <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 180 }}>
                <img
                  src={selectedTrip.proof_photo_url}
                  alt="Delivery Proof"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '6px 12px',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>GEOTAGGED: Lasalgaon APMC Dock 4</span>
                  <span style={{ color: '#4ade80' }}>✓ WEIGHMENT VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Itemized Payout Breakdown */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                Remittance & Settlement Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569' }}>
                <span>Base Contract Freight</span>
                <strong>₹{selectedTrip.freight_amount.toFixed(2)}</strong>
              </div>
              {selectedTrip.toll_charges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569' }}>
                  <span>NETC Fastag Toll Reimbursement</span>
                  <strong>+₹{selectedTrip.toll_charges.toFixed(2)}</strong>
                </div>
              )}
              {selectedTrip.demurrage_fee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#16a34a' }}>
                  <span>APMC Sec 31-B Detention Claim Payout</span>
                  <strong>+₹{selectedTrip.demurrage_fee.toFixed(2)}</strong>
                </div>
              )}
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.96rem', fontWeight: 800, color: '#15803d' }}>
                <span>Total DBT Wire Credited</span>
                <span>₹{selectedTrip.net_payout.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                onClick={() => {
                  alert(`Downloading Official APMC Gate Pass #${selectedTrip.gate_pass_no}`);
                }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 10,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Download size={15} /> Download Mandi Gate Pass
              </button>
              <button
                onClick={() => {
                  alert(`Downloading GST e-Way Bill #${selectedTrip.eway_bill_no}`);
                }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 10,
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Download size={15} /> Download e-Way Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
