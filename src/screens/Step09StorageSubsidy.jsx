import React, { useState, useMemo } from 'react';
import { 
  Warehouse, ShieldCheck, MapPin, CheckCircle2, ArrowRight, 
  Sparkles, ExternalLink, FileText, AlertCircle, Clock, 
  Phone, Mail, Building2, Filter, Search, Calendar, 
  ChevronDown, ChevronUp, Check, Info, HelpCircle, 
  ThermometerSnowflake, Wheat, Layers
} from 'lucide-react';
import { 
  DATASET_METADATA, 
  REGIONAL_OFFICES, 
  WAREHOUSES, 
  STORAGE_SCHEMES 
} from '../data/storageSchemesData';

export default function Step09StorageSubsidy({ setStep, lang = 'en' }) {
  // District Filter (Default: Nashik)
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  
  // Storage Type Filter: 'all', 'MSWC Dry Godown', 'Commercial Cold Storage', 'Cooperative PACS Godown'
  const [storageTypeFilter, setStorageTypeFilter] = useState('all');
  
  // Crop Category Filter: 'all', 'onion', 'grains', 'fruits', 'cooperative'
  const [cropCategoryFilter, setCropCategoryFilter] = useState('all');
  
  // Search Query for warehouses
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active selected warehouse for details/booking
  const [selectedWh, setSelectedWh] = useState(WAREHOUSES[0] || null);
  
  // Modals state
  const [bookingWh, setBookingWh] = useState(null);
  const [bookingQty, setBookingQty] = useState(15);
  const [bookingDuration, setBookingDuration] = useState(3);
  const [bookingCommodity, setBookingCommodity] = useState('Red Onion (Rabi)');
  const [bookingSuccessRef, setBookingSuccessRef] = useState(null);
  
  const [appliedScheme, setAppliedScheme] = useState(null);
  const [applySuccessRef, setApplySuccessRef] = useState(null);
  
  // Expanded Jargon Box per scheme
  const [expandedJargon, setExpandedJargon] = useState({});

  const toggleJargon = (schemeId) => {
    setExpandedJargon(prev => ({ ...prev, [schemeId]: !prev[schemeId] }));
  };

  // Extract unique districts from warehouses data
  const districtsList = useMemo(() => {
    const list = Array.from(new Set(WAREHOUSES.map(w => w.district))).sort();
    return list;
  }, []);

  // Get nearest Regional Office for the selected district
  const currentRegionalOffice = useMemo(() => {
    for (const ro of Object.values(REGIONAL_OFFICES)) {
      if (ro.districts.some(d => d.toLowerCase() === selectedDistrict.toLowerCase())) {
        return ro;
      }
    }
    return REGIONAL_OFFICES["Nashik"] || Object.values(REGIONAL_OFFICES)[0];
  }, [selectedDistrict]);

  // Filter Warehouses
  const filteredWarehouses = useMemo(() => {
    return WAREHOUSES.filter(wh => {
      const matchDistrict = wh.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchType = storageTypeFilter === 'all' || wh.type === storageTypeFilter;
      const matchSearch = searchQuery.trim() === '' || 
        wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.plantCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDistrict && matchType && matchSearch;
    });
  }, [selectedDistrict, storageTypeFilter, searchQuery]);

  // Filter Schemes
  const filteredSchemes = useMemo(() => {
    return STORAGE_SCHEMES.filter(scheme => {
      if (cropCategoryFilter === 'all') return true;
      if (cropCategoryFilter === 'onion') return scheme.cropCategories.includes('onion');
      if (cropCategoryFilter === 'grains') return scheme.cropCategories.includes('grains') || scheme.cropCategories.includes('pulses');
      if (cropCategoryFilter === 'fruits') return scheme.cropCategories.includes('fruits') || scheme.cropCategories.includes('vegetables') || scheme.cropCategories.includes('horticulture');
      if (cropCategoryFilter === 'cooperative') return scheme.cropCategories.includes('cooperative') || scheme.id.includes('NABARD') || scheme.id.includes('PIB');
      return true;
    });
  }, [cropCategoryFilter]);

  // Statistics for selected district
  const districtStats = useMemo(() => {
    const whs = WAREHOUSES.filter(w => w.district.toLowerCase() === selectedDistrict.toLowerCase());
    const totalCapacity = whs.reduce((acc, w) => acc + (w.totalCapacityMT || 0), 0);
    const availableCapacity = whs.reduce((acc, w) => acc + (w.availableCapacityMT || 0), 0);
    return {
      count: whs.length,
      totalCapacity,
      availableCapacity
    };
  }, [selectedDistrict]);

  const handleOpenBooking = (wh) => {
    setBookingWh(wh);
    setBookingSuccessRef(null);
  };

  const handleConfirmBooking = () => {
    const ref = `MSWC-BK-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccessRef(ref);
  };

  const handleOpenApplyScheme = (scheme) => {
    setAppliedScheme(scheme);
    setApplySuccessRef(null);
  };

  const handleConfirmApply = () => {
    const ref = `MAHA-SUB-${Math.floor(200000 + Math.random() * 800000)}`;
    setApplySuccessRef(ref);
  };

  return (
    <div className="animate-slide-in" style={{ paddingBottom: 40 }}>
      
      {/* 1. Header Banner & Data Freshness Indicator */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        borderRadius: 16, 
        padding: '24px 28px', 
        color: '#ffffff',
        marginBottom: 24,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ 
                background: 'rgba(34, 197, 94, 0.15)', 
                color: '#4ade80', 
                padding: '4px 10px', 
                borderRadius: 20, 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 5,
                border: '1px solid rgba(74, 222, 128, 0.3)'
              }}>
                <Warehouse size={12} />
                MSWC Maharashtra Directory (198 Verified Centers)
              </span>

              <span style={{ 
                background: 'rgba(245, 158, 11, 0.15)', 
                color: '#fbbf24', 
                padding: '4px 10px', 
                borderRadius: 20, 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 5,
                border: '1px solid rgba(251, 191, 36, 0.3)'
              }}>
                <Sparkles size={12} />
                LLM Jargon-Free Scheme Summaries
              </span>

              <span style={{ 
                background: 'rgba(59, 130, 246, 0.15)', 
                color: '#93c5fd', 
                padding: '4px 10px', 
                borderRadius: 20, 
                fontSize: '0.72rem', 
                fontWeight: 600, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 5,
                border: '1px solid rgba(147, 197, 253, 0.3)'
              }}>
                <Clock size={12} />
                Reference Ledger: Last Updated {DATASET_METADATA.formattedDate}
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Storage Facilities & Government Subsidies Ledger
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, maxWidth: 840, lineHeight: 1.5 }}>
              Find accredited state warehousing centers, cold chains, and Primary Agricultural Credit Society (PACS) godowns across Maharashtra. 
              Review plain-language government subsidy programs (PIB Grain Plan, MSAMB Onion Chawl, AIF Cold Stores, NHB) with pre-filled application pathways.
            </p>
          </div>

          <div style={{ 
            background: 'rgba(15, 23, 42, 0.8)', 
            border: '1px solid #475569', 
            borderRadius: 12, 
            padding: '12px 18px',
            minWidth: 220,
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Current District Focus
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
              {selectedDistrict} District
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: 2 }}>
              {districtStats.count} Centers • {(districtStats.availableCapacity).toLocaleString()} MT Space
            </div>
          </div>
        </div>

        {/* Notice of Periodic Batch (Transparency guarantee) */}
        <div style={{ 
          marginTop: 16, 
          padding: '8px 14px', 
          borderRadius: 8, 
          background: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          fontSize: '0.75rem', 
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Info size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <span>
            <strong>Transparency Notice:</strong> This module references official statutory registries (MSWC, PIB, MSAMB, NABARD, NHB). Data is periodically synced via batch ingestion ({DATASET_METADATA.updateCycle}) rather than a live transaction API. Bay allocations are finalized upon physical inward inspection.
          </span>
        </div>
      </div>

      {/* 2. Interactive Filter Toolbar */}
      <div className="panel" style={{ padding: '16px 20px', marginBottom: 24, background: '#ffffff', borderRadius: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'center' }}>
          
          {/* District Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
              <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
              Select Maharashtra District
            </label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '9px 12px', 
                borderRadius: 8, 
                border: '1px solid #cbd5e1', 
                fontSize: '0.86rem', 
                fontWeight: 600,
                color: '#0f172a',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              {districtsList.map(dist => (
                <option key={dist} value={dist}>{dist} District</option>
              ))}
            </select>
          </div>

          {/* Crop / Commodity Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
              <Wheat size={12} style={{ display: 'inline', marginRight: 4 }} />
              Filter by Your Crop / Scale
            </label>
            <select 
              value={cropCategoryFilter}
              onChange={(e) => setCropCategoryFilter(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '9px 12px', 
                borderRadius: 8, 
                border: '1px solid #cbd5e1', 
                fontSize: '0.86rem', 
                fontWeight: 600,
                color: '#0f172a',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <option value="all">🌾 All Agricultural Commodities</option>
              <option value="onion">🧅 Onion / Kanda Growers (Prioritizes Kanda Chawl)</option>
              <option value="grains">🌾 Grains & Pulses (PACS Godown Scheme)</option>
              <option value="fruits">🍇 Fruits, Veg & Cold Storage (AIF & NHB)</option>
              <option value="cooperative">🏛️ FPO / Cooperative Scale (5,000+ MT NABARD)</option>
            </select>
          </div>

          {/* Storage Type Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
              <Layers size={12} style={{ display: 'inline', marginRight: 4 }} />
              Storage Facility Type
            </label>
            <select 
              value={storageTypeFilter}
              onChange={(e) => setStorageTypeFilter(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '9px 12px', 
                borderRadius: 8, 
                border: '1px solid #cbd5e1', 
                fontSize: '0.86rem', 
                fontWeight: 600,
                color: '#0f172a',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Storage Facility Types</option>
              <option value="MSWC Dry Godown">MSWC State Dry Godowns</option>
              <option value="Commercial Cold Storage">Commercial Cold Storage / CA</option>
              <option value="Cooperative PACS Godown">PACS Cooperative Village Godowns</option>
            </select>
          </div>

          {/* Warehouse Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
              <Search size={12} style={{ display: 'inline', marginRight: 4 }} />
              Quick Warehouse Search
            </label>
            <input 
              type="text"
              placeholder="Search by APMC, plant code, tehsil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '9px 12px', 
                borderRadius: 8, 
                border: '1px solid #cbd5e1', 
                fontSize: '0.86rem',
                color: '#0f172a',
                background: '#ffffff'
              }}
            />
          </div>

        </div>

        {/* Quick Filter Pill Badges */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
          
          <button 
            onClick={() => setCropCategoryFilter('onion')}
            style={{ 
              padding: '4px 10px', 
              borderRadius: 16, 
              fontSize: '0.72rem', 
              fontWeight: 600, 
              border: cropCategoryFilter === 'onion' ? '1px solid #ea580c' : '1px solid #e2e8f0',
              background: cropCategoryFilter === 'onion' ? '#ffedd5' : '#f8fafc',
              color: cropCategoryFilter === 'onion' ? '#c2410c' : '#475569',
              cursor: 'pointer'
            }}
          >
            🧅 Onion Farmer Focus
          </button>

          <button 
            onClick={() => setCropCategoryFilter('grains')}
            style={{ 
              padding: '4px 10px', 
              borderRadius: 16, 
              fontSize: '0.72rem', 
              fontWeight: 600, 
              border: cropCategoryFilter === 'grains' ? '1px solid #0284c7' : '1px solid #e2e8f0',
              background: cropCategoryFilter === 'grains' ? '#e0f2fe' : '#f8fafc',
              color: cropCategoryFilter === 'grains' ? '#0369a1' : '#475569',
              cursor: 'pointer'
            }}
          >
            🌾 PACS Grain Storage
          </button>

          <button 
            onClick={() => setCropCategoryFilter('fruits')}
            style={{ 
              padding: '4px 10px', 
              borderRadius: 16, 
              fontSize: '0.72rem', 
              fontWeight: 600, 
              border: cropCategoryFilter === 'fruits' ? '1px solid #16a34a' : '1px solid #e2e8f0',
              background: cropCategoryFilter === 'fruits' ? '#dcfce7' : '#f8fafc',
              color: cropCategoryFilter === 'fruits' ? '#15803d' : '#475569',
              cursor: 'pointer'
            }}
          >
            ❄️ Cold Storage Subsidy
          </button>

          {cropCategoryFilter !== 'all' && (
            <button 
              onClick={() => setCropCategoryFilter('all')}
              style={{ 
                padding: '4px 8px', 
                borderRadius: 16, 
                fontSize: '0.7rem', 
                border: '1px solid #cbd5e1', 
                background: '#ffffff', 
                color: '#64748b', 
                cursor: 'pointer' 
              }}
            >
              Reset Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Split View: Left = Warehouses & Regional Office, Right = Schemes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* ================= LEFT COLUMN: WAREHOUSES & REGIONAL OFFICE ================= */}
        <div>
          
          {/* Nearest Regional Office Highlight Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e2fbe8 100%)', 
            borderRadius: 12, 
            padding: '16px 20px', 
            border: '1px solid #bbf7d0', 
            marginBottom: 20,
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#15803d', letterSpacing: '0.05em' }}>
                  Designated Regional Controlling Office
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532d', margin: '2px 0 6px 0' }}>
                  MSWC {currentRegionalOffice.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
                  <div><strong>Officer:</strong> {currentRegionalOffice.officer} ({currentRegionalOffice.designation})</div>
                  <div><strong>Office Address:</strong> {currentRegionalOffice.address}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <a 
                  href={`tel:${currentRegionalOffice.phone.split('/')[0].trim()}`}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    fontSize: '0.75rem', 
                    color: '#ffffff', 
                    background: '#15803d', 
                    padding: '6px 12px', 
                    borderRadius: 6, 
                    textDecoration: 'none',
                    fontWeight: 700 
                  }}
                >
                  <Phone size={12} />
                  {currentRegionalOffice.phone.split('/')[0].trim()}
                </a>
                <a 
                  href={`mailto:${currentRegionalOffice.email}`}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    fontSize: '0.72rem', 
                    color: '#166534', 
                    textDecoration: 'none',
                    fontWeight: 600 
                  }}
                >
                  <Mail size={12} />
                  {currentRegionalOffice.email}
                </a>
              </div>
            </div>
            
            <div style={{ fontSize: '0.7rem', color: '#15803d', marginTop: 8, borderTop: '1px dashed #86efac', paddingTop: 6 }}>
              Covering Districts: {currentRegionalOffice.districts.join(', ')}
            </div>
          </div>

          {/* District Warehouse List Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
              Warehouses & Cold Stores in {selectedDistrict} ({filteredWarehouses.length})
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              WDRA Certified e-NWR Ready
            </span>
          </div>

          {/* Warehouses List */}
          {filteredWarehouses.length === 0 ? (
            <div className="panel" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 8px auto', color: '#94a3b8' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>No warehouses matched your filters in {selectedDistrict}.</p>
              <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0' }}>Try resetting the storage type or search query.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredWarehouses.map((wh) => {
                const isSelected = selectedWh && selectedWh.id === wh.id;
                const capacityPct = Math.round((wh.availableCapacityMT / wh.totalCapacityMT) * 100);

                return (
                  <div 
                    key={wh.id}
                    className="panel"
                    style={{ 
                      padding: '18px 20px', 
                      borderRadius: 14, 
                      border: isSelected ? '2px solid #16a34a' : '1px solid var(--border-card)',
                      background: isSelected ? '#fcfdfd' : '#ffffff',
                      boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.08)' : 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedWh(wh)}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 800, 
                            background: wh.type.includes('Cold') ? '#eff6ff' : '#f1f5f9',
                            color: wh.type.includes('Cold') ? '#1d4ed8' : '#334155',
                            padding: '2px 8px', 
                            borderRadius: 4,
                            border: wh.type.includes('Cold') ? '1px solid #bfdbfe' : '1px solid #e2e8f0'
                          }}>
                            {wh.type}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                            Plant #{wh.plantCode}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {wh.name}
                        </h4>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          color: '#15803d', 
                          background: '#dcfce7', 
                          padding: '3px 8px', 
                          borderRadius: 6 
                        }}>
                          {wh.availableCapacityMT.toLocaleString()} MT Space
                        </span>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>
                          {wh.godownsCount} Godowns
                        </div>
                      </div>
                    </div>

                    {/* Address & Incharge */}
                    <p style={{ fontSize: '0.76rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4, color: '#64748b' }} />
                      {wh.address}
                    </p>

                    {/* Capacity Progress Bar */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginBottom: 4 }}>
                        <span>Capacity Utilization ({wh.totalCapacityMT - wh.availableCapacityMT} MT used)</span>
                        <span><strong>{capacityPct}%</strong> Open Headroom</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${100 - capacityPct}%`, 
                          height: '100%', 
                          background: capacityPct < 20 ? '#ef4444' : '#16a34a',
                          borderRadius: 3 
                        }} />
                      </div>
                    </div>

                    {/* Meta Badges */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: 8, 
                      padding: '8px 10px', 
                      background: '#f8fafc', 
                      borderRadius: 8, 
                      fontSize: '0.72rem',
                      marginBottom: 12
                    }}>
                      <div>
                        <div style={{ color: '#64748b' }}>Tariff Class</div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{wh.tariffCategory}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b' }}>Base Rent</div>
                        <div style={{ fontWeight: 700, color: '#15803d' }}>₹{wh.monthlyRatePerMT}/MT/Mo</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b' }}>Accreditation</div>
                        <div style={{ fontWeight: 700, color: '#0284c7' }}>WDRA / e-NWR</div>
                      </div>
                    </div>

                    {/* Contact & Booking Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                      <div style={{ fontSize: '0.72rem', color: '#334155' }}>
                        <strong>Incharge:</strong> {wh.incharge}
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBooking(wh);
                          }}
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.76rem', borderRadius: 6 }}
                        >
                          Book Space / e-NWR
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>


        {/* ================= RIGHT COLUMN: LLM-SUMMARIZED GOVERNMENT SCHEMES ================= */}
        <div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                Applicable Storage Subsidies & Schemes ({filteredSchemes.length})
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                AI plain-language translation of central & state storage subsidies
              </p>
            </div>

            {cropCategoryFilter === 'onion' && (
              <span style={{ 
                fontSize: '0.68rem', 
                fontWeight: 800, 
                color: '#c2410c', 
                background: '#ffedd5', 
                padding: '4px 8px', 
                borderRadius: 6,
                border: '1px solid #fed7aa'
              }}>
                🧅 Onion Match Active
              </span>
            )}
          </div>

          {/* Scheme Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {filteredSchemes.map((scheme) => {
              const isExpanded = !!expandedJargon[scheme.id];
              const isOnionScheme = scheme.cropCategories.includes('onion');

              return (
                <div 
                  key={scheme.id}
                  className="panel"
                  style={{ 
                    padding: '22px', 
                    borderRadius: 16, 
                    border: isOnionScheme && cropCategoryFilter === 'onion' 
                      ? '2px solid #ea580c' 
                      : '1px solid var(--border-card)',
                    background: '#ffffff',
                    boxShadow: isOnionScheme && cropCategoryFilter === 'onion'
                      ? '0 6px 20px rgba(234, 88, 12, 0.1)'
                      : 'var(--shadow-sm)'
                  }}
                >
                  
                  {/* Scheme Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          fontWeight: 700, 
                          color: '#0369a1', 
                          background: '#e0f2fe', 
                          padding: '2px 8px', 
                          borderRadius: 4 
                        }}>
                          {scheme.issuingBody}
                        </span>
                        {isOnionScheme && (
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            color: '#c2410c', 
                            background: '#ffedd5', 
                            padding: '2px 8px', 
                            borderRadius: 4 
                          }}>
                            ★ High Priority for Nashik / Niphad Onion Belt
                          </span>
                        )}
                      </div>
                      
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                        {scheme.schemeName}
                      </h4>
                    </div>
                  </div>

                  {/* Financial Grant Banner */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
                    border: '1px solid #fde68a', 
                    borderRadius: 10, 
                    padding: '12px 14px', 
                    marginBottom: 14 
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                      Govt Financial Assistance & Subsidy Rate
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#b45309', margin: '2px 0' }}>
                      {scheme.subsidyRateOrAmount}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#78350f' }}>
                      <strong>Capacity Ceiling:</strong> {scheme.capacityLimits}
                    </div>
                  </div>

                  {/* Plain Language Farmer Explanation */}
                  <div style={{ 
                    background: '#f8fafc', 
                    borderRadius: 10, 
                    padding: '14px', 
                    marginBottom: 14,
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Sparkles size={14} style={{ color: '#0284c7' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                        In Plain English (How this helps you):
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                      {scheme.plainLanguageExplanation}
                    </p>
                  </div>

                  {/* What it covers bullet list */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                      Eligible Expenses Covered:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
                      {scheme.whatItCovers.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.75rem', color: '#334155' }}>
                          <CheckCircle2 size={13} style={{ color: '#16a34a', marginTop: 2, flexShrink: 0 }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Jargon Buster Dropdown Accordion */}
                  {scheme.jargonBuster && (
                    <div style={{ marginBottom: 16 }}>
                      <button 
                        onClick={() => toggleJargon(scheme.id)}
                        style={{ 
                          width: '100%', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          background: '#f1f5f9', 
                          border: 'none', 
                          padding: '7px 12px', 
                          borderRadius: 6, 
                          cursor: 'pointer',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#475569'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <HelpCircle size={13} />
                          Plain-Language Jargon Buster ({Object.keys(scheme.jargonBuster).length} terms explained)
                        </span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isExpanded && (
                        <div style={{ 
                          background: '#f8fafc', 
                          border: '1px solid #e2e8f0', 
                          borderTop: 'none', 
                          padding: '10px 12px', 
                          borderRadius: '0 0 6px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6
                        }}>
                          {Object.entries(scheme.jargonBuster).map(([term, explanation]) => (
                            <div key={term} style={{ fontSize: '0.72rem', lineHeight: 1.45 }}>
                              <strong style={{ color: '#0f172a' }}>"{term}":</strong> <span style={{ color: '#475569' }}>{explanation}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Maharashtra Progress Context if present */}
                  {scheme.maharashtraContext && (
                    <div style={{ 
                      fontSize: '0.72rem', 
                      color: '#0369a1', 
                      background: '#f0f9ff', 
                      padding: '7px 10px', 
                      borderRadius: 6, 
                      marginBottom: 14,
                      border: '1px solid #bae6fd'
                    }}>
                      <strong>Maharashtra Progress:</strong> {scheme.maharashtraContext}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                    <a 
                      href={scheme.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '0.72rem', 
                        color: '#64748b', 
                        textDecoration: 'none', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 4 
                      }}
                    >
                      <ExternalLink size={12} />
                      Official Reference Source
                    </a>

                    <button 
                      onClick={() => handleOpenApplyScheme(scheme)}
                      className="btn-primary"
                      style={{ 
                        padding: '7px 16px', 
                        fontSize: '0.78rem', 
                        borderRadius: 6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>1-Click Pre-filled Apply</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 4. MODAL: Book Warehouse Slot */}
      {bookingWh && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(5px)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 20 
        }}>
          <div style={{ 
            maxWidth: 540, 
            width: '100%', 
            background: '#ffffff', 
            borderRadius: 16, 
            padding: '26px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
            border: '2px solid #16a34a' 
          }}>
            
            {!bookingSuccessRef ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                      MSWC Warehouse Space Reservation & e-NWR
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                      {bookingWh.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {bookingWh.district} District • Tariff {bookingWh.tariffCategory} (₹{bookingWh.monthlyRatePerMT}/MT/Month)
                    </div>
                  </div>
                  <button 
                    onClick={() => setBookingWh(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    ✕
                  </button>
                </div>

                {/* Farmer Profile Auto-Filled info */}
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, fontSize: '0.76rem', color: '#334155', marginBottom: 16 }}>
                  <div><strong>Applicant:</strong> Santosh Shinde (Aadhaar Verified)</div>
                  <div><strong>Farm Location:</strong> Gut No. 142/B, Niphad, Nashik</div>
                  <div><strong>Incharge Contact:</strong> {bookingWh.incharge} ({bookingWh.email})</div>
                </div>

                {/* Booking Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                      Commodity to Store
                    </label>
                    <input 
                      type="text"
                      value={bookingCommodity}
                      onChange={(e) => setBookingCommodity(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                      Required Capacity (MT)
                    </label>
                    <input 
                      type="number"
                      value={bookingQty}
                      onChange={(e) => setBookingQty(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Storage Duration: {bookingDuration} Months
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b' }}>
                    <span>1 Month</span>
                    <span>6 Months</span>
                    <span>12 Months</span>
                  </div>
                </div>

                {/* Financial Summary Calculation */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px', marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#166534', marginBottom: 4 }}>
                    <span>Estimated Rental ({bookingQty} MT × ₹{bookingWh.monthlyRatePerMT} × {bookingDuration} Mo):</span>
                    <strong>₹{(bookingQty * bookingWh.monthlyRatePerMT * bookingDuration).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#166534', marginBottom: 4 }}>
                    <span>e-NWR Pledge Loan Entitlement (70% Crop Value):</span>
                    <strong style={{ color: '#15803d' }}>₹{(bookingQty * 24000 * 0.7).toLocaleString()} Max Loan</strong>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#15803d' }}>
                    ✓ Eligible for Maharashtra 75% rental subsidy rebate on WDRA receipt generation.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button 
                    onClick={() => setBookingWh(null)}
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmBooking}
                    className="btn-primary" 
                    style={{ padding: '8px 18px', fontSize: '0.8rem', background: '#16a34a' }}
                  >
                    Confirm & Reserve Bay
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={48} style={{ color: '#16a34a', margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Bay Reservation Confirmed!
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 16px 0' }}>
                  Your provisional slot for <strong>{bookingQty} MT</strong> of {bookingCommodity} at {bookingWh.name} is reserved.
                </p>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 8, fontSize: '0.82rem', marginBottom: 18, border: '1px dashed #cbd5e1' }}>
                  <div>Booking Reference: <strong style={{ color: '#15803d' }}>{bookingSuccessRef}</strong></div>
                  <div>Incharge Mobile: <strong>{bookingWh.incharge}</strong></div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
                    An SMS notification has been dispatched to your Aadhaar-registered phone.
                  </div>
                </div>
                <button 
                  onClick={() => setBookingWh(null)}
                  className="btn-primary" 
                  style={{ padding: '8px 24px', fontSize: '0.82rem' }}
                >
                  Close & View Ledger
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. MODAL: 1-Click Pre-filled Scheme Apply */}
      {appliedScheme && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(5px)', 
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 20 
        }}>
          <div style={{ 
            maxWidth: 540, 
            width: '100%', 
            background: '#ffffff', 
            borderRadius: 16, 
            padding: '26px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
            border: '2px solid #ea580c' 
          }}>
            
            {!applySuccessRef ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase' }}>
                      MahaDBT & Central Agri Scheme Application
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                      {appliedScheme.shortTitle || appliedScheme.schemeName}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Issuing Body: {appliedScheme.issuingBody}
                    </div>
                  </div>
                  <button 
                    onClick={() => setAppliedScheme(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '12px', borderRadius: 8, marginBottom: 14 }}>
                  <div style={{ fontSize: '0.7rem', color: '#9a3412', fontWeight: 700, textTransform: 'uppercase' }}>Financial Entitlement</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#c2410c' }}>{appliedScheme.subsidyRateOrAmount}</div>
                  <div style={{ fontSize: '0.72rem', color: '#7c2d12', marginTop: 2 }}>{appliedScheme.capacityLimits}</div>
                </div>

                {/* Pre-filled 7/12 Land Details */}
                <div style={{ fontSize: '0.8rem', lineHeight: 1.8, marginBottom: 16, color: '#334155', background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div><strong>Applicant:</strong> Santosh Shinde (Aadhaar Linked)</div>
                  <div><strong>Land Holding (7/12):</strong> Gut No. 142/B, Niphad, Nashik (4.20 Acres)</div>
                  <div><strong>Bank Account:</strong> State Bank of India, Niphad Branch (Aadhaar Seeding: Active)</div>
                  <div><strong>Category:</strong> General Small / Marginal Farmer</div>
                </div>

                {/* Checklist */}
                <div style={{ fontSize: '0.74rem', color: '#475569', marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Pre-verified Documents from DigiLocker:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div>✓ Digitally signed 7/12 & 8A Land Extract attached</div>
                    <div>✓ Geo-tagged farm photos synced from AgriConnect survey</div>
                    <div>✓ Bank Mandate & cancelled cheque verified</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button 
                    onClick={() => setAppliedScheme(null)}
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmApply}
                    className="btn-primary" 
                    style={{ padding: '8px 18px', fontSize: '0.8rem', background: '#ea580c' }}
                  >
                    Confirm & Submit via MahaDBT Gateway
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={48} style={{ color: '#ea580c', margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Application Dispatched to MahaDBT!
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 16px 0' }}>
                  Your application for <strong>{appliedScheme.shortTitle}</strong> has been transmitted to the Taluka Agriculture Officer (Niphad, Nashik).
                </p>
                <div style={{ background: '#fff7ed', padding: '12px', borderRadius: 8, fontSize: '0.82rem', marginBottom: 18, border: '1px dashed #fed7aa' }}>
                  <div>Application ID: <strong style={{ color: '#c2410c' }}>{applySuccessRef}</strong></div>
                  <div>Status: <strong style={{ color: '#15803d' }}>Under Scrutiny (Inspection Assigned)</strong></div>
                </div>
                <button 
                  onClick={() => setAppliedScheme(null)}
                  className="btn-primary" 
                  style={{ padding: '8px 24px', fontSize: '0.82rem' }}
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
