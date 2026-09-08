import React, { useState } from 'react';
import { 
  ShieldCheck, Truck, FileText, CheckCircle2, AlertCircle, 
  ExternalLink, CreditCard, RefreshCw, Award, Calendar,
  User, Phone, Mail, MapPin, Fuel
} from 'lucide-react';
import { DRIVER_PROFILE, VEHICLE_DETAILS, COMPLIANCE_DOCUMENTS } from './driverData';

export default function DriverVehicleProfile({ lang = 'en' }) {
  const [fastagBalance, setFastagBalance] = useState(VEHICLE_DETAILS.fastag_balance);
  const [isRechargingFastag, setIsRechargingFastag] = useState(false);

  const handleTopupFastag = (amount) => {
    setIsRechargingFastag(true);
    setTimeout(() => {
      setFastagBalance((prev) => prev + amount);
      setIsRechargingFastag(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(3, 105, 161, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Truck size={32} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {VEHICLE_DETAILS.reg_no}
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 20,
                background: '#10b981',
                color: '#ffffff'
              }}>
                VAHAN VERIFIED
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.2)',
                color: '#e0f2fe'
              }}>
                BS-VI DIESEL
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#bae6fd' }}>
              {VEHICLE_DETAILS.make_model} • {VEHICLE_DETAILS.category}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#bae6fd', fontWeight: 700 }}>
            COMMERCIAL RTO PERMIT
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
            Maharashtra State (All 36 Districts)
          </div>
          <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>
            Valid till 11-Jan-2029
          </div>
        </div>
      </div>

      {/* Split: Driver Identity (Left) & Vehicle Specs (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)', gap: 20 }}>
        {/* Left Column: Transporter KYC Profile */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={22} color="#2563eb" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                {DRIVER_PROFILE.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                {DRIVER_PROFILE.name_mr} • {DRIVER_PROFILE.driver_code}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Primary Mobile:</span>
              <strong>{DRIVER_PROFILE.phone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Commercial Driving License:</span>
              <strong>{DRIVER_PROFILE.license_no}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>License Valid Until:</span>
              <strong style={{ color: '#16a34a' }}>{DRIVER_PROFILE.license_valid_until}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Aadhaar e-KYC:</span>
              <strong style={{ color: '#16a34a' }}>✓ Verified (UIDAI Linked)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Home Mandi APMC:</span>
              <strong>{DRIVER_PROFILE.home_apmc}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#64748b' }}>Linked DBT Bank Account:</span>
              <strong>State Bank of India (****4402)</strong>
            </div>
          </div>

          {/* NETC Fastag Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: 12,
            padding: '16px',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                <CreditCard size={16} color="#0284c7" /> NETC Fastag Wallet
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#dcfce7', color: '#15803d' }}>
                Active & Linked
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>TAG ID</div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 700 }}>
                  {VEHICLE_DETAILS.fastag_tag_id}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>BALANCE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d' }}>
                  ₹{fastagBalance.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                disabled={isRechargingFastag}
                onClick={() => handleTopupFastag(500)}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                +₹500 Quick Recharge
              </button>
              <button
                disabled={isRechargingFastag}
                onClick={() => handleTopupFastag(1000)}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                +₹1,000 Topup
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Vehicle Engineering & Technical Specs */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
              TECHNICAL SPECIFICATIONS
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0f172a' }}>
              Eicher Pro 2049 Payload Engineering
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>GROSS VEHICLE WEIGHT (GVW)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                {VEHICLE_DETAILS.gross_vehicle_weight_kg.toLocaleString()} kg
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>UNLADEN TARE WEIGHT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                {VEHICLE_DETAILS.unladen_weight_kg.toLocaleString()} kg
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: 10, border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534' }}>CERTIFIED PAYLOAD CAPACITY</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: 2 }}>
                {VEHICLE_DETAILS.max_payload_tonnes} MT ({VEHICLE_DETAILS.max_payload_qtl} Qtl)
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>CARGO DECK DIMENSIONS</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                {VEHICLE_DETAILS.deck_dimensions}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem', color: '#475569' }}>
            <div>
              <strong>Deck Construction:</strong> {VEHICLE_DETAILS.deck_type}
            </div>
            <div>
              <strong>Tarpaulin & Canopy:</strong> {VEHICLE_DETAILS.tarp_type}
            </div>
            <div>
              <strong>GPS Telemetry Hardware:</strong> {VEHICLE_DETAILS.gps_device_id} (Govt. AIS-140 Compliant)
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Compliance Certificates Grid (4 Cards) */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '22px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Statutory RTO & Regulatory Documents
            </h3>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
              Active digital certificates verified against Maharashtra Parivahan / Vahan databases.
            </div>
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={14} /> 100% Fully Compliant
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {COMPLIANCE_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  {doc.title}
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 10,
                  background: '#dcfce7',
                  color: '#15803d'
                }}>
                  {doc.badge}
                </span>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Certificate No: <strong style={{ color: '#1e293b' }}>{doc.doc_no}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Issuing Authority: {doc.authority}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700 }}>
                Valid: {doc.issued_date} to {doc.valid_until}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
