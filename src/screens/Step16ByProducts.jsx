import React, { useState } from 'react';
import { 
  Recycle, Sparkles, TrendingUp, CheckCircle2, Factory, Truck, 
  ArrowRight, ShieldCheck, DollarSign, Leaf, PlusCircle, AlertCircle, MapPin
} from 'lucide-react';
import { useAgri } from '../context/AgriContext';

export default function Step16ByProducts({ setStep }) {
  const { 
    byProductLots, 
    createByProductLot, 
    gradeByProductLot, 
    dispatchByProductLot, 
    BYPRODUCT_STAGES, 
    addToast 
  } = useAgri();

  // Residue Calculator State
  const [selectedResidue, setSelectedResidue] = useState('onion_stalks');
  const [residueQtyMT, setResidueQtyMT] = useState(15);
  const [showListingModal, setShowListingModal] = useState(false);

  const residueCatalog = {
    onion_stalks: {
      name: 'Onion Stalks & Leaves (कांदा पात व टरफले)',
      pricePerMT: 1200,
      useCase: 'Biomass Briquetting & Organic Compost',
      buyer: 'MahaUrja Niphad Briquette Cluster',
      carbonOffsetPerMT: '1.4 T CO₂e'
    },
    cotton_stalks: {
      name: 'Cotton Stalks / Parati (कापूस पराटी)',
      pricePerMT: 1850,
      useCase: 'Industrial Bio-coal & Thermal Power Blending',
      buyer: 'Vidarbha Bio-Energy Hub',
      carbonOffsetPerMT: '1.8 T CO₂e'
    },
    soyabean_straw: {
      name: 'Soyabean Straw / Bhusa (सोयाबीन भुसा)',
      pricePerMT: 2100,
      useCase: 'Nutritious Fodder & Bio-Pellet Fuel',
      buyer: 'Sahyadri Cattle Feed & Pellets',
      carbonOffsetPerMT: '1.6 T CO₂e'
    },
    sugarcane_trash: {
      name: 'Sugarcane Trash / Pachat (ऊस पाचट)',
      pricePerMT: 1650,
      useCase: 'Co-generation Boiler Feed & Mulch Paper',
      buyer: 'Khed Sahakari Bio-Power',
      carbonOffsetPerMT: '2.0 T CO₂e'
    }
  };

  const currentResidue = residueCatalog[selectedResidue];
  const totalValuation = residueQtyMT * currentResidue.pricePerMT;

  // Form State for listing new residue
  const [formCrop, setFormCrop] = useState('onion_stalks');
  const [formQty, setFormQty] = useState(12);

  // 1. Farmer clicks "Sell By-Product" -> create lot record with status LISTED_PENDING_GRADING
  const handleCreateByProductListing = (e) => {
    e.preventDefault();
    const sel = residueCatalog[formCrop];
    const cropTitle = sel.name.split('(')[0].trim();
    const marathiTitle = sel.name.includes('(') ? sel.name.split('(')[1].replace(')', '') : 'अवशेष';

    createByProductLot({
      cropType: cropTitle,
      marathi: marathiTitle,
      description: sel.useCase,
      quantityMT: Number(formQty),
      pricePerMT: sel.pricePerMT,
      buyer: sel.buyer,
      distanceKm: 16,
      status: BYPRODUCT_STAGES.GRADED_LISTED
    });

    setShowListingModal(false);
    if (setStep) setStep(23); // Automatically route to Biomass Marketplace
  };

  return (
    <div className="animate-slide-in">
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-green">MahaUrja (MEDA) & MNRE Bio-Energy Grid</span>
            <span className="badge badge-amber">Stubble Burning Prevention Scheme</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-title)' }}>
            Agricultural By-Products & Crop Residue Monetization
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            शेतमाल उप-उत्पादने व बायोमास व्यवस्थापन • Turn harvest stubble, husk & stalks into guaranteed extra cash payouts
          </p>
        </div>

        <button 
          onClick={() => setShowListingModal(true)}
          className="btn-primary" style={{ fontSize: '0.84rem', padding: '9px 18px' }}>
          <PlusCircle size={16} />
          <span>+ Monetize Harvest Residue</span>
        </button>
      </div>

      {/* 4 Key Impact Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="panel" style={{ padding: '20px', borderLeft: '4px solid #15803d' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            EXTRA RESIDUE INCOME
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>
            ₹34,800.00
          </div>
          <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 600 }}>
            +14.2% Extra Revenue over Grain Sale
          </div>
        </div>

        <div className="panel" style={{ padding: '20px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            BIOMASS DIVERTED FROM BURNING
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c', marginTop: 2 }}>
            23.0 MT
          </div>
          <div style={{ fontSize: '0.74rem', color: '#9a3412', fontWeight: 600 }}>
            100% Farmgate Pickup via Logistics Grid
          </div>
        </div>

        <div className="panel" style={{ padding: '20px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            CARBON CREDITS GENERATED
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284c7', marginTop: 2 }}>
            31.4 T CO₂e
          </div>
          <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600 }}>
            Maha Green Agri Clean Certified
          </div>
        </div>

        <div className="panel" style={{ padding: '20px', borderLeft: '4px solid #15803d' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            VERIFIED INDUSTRIAL BUYERS
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>
            14 Plants
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Within 45 km radius (Nashik / Pune)
          </div>
        </div>
      </div>

      {/* Interactive Residue Valuation Calculator */}
      <div className="panel" style={{ padding: '24px', marginBottom: 24, border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: 4 }}>INSTANT BIOMASS VALUATION</span>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
              Calculate Your Crop Residue Net Extra Earnings
            </h3>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {Object.keys(residueCatalog).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedResidue(key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: '0.78rem',
                  fontWeight: selectedResidue === key ? 800 : 500,
                  background: selectedResidue === key ? '#15803d' : '#ffffff',
                  color: selectedResidue === key ? '#ffffff' : '#475569',
                  border: selectedResidue === key ? '1px solid #15803d' : '1px solid #cbd5e1'
                }}
              >
                {residueCatalog[key].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Residue Quantity: <strong style={{ color: '#15803d', fontSize: '1.05rem' }}>{residueQtyMT} Metric Tonnes</strong>
                </label>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Rate: ₹{currentResidue.pricePerMT} / MT</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                step="1" 
                value={residueQtyMT}
                onChange={(e) => setResidueQtyMT(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#15803d' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                <span>5 MT (~3 Acres)</span>
                <span>25 MT (~15 Acres)</span>
                <span>50 MT (Bulk Cluster)</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: 8, border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#334155' }}>
              <div><strong>Primary Industry Usage:</strong> {currentResidue.useCase}</div>
              <div style={{ marginTop: 2 }}><strong>Designated Agro-Energy Offtaker:</strong> {currentResidue.buyer}</div>
            </div>
          </div>

          <div style={{ background: '#15803d', borderRadius: 10, padding: '20px', color: '#ffffff', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#dcfce7' }}>
              Guaranteed Farmgate Escrow Payout
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, margin: '6px 0' }}>
              ₹{totalValuation.toLocaleString('en-IN')}.00
            </div>
            <div style={{ fontSize: '0.76rem', color: '#86efac', marginBottom: 14 }}>
              Zero Transport Fee • Picked directly from your gut
            </div>
            <button
              onClick={() => {
                setFormCrop(selectedResidue);
                setFormQty(residueQtyMT);
                setShowListingModal(true);
              }}
              style={{
                width: '100%', background: '#ffffff', color: '#15803d', fontWeight: 800,
                padding: '9px 16px', borderRadius: 6, fontSize: '0.85rem'
              }}
            >
              List this {residueQtyMT} MT Lot for Pickup
            </button>
          </div>
        </div>
      </div>

      {/* Active By-Product Lots Table */}
      <div className="panel" style={{ padding: '22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-title)', fontWeight: 800 }}>
              Your Active Residue & Biomass Contracts
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              100% Pre-funded institutional escrow under Maharashtra Clean Bio-Energy Framework
            </p>
          </div>
          <span className="badge badge-green">{byProductLots.length} Active Lots</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>LOT REF</th>
                <th>BY-PRODUCT CROP</th>
                <th>QUANTITY</th>
                <th>RATE / MT</th>
                <th>ESCROW VALUE</th>
                <th>ACCREDITED INDUSTRIAL OFFTAKER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {byProductLots.map((lot) => {
                const isPendingGrading = lot.status === BYPRODUCT_STAGES.LISTED_PENDING_GRADING;
                const isTransportAssigned = lot.status === BYPRODUCT_STAGES.TRANSPORT_ASSIGNED;
                const isInTransit = lot.status === BYPRODUCT_STAGES.PICKED_UP_IN_TRANSIT;
                const isAwaitingConfirmation = lot.status === BYPRODUCT_STAGES.DELIVERED_AWAITING_CONFIRMATION;
                const isCompleted = lot.status === BYPRODUCT_STAGES.COMPLETED;
                const isDisputed = lot.status === BYPRODUCT_STAGES.DISPUTED;

                const lotPayout = lot.escrow?.productAmount || (lot.quantityMT * (lot.pricePerMT || lot.ratePerMT || 1200));

                return (
                  <tr key={lot.id}>
                    <td style={{ fontWeight: 700, color: '#15803d' }}>#{lot.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{lot.cropType || lot.commodity}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lot.marathi}</div>
                    </td>
                    <td style={{ fontWeight: 800 }}>{lot.quantityMT} MT</td>
                    <td>₹{lot.pricePerMT || lot.ratePerMT}</td>
                    <td style={{ fontWeight: 800, color: '#15803d' }}>₹{lotPayout.toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lot.buyer || 'AgroFresh Biomass Sourcing'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {lot.escrow?.transporter ? `${lot.escrow.transporter.driverName} (${lot.escrow.transporter.vehicleNumber})` : 'Transporter on Call'}
                      </div>
                    </td>
                    <td>
                      <span 
                        className={
                          isCompleted || lot.status === BYPRODUCT_STAGES.PAYMENT_CONFIRMED ? "badge badge-green" :
                          isDisputed ? "badge badge-red" :
                          isPendingGrading || isAwaitingConfirmation || lot.status === BYPRODUCT_STAGES.ESCROW_LOCKED_AWAITING_PAYMENT ? "badge badge-amber" :
                          isTransportAssigned ? "badge badge-purple" : "badge badge-blue"
                        }
                        style={{
                          fontSize: '0.65rem',
                          background: isDisputed ? '#fee2e2' : isTransportAssigned ? '#f3e8ff' : undefined,
                          color: isDisputed ? '#b91c1c' : isTransportAssigned ? '#7e22ce' : undefined
                        }}
                      >
                        {lot.status}
                      </span>
                    </td>
                    <td>
                      {isPendingGrading ? (
                        <button 
                          onClick={() => gradeByProductLot(lot.id)}
                          className="btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '0.72rem', background: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Sparkles size={12} />
                          <span>Run Quality Grading</span>
                        </button>
                      ) : isTransportAssigned ? (
                        <button 
                          onClick={() => dispatchByProductLot(lot.id)}
                          className="btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '0.72rem', background: '#15803d', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Truck size={12} />
                          <span>Notify Buyer — Loaded & Dispatched</span>
                        </button>
                      ) : isInTransit ? (
                        <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Truck size={13} />
                          <span>In Transit to Buyer</span>
                        </span>
                      ) : isAwaitingConfirmation ? (
                        <span style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 600 }}>
                          ⏳ Awaiting Buyer Inspection
                        </span>
                      ) : isCompleted ? (
                        <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700 }}>
                          ✓ Escrow Payout Released
                        </span>
                      ) : isDisputed ? (
                        <button 
                          onClick={() => setStep(10)}
                          className="btn-secondary" 
                          style={{ padding: '5px 10px', fontSize: '0.72rem', color: '#dc2626', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <AlertCircle size={12} />
                          <span>View Dispute Docket</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Live on Buyer Portal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: List New By-Product Form */}
      {showListingModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20
        }}>
          <div className="panel animate-slide-in" style={{ maxWidth: 520, width: '100%', padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Recycle size={20} style={{ color: '#15803d' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                  List Crop Residue / By-Product
                </h3>
              </div>
              <button 
                onClick={() => setShowListingModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateByProductListing}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Residue / Biomass Category
                </label>
                <select 
                  value={formCrop}
                  onChange={(e) => setFormCrop(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="onion_stalks">Onion Stalks & Leaves (कांदा पात) - ₹1,200/MT</option>
                  <option value="cotton_stalks">Cotton Stalks / Parati (कापूस पराटी) - ₹1,850/MT</option>
                  <option value="soyabean_straw">Soyabean Straw / Bhusa (सोयाबीन भुसा) - ₹2,100/MT</option>
                  <option value="sugarcane_trash">Sugarcane Trash / Pachat (ऊस पाचट) - ₹1,650/MT</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Estimated Quantity (Metric Tonnes)
                </label>
                <input 
                  type="number"
                  min="2"
                  max="100"
                  value={formQty}
                  onChange={(e) => setFormQty(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 18, fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>Calculated Escrow Payout:</span>
                  <strong style={{ color: '#15803d', fontSize: '1rem' }}>
                    ₹{(formQty * residueCatalog[formCrop].pricePerMT).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Offtaker: {residueCatalog[formCrop].buyer}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setShowListingModal(false)}
                  className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Sell By-Product / Confirm Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
