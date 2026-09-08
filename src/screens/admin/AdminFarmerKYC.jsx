import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, Search, Filter, 
  MapPin, ShieldCheck, FileText, Phone, Award, 
  ExternalLink, Eye, ChevronRight, Check, X, AlertTriangle,
  Building2, Sparkles, Scale, RefreshCw, Layers
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function AdminFarmerKYC() {
  const { 
    farmerApplications, 
    approveFarmerKYC, 
    rejectFarmerKYC, 
    adminUser 
  } = useAgri();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedFarmerDoc, setSelectedFarmerDoc] = useState(null);
  const [rejectModalFarmer, setRejectModalFarmer] = useState(null);
  const [rejectReason, setRejectReason] = useState('7/12 land extract boundary discrepancy or mismatched Khatedar name.');

  const applications = farmerApplications || [];

  const pendingCount = applications.filter(f => f.status === 'Pending').length;
  const approvedCount = applications.filter(f => f.status === 'Approved').length;
  const rejectedCount = applications.filter(f => f.status === 'Rejected').length;

  const filteredFarmers = applications.filter(f => {
    const matchesSearch = !searchTerm || 
      (f.farmer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.gut_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.khata_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.phone || '').includes(searchTerm);
    
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (farmerId) => {
    if (approveFarmerKYC) {
      approveFarmerKYC(farmerId, 'Mahabhulekh 7/12 verified against State Land Records. Khatedar confirmed.');
    }
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (rejectModalFarmer && rejectFarmerKYC) {
      rejectFarmerKYC(rejectModalFarmer.id, rejectReason);
    }
    setRejectModalFarmer(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #0f172a 100%)',
        borderRadius: 16, padding: '22px 26px', color: '#ffffff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        boxShadow: '0 10px 25px -5px rgba(20, 83, 45, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            👨‍🌾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                Farmer 7/12 Land KYC & Cultivator Registry
              </h1>
              <span style={{ background: '#22c55e', color: '#052e16', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999 }}>
                MAHABHULEKH VERIFIED
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#bbf7d0' }}>
              Supervised verification of cultivator land parcels, Saat-Baara extracts, Aadhaar consent & e-Pik Pahani digital crop surveys.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.25)', padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
          <ShieldCheck size={18} color="#4ade80" />
          <div style={{ fontSize: '0.75rem', color: '#f0fdf4' }}>
            Magistrate: <strong>{adminUser?.name || 'S. K. Deshmukh'}</strong> • Nashik APMC
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Registered Cultivators
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
            {applications.length} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Profiles</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>In APMC Central Registry</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Pending 7/12 Land Check
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: pendingCount > 0 ? '#d97706' : '#15803d', marginTop: 4 }}>
            {pendingCount} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Awaiting Audit</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Requires Magistrate approval</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Approved Khatedar Farmers
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>
            {approvedCount} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>Verified</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Authorized to list & sell produce</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Deficient / Rejected
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: rejectedCount > 0 ? '#dc2626' : '#64748b', marginTop: 4 }}>
            {rejectedCount} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Profiles</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Re-survey or correction requested</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ background: '#ffffff', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0 12px', width: 340 }}>
          <Search size={15} style={{ color: '#94a3b8', marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search by farmer name, gut no, village or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 0', fontSize: '0.82rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `All (${applications.length})` },
            { id: 'Pending', label: `Pending Check (${pendingCount})` },
            { id: 'Approved', label: `Approved (${approvedCount})` },
            { id: 'Rejected', label: `Rejected (${rejectedCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 800,
                background: statusFilter === f.id ? '#15803d' : '#f1f5f9',
                color: statusFilter === f.id ? '#ffffff' : '#475569',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Farmer KYC Application Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
        {filteredFarmers.map(farmer => {
          const isPending = farmer.status === 'Pending';
          const isApproved = farmer.status === 'Approved';
          return (
            <div key={farmer.id} style={{
              background: '#ffffff', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                {/* Farmer Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: isApproved ? '#dcfce7' : isPending ? '#fef3c7' : '#fee2e2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', border: isApproved ? '1.5px solid #86efac' : '1px solid #cbd5e1'
                    }}>
                      👨‍🌾
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                        {farmer.farmer_name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        s/o {farmer.father_name || 'Land Cultivator'} • 📍 {farmer.village}, {farmer.taluka || 'Niphad'}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 900,
                    background: isApproved ? '#dcfce7' : isPending ? '#fef3c7' : '#fee2e2',
                    color: isApproved ? '#15803d' : isPending ? '#b45309' : '#b91c1c'
                  }}>
                    {farmer.status === 'Approved' ? '✓ 7/12 VERIFIED' : farmer.status === 'Pending' ? '⏳ PENDING CHECK' : '✗ REJECTED'}
                  </span>
                </div>

                {/* Land Parcel 7/12 Details Box */}
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0', margin: '10px 0', fontSize: '0.78rem', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Mahabhulekh Land Parcel:</span>
                    <strong style={{ color: '#0f172a' }}>{farmer.gut_no} ({farmer.khata_no})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Total Holding Area:</span>
                    <strong>{farmer.land_area_acres} Acres ({farmer.land_area_ha_r || '1 Ha 82 Are'})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Occupant Class:</span>
                    <span style={{ color: '#15803d', fontWeight: 700 }}>{farmer.occupant_class || 'Bhogwatadar Class-1'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Primary Sown Crops:</span>
                    <strong style={{ color: '#0284c7' }}>{(farmer.crops || ['Red Onion', 'Soyabean']).join(', ')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Irrigation Source:</span>
                    <span>{farmer.irrigation_type || 'Well + Drip Irrigation'}</span>
                  </div>
                </div>

                {/* Aadhaar & DBT Verification Tag */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, margin: '8px 0', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700 }}>
                    <CheckCircle2 size={13} />
                    <span>Aadhaar ({farmer.aadhaar_masked || 'XXXX-XXXX-9012'}): {farmer.aadhaar_match_score || '100% Name Match'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284c7', fontWeight: 700 }}>
                    <ShieldCheck size={13} />
                    <span>DBT Status: {farmer.dbt_status || 'Active NPCI Direct Benefit Transfer Seeded'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSelectedFarmerDoc(farmer)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 12px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 700,
                    background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', cursor: 'pointer'
                  }}
                >
                  <Eye size={13} />
                  <span>Inspect 7/12 Extract</span>
                </button>

                {isPending ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setRejectModalFarmer(farmer)}
                      style={{
                        padding: '7px 12px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 700,
                        background: '#fff', border: '1px solid #fca5a5', color: '#dc2626', cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(farmer.id)}
                      style={{
                        padding: '7px 14px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 900,
                        background: '#15803d', border: 'none', color: '#ffffff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                      }}
                    >
                      <Check size={14} />
                      <span>Approve 7/12 KYC</span>
                    </button>
                  </div>
                ) : isApproved ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontSize: '0.76rem', fontWeight: 800 }}>
                    <Award size={15} />
                    <span>Certified Khatedar Cultivator</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApprove(farmer.id)}
                    style={{
                      padding: '6px 12px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800,
                      background: '#15803d', border: 'none', color: '#fff', cursor: 'pointer'
                    }}
                  >
                    Re-Approve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 7/12 Extract Inspection Modal */}
      {selectedFarmerDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Mahabhulekh 7/12 Land Extract Record
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#64748b' }}>
                  Cultivator: <strong>{selectedFarmerDoc.farmer_name}</strong> • {selectedFarmerDoc.gut_no} ({selectedFarmerDoc.village})
                </p>
              </div>
              <button onClick={() => setSelectedFarmerDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Simulated Document Preview */}
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              <img 
                src={selectedFarmerDoc.land_extract_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'} 
                alt="7/12 Saat-Baara Extract" 
                style={{ width: '100%', maxHeight: 320, objectFit: 'cover' }} 
              />
              <div style={{ background: '#f8fafc', padding: 12, borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569' }}>
                <div><strong>Digital Signature Hash:</strong> MH-REV-DSIGN-2026-992140A8 (Approved by Talathi)</div>
                <div><strong>Khata (Account) No:</strong> {selectedFarmerDoc.khata_no} • Land Revenue Assessment: ₹14.50/yr</div>
                <div><strong>e-Pik Pahani Crop Entry:</strong> {selectedFarmerDoc.e_pik_pahani?.crop || 'Soyabean (JS-335)'} ({selectedFarmerDoc.e_pik_pahani?.area || '4.50 Acres'})</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Status: <strong style={{ color: selectedFarmerDoc.status === 'Approved' ? '#15803d' : '#b45309' }}>{selectedFarmerDoc.status}</strong>
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setSelectedFarmerDoc(null)}
                  style={{ padding: '8px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                >
                  Close
                </button>
                {selectedFarmerDoc.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(selectedFarmerDoc.id);
                      setSelectedFarmerDoc(null);
                    }}
                    style={{ padding: '8px 18px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 900, background: '#15803d', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    ✓ Verify & Approve 7/12
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalFarmer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 14, maxWidth: 460, width: '100%', padding: 22, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 900, color: '#dc2626' }}>
              Request Correction or Reject 7/12 Land Record
            </h3>
            <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: '#64748b' }}>
              Specify the legal reason for rejecting <strong>{rejectModalFarmer.farmer_name}</strong>'s 7/12 application:
            </p>
            <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setRejectModalFarmer(null)}
                  style={{ padding: '7px 14px', borderRadius: 6, fontSize: '0.78rem', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '7px 16px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 800, background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
