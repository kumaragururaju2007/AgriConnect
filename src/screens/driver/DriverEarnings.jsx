import React, { useState } from 'react';
import { 
  DollarSign, ShieldCheck, ArrowUpRight, CheckCircle2, 
  Building2, CreditCard, RefreshCw, Clock, ExternalLink, 
  Download, AlertCircle, FileText, Sparkles
} from 'lucide-react';
import { DRIVER_PROFILE, COMPLETED_TRIPS_HISTORY } from './driverData';

export default function DriverEarnings({ lang = 'en', setStep }) {
  const [withdrawableBalance, setWithdrawableBalance] = useState(42300);
  const [withdrawAmount, setWithdrawAmount] = useState('25000');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(null);

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > withdrawableBalance) {
      alert('Please enter a valid amount within your available balance.');
      return;
    }

    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setWithdrawableBalance((prev) => prev - amt);
      setTransferSuccess({
        amount: amt,
        utr: `DBT-SBI-MH${Math.floor(100000000 + Math.random() * 900000000)}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        borderRadius: 16,
        padding: '22px 26px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(6, 95, 70, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.2)' }}>
              MAHA-DBT ESCROW RECONCILIATION
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#a7f3d0' }}>
              • Zero Commission Remittance
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#ffffff' }}>
            Transporter Earnings & State Escrow Vault
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#d1fae5' }}>
            Guaranteed freight payments held in Reserve Bank monitored escrow and wired directly to your SBI DBT account.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {setStep && (
            <button
              onClick={() => setStep(8)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderRadius: 8, background: '#ffffff', color: '#065f46',
                border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <ShieldCheck size={16} color="#065f46" />
              <span>View Offers & Escrow Hub</span>
            </button>
          )}

          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '10px 16px',
            borderRadius: 12,
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#d1fae5', fontWeight: 700 }}>
              LINKED DBT ACCOUNT
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
              SBI Direct (****4402)
            </div>
            <div style={{ fontSize: '0.72rem', color: '#bbf7d0' }}>
              IFSC: {DRIVER_PROFILE.ifsc_code} • Niphad
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {/* Total Lifetime Remittance */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            LIFETIME FREIGHT RECEIVED
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
            ₹1,84,650.00
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={13} /> Across 84 Verified Mandi Trips
          </div>
        </div>

        {/* Locked In Escrow Vault */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            LOCKED IN DUAL-ESCROW VAULT
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563eb', marginTop: 4 }}>
            ₹8,450.00
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={13} /> Trip #JOB-2024-8841 (Releases on Dock Slip)
          </div>
        </div>

        {/* Available For Instant DBT Transfer */}
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            WITHDRAWABLE TO BANK
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>
            ₹{withdrawableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={13} /> Instant IMPS / DBT Available 24/7
          </div>
        </div>
      </div>

      {/* Main Split: Instant Bank Withdrawal (Left) & Escrow Architecture (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 20 }}>
        
        {/* Left: Instant DBT Withdrawal Simulator */}
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
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
              DIRECT BENEFIT TRANSFER
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0f172a' }}>
              Transfer Withdrawable Funds to Bank
            </h3>
          </div>

          {transferSuccess ? (
            <div style={{
              background: '#f0fdf4',
              borderRadius: 12,
              padding: '18px',
              border: '1px solid #86efac',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803d', fontWeight: 800, fontSize: '1rem' }}>
                <CheckCircle2 size={20} /> Wire Transfer Executed Successfully!
              </div>
              <div style={{ fontSize: '0.84rem', color: '#166534' }}>
                ₹{transferSuccess.amount.toLocaleString('en-IN')} has been wired directly to <strong>State Bank of India (A/C *******4402)</strong>.
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Bank UTR: <strong>{transferSuccess.utr}</strong> • Time: {transferSuccess.timestamp}
              </div>
              <button
                onClick={() => setTransferSuccess(null)}
                style={{
                  marginTop: 6,
                  alignSelf: 'flex-start',
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: '#15803d',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Make Another Transfer
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
                  TRANSFER AMOUNT (INR)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: 10, fontSize: '1.1rem', fontWeight: 800, color: '#64748b' }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 30px',
                      borderRadius: 10,
                      border: '1px solid #cbd5e1',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {['10000', '25000', '42300'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setWithdrawAmount(preset)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      ₹{Number(preset).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Bank Card Preview */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                    State Bank of India (DBT Verified)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    A/C: *******4402 • IFSC: SBIN0001429 • Beneficiary: Rajesh Vitthal Patil
                  </div>
                </div>
              </div>

              <button
                disabled={isTransferring}
                onClick={handleWithdraw}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  background: isTransferring ? '#94a3b8' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: isTransferring ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                }}
              >
                {isTransferring ? (
                  'Executing Secure DBT Bank Wire...'
                ) : (
                  <>
                    <ArrowUpRight size={16} /> Transfer ₹{Number(withdrawAmount || 0).toLocaleString('en-IN')} to Bank Account
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right: Dual-Escrow Architecture Details */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '22px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              How Escrow Guaranteed Payout Works
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', color: '#15803d', fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                1
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                <strong>100% Pre-funded:</strong> The buyer deposits both the agricultural lot price and your commercial freight fee into State Escrow before your vehicle departs.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', color: '#15803d', fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                2
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                <strong>0% Advance / Zero Fraud Risk:</strong> Escrow guarantees the driver does not suffer delayed payments, commission deductions, or bad debts from consignees.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', color: '#15803d', fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                3
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                <strong>Dual-Split Settlement:</strong> When receiving dock weighs the produce, the escrow splits: produce price goes to farmer, freight goes to you automatically.
              </div>
            </div>
          </div>

          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: '0.76rem',
            color: '#1e40af',
            lineHeight: 1.4
          }}>
            <strong>Statutory Rule 24 Protection:</strong> If the receiving buyer fails to confirm within 48 hours of your uploaded ePOD, the APMC system auto-clears your payment.
          </div>
        </div>
      </div>

      {/* Itemized Payouts Ledger Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Recent Escrow Remittance Ledger
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
              Itemized audit trail of bank credits with Fastag toll reimbursements and demurrage payouts.
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '10px 12px' }}>DATE</th>
                <th style={{ padding: '10px 12px' }}>JOB REF</th>
                <th style={{ padding: '10px 12px' }}>COMMODITY & ROUTE</th>
                <th style={{ padding: '10px 12px' }}>BASE FREIGHT</th>
                <th style={{ padding: '10px 12px' }}>TOLL / CLAIMS</th>
                <th style={{ padding: '10px 12px' }}>TOTAL WIRE</th>
                <th style={{ padding: '10px 12px' }}>BANK UTR</th>
                <th style={{ padding: '10px 12px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {COMPLETED_TRIPS_HISTORY.map((trip) => (
                <tr key={trip.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', color: '#334155', fontWeight: 600 }}>{trip.date}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#2563eb' }}>{trip.trip_code}</td>
                  <td style={{ padding: '12px', color: '#0f172a' }}>
                    <div style={{ fontWeight: 700 }}>{trip.commodity}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{trip.origin.split(',')[0]} ➔ {trip.destination.split(',')[0]}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>₹{trip.freight_amount.toFixed(2)}</td>
                  <td style={{ padding: '12px', color: trip.toll_charges > 0 || trip.demurrage_fee > 0 ? '#16a34a' : '#64748b' }}>
                    +₹{(trip.toll_charges + trip.demurrage_fee).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 900, color: '#15803d' }}>
                    ₹{trip.net_payout.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#64748b' }}>
                    {trip.bank_utr}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 10,
                      background: '#dcfce7',
                      color: '#15803d'
                    }}>
                      DBT Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
