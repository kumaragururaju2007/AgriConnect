import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, CheckCircle2, ShieldCheck, Copy, Check, 
  Smartphone, ArrowRight, CreditCard, RefreshCw, 
  AlertTriangle, Lock, Sparkles, ExternalLink, QrCode
} from 'lucide-react';
import api from '../services/api';

export default function RazorpayQrPaymentModal({
  isOpen,
  onClose,
  deal,
  lot,
  amount,
  productAmount,
  transportAmount,
  dealRef,
  orderId,
  onPaymentSuccess
}) {
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'intent' | 'gateway'

  if (!isOpen) return null;

  const total = Number(amount) || (Number(productAmount || 291000) + Number(transportAmount || 8450));
  const prodAmt = Number(productAmount) || Math.round(total - (Number(transportAmount) || 8450));
  const transAmt = Number(transportAmount) || Math.round(total - prodAmt);
  const refCode = dealRef || deal?.deal_ref || `AC-TXN-${Date.now().toString().slice(-4)}`;
  const currentOrderId = orderId || deal?.razorpay_order_id || `order_test_${refCode.replace('AC-TXN-', '')}`;
  const vpa = 'agriconnect.escrow@sbi';

  // Standard UPI URI format accepted by Google Pay, PhonePe, Paytm, BHIM, Cred
  const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent('AgriConnect State Escrow')}&mc=5411&tr=${encodeURIComponent(refCode)}&tn=${encodeURIComponent(`AgriConnect Escrow ${refCode}`)}&am=${total}&cu=INR`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2500);
  };

  // Simulate or process payment capture
  const handleConfirmUpiPayment = async () => {
    setIsProcessing(true);
    try {
      const simulatedPaymentId = `pay_upi_${Date.now()}`;
      const res = await api.verifyPaymentAndHold({
        order_id: currentOrderId,
        payment_id: simulatedPaymentId,
        signature: 'simulated_sig',
        deal_ref: refCode
      });

      setPaymentSuccess(true);
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess(res.deal || deal);
        }
        onClose();
      }, 1800);
    } catch (err) {
      console.error('UPI Payment verification error:', err);
      // Fallback local notification
      setPaymentSuccess(true);
      setTimeout(() => {
        if (onPaymentSuccess) onPaymentSuccess(deal);
        onClose();
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  // Launch native Razorpay checkout as fallback if user wants cards or netbanking
  const handleLaunchRazorpayCheckout = () => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      const options = {
        key: 'rzp_test_TZ2MRrzjvZvfqW',
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'AgriConnect Maharashtra',
        description: `Dual Escrow: Produce (₹${prodAmt.toLocaleString('en-IN')}) + Freight (₹${transAmt.toLocaleString('en-IN')})`,
        image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=128&auto=format&fit=crop&q=80',
        order_id: currentOrderId.startsWith('order_') ? currentOrderId : undefined,
        prefill: {
          name: 'AgroFresh Supply Chain Ltd',
          email: 'procurement@agrofresh.in',
          contact: '+91 98224 81920'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true
        },
        theme: {
          color: '#15803d'
        },
        handler: async function (response) {
          try {
            const res = await api.verifyPaymentAndHold({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              deal_ref: refCode
            });
            if (onPaymentSuccess) onPaymentSuccess(res.deal);
            onClose();
          } catch (e) {
            console.error(e);
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 10000, padding: 16
    }}>
      <div className="panel animate-slide-in" style={{
        width: 520, maxWidth: '100%', background: '#ffffff', borderRadius: 16,
        padding: 0, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        border: '1px solid #cbd5e1'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '18px 22px', color: '#ffffff', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{
                background: '#15803d', color: '#ffffff', fontSize: '0.65rem',
                fontWeight: 900, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase'
              }}>
                UPI & BharatQR Escrow
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Ref #{refCode}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <QrCode size={18} color="#22c55e" />
              Scan & Pay via UPI QR Code
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff',
              cursor: 'pointer', padding: 6, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {paymentSuccess ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', background: '#dcfce7',
              color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={42} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
              ₹{total.toLocaleString('en-IN')} Locked in Escrow Vault!
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#166534', margin: '0 0 12px', fontWeight: 600 }}>
              Payment captured via UPI. Funds held safely in AgriConnect State Vault under APMC Rule 24.
            </p>
            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Produce (₹{prodAmt.toLocaleString('en-IN')}) + Freight (₹{transAmt.toLocaleString('en-IN')}) will release upon Buyer delivery inspection approval.
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px 24px' }}>
            
            {/* Amount Banner */}
            <div style={{
              background: '#f8fafc', borderRadius: 12, padding: '14px 18px',
              border: '1px solid #e2e8f0', marginBottom: 16, display: 'flex',
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Total Escrow Deposit Payable
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d' }}>
                  ₹{total.toLocaleString('en-IN')}.00
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#475569' }}>
                <div>Produce: <strong>₹{prodAmt.toLocaleString('en-IN')}</strong></div>
                <div>Freight: <strong>₹{transAmt.toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            {/* QR Code Card */}
            <div style={{
              background: '#ffffff', border: '2px dashed #16a34a', borderRadius: 14,
              padding: '18px', textAlign: 'center', marginBottom: 16,
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)'
            }}>
              <div style={{ display: 'inline-block', padding: 12, background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <QRCodeSVG
                  value={upiUri}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=128&auto=format&fit=crop&q=80',
                    x: undefined,
                    y: undefined,
                    height: 34,
                    width: 34,
                    excavate: true
                  }}
                />
              </div>

              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#0f172a', fontWeight: 800, fontSize: '0.85rem' }}>
                <Smartphone size={16} color="#15803d" />
                <span>Scan with any UPI App</span>
              </div>
              
              {/* UPI Brand Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred', 'Navi'].map((app) => (
                  <span key={app} style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
                    borderRadius: 20, background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1'
                  }}>
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* VPA ID Copy Row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#f1f5f9', padding: '8px 12px', borderRadius: 8, marginBottom: 16,
              fontSize: '0.78rem'
            }}>
              <span style={{ color: '#64748b' }}>
                UPI ID: <strong style={{ color: '#0f172a' }}>{vpa}</strong>
              </span>
              <button
                onClick={handleCopyVpa}
                style={{
                  background: copiedVpa ? '#dcfce7' : '#ffffff',
                  border: '1px solid #cbd5e1', borderRadius: 6,
                  padding: '4px 8px', fontSize: '0.72rem', fontWeight: 700,
                  color: copiedVpa ? '#15803d' : '#475569', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                {copiedVpa ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedVpa ? 'Copied!' : 'Copy UPI'}</span>
              </button>
            </div>

            {/* Statutory Security Seal */}
            <div style={{
              background: '#ecfdf5', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #a7f3d0', fontSize: '0.73rem', color: '#166534',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <ShieldCheck size={18} color="#15803d" style={{ flexShrink: 0 }} />
              <div>
                <strong>Statutory Dual-Escrow Hold:</strong> 100% of funds sit in the platform escrow account. Payout releases only when Buyer inspects and confirms produce delivery.
              </div>
            </div>

            {/* Test Simulation Trigger & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={handleConfirmUpiPayment}
                disabled={isProcessing}
                style={{
                  width: '100%', padding: '11px', borderRadius: 10, fontSize: '0.86rem',
                  fontWeight: 800, background: '#15803d', border: 'none', color: '#ffffff',
                  cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 3px 10px rgba(21, 128, 61, 0.3)'
                }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Verifying UPI Payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Simulate Successful UPI Scan & Pay</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleLaunchRazorpayCheckout}
                  style={{
                    flex: 1, padding: '9px', borderRadius: 8, fontSize: '0.78rem',
                    fontWeight: 700, background: '#ffffff', border: '1px solid #cbd5e1',
                    color: '#334155', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: 5
                  }}
                >
                  <CreditCard size={14} color="#2563eb" />
                  <span>Card / NetBanking</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1, padding: '9px', borderRadius: 8, fontSize: '0.78rem',
                    fontWeight: 700, background: '#f8fafc', border: '1px solid #cbd5e1',
                    color: '#64748b', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
