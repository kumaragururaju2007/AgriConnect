import React, { useState } from 'react';
import { 
  PlusCircle, ShieldCheck, Sparkles, ArrowRight, 
  MapPin, Calendar, Package, AlertCircle, CheckCircle2, DollarSign
} from 'lucide-react';
import { MOCK_COMMODITIES } from '../data/mockData';
import { useAgri } from '../context/AgriContext';

// Maharashtra APMC Standard Sourcing Commodities & Varieties Preset
export const COMMODITY_OPTIONS = [
  {
    id: 'onion',
    shortName: 'Onion',
    count: 4,
    name: 'Onion (Red / लाल कांदा)',
    defaultVariety: 'Gavran / High Pungency (गावराण)',
    varieties: [
      'Gavran / High Pungency (गावराण)',
      'Garva Red / Summer Onion (उन्हाळी)',
      'Pol / Late Kharif (पोळ कांदा)',
      'White Onion (पांढरा कांदा)'
    ],
    defaultPriceTon: 24500,
    defaultPackaging: 'Standard 50 kg Aerated Jute Sacks'
  },
  {
    id: 'soyabean',
    shortName: 'Soyabean',
    count: 4,
    name: 'Soyabean (Yellow / पिवळी सोयाबीन)',
    defaultVariety: 'JS-335 Certified Seed (पिवळी)',
    varieties: [
      'JS-335 Certified Seed (पिवळी)',
      'JS-9305 High Oil Content',
      'Phule Kalyani (DS-228)',
      'KDS-726 (Phule Sangam)'
    ],
    defaultPriceTon: 48500,
    defaultPackaging: 'Standard 50 kg Aerated Jute Sacks'
  },
  {
    id: 'cotton',
    shortName: 'Cotton',
    count: 2,
    name: 'Cotton (BT Hybrid / कापूस)',
    defaultVariety: 'BT Hybrid / Medium Staple (29mm)',
    varieties: [
      'BT Hybrid / Medium Staple (29mm)',
      'DCH-32 Extra Long Staple',
      'Bollgard II High Yield',
      'Desi Cotton (हवेशीर कापूस)'
    ],
    defaultPriceTon: 74100,
    defaultPackaging: 'Loose Bulk Farmgate Crates'
  },
  {
    id: 'pomegranate',
    shortName: 'Pomegranate',
    count: 2,
    name: 'Pomegranate (Bhagwa / भगवा डाळिंब)',
    defaultVariety: 'Bhagwa Export Super Grade (भगवा)',
    varieties: [
      'Bhagwa Export Super Grade (भगवा)',
      'Arakta Ruby Red (आरक्ता)',
      'Ganesh Soft Seed'
    ],
    defaultPriceTon: 92000,
    defaultPackaging: '25 kg Mesh Bags (Lenox / Net)'
  },
  {
    id: 'wheat',
    shortName: 'Wheat',
    count: 2,
    name: 'Wheat (Sharbati Golden / शरबती गहू)',
    defaultVariety: 'Lokwan Golden Hard (लोकवन)',
    varieties: [
      'Lokwan Golden Hard (लोकवन)',
      'Sharbati Premium Bold (शरबती)',
      'HD-2189 Certified Seed'
    ],
    defaultPriceTon: 31800,
    defaultPackaging: 'Standard 50 kg Aerated Jute Sacks'
  },
  {
    id: 'tomato',
    shortName: 'Tomato',
    count: 2,
    name: 'Tomato (Hybrid / लाल टोमॅटो)',
    defaultVariety: 'Abhinav F1 Hybrid Table Grade',
    varieties: [
      'Abhinav F1 Hybrid Table Grade',
      'Saaho F1 Deep Red (साहो)',
      'Vaishnavi F1 Firm Skin'
    ],
    defaultPriceTon: 19500,
    defaultPackaging: 'Loose Bulk Farmgate Crates'
  }
];

