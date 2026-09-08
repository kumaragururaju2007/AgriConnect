import React, { useState } from 'react';
import { 
  History, Calendar, Package, DollarSign, Store, Clock, 
  CheckCircle2, AlertCircle, Search, Filter, Download, 
  Printer, ArrowUpRight, ShieldCheck, FileText, ChevronRight, X, Sparkles
} from 'lucide-react';

// Comprehensive Mock Produce History Transactions Dataset
export const MOCK_PRODUCE_HISTORY = [
  {
    id: 'TXN-MH-2024-8841',
    produce: 'Onion (Red / लाल कांदा)',
    variety: 'Gavran High Pungency • Grade A (55mm+)',
    icon: '🧅',
    date: '04 Sept 2024',
    timestamp: '11:30 AM IST',
    quantity: '12.0 Tons (120 Qtl)',
    quantityNum: 120,
    pricePerUnit: '₹24,500 / Ton (₹2,450/Q)',
    totalPrice: '₹2,94,000',
    totalAmount: 294000,
    buyerOrMandi: 'AgroFresh Supply Chain Ltd • Lasalgaon APMC Bay 4',
    buyerName: 'AgroFresh Supply Chain Ltd',
    mandiName: 'Lasalgaon APMC (Nashik)',
    status: 'Delivered',
    statusType: 'delivered',
    lotNumber: 'LOT-NSK-2024-9104',
    escrowRef: 'ESC-MH-2024-99823101',
    paymentStatus: 'Escrow Released to SBI A/C (Aadhaar DBT)',
    notes: 'Electronic proof-of-delivery signed. Mandi assayer moisture verified at 11.2%.'
  },
  {
    id: 'TXN-MH-2024-8419',
    produce: 'Wheat (Sharbati / शरबती गहू)',
    variety: 'Lokwan Golden Hard • Grade A',
    icon: '🌾',
    date: '29 Aug 2024',
    timestamp: '02:15 PM IST',
    quantity: '20.0 Tons (200 Qtl)',
    quantityNum: 200,
    pricePerUnit: '₹31,800 / Ton (₹3,180/Q)',
    totalPrice: '₹6,36,000',
    totalAmount: 636000,
    buyerOrMandi: 'Sahyadri Farmer Producer Co. Ltd • Mohadi Hub',
    buyerName: 'Sahyadri FPC Ltd',
    mandiName: 'Mohadi Regional Hub (Nashik)',
    status: 'Sold',
    statusType: 'sold',
    lotNumber: 'LOT-NSK-2024-8902',
    escrowRef: 'ESC-MH-2024-94100234',
    paymentStatus: '100% Settled & Deposited via Direct DBT',
    notes: 'Sold via digital pool auction. Quality NIR test score 96/100.'
  },
  {
    id: 'TXN-MH-2024-7933',
    produce: 'Soyabean (Yellow / पिवळी सोयाबीन)',
    variety: 'JS-335 Certified Seed • High Oil (19.8%)',
    icon: '🫘',
    date: '22 Aug 2024',
    timestamp: '10:45 AM IST',
    quantity: '15.0 Tons (150 Qtl)',
    quantityNum: 150,
    pricePerUnit: '₹48,200 / Ton (₹4,820/Q)',
    totalPrice: '₹7,23,000',
    totalAmount: 723000,
    buyerOrMandi: 'Krishna Valley Oilseeds Co. • Latur APMC',
    buyerName: 'Krishna Valley Oilseeds Co.',
    mandiName: 'Latur APMC Yard',
    status: 'Delivered',
    statusType: 'delivered',
    lotNumber: 'LOT-LTR-2024-8711',
    escrowRef: 'ESC-MH-2024-88319201',
    paymentStatus: 'Escrow Payout Complete',
    notes: 'Weighbridge calibrated inward slip approved. Clean transit under 5 hrs.'
  },
  {
    id: 'TXN-MH-2024-7402',
    produce: 'Tomato (Hybrid / लाल टोमॅटो)',
    variety: 'Abhinav F1 Hybrid • Table Grade',
    icon: '🍅',
    date: '16 Aug 2024',
    timestamp: '04:20 AM IST',
    quantity: '8.0 Tons (80 Qtl)',
    quantityNum: 80,
    pricePerUnit: '₹16,500 / Ton (₹1,650/Q)',
    totalPrice: '₹1,32,000',
    totalAmount: 132000,
    buyerOrMandi: 'Vashi APMC Terminal II • Navi Mumbai',
    buyerName: 'Mumbai Central Aggregators',
    mandiName: 'Vashi APMC Mandi II',
    status: 'Sold',
    statusType: 'sold',
    lotNumber: 'LOT-VSH-2024-8420',
    escrowRef: 'ESC-MH-2024-76229104',
    paymentStatus: 'Morning Auction Funds Cleared',
    notes: 'Arrived at 03:30 AM before auction ring open. Zero crate damage recorded.'
  },
  {
    id: 'TXN-MH-2024-6991',
    produce: 'Pomegranate (Bhagwa / भगवा डाळिंब)',
    variety: 'Export Super Grade • 250g+ Ruby Arils',
    icon: '🍎',
    date: '08 Aug 2024',
    timestamp: '03:10 PM IST',
    quantity: '5.0 Tons (50 Qtl)',
    quantityNum: 50,
    pricePerUnit: '₹92,000 / Ton (₹9,200/Q)',
    totalPrice: '₹4,60,000',
    totalAmount: 460000,
    buyerOrMandi: 'MahaAgro Food Processors & Exporters • Solapur APMC',
    buyerName: 'MahaAgro Food Processors Ltd',
    mandiName: 'Solapur APMC Cold Corridor',
    status: 'Delivered',
    statusType: 'delivered',
    lotNumber: 'LOT-SLP-2024-8104',
    escrowRef: 'ESC-MH-2024-69128039',
    paymentStatus: 'Cold Chain Inward Complete • Escrow Released',
    notes: 'Pack-house refrigerated container delivery. Phytosanitary certificate linked.'
  },
  {
    id: 'TXN-MH-2024-6510',
    produce: 'Cotton (BT Hybrid / पांढरे सोने)',
    variety: 'Medium Staple 29mm • Micronaire 3.8',
    icon: '🪵',
    date: '02 Aug 2024',
    timestamp: '01:00 PM IST',
    quantity: '10.0 Tons (100 Qtl)',
    quantityNum: 100,
    pricePerUnit: '₹74,100 / Ton (₹7,410/Q)',
    totalPrice: '₹7,41,000',
    totalAmount: 741000,
    buyerOrMandi: 'Akola Cotton Ginning Cluster • Akola APMC',
    buyerName: 'Vidarbha Ginning & Pressing Mills',
    mandiName: 'Akola APMC Yard',
    status: 'Sold',
    statusType: 'sold',
    lotNumber: 'LOT-AKL-2024-7822',
    escrowRef: 'ESC-MH-2024-61029482',
    paymentStatus: 'MSP Plus Contract Cleared',
    notes: 'Moisture content tested at 7.8% (within statutory 8.5% limit).'
  },
  {
    id: 'TXN-MH-2024-9102',
    produce: 'Onion (Late Kharif Pol / लाल कांदा)',
    variety: 'Nashik Red Gavran • Size 50mm+',
    icon: '🧅',
    date: '05 Sept 2024',
    timestamp: '09:15 AM IST',
    quantity: '9.0 Tons (90 Qtl)',
    quantityNum: 90,
    pricePerUnit: '₹23,800 / Ton (₹2,380/Q)',
    totalPrice: '₹2,14,200',
    totalAmount: 214200,
    buyerOrMandi: 'Pimpalgaon Baswant Regional Depot • Nashik',
    buyerName: 'Pimpalgaon Growers Collective',
    mandiName: 'Pimpalgaon APMC Depot',
    status: 'Pending',
    statusType: 'pending',
    lotNumber: 'LOT-NSK-2024-9280',
    escrowRef: 'ESC-MH-2024-99840212',
    paymentStatus: '100% Pre-funded in Vault • Pending Dock Weighment',
    notes: 'Consignment gate pass generated. Awaiting dock inward weighbridge stamp.'
  },
  {
    id: 'TXN-MH-2024-9215',
    produce: 'Tur Dal / Pigeon Pea (गावराण तूर)',
    variety: 'Amravati White Bold • Desi Variety',
    icon: '🌾',
    date: '06 Sept 2024',
    timestamp: '10:00 AM IST',
    quantity: '6.0 Tons (60 Qtl)',
    quantityNum: 60,
    pricePerUnit: '₹98,500 / Ton (₹9,850/Q)',
    totalPrice: '₹5,91,000',
    totalAmount: 591000,
    buyerOrMandi: 'Amravati Dal Millers Consortium • Amravati Mandi',
    buyerName: 'Amravati Dal Millers Consortium',
    mandiName: 'Amravati APMC Gate 1',
    status: 'Pending',
    statusType: 'pending',
    lotNumber: 'LOT-AMR-2024-9340',
    escrowRef: 'ESC-MH-2024-99912048',
    paymentStatus: 'Escrow Lock Activated • Contract Signing',
    notes: 'Buyer inspection underway. Digital grading report submitted with 94% purity.'
  }
];

