import React, { useState } from 'react';
import { 
  Users, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, 
  Sparkles, DollarSign, Database, Award, Info, Lock, MapPin, 
  AlertCircle, ChevronRight, Scale, Clock, RefreshCw
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';

export default function Step18DigitalPooling({ setStep, setTerminal, lang = 'en' }) {
  const { authUser, mandiPools, togglePoolJoin, placePoolBid, addToast } = useAgri();
  const isBuyer = authUser?.role === 'buyer';
  const isFarmer = authUser?.role === 'farmer' || !isBuyer;

  // Selected pool
  const [selectedPoolId, setSelectedPoolId] = useState('POOL-04');
  const activePool = mandiPools.find(p => p.id === selectedPoolId) || mandiPools[0];

  // Buyer Bidding Form State
  const [bidPrice, setBidPrice] = useState(activePool.base_rate_per_qtl + 25);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Farmer lot contribution input
  const [farmerContribution, setFarmerContribution] = useState(30);

  const isUserJoined = activePool.pooled_farmers.some(f => f.isUser);

  const handleFarmerToggle = () => {
    togglePoolJoin(activePool.id, farmerContribution);
  };

  const handleBuyerBidSubmit = (e) => {
    e.preventDefault();
    if (!bidPrice || bidPrice < activePool.base_rate_per_qtl) {
      addToast({
        type: 'error',
        title: 'Invalid Bid Price',
        message: `Bid price must be at least the reserve rate of ₹${activePool.base_rate_per_qtl}/Qtl.`
      });
      return;
    }
    setIsSubmittingBid(true);
    setTimeout(() => {
      placePoolBid(activePool.id, bidPrice, authUser?.user?.name || 'AgroFresh Supply Chain Pvt Ltd');
      setIsSubmittingBid(false);
    }, 600);
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>
      
      {/* Top Header */}
      <div className="panel" style={{ 
        padding: '24px 28px', marginBottom: 24, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #eff6ff 100%)', 
        border: '1px solid #bbf7d0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                <Users size={13} />
                <span>DIGITAL MANDI POOLING (स्मार्ट गट एकत्रिकरण)</span>
              </span>
              <span className="badge badge-blue">APMC Cluster Trading</span>
              <span className="badge badge-amber">
                {isBuyer ? '🏢 Buyer View • Place Combined Lot Bids' : '👨‍🌾 Farmer View • Join Pool & Earn +₹120/Qtl'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-title)', letterSpacing: '-0.02em', margin: 0 }}>
              Digital Mandi Pooling Engine
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4, maxWidth: 900, lineHeight: 1.45 }}>
              {isBuyer 
                ? 'Procure aggregated, uniform Grade-A truckload lots directly from verified farmer clusters with single-point APMC escrow settlement.'
                : 'शेजारील अल्पभूधारक शेतकऱ्यांचा एकाच प्रतीचा माल एकत्र करून घाऊक खरेदीदारांकडून प्रति क्विंटल ₹१२० ते ₹१५० अधिक भाव मिळवा.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {mandiPools.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPoolId(p.id);
                  setBidPrice(p.base_rate_per_qtl + 25);
                }}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                  background: selectedPoolId === p.id ? '#15803d' : '#ffffff',
                  color: selectedPoolId === p.id ? '#ffffff' : '#334155',
                  border: selectedPoolId === p.id ? '1px solid #166534' : '1px solid #cbd5e1',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                {p.id}: {p.commodity.split('(')[0]} ({p.current_pooled_qtl} Qtl)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Pool Details & Role Action Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        
        {/* LEFT COLUMN: POOL SPECIFICATIONS & POOLED MEMBERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className="panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Cluster #{activePool.id}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
                  {activePool.name}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Commodity: <strong>{activePool.commodity}</strong> • Standard: <strong>{activePool.grade}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 16px', borderRadius: 10 }}>
                <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>Combined Lot Size</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d' }}>
                  {activePool.current_pooled_qtl} <span style={{ fontSize: '0.85rem' }}>Qtl</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Target: {activePool.total_target_qtl} Qtl</div>
              </div>
            </div>

            {/* Progress to Full Truckload */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6, fontWeight: 700 }}>
                <span style={{ color: '#475569' }}>Cluster Lot Accumulation</span>
                <span style={{ color: '#15803d' }}>{Math.round((activePool.current_pooled_qtl / activePool.total_target_qtl) * 100)}% of Truckload Ready</span>
              </div>
              <div style={{ width: '100%', height: 10, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(activePool.current_pooled_qtl / activePool.total_target_qtl) * 100}%`, 
                  height: '100%', background: 'linear-gradient(90deg, #15803d 0%, #22c55e 100%)', 
                  borderRadius: 999, transition: 'width 0.4s ease' 
                }} />
              </div>
            </div>

            {/* Pooled Farmers Contributions */}
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              Contributing Cultivators in this Cluster ({activePool.pooled_farmers.length} Farmers)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {activePool.pooled_farmers.map(f => (
                <div 
                  key={f.id}
                  style={{
                    padding: '12px 14px', borderRadius: 8,
                    background: f.isUser ? '#ecfdf5' : '#f8fafc',
                    border: f.isUser ? '2px solid #86efac' : '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem', color: f.isUser ? '#15803d' : '#0f172a' }}>
                      {f.name} {f.isUser && '(You)'}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{f.village}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803d' }}>
                      {f.contribution_qtl} Qtl
                    </span>
                    <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>Grade-A</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Current Bids Stream */}
          <div className="panel" style={{ padding: '24px', background: '#ffffff' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              Active Institutional Bids on this Pooled Lot ({activePool.current_bids.length} Bids)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activePool.current_bids.map(b => (
                <div 
                  key={b.id}
                  style={{
                    padding: '14px 16px', borderRadius: 8,
                    background: b.status === 'TOP_BID' ? '#f0fdf4' : '#f8fafc',
                    border: b.status === 'TOP_BID' ? '2px solid #86efac' : '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{b.buyer_name}</strong>
                      {b.status === 'TOP_BID' ? (
                        <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>★ HIGHEST BID</span>
                      ) : (
                        <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>Outbid</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                      Placed: {b.placed_at} • Escrow Guaranteed by SBI
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#15803d' }}>
                      ₹{b.bid_price.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/Qtl</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Total: ₹{b.total_value.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ROLE-SPECIFIC ACTION PANEL */}
        <div>
          {isFarmer ? (
            /* FARMER ACTION PANEL: JOIN POOL WITH OWN CONTRIBUTION */
            <div className="panel" style={{ padding: '24px', background: '#ffffff', border: '2px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="badge badge-green">FARMER CONSOLE</span>
                <span className="badge badge-amber">Collective Premium</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                Join Digital Cluster Pool
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45, marginBottom: 18 }}>
                Contribute your harvest to the cluster to unlock corporate buyer bids and save on transport pooling.
              </p>

              {/* Status card */}
              <div style={{ 
                background: isUserJoined ? '#ecfdf5' : '#f8fafc', 
                border: isUserJoined ? '1px solid #86efac' : '1px solid #cbd5e1', 
                borderRadius: 10, padding: '16px', marginBottom: 20 
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Your Participation Status
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: isUserJoined ? '#15803d' : '#0f172a', marginTop: 2 }}>
                  {isUserJoined ? `✓ Active in ${activePool.id} (30 Qtl Contributed)` : 'Not Yet Joined'}
                </div>
                <div style={{ fontSize: '0.78rem', color: isUserJoined ? '#166534' : '#64748b', marginTop: 4 }}>
                  {isUserJoined 
                    ? 'Your produce is locked in this cluster lot. You will receive ₹2,450/Qtl via SBI DBT upon buyer acceptance.'
                    : 'Select quantity to contribute from your active harvest lot.'}
                </div>
              </div>

              {/* Contribution selector */}
              {!isUserJoined && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    Select Contribution Quantity (क्विंटल प्रमाण निवडा):
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[20, 30, 40, 50].map(qty => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setFarmerContribution(qty)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: 6, fontSize: '0.84rem', fontWeight: 800,
                          background: farmerContribution === qty ? '#15803d' : '#f1f5f9',
                          color: farmerContribution === qty ? '#ffffff' : '#334155',
                          border: farmerContribution === qty ? '1px solid #166534' : '1px solid #cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        {qty} Qtl
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleFarmerToggle}
                className={isUserJoined ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%', padding: '12px', fontSize: '0.92rem', fontWeight: 800,
                  justifyContent: 'center', background: isUserJoined ? '#ffffff' : 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                }}
              >
                {isUserJoined ? 'Leave Pool (गटातून बाहेर पडा)' : `+ Join Pool with ${farmerContribution} Qtl (गटात सहभागी व्हा)`}
              </button>

              <div style={{ marginTop: 16, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                🔒 <strong>100% Escrow Protection:</strong> Funds are paid directly into your linked bank account via NPCI DBT immediately when the buyer accepts the combined delivery.
              </div>
            </div>
          ) : (
            /* BUYER ACTION PANEL: PLACE BID ON COMBINED LOT */
            <div className="panel" style={{ padding: '24px', background: '#ffffff', border: '2px solid #93c5fd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="badge badge-blue">BUYER PROCUREMENT</span>
                <span className="badge badge-green">Combined Bulk Lot</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                Place Bid on Combined Lot
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45, marginBottom: 18 }}>
                Bid on the entire {activePool.current_pooled_qtl} Qtl lot as a single trade. Pre-funds into State Escrow Vault upon bid placement.
              </p>

              <form onSubmit={handleBuyerBidSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Your Offer Price per Quintal (प्रति क्विंटल दर):
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#64748b' }}>₹</span>
                    <input
                      type="number"
                      value={bidPrice}
                      onChange={(e) => setBidPrice(Number(e.target.value))}
                      min={activePool.base_rate_per_qtl}
                      style={{
                        width: '100%', padding: '10px 14px 10px 28px', borderRadius: 8,
                        border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                    Reserve / Cluster Base Price: <strong>₹{activePool.base_rate_per_qtl}/Qtl</strong>
                  </div>
                </div>

                {/* Total Escrow Calculation */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px', marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569' }}>
                    <span>Combined Lot Volume:</span>
                    <strong>{activePool.current_pooled_qtl} Qtl</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginTop: 4 }}>
                    <span>Bid Rate:</span>
                    <strong>₹{bidPrice}/Qtl</strong>
                  </div>
                  <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: 6, marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 900, color: '#0f172a' }}>
                    <span>Total Escrow Deposit:</span>
                    <span style={{ color: '#15803d' }}>₹{(bidPrice * activePool.current_pooled_qtl).toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '12px', fontSize: '0.92rem', fontWeight: 800,
                    justifyContent: 'center', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                  }}
                >
                  {isSubmittingBid ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Locking Escrow Bid...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} />
                      <span>Place Bid & Pre-Fund Escrow (बोली लावा)</span>
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 14, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                🛡️ <strong>APMC Rule 24 Escrow Guarantee:</strong> Bids are binding and pre-authorized. Funds are credited simultaneously across the {activePool.pooled_farmers.length} contributing farmers upon inward weighbridge verification.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