export default function Step05CreateLot({ setStep }) {
  const { pendingLotDraft, setPendingLotDraft, createLotDraft } = useAgri();
  const [crop, setCrop] = useState(pendingLotDraft?.crop_name || COMMODITY_OPTIONS[0].name);
  const [variety, setVariety] = useState(pendingLotDraft?.variety || COMMODITY_OPTIONS[0].defaultVariety);
  const [quantityTons, setQuantityTons] = useState(pendingLotDraft?.quantity_tons || (pendingLotDraft?.quantity_qtl ? pendingLotDraft.quantity_qtl * 0.1 : 12));
  const [askingPriceTon, setAskingPriceTon] = useState(pendingLotDraft?.asking_price_ton || (pendingLotDraft?.asking_price ? pendingLotDraft.asking_price * 10 : 24500));
  const [insureTransit, setInsureTransit] = useState(pendingLotDraft?.insure_transit ?? true);
  const [includeResidue, setIncludeResidue] = useState(pendingLotDraft?.include_residue ?? true);
  const [packaging, setPackaging] = useState(pendingLotDraft?.packaging || 'Standard 50 kg Aerated Jute Sacks');

  const selectedCommodity = COMMODITY_OPTIONS.find(c => c.name === crop || crop.toLowerCase().includes(c.shortName.toLowerCase())) || COMMODITY_OPTIONS[0];

  const handleSelectCommodity = (commodityId) => {
    const matched = COMMODITY_OPTIONS.find(c => c.id === commodityId);
    if (matched) {
      setCrop(matched.name);
      setVariety(matched.defaultVariety);
      setAskingPriceTon(matched.defaultPriceTon);
      if (matched.defaultPackaging) {
        setPackaging(matched.defaultPackaging);
      }
    }
  };

  const handleSelectCrop = (cropName) => {
    setCrop(cropName);
    const matched = COMMODITY_OPTIONS.find(c => c.name === cropName);
    if (matched) {
      setVariety(matched.defaultVariety);
      setAskingPriceTon(matched.defaultPriceTon);
      if (matched.defaultPackaging) {
        setPackaging(matched.defaultPackaging);
      }
    }
  };

  const totalLotValue = quantityTons * askingPriceTon;
  const insurancePremium = insureTransit ? Math.round(totalLotValue * 0.0075) : 0;
  const residueEstimate = includeResidue ? 18000 : 0;

  const handleProceedToGrading = (e) => {
    e.preventDefault();
    createLotDraft({
      id: pendingLotDraft?.id,
      lot_code: pendingLotDraft?.lot_code,
      crop_name: crop,
      variety,
      quantity_qtl: Number((quantityTons * 10).toFixed(1)),
      asking_price: Math.round(askingPriceTon / 10),
      quantity_tons: Number(quantityTons),
      asking_price_ton: Number(askingPriceTon),
      insure_transit: insureTransit,
      include_residue: includeResidue,
      residue_value: residueEstimate,
      mandi: 'Lasalgaon APMC',
      gut_no: 'Gut No. 142/B, Pimpalgaon, Niphad Taluka',
      packaging
    });
    setStep(6); // Proceed to Step 06: Quality Grading
  };

  return (
    <div className="animate-slide-in" style={{ maxWidth: 920, margin: '0 auto' }}>
      {/* Main Lot Creation Panel */}
      <form onSubmit={handleProceedToGrading} className="panel" style={{ padding: '28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-title)', margin: '0 0 4px 0' }}>
              Create Agricultural Lot Particulars
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Select produce from verified APMC categories. Next, you will grade produce quality with Agmark sliders and AI camera before final submission.
            </p>
          </div>
          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>MH-APMC Spec 2024</span>
        </div>

        {/* Quick Commodity Selector Chips (matching marketplace categories) */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Select Commodity (शेतमाल प्रवर्ग):
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {COMMODITY_OPTIONS.map(c => {
              const isSelected = selectedCommodity?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCommodity(c.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 600,
                    background: isSelected ? '#0f172a' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1px solid #0f172a' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(15,23,42,0.2)' : 'none'
                  }}
                >
                  <span>{c.shortName}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: isSelected ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                    color: isSelected ? '#ffffff' : '#64748b',
                    fontWeight: 800
                  }}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
          
          <div>
            <label htmlFor="crop-commodity-select" style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
              Crop / Commodity Name (शेतमाल) *
            </label>
            <div style={{ position: 'relative' }}>
              <select 
                id="crop-commodity-select"
                required
                value={crop}
                onChange={e => handleSelectCrop(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '11px 14px', 
                  background: '#ffffff', 
                  border: '1.5px solid #cbd5e1', 
                  borderRadius: 8, 
                  color: '#0f172a', 
                  fontSize: '0.92rem', 
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }} 
              >
                {COMMODITY_OPTIONS.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
              Select from standard Maharashtra APMC gazetted commodities
            </span>
          </div>

          <div>
            <label htmlFor="variety-select" style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
              Specific Variety (जात / व्हरायटी) *
            </label>
            <div style={{ position: 'relative' }}>
              <select 
                id="variety-select"
                required
                value={variety}
                onChange={e => setVariety(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '11px 14px', 
                  background: '#ffffff', 
                  border: '1.5px solid #cbd5e1', 
                  borderRadius: 8, 
                  color: '#0f172a', 
                  fontSize: '0.92rem', 
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }} 
              >
                {(selectedCommodity?.varieties || [variety]).map((v, i) => (
                  <option key={i} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
              Certified seed & cultivar for {selectedCommodity?.shortName || 'produce'}
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
              Lot Quantity (वजन - मेट्रिक टन / Metric Tons) *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 12px' }}>
              <input 
                type="number" 
                min="0.5"
                max="500"
                step="0.1"
                required
                value={quantityTons}
                onChange={e => setQuantityTons(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }} 
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                Tons (MT) • {(quantityTons * 10).toFixed(0)} Qtl
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
              Base Asking Price (अपेक्षित भाव प्रति टन / Ton) *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 12px' }}>
              <span style={{ color: '#15803d', fontWeight: 800, marginRight: 6 }}>₹</span>
              <input 
                type="number" 
                min="5000"
                max="250000"
                step="100"
                required
                value={askingPriceTon}
                onChange={e => setAskingPriceTon(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }} 
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                / Ton (₹{Math.round(askingPriceTon / 10)}/Q)
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
              Farm Location & 7/12 Land Gut Number
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '10px 12px', gap: 6, fontSize: '0.85rem' }}>
              <MapPin size={14} style={{ color: '#15803d' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Gut No. 142/B, Pimpalgaon, Niphad Taluka (Nashik)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
              Packaging Format
            </label>
            <select
              value={packaging}
              onChange={e => setPackaging(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, color: '#0f172a', fontSize: '0.85rem' }}
            >
              <option value="Standard 50 kg Aerated Jute Sacks">Standard 50 kg Aerated Jute Sacks (तागाची पोती)</option>
              <option value="25 kg Mesh Bags (Lenox / Net)">25 kg Mesh Bags / Net Bags (जाळीची पिशवी)</option>
              <option value="Loose Bulk Trolley / Crates">Loose Bulk Farmgate Crates (प्लॅस्टिक क्रेट्स)</option>
            </select>
          </div>

        </div>

        {/* Add-ons */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#15803d' }}>
                ✓ Point-of-Sale Transit Micro-Insurance (+0.75% Lot Value)
              </div>
              <p style={{ fontSize: '0.74rem', color: '#166534', margin: 0 }}>
                Covers transit damage and spillage between farmgate and Lasalgaon weighbridge. Auto-linked to dispute claim trail.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setInsureTransit(!insureTransit)}
              style={{ padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, background: insureTransit ? '#15803d' : '#ffffff', color: insureTransit ? '#ffffff' : '#0f172a', border: '1px solid #15803d', cursor: 'pointer' }}>
              {insureTransit ? `✓ Insured (+₹${insurancePremium})` : '+ Add'}
            </button>
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#c2410c' }}>
                ✓ Monetize Crop Residue / Stubble (+₹18,000 Extra Income)
              </div>
              <p style={{ fontSize: '0.74rem', color: '#9a3412', margin: 0 }}>
                Auto-matches ~15 MT onion stalks/husk with nearby biomass briquetting plants. Prevents burning.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setIncludeResidue(!includeResidue)}
              style={{ padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, background: includeResidue ? '#ea580c' : '#ffffff', color: includeResidue ? '#ffffff' : '#0f172a', border: '1px solid #ea580c', cursor: 'pointer' }}>
              {includeResidue ? `✓ Included (+₹${residueEstimate})` : '+ Add'}
            </button>
          </div>

        </div>

        {/* Valuation & Action Button (Proceed to Quality Grading) */}
        <div style={{ 
          background: '#f8fafc', padding: '16px 20px', borderRadius: 10, border: '1px solid #e2e8f0', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Estimated Baseline Lot Valuation
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>
              ₹{(totalLotValue + residueEstimate).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Base asking rate before Agmark Grade A premium uplift
            </div>
          </div>

          <button 
            type="submit"
            className="btn-primary" 
            style={{ 
              padding: '12px 24px', fontSize: '0.95rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(21, 128, 61, 0.3)'
            }}
          >
            <span>Proceed to Step 2: Quality Grading (गुणवत्ता तपासणी)</span>
            <ArrowRight size={17} />
          </button>
        </div>

      </form>

    </div>
  );
}
