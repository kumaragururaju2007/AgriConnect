// Mock Data for AgriConnect Field Agent Portal (Problem Statement ID 26132)

export const MOCK_FIELD_AGENT = {
  id: 'AGNT-MH-2026-0814',
  name: 'Sachin B. Kadam',
  phone: '+91 98234 11092',
  email: 'sachin.kadam@agri-extension.mh.gov.in',
  role: 'Field Agent - Crop Quality Assayer',
  designation: 'Senior Crop Quality Assayer & Inspector',
  department: 'Maharashtra APMC Quality Assay & APEDA Export Certification Wing',
  zone: 'Niphad & Dindori Crop Quality Zone',
  district: 'Nashik District (नाशिक विभाग)',
  assignedMandis: ['Pimpalgaon Baswant APMC Yard', 'Lasalgaon Central Mandi', 'Dindori Sub-Market Hub'],
  currentLocation: {
    lat: 20.1745,
    lng: 73.9842,
    address: 'Near Pimpalgaon Baswant APMC Weighbridge #2, Nashik'
  },
  stats: {
    inspectionsCompleted: 42,
    pendingQualityInspections: 3,
    manuallyVerifiedLots: 38,
    exportCompliantAssays: 29,
    accuracyScore: 99.4
  }
};

export const MOCK_AGENT_VISITS = [
  {
    id: 'VISIT-2026-01',
    farmer_name: 'Dnyaneshwar Gaikwad',
    farmer_phone: '+91 94229 11029',
    village: 'Niphad Shivar',
    taluka: 'Niphad',
    lot_code: 'LOT-NSK-SOY-881',
    crop: 'Soyabean (JS-335 Yellow Bold)',
    quantity_qtl: 85,
    scheduled_time: '10:30 AM Today',
    visit_type: 'QUALITY_INSPECTION',
    priority: 'HIGH',
    status: 'SCHEDULED',
    distance_km: 1.8,
    coordinates: { lat: 20.1812, lng: 73.9912 },
    notes: 'Crop Quality Inspection: Test moisture content, seed pod uniformity, and foreign matter percentage for spot auction.',
    syncStatus: 'SYNCED'
  },
  {
    id: 'VISIT-2026-02',
    farmer_name: 'Santosh Ramdas Shinde',
    farmer_phone: '+91 98224 81920',
    village: 'Pimpalgaon Baswant',
    taluka: 'Niphad',
    lot_code: 'MH-NSK-2024-LOT-0941',
    crop: 'Nashik Red Onion (Garwa Grade)',
    quantity_qtl: 120,
    scheduled_time: '01:00 PM Today',
    visit_type: 'QUALITY_INSPECTION',
    is_level_3: true,
    priority: 'CRITICAL',
    status: 'SCHEDULED',
    distance_km: 3.4,
    coordinates: { lat: 20.1704, lng: 73.9781 },
    notes: 'Level 3 Physical Grading Request: Measure bulb caliber (55-65mm), NIR moisture, skin curing, and export parity.',
    syncStatus: 'SYNCED'
  },
  {
    id: 'VISIT-2026-03',
    farmer_name: 'Ananda Bhor FPO Cluster',
    farmer_phone: '+91 98211 44901',
    village: 'Ranwad Horticultural Grid',
    taluka: 'Niphad',
    lot_code: 'LOT-SOL-1102',
    crop: 'Bhagwa Pomegranate (A-Export 280g+)',
    quantity_qtl: 80,
    scheduled_time: '03:15 PM Today',
    visit_type: 'QUALITY_INSPECTION',
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    distance_km: 5.2,
    coordinates: { lat: 20.1921, lng: 74.0084 },
    notes: 'Pre-harvest NIR sugar brix and fruit skin peel assay for APEDA global export certification.',
    syncStatus: 'SYNCED'
  },
  {
    id: 'VISIT-2026-04',
    farmer_name: 'Sunita Tukaram More',
    farmer_phone: '+91 98230 44109',
    village: 'Dindori Taluka Border',
    taluka: 'Dindori',
    lot_code: 'LOT-NSK-TOM-301',
    crop: 'Tomato (Abhinav Hybrid Red)',
    quantity_qtl: 95,
    scheduled_time: '04:45 PM Today',
    visit_type: 'QUALITY_INSPECTION',
    priority: 'NORMAL',
    status: 'SCHEDULED',
    distance_km: 7.8,
    coordinates: { lat: 20.2105, lng: 73.9620 },
    notes: 'Farmgate Crop Quality Assay: Test firmness, color grade index, blemish count, and packaging integrity.',
    syncStatus: 'SYNCED'
  }
];

// Deprecated: Land KYC and APMC Disputes removed - Field Agent role strictly limited to Crop Quality Inspection
export const MOCK_PENDING_FARMER_VERIFICATIONS = [];

export const MOCK_QUALITY_INSPECTIONS = [
  {
    id: 'INSP-2026-081',
    farmer_name: 'Santosh Ramdas Shinde',
    lot_code: 'LOT-NSK-4920',
    crop: 'Nashik Red Onion (Garwa)',
    estimated_yield_qtl: 120,
    moisture_percentage: 11.4,
    caliber_mm: '55mm - 65mm (Export Caliber)',
    outer_skin_integrity: 'Cured & Dry Outer Tunic Intact',
    sprouting_damage_pct: 0.2,
    pest_damage_pct: 0.0,
    certified_grade: 'GRADE_A_SUPER',
    star_rating: 5,
    is_exportable: true,
    inspection_date: '5 Sept 2026',
    gps_tag: '20.1704° N, 73.9781° E',
    photo_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    agent_signature: 'Verified by Sachin B. Kadam (Ext Officer)',
    status: 'CERTIFIED_SYNCED'
  },
  {
    id: 'INSP-2026-079',
    farmer_name: 'Ananda Bhor FPO Cluster',
    lot_code: 'LOT-SOL-1102',
    crop: 'Bhagwa Pomegranate (A-Export)',
    estimated_yield_qtl: 80,
    moisture_percentage: 8.2,
    caliber_mm: '280g+ per fruit',
    outer_skin_integrity: 'Glossy Deep Red, < 3% Scars',
    sprouting_damage_pct: 0.0,
    pest_damage_pct: 0.5,
    certified_grade: 'GRADE_A_EXPORT',
    star_rating: 5,
    is_exportable: true,
    inspection_date: '3 Sept 2026',
    gps_tag: '20.1921° N, 74.0084° E',
    photo_url: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80',
    agent_signature: 'Verified by Sachin B. Kadam (Ext Officer)',
    status: 'CERTIFIED_SYNCED'
  }
];

export const MOCK_AGENT_GRIEVANCES = [];