export default function Step14ProduceHistory({ setStep, setTerminal, lang = 'en' }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Filter transactions based on status tab and search query
  const filteredTransactions = MOCK_PRODUCE_HISTORY.filter((item) => {
    const matchesFilter = 
      selectedFilter === 'ALL' || 
      item.statusType.toUpperCase() === selectedFilter;

    const matchesSearch = 
      searchQuery.trim() === '' ||
      item.produce.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyerOrMandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate totals
  const totalVolumeQtl = MOCK_PRODUCE_HISTORY.reduce((acc, curr) => acc + curr.quantityNum, 0);
  const totalValueRupees = MOCK_PRODUCE_HISTORY.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const soldCount = MOCK_PRODUCE_HISTORY.filter(i => i.statusType === 'sold').length;
  const deliveredCount = MOCK_PRODUCE_HISTORY.filter(i => i.statusType === 'delivered').length;
  const pendingCount = MOCK_PRODUCE_HISTORY.filter(i => i.statusType === 'pending').length;

  // Status badge styling helper
  const renderStatusBadge = (statusType, statusText) => {
    if (statusType === 'sold') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: '0.72rem',
          fontWeight: 800,
          background: '#ecfdf5',
          color: '#15803d',
          border: '1px solid #bbf7d0'
        }}>
          <CheckCircle2 size={12} />
          {statusText}
        </span>
      );
    } else if (statusType === 'delivered') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: '0.72rem',
          fontWeight: 800,
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe'
        }}>
          <CheckCircle2 size={12} />
          {statusText}
        </span>
      );
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: '0.72rem',
          fontWeight: 800,
          background: '#fffbeb',
          color: '#b45309',
          border: '1px solid #fde68a'
        }}>
          <Clock size={12} />
          {statusText}
        </span>
      );
    }
  };

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Top Header Banner */}
      <div className="panel" style={{ 
        padding: '24px 28px', 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderLeft: '4px solid #ea580c',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-saffron" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                <History size={13} />
                <span>OFFICIAL PRODUCE TRANSACTIONS LOG</span>
              </span>
              <span className="badge badge-green">APMC Mandi Ledger Synchronized</span>
              <span className="badge badge-blue">100% Escrow Vault Verified</span>
            </div>

            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-title)', letterSpacing: '-0.02em', margin: 0 }}>
              Produce Transaction & Listing History
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4, maxWidth: 900, lineHeight: 1.45 }}>
              Comprehensive historical audit log of all farmgate listings, spot auctions, Mandi inward consignments, and escrow disbursements across Maharashtra APMCs.
            </p>
          </div>

          <div style={{ textAlign: 'right', background: '#ffffff', border: '1px solid #fed7aa', padding: '10px 18px', borderRadius: 10 }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Value Realized</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#c2410c', marginTop: 2 }}>
              ₹{(totalValueRupees / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 700 }}>8 Recorded Trades</div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="panel" style={{ padding: '18px 20px', background: '#ffffff' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TOTAL VOLUME TRANSACTED
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
            {(totalVolumeQtl / 10).toFixed(1)} Tons
          </div>
          <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600 }}>
            {totalVolumeQtl} Quintals (Qtl)
          </div>
        </div>

        <div className="panel" style={{ padding: '18px 20px', background: '#ffffff' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            TOTAL VALUE SETTLED
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d', margin: '4px 0 2px' }}>
            ₹{totalValueRupees.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600 }}>
            100% Guaranteed Escrow
          </div>
        </div>

        <div className="panel" style={{ padding: '18px 20px', background: '#ffffff' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            SOLD & DELIVERED
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563eb', margin: '4px 0 2px' }}>
            {soldCount + deliveredCount} Orders
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
            {soldCount} Sold • {deliveredCount} Delivered
          </div>
        </div>

        <div className="panel" style={{ padding: '18px 20px', background: '#ffffff' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            PENDING CLEARANCE
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#d97706', margin: '4px 0 2px' }}>
            {pendingCount} Consignments
          </div>
          <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 600 }}>
            Dock Weighment & Inward SLA
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="panel" style={{ 
        padding: '16px 20px', 
        background: '#ffffff',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 14 
      }}>
        {/* Status Tab Chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Transactions', count: MOCK_PRODUCE_HISTORY.length },
            { id: 'SOLD', label: 'Sold', count: soldCount },
            { id: 'DELIVERED', label: 'Delivered', count: deliveredCount },
            { id: 'PENDING', label: 'Pending', count: pendingCount }
          ].map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? '#ea580c' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  border: isActive ? '1px solid #c2410c' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: 12,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 260, flex: '1 1 260px', maxWidth: 360 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '7px 12px',
            width: '100%'
          }}>
            <Search size={16} color="#64748b" style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="Search produce, buyer, mandi, lot #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.84rem',
                width: '100%',
                color: '#0f172a'
              }}
            />
            {searchQuery && (
              <X size={14} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            )}
          </div>
        </div>
      </div>

      {/* Transaction List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredTransactions.length === 0 ? (
          <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <History size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>No transaction history found</div>
            <div style={{ fontSize: '0.82rem', marginTop: 4 }}>
              Try adjusting your search query or switching to another filter tab.
            </div>
          </div>
        ) : (
          filteredTransactions.map((item) => (
            <div
              key={item.id}
              className="panel hover-card"
              style={{
                padding: '20px 24px',
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                borderLeft: item.statusType === 'sold' 
                  ? '4px solid #15803d' 
                  : item.statusType === 'delivered' 
                  ? '4px solid #2563eb' 
                  : '4px solid #d97706'
              }}
            >
              {/* Left Column: Icon & Produce Name & Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 280, flex: '1 1 300px' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  {item.icon}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {item.produce}
                    </h3>
                    {renderStatusBadge(item.statusType, item.status)}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
                    {item.variety}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: '0.74rem', color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} color="#ea580c" />
                      <strong>{item.date}</strong> ({item.timestamp})
                    </span>
                    <span>•</span>
                    <span style={{ color: '#64748b' }}>
                      Txn: <strong style={{ color: '#0f172a' }}>{item.id}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Quantity & Price */}
              <div style={{ minWidth: 200, flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Quantity & Pricing
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '1.18rem', fontWeight: 900, color: '#0f172a' }}>
                    {item.totalPrice}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    ({item.pricePerUnit})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                  <Package size={13} />
                  <span>{item.quantity}</span>
                </div>
              </div>

              {/* Right Column: Buyer / Mandi & Actions */}
              <div style={{ minWidth: 260, flex: '1 1 260px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Buyer / Mandi Counterparty
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
                  <Store size={14} color="#ea580c" />
                  <span>{item.buyerOrMandi}</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {item.paymentStatus}
                </div>

                <button
                  onClick={() => setSelectedTxn(item)}
                  style={{
                    marginTop: 4,
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    color: '#c2410c',
                    border: '1px solid #fed7aa',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={13} />
                  <span>View Mandi Receipt</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Mandi Invoice / Receipt Modal */}
      {selectedTxn && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div className="panel" style={{
            maxWidth: 620,
            width: '100%',
            background: '#ffffff',
            borderRadius: 16,
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #fed7aa' }}>
                  {selectedTxn.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
                    APMC SETTLED E-INVOICE & VOUCHER
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                    {selectedTxn.produce}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="#64748b" />
              </button>
            </div>

            {/* Receipt Body Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem' }}>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>TRANSACTION REFERENCE</div>
                <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{selectedTxn.id}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>DATE & TIMESTAMP</div>
                <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{selectedTxn.date} • {selectedTxn.timestamp}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>LOT SPECIFICATION</div>
                <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{selectedTxn.lotNumber}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ESCROW VAULT REF</div>
                <div style={{ fontWeight: 800, color: '#166534', marginTop: 2 }}>{selectedTxn.escrowRef}</div>
              </div>
            </div>

            {/* Financial Summary Box */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: 12,
              padding: '16px 20px',
              border: '1px solid #86efac',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 700 }}>
                  QUANTITY: {selectedTxn.quantity} @ {selectedTxn.pricePerUnit}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: 2 }}>
                  Status: <strong>{selectedTxn.status}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>NET PAYOUT AMOUNT</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#15803d' }}>
                  {selectedTxn.totalPrice}
                </div>
              </div>
            </div>

            {/* Counterparty & Inspection notes */}
            <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <strong>Buyer Counterparty:</strong> {selectedTxn.buyerName}
              </div>
              <div>
                <strong>Assigned APMC Mandi:</strong> {selectedTxn.mandiName}
              </div>
              <div>
                <strong>Settlement Ledger:</strong> {selectedTxn.paymentStatus}
              </div>
              <div>
                <strong>Assayer Notes:</strong> {selectedTxn.notes}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
