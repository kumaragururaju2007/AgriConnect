import React, { useState, useRef } from 'react';
import { 
  MapPin, CheckCircle2, Clock, Camera, ShieldCheck, 
  Upload, Phone, Wifi, WifiOff, RefreshCw, Search, 
  ChevronRight, X, Calendar, Award, Sparkles, Scale,
  Battery, ExternalLink, ArrowRight, Eye, Smartphone, 
  Compass, PhoneCall, Star, Globe
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function Step22FieldAgentPortal({ setStep, setTerminal, setRole, lang = 'mr' }) {
  const { 
    fieldAgentUser, 
    agentVisits, 
    qualityInspections, 
    isFieldOfflineMode, 
    toggleFieldOfflineMode,
    completeAgentVisit,
    submitCropQualityInspection,
    logoutUser,
    switchRole
  } = useAgri();

  // Active Tab: Focused 100% on Crop Quality Inspection
  // 'visits' (Scheduled Quality Inspections) | 'inspection' (Certified Quality Assays)
  const [activeTab, setActiveTab] = useState('visits');

  // Search & Filters for Quality Visits
  const [visitFilter, setVisitFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

  // Quality Inspection Form State
  const [showNewAssayModal, setShowNewAssayModal] = useState(false);
  const [inspectionCrop, setInspectionCrop] = useState('Nashik Red Onion (Garwa)');
  const [inspectionFarmer, setInspectionFarmer] = useState('Santosh Ramdas Shinde');
  const [inspectionLotCode, setInspectionLotCode] = useState('LOT-NSK-4920');
  const [inspectionYield, setInspectionYield] = useState('120');
  const [inspectionMoisture, setInspectionMoisture] = useState('11.4');
  const [inspectionCaliber, setInspectionCaliber] = useState('55mm - 65mm Export Spec');
  const [inspectionOuterSkin, setInspectionOuterSkin] = useState('Cured & Dry Outer Tunic Intact');
  const [inspectionSprouting, setInspectionSprouting] = useState('0.2');
  const [inspectionPest, setInspectionPest] = useState('0.0');
  const [inspectionGrade, setInspectionGrade] = useState('GRADE_A_SUPER');
  const [inspectionRating, setInspectionRating] = useState(5);
  const [inspectionIsExportable, setInspectionIsExportable] = useState(true);
  const [inspectionPhoto, setInspectionPhoto] = useState('https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80');
  const [inspectionVisitId, setInspectionVisitId] = useState(null);
  const [inspectionNotes, setInspectionNotes] = useState('Grade A Super Export compliant. Zero pest blemish, uniform size caliber, optimal curing.');
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setInspectionPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered Quality Visits
  const filteredVisits = (agentVisits || []).filter(v => {
    const matchesFilter = visitFilter === 'ALL' || v.status === visitFilter;
    const matchesSearch = !searchQuery || 
      (v.farmer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (v.village || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (v.crop || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.lot_code || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Submit Quality Inspection
  const handleSubmitInspection = (e) => {
    e.preventDefault();
    submitCropQualityInspection({
      farmer_name: inspectionFarmer,
      lot_code: inspectionLotCode,
      crop: inspectionCrop,
      estimated_yield_qtl: Number(inspectionYield) || 120,
      moisture_percentage: Number(inspectionMoisture) || 10.5,
      caliber_mm: inspectionCaliber,
      outer_skin_integrity: inspectionOuterSkin,
      sprouting_damage_pct: Number(inspectionSprouting) || 0,
      pest_damage_pct: Number(inspectionPest) || 0,
      certified_grade: inspectionGrade,
      rating: Number(inspectionRating) || 5,
      is_exportable: Boolean(inspectionIsExportable),
      photo_url: inspectionPhoto,
      gps_tag: '20.1745° N, 73.9842° E (Geo-Tagged Field Gate)',
      visit_id: inspectionVisitId,
      notes: inspectionNotes
    });
    setShowNewAssayModal(false);
    setActiveTab('inspection');
  };

  const pendingVisitsCount = (agentVisits || []).filter(v => v.status !== 'COMPLETED').length;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* ========================================================================= */}
      {/* FOCUSED CROP QUALITY ASSAYER SIDEBAR                                      */}
      {/* ========================================================================= */}
      <aside style={{
        width: 300,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(226, 232, 240, 0.9)',
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 20,
        boxShadow: '4px 0 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          {/* Header Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', color: '#ffffff', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
            }}>
              🔬
            </div>
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 900, letterSpacing: '-0.01em', color: '#0f172a' }}>
                Field Crop Assayer
              </div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                APMC & APEDA Quality Grid
              </div>
            </div>
          </div>

          {/* Officer Info Card */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', margin: '14px 0 18px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1.5px solid #86efac' }}>
                🧑‍🌾
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                  {fieldAgentUser?.name || 'Sachin B. Kadam'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                  Senior Crop Quality Assayer
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} color="#059669" />
              <span>{fieldAgentUser?.zone || 'Niphad & Dindori Zone (Nashik)'}</span>
            </div>
          </div>

          {/* Navigation Links: ONLY Quality Inspection Work */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { 
                id: 'visits', 
                label: 'Scheduled Crop Inspections', 
                desc: 'Farmgate Itinerary & Level 3',
                icon: Calendar, 
                badge: pendingVisitsCount > 0 ? `${pendingVisitsCount} Pending` : null, 
                badgeColor: '#d97706' 
              },
              { 
                id: 'inspection', 
                label: 'Certified Quality Assays', 
                desc: 'Vision Lab & Verified Badges',
                icon: Sparkles, 
                badge: `${(qualityInspections || []).length} Certified`, 
                badgeColor: '#10b981' 
              }
            ].map(nav => {
              const Icon = nav.icon;
              const isCurrent = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 12, fontSize: '0.84rem',
                    fontWeight: isCurrent ? 800 : 600,
                    background: isCurrent ? 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)' : '#ffffff',
                    color: isCurrent ? '#15803d' : '#334155',
                    border: isCurrent ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    boxShadow: isCurrent ? '0 3px 8px rgba(16, 185, 129, 0.15)' : 'none',
                    textAlign: 'left', width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isCurrent ? '#15803d' : '#f1f5f9',
                      color: isCurrent ? '#ffffff' : '#64748b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: isCurrent ? '#15803d' : '#0f172a' }}>{nav.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{nav.desc}</div>
                    </div>
                  </div>

                  {nav.badge && (
                    <span style={{
                      background: isCurrent ? '#15803d' : nav.badgeColor,
                      color: '#ffffff',
                      fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999
                    }}>
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality Standards & Accreditation Summary */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: 12, fontSize: '0.74rem' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Assay Quality Protocols</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#475569' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>• Moisture Standard</span>
              <strong style={{ color: '#15803d' }}>&lt; 12% Parity</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>• Export Grading</span>
              <strong style={{ color: '#0284c7' }}>APEDA Codex</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>• Verification Badge</span>
              <strong style={{ color: '#d97706' }}>&gt; 3.0 Stars ★</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT WORKSPACE                                                    */}
      {/* ========================================================================= */}
      <main style={{ flex: 1, minWidth: 0, padding: '24px 32px 40px', overflowY: 'auto', height: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Top Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
            borderRadius: 16, padding: '22px 26px', color: '#ffffff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
            boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', border: '1px solid rgba(255, 255, 255, 0.25)'
              }}>
                🔬
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                    Crop Quality Inspection Desk
                  </h1>
                  <span style={{ background: '#10b981', color: '#064e3b', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999 }}>
                    APMC & APEDA STANDARDS
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#a7f3d0' }}>
                  {fieldAgentUser?.zone || 'Niphad & Dindori Zone'} • Farmgate moisture assay, caliber sizing, export compliance & 5-star verified certificates
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => {
                setInspectionRating(5);
                setInspectionIsExportable(true);
                setShowNewAssayModal(true);
              }}
              style={{
                background: '#10b981', color: '#ffffff', border: 'none',
                padding: '9px 18px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 3px 10px rgba(16, 185, 129, 0.35)'
              }}
            >
              <Sparkles size={16} />
              <span>+ Record New Quality Assay</span>
            </button>
          </div>

          {/* Top 4 Crop Quality Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Pending Crop Inspections
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: pendingVisitsCount > 0 ? '#d97706' : '#15803d', marginTop: 4 }}>
                {pendingVisitsCount} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Requests</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Farmgate produce awaiting assay</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Total Certified Assays
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
                {(qualityInspections || []).length} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Batches</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Physical assays authenticated</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Manually Verified Lots
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>
                {(qualityInspections || []).filter(q => (q.star_rating || 5) > 3).length} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>&gt; 3★</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Badged live in Buyer Portal</div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Export Compliant Lots
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
                {(qualityInspections || []).filter(q => q.is_exportable).length} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>APEDA</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>Phytosanitary cleared produce</div>
            </div>
          </div>

          {/* Main Workspace Navigation Tab Switcher */}
          <div style={{ display: 'flex', gap: 10, borderBottom: '2px solid #e2e8f0', paddingBottom: 6 }}>
            <button
              onClick={() => setActiveTab('visits')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
                background: activeTab === 'visits' ? '#ecfdf5' : '#ffffff',
                color: activeTab === 'visits' ? '#15803d' : '#64748b',
                border: activeTab === 'visits' ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: activeTab === 'visits' ? '0 2px 6px rgba(16, 185, 129, 0.15)' : 'none'
              }}
            >
              <Calendar size={15} />
              <span>Scheduled Crop Quality Inspections</span>
              {pendingVisitsCount > 0 && (
                <span style={{ background: '#d97706', color: '#fff', fontSize: '0.68rem', fontWeight: 900, padding: '2px 7px', borderRadius: 999 }}>
                  {pendingVisitsCount} Pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inspection')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
                background: activeTab === 'inspection' ? '#ecfdf5' : '#ffffff',
                color: activeTab === 'inspection' ? '#15803d' : '#64748b',
                border: activeTab === 'inspection' ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: activeTab === 'inspection' ? '0 2px 6px rgba(16, 185, 129, 0.15)' : 'none'
              }}
            >
              <Sparkles size={15} />
              <span>Certified Quality Assays & Vision Lab</span>
              <span style={{ background: '#059669', color: '#fff', fontSize: '0.68rem', fontWeight: 900, padding: '2px 7px', borderRadius: 999 }}>
                {(qualityInspections || []).length} Certified
              </span>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* TAB 1: SCHEDULED QUALITY INSPECTIONS (ITINERARY)                        */}
          {/* ======================================================================= */}
          {activeTab === 'visits' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              {/* Informative Guidance */}
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Award size={20} color="#059669" />
                  <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
                    <strong>Quality Inspection Pipeline:</strong> Farm visits scheduled by farmers (including <strong>Level 3 Physical Grading requests</strong>). Conduct portable NIR moisture test, verify bulb caliber, capture photo, and award a 5-star rating to certify the produce for the Buyer Portal.
                  </div>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div style={{ background: '#ffffff', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0 12px', width: 340 }}>
                  <Search size={15} style={{ color: '#94a3b8', marginRight: 8 }} />
                  <input
                    type="text"
                    placeholder="Search scheduled inspections by farmer, village or crop..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', padding: '8px 0', fontSize: '0.82rem', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['ALL', 'SCHEDULED', 'COMPLETED'].map(status => (
                    <button
                      key={status}
                      onClick={() => setVisitFilter(status)}
                      style={{
                        padding: '6px 12px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 800,
                        background: visitFilter === status ? '#059669' : '#f1f5f9',
                        color: visitFilter === status ? '#ffffff' : '#475569',
                        border: 'none', cursor: 'pointer'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visits Card Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
                {filteredVisits.map(visit => (
                  <div key={visit.id} style={{
                    background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}>
                    <div>
                      {/* Top Cultivator Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{visit.farmer_name}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>📍 {visit.village}, {visit.taluka || 'Nashik'} • Batch #{visit.lot_code || visit.id}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {visit.is_level_3 && (
                            <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '2px 7px', borderRadius: 4, fontSize: '0.66rem', fontWeight: 800 }}>
                              ⭐ LEVEL 3
                            </span>
                          )}
                          <span style={{
                            padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800,
                            background: visit.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                            color: visit.status === 'COMPLETED' ? '#15803d' : '#b45309'
                          }}>
                            {visit.status}
                          </span>
                        </div>
                      </div>

                      {/* Quality Target Box */}
                      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, margin: '10px 0', fontSize: '0.78rem', color: '#334155' }}>
                        <div><strong>Produce to Inspect:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>{visit.crop}</span></div>
                        <div><strong>Target Volume:</strong> {visit.quantity_qtl || 120} Quintals ({((visit.quantity_qtl || 120)/10).toFixed(1)} MT)</div>
                        <div><strong>Scheduled Window:</strong> {visit.time_slot || visit.scheduled_time || 'Today, 02:30 PM – 04:00 PM'}</div>
                        <div style={{ marginTop: 4, fontStyle: 'italic', color: '#64748b' }}>"{visit.notes || 'Physical crop quality assay requested.'}"</div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
                      <a href={`tel:${visit.farmer_phone}`} style={{
                        display: 'flex', alignItems: 'center', gap: 6, color: '#059669',
                        fontSize: '0.76rem', fontWeight: 800, textDecoration: 'none'
                      }}>
                        <Phone size={13} />
                        <span>Call {visit.farmer_phone}</span>
                      </a>

                      {visit.status !== 'COMPLETED' ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              setInspectionCrop(visit.crop || 'Nashik Red Onion (Garwa)');
                              setInspectionFarmer(visit.farmer_name || 'Santosh Ramdas Shinde');
                              setInspectionLotCode(visit.lot_code || 'MH-NSK-2024-LOT-0941');
                              setInspectionYield(String(visit.quantity_qtl || 120));
                              setInspectionVisitId(visit.id);
                              setInspectionRating(5);
                              setInspectionIsExportable(true);
                              setShowNewAssayModal(true);
                            }}
                            style={{
                              background: '#d97706', color: '#ffffff', border: 'none',
                              padding: '7px 14px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 800,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.25)'
                            }}
                          >
                            <Sparkles size={14} />
                            <span>Conduct Quality Assay</span>
                          </button>
                          <button
                            onClick={() => completeAgentVisit(visit.id, 'Physical quality assay completed on ground.')}
                            style={{
                              background: '#059669', color: '#ffffff', border: 'none',
                              padding: '7px 12px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 800,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Done</span>
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontSize: '0.76rem', fontWeight: 800 }}>
                          <CheckCircle2 size={15} />
                          <span>Assay Completed & Certified</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: CERTIFIED QUALITY ASSAYS TABLE                                   */}
          {/* ======================================================================= */}
          {activeTab === 'inspection' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                    Certified Field Quality Assays & Vision Lab Records
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                    NIR moisture assay, caliber sizing, export compliance and 5-star certificates published directly into the Buyer Portal.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setInspectionRating(5);
                    setInspectionIsExportable(true);
                    setShowNewAssayModal(true);
                  }}
                  style={{
                    background: '#059669', color: '#ffffff', border: 'none',
                    padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Sparkles size={15} />
                  <span>+ Record New Quality Assay</span>
                </button>
              </div>

              {/* Certified Assays Table */}
              <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>Lot Code & Date</th>
                      <th style={{ padding: '12px 16px' }}>Cultivator & Crop</th>
                      <th style={{ padding: '12px 16px' }}>Yield</th>
                      <th style={{ padding: '12px 16px' }}>NIR Moisture</th>
                      <th style={{ padding: '12px 16px' }}>Caliber & Quality</th>
                      <th style={{ padding: '12px 16px' }}>Export Compliance</th>
                      <th style={{ padding: '12px 16px' }}>Assayer Rating & Grade</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Photo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(qualityInspections || []).map(assay => {
                      const isVerified = (assay.star_rating || 5) > 3;
                      return (
                        <tr key={assay.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{assay.lot_code}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{assay.inspection_date || 'Today'}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800 }}>{assay.farmer_name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#059669' }}>{assay.crop}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                            {assay.estimated_yield_qtl} Qtl
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: Number(assay.moisture_percentage) <= 12 ? '#15803d' : '#ea580c' }}>
                              {assay.moisture_percentage}%
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>NIR Calibrated</div>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#334155' }}>
                            <div>{assay.caliber_mm}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{assay.outer_skin_integrity}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {assay.is_exportable ? (
                              <span style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 7px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800 }}>
                                🌍 Export Compliant
                              </span>
                            ) : (
                              <span style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '2px 7px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 700 }}>
                                🇮🇳 Domestic Only
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <span style={{
                                padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 900,
                                background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a',
                                display: 'inline-flex', alignItems: 'center', gap: 3, width: 'fit-content'
                              }}>
                                ⭐ {assay.star_rating || 5}.0 ★
                              </span>
                              {isVerified && (
                                <span style={{
                                  background: '#dcfce7', color: '#15803d', border: '1px solid #86efac',
                                  padding: '2px 6px', borderRadius: 4, fontSize: '0.66rem', fontWeight: 800,
                                  display: 'inline-flex', alignItems: 'center', gap: 3, width: 'fit-content'
                                }}>
                                  <ShieldCheck size={10} />
                                  <span>Manually Verified</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            {assay.photo_url ? (
                              <button
                                onClick={() => setSelectedPhotoPreview(assay.photo_url)}
                                style={{
                                  background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6,
                                  padding: '4px 8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                                  display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0284c7'
                                }}
                              >
                                <Camera size={12} />
                                <span>Photo</span>
                              </button>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>No photo</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* CROP QUALITY ASSAY MODAL (Quality, Photo, Exportable, 5-Star Rating)     */}
      {/* ========================================================================= */}
      {showNewAssayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, maxWidth: 680, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                    Physical Crop Quality Assay & Grade Certification
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                    Physical on-ground evaluation for APMC Mandi & APEDA Export accreditation
                  </p>
                </div>
              </div>
              <button onClick={() => setShowNewAssayModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitInspection} style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.82rem' }}>
              
              {/* SECTION 1: CROP & FARMER PARTICULARS */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🌾 1. Quality of Crop & Cultivator Identity</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Cultivator Name</label>
                    <input
                      type="text"
                      value={inspectionFarmer}
                      onChange={e => setInspectionFarmer(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Lot / Batch Tracking ID</label>
                    <input
                      type="text"
                      value={inspectionLotCode}
                      onChange={e => setInspectionLotCode(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Crop & Variety</label>
                    <input
                      type="text"
                      value={inspectionCrop}
                      onChange={e => setInspectionCrop(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Yield Volume (Quintals)</label>
                    <input
                      type="number"
                      value={inspectionYield}
                      onChange={e => setInspectionYield(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Quality Metrics: Grade, Moisture, Caliber */}
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Certified Quality Grade</label>
                    <select
                      value={inspectionGrade}
                      onChange={e => setInspectionGrade(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontWeight: 800, background: '#ffffff', color: '#0f172a' }}
                    >
                      <option value="GRADE_A_SUPER">GRADE A SUPER (Export Parity / High Pungency)</option>
                      <option value="GRADE_B_DOMESTIC">GRADE B (Domestic Mandi Commercial)</option>
                      <option value="GRADE_C_INDUSTRIAL">GRADE C (Processing / Industrial)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Caliber / Size Specification</label>
                    <select
                      value={inspectionCaliber}
                      onChange={e => setInspectionCaliber(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#ffffff' }}
                    >
                      <option value="55mm - 65mm Export Spec">55mm - 65mm (Grade-A Super Export)</option>
                      <option value="45mm - 55mm Medium Mandi">45mm - 55mm (Grade-B Medium Commercial)</option>
                      <option value="35mm - 45mm Small Bulb">35mm - 45mm (Grade-C Processing)</option>
                    </select>
                  </div>
                </div>

                {/* Moisture Slider */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>
                      NIR Moisture Content: <strong style={{ color: Number(inspectionMoisture) <= 12 ? '#15803d' : '#ea580c' }}>{inspectionMoisture}%</strong>
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Export Parity Optimum: 10.0% – 11.5%</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="0.1"
                    value={inspectionMoisture}
                    onChange={e => setInspectionMoisture(e.target.value)}
                    style={{ width: '100%', accentColor: '#059669' }}
                  />
                </div>
              </div>

              {/* SECTION 2: PHOTO OF THE CROP */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Camera size={15} color="#0284c7" />
                  <span>2. Inspection Photo of the Crop</span>
                </div>

                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {/* Photo Preview Thumbnail */}
                  <div style={{ position: 'relative', width: 140, height: 105, borderRadius: 8, overflow: 'hidden', border: '2px solid #cbd5e1', background: '#e2e8f0', flexShrink: 0 }}>
                    <img
                      src={inspectionPhoto}
                      alt="Crop Assay Specimen"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{ position: 'absolute', bottom: 2, left: 2, right: 2, background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.58rem', padding: '1px 3px', borderRadius: 3, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📍 20.1745°N, 73.9842°E
                    </span>
                  </div>

                  {/* Photo Controls */}
                  <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '6px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                          background: '#ffffff', border: '1px solid #cbd5e1', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5, color: '#334155'
                        }}
                      >
                        <Upload size={13} />
                        <span>Upload Field Photo</span>
                      </button>
                    </div>

                    {/* Quick Preset Specimens */}
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: 4 }}>Or select verified specimen camera sample:</span>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {[
                          { name: '🧅 Red Onion Specimen', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80' },
                          { name: '🍈 Pomegranate Sample', url: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80' },
                          { name: '🍅 Hybrid Tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80' },
                          { name: '🌾 Soyabean Heap', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80' }
                        ].map((spec, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setInspectionPhoto(spec.url)}
                            style={{
                              padding: '3px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 600,
                              background: inspectionPhoto === spec.url ? '#dcfce7' : '#ffffff',
                              border: inspectionPhoto === spec.url ? '1px solid #16a34a' : '1px solid #e2e8f0',
                              color: inspectionPhoto === spec.url ? '#15803d' : '#475569',
                              cursor: 'pointer'
                            }}
                          >
                            {spec.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: EXPORTABLE OR NOT */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={15} color="#d97706" />
                  <span>3. Export Compliance: Exportable or Not?</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div
                    onClick={() => setInspectionIsExportable(true)}
                    style={{
                      padding: 12, borderRadius: 8, cursor: 'pointer',
                      background: inspectionIsExportable ? '#f0fdf4' : '#ffffff',
                      border: inspectionIsExportable ? '2px solid #16a34a' : '1px solid #cbd5e1',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.1rem' }}>🌍</span>
                      <strong style={{ fontSize: '0.82rem', color: inspectionIsExportable ? '#15803d' : '#1e293b' }}>
                        Exportable: YES
                      </strong>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                      Meets APEDA & Global Phytosanitary Norms. Moisture &lt; 12%, zero fungal decay.
                    </p>
                  </div>

                  <div
                    onClick={() => setInspectionIsExportable(false)}
                    style={{
                      padding: 12, borderRadius: 8, cursor: 'pointer',
                      background: !inspectionIsExportable ? '#fef2f2' : '#ffffff',
                      border: !inspectionIsExportable ? '2px solid #ef4444' : '1px solid #cbd5e1',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
                      <strong style={{ fontSize: '0.82rem', color: !inspectionIsExportable ? '#b91c1c' : '#1e293b' }}>
                        Exportable: NO (Domestic Only)
                      </strong>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#64748b' }}>
                      Reserved for domestic wholesale mandis. Suitable for local consumption.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: 5-STAR RATING SELECTOR */}
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={15} color="#eab308" fill="#eab308" />
                    <span>4. Field Agent 5-Star Quality Rating</span>
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 900,
                    background: inspectionRating > 3 ? '#dcfce7' : '#fef3c7',
                    color: inspectionRating > 3 ? '#15803d' : '#b45309'
                  }}>
                    ⭐ {inspectionRating}.0 / 5.0
                  </span>
                </div>

                {/* Star Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setInspectionRating(star)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                        transform: inspectionRating >= star ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                      title={`Rate ${star} Star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={32}
                        color={inspectionRating >= star ? '#f59e0b' : '#cbd5e1'}
                        fill={inspectionRating >= star ? '#f59e0b' : 'none'}
                      />
                    </button>
                  ))}
                  <div style={{ marginLeft: 10, fontSize: '0.8rem', fontWeight: 800, color: inspectionRating > 3 ? '#15803d' : '#64748b' }}>
                    {inspectionRating === 5 && '5.0 ★ Super Premium (Certified Export Quality)'}
                    {inspectionRating === 4 && '4.0 ★ Premium Quality (Above Average Mandi Spec)'}
                    {inspectionRating === 3 && '3.0 ★ Standard Domestic Grade (Fair Quality)'}
                    {inspectionRating === 2 && '2.0 ★ Marginal (High Moisture / Curing Defect)'}
                    {inspectionRating === 1 && '1.0 ★ Sub-Standard (High Rot / Processing Only)'}
                  </div>
                </div>

                {/* Dynamic Rule Alert: Rating > 3 grants "Manually Verified" Badge */}
                {inspectionRating > 3 ? (
                  <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: 8, padding: '8px 12px', fontSize: '0.74rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={18} color="#16a34a" />
                    <span>
                      <strong>Approved for Verification:</strong> Because rating is <strong>{inspectionRating} Stars (&gt; 3★)</strong>, this produce lot will automatically receive the <strong>"Manually Verified"</strong> badge in the Buyer Portal!
                    </span>
                  </div>
                ) : (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', fontSize: '0.74rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={18} color="#d97706" />
                    <span>
                      <strong>Notice:</strong> Rating is {inspectionRating} Stars (≤ 3★). This lot will NOT receive the "Manually Verified" badge (requires above 3 stars).
                    </span>
                  </div>
                )}
              </div>

              {/* Assayer Notes */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 4, color: '#475569', fontSize: '0.75rem' }}>Assayer Field Observations & Remarks</label>
                <textarea
                  rows={2}
                  value={inspectionNotes}
                  onChange={e => setInspectionNotes(e.target.value)}
                  placeholder="Enter specific physical assay findings..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                />
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Assaying Officer: <strong>{fieldAgentUser?.name || 'Sachin B. Kadam'}</strong> • Niphad Zone
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowNewAssayModal(false)}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#059669', color: '#ffffff', border: 'none',
                      padding: '9px 20px', borderRadius: 6, fontSize: '0.84rem', fontWeight: 900,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Certify & Authenticate Quality Assay</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhotoPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 14, maxWidth: 560, width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                Field Gate Inspection Photograph
              </div>
              <button onClick={() => setSelectedPhotoPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <img src={selectedPhotoPreview} alt="Field Specimen" style={{ width: '100%', maxHeight: 380, objectFit: 'cover' }} />
            <div style={{ padding: '10px 16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
              <span>📍 Geo-Stamped: 20.1745° N, 73.9842° E</span>
              <button onClick={() => setSelectedPhotoPreview(null)} style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
