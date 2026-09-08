import React from 'react';
import { 
  Truck, DollarSign, Package, Star, ShieldCheck, MapPin, 
  ArrowRight, Clock, AlertTriangle, Phone, Navigation, 
  CheckCircle2, Fuel, Radio, Sparkles, Award, ExternalLink
} from 'lucide-react';
import { DRIVER_PROFILE, VEHICLE_DETAILS } from './driverData';

export default function DriverDashboard({
  dutyStatus,
  setDutyStatus,
  activeJob,
  availableJobs,
  setActiveTab,
  onAcceptJob,
  lang = 'en'
}) {
  const isOnline = dutyStatus === 'ON_DELIVERY' || dutyStatus === 'AVAILABLE';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner: Transporter Greeting & Duty Status Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2e22 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            <Truck size={30} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                {DRIVER_PROFILE.name}
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <ShieldCheck size={12} /> {DRIVER_PROFILE.vahan_status}
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 20,
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(96, 165, 250, 0.3)'
              }}>
                {VEHICLE_DETAILS.reg_no} • {VEHICLE_DETAILS.make_model}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              {DRIVER_PROFILE.home_apmc} • {DRIVER_PROFILE.district}, {DRIVER_PROFILE.state} • Code: <strong style={{ color: '#e2e8f0' }}>{DRIVER_PROFILE.driver_code}</strong>
            </p>
          </div>
        </div>

        {/* Duty Status Controller */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px 14px',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isOnline ? '#10b981' : '#f59e0b',
              boxShadow: isOnline ? '0 0 10px #10b981' : 'none'
            }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
              {dutyStatus === 'ON_DELIVERY' ? 'ON ACTIVE TRIP' : dutyStatus === 'AVAILABLE' ? 'AVAILABLE FOR LOADS' : 'RESTING / OFF-DUTY'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setDutyStatus(dutyStatus === 'OFF_DUTY' ? 'AVAILABLE' : 'OFF_DUTY')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: dutyStatus === 'OFF_DUTY' ? '#10b981' : 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                transition: 'all 0.2s'
              }}
            >
              {dutyStatus === 'OFF_DUTY' ? 'Go Available' : 'Take Rest'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats 4-Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16
      }}>
        {/* Card 1: Today's Escrow Freight */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Current Escrow Revenue
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              ₹8,450
            </div>
            <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <ShieldCheck size={12} /> 100% Pre-funded in Vault
            </div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} color="#16a34a" />
          </div>
        </div>

        {/* Card 2: Completed Trips */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Verified APMC Trips
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              {DRIVER_PROFILE.total_trips}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <CheckCircle2 size={12} /> 99.4% On-Time Record
            </div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={22} color="#2563eb" />
          </div>
        </div>

        {/* Card 3: Distance & Payload */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Fleet Odometer
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
              16,420 <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>km</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#7c3aed', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Navigation size={12} /> Live GPS Active
            </div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={22} color="#7c3aed" />
          </div>
        </div>

        {/* Card 4: Transporter Rating */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Trust & Quality Score
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              {DRIVER_PROFILE.rating_avg} <Star size={20} fill="#f59e0b" color="#f59e0b" />
            </div>
            <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Award size={12} /> Top 1% Nashik APMC Carrier
            </div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={22} color="#d97706" />
          </div>
        </div>
      </div>

      {/* Main Split: Active Trip Spotlight (Left) & Live Loads Radar (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 20 }}>
        
        {/* Left Column: Active Trip Spotlight Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#16a34a',
                boxShadow: '0 0 8px #16a34a'
              }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Active Transit Mission
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: '#dcfce7', color: '#15803d' }}>
                {activeJob?.job_code || 'JOB-2024-8841'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('active_trip')}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563eb',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Open Live GPS & Telemetry <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Commodity Banner */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Commodity & Weight
                </span>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                  {activeJob?.commodity_summary || '120 Qtl Grade-A Red Onion (Nashik Gavran)'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Dual-Escrow Payout
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a', marginTop: 2 }}>
                  ₹{activeJob?.delivery_fee ? Number(activeJob.delivery_fee).toLocaleString('en-IN') : '8,450'}
                </div>
              </div>
            </div>

            {/* Route Map Visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={16} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Pickup Point (Farm Gate)
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                    {activeJob?.pickup_location || 'Gut No. 142/B, Pimpalgaon Baswant, Niphad Taluka'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                    Consignor: <strong>Santosh Bhaurao Shinde</strong> (+91 98224 81920)
                  </div>
                </div>
              </div>

              <div style={{ marginLeft: 13, borderLeft: '2px dashed #cbd5e1', height: 20 }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={16} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Destination (Consignee Dock)
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                    {activeJob?.drop_location || 'AgroFresh Central Sourcing Hub, Lasalgaon APMC Bay 4'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                    Consignee: <strong>AgroFresh Supply Chain Ltd</strong> (Mandi License #MH-9421)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions for Active Trip */}
            <div style={{
              marginTop: 'auto',
              paddingTop: 14,
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: 10
            }}>
              <button
                onClick={() => setActiveTab('active_trip')}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                <Navigation size={16} /> Open Trip Telemetry & Camera
              </button>
              
              <button
                onClick={() => setActiveTab('support')}
                style={{
                  padding: '11px 16px',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Phone size={15} /> APMC Helpdesk
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Available Loads Ticker */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={16} color="#0284c7" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Nearby Load Requests
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('available_orders')}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0284c7',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              View All ({availableJobs?.length || 4}) <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
            {(availableJobs && availableJobs.length > 0 ? availableJobs.slice(0, 3) : [
              {
                id: 'MOCK-1',
                commodity: '150 Qtl Onion (Gavran)',
                pickup: 'Pimpalgaon (7 km)',
                drop: 'Lasalgaon APMC',
                payout: 9200
              },
              {
                id: 'MOCK-2',
                commodity: '110 Qtl Soyabean Seed Lot',
                pickup: 'Dindori (18 km)',
                drop: 'Ambad MIDC',
                payout: 8650
              },
              {
                id: 'MOCK-3',
                commodity: 'Pooled Tomato Crates (3 Farms)',
                pickup: 'Sinnar Cluster (24 km)',
                drop: 'Vashi APMC',
                payout: 17400
              }
            ]).map((job, idx) => (
              <div
                key={job.id || idx}
                style={{
                  padding: '14px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      {job.commodity || job.commodity_summary || '150 Qtl Grade-A Red Onion'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={12} color="#0284c7" />
                      {job.pickup || job.pickup_location?.slice(0, 30) || 'Pimpalgaon Baswant'} ➔ {job.drop || job.drop_location?.slice(0, 25) || 'Lasalgaon Bay 4'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#15803d' }}>
                      ₹{job.payout ? Number(job.payout).toLocaleString('en-IN') : (job.delivery_fee ? Number(job.delivery_fee).toLocaleString('en-IN') : '9,200')}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a' }}>
                      Pre-funded
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: '#f1f5f9',
                    color: '#475569'
                  }}>
                    Ready to load now
                  </span>
                  <button
                    onClick={() => {
                      if (onAcceptJob) onAcceptJob(job);
                      else setActiveTab('available_orders');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Accept & Lock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Vehicle Vital Signs & Regulatory Assurance Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        padding: '18px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Fuel size={18} color="#0284c7" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>DIESEL TANK</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{VEHICLE_DETAILS.fuel_level_pct}% (320 km Range)</div>
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>FASTAG BALANCE</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#16a34a' }}>₹{VEHICLE_DETAILS.fastag_balance.toFixed(2)} (Active)</div>
          </div>

          <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>RTO FITNESS</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>Valid till 15-Aug-2027</div>
          </div>

          <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>PAYLOAD LIMIT</div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{VEHICLE_DETAILS.max_payload_tonnes} MT ({VEHICLE_DETAILS.max_payload_qtl} Qtl)</div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('vehicle_profile')}
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0284c7',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            padding: '7px 14px',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          Vehicle Vahan Details <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
