// Mock Data for AgriConnect Admin Portal (Maharashtra State Innovation Society - Problem Statement ID 26132)

export const MOCK_ADMIN_USER = {
  id: 1,
  name: 'S. K. Deshmukh',
  designation: 'District APMC Regulatory Magistrate',
  jurisdiction: 'Nashik Supervised Division (34 Mandis)',
  department: 'Maharashtra Directorate of Agricultural Marketing',
  email: 'admin.nashik@agri.mh',
  badge: 'Gazetted APMC Officer #MH-GOV-9142',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
  lastLogin: 'Today, 09:14 AM IST',
  sessionTimeoutMinutes: 15
};

export const MOCK_BUYER_APPLICATIONS = [
  {
    id: 'APP-2024-0101',
    buyer_id: 'agrofresh',
    buyer_name: 'Rajesh Mehta',
    firm_name: 'AgroFresh Supply Chain Pvt Ltd',
    apmc_license_no: 'MH-PUN-APMC-9421',
    location: 'Lasalgaon Mandi Grid, Nashik',
    region: 'Nashik',
    submitted_date: '2 Sept 2024',
    status: 'Approved',
    email: 'rajesh.mehta@agrofresh.in',
    phone: '+91 98210 44102',
    cin: 'U01100MH2018PTC309112',
    business_type: 'Commercial Mandi Aggregator & Institutional Processor',
    verified_badge: true,
    documents: {
      license: {
        title: 'APMC Trading License (Form B)',
        certNo: 'MH-PUN-APMC-9421',
        validity: '31-Mar-2026',
        issuingAuthority: 'Nashik District APMC Regulatory Board',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      gst: {
        title: 'GST Registration Certificate (Active)',
        gstin: '27AABCA9124K1ZK',
        state: 'Maharashtra (State Code 27)',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      pan: {
        title: 'Corporate PAN Card',
        panNo: 'AABCA9124K',
        entityName: 'AGROFRESH SUPPLY CHAIN PVT LTD',
        fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      address: {
        title: 'Mandi Yard Allotment & Lease Deed',
        documentNo: 'APMC-LSG-SH-44B',
        location: 'Shop 44-B, Main Commodity Yard, Lasalgaon APMC, Nashik',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        verified: true
      }
    },
    audit_log: [
      {
        id: 'LOG-101',
        timestamp: '3 Sept 2024, 10:15 AM IST',
        admin_name: 'S. K. Deshmukh',
        action: 'Approved',
        notes: 'KYC verified against e-NAM state database. Validated APMC Form B license. Verified Buyer Badge granted.'
      }
    ]
  },
  {
    id: 'APP-2024-0102',
    buyer_id: 'mahaagro',
    buyer_name: 'Kishore Bhende',
    firm_name: 'MahaAgro Food Processors & Exporters',
    apmc_license_no: 'MH-VSH-APMC-6733',
    location: 'APMC Market II, Vashi, Navi Mumbai',
    region: 'Vashi / Mumbai',
    submitted_date: '4 Sept 2024',
    status: 'Pending',
    email: 'procurement@mahaagro.com',
    phone: '+91 98201 55921',
    cin: 'U15400MH2016PTC281900',
    business_type: 'Institutional Food Processor & Dehydration Plant',
    verified_badge: false,
    documents: {
      license: {
        title: 'APMC Trading License (Form B)',
        certNo: 'MH-VSH-APMC-6733',
        validity: '31-Dec-2025',
        issuingAuthority: 'Mumbai APMC Directorate, Vashi',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      gst: {
        title: 'GST Registration Certificate',
        gstin: '27AABCM6733P1Z1',
        state: 'Maharashtra',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      pan: {
        title: 'Corporate PAN Card',
        panNo: 'AABCM6733P',
        entityName: 'MAHAAGRO FOOD PROCESSORS AND EXPORTERS',
        fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      address: {
        title: 'Warehouse Electricity Bill & Industrial Lease',
        documentNo: 'MSEB-VSH-49120',
        location: 'Plot 18, MIDC Industrial Area, Turbhe, Navi Mumbai',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        verified: true
      }
    },
    audit_log: [
      {
        id: 'LOG-102',
        timestamp: '4 Sept 2024, 11:30 AM IST',
        admin_name: 'System Portal',
        action: 'Submitted',
        notes: 'KYC dossier submitted by buyer applicant. Awaiting regulatory review.'
      }
    ]
  },
  {
    id: 'APP-2024-0103',
    buyer_id: 'rathigrains',
    buyer_name: 'Anand Prakash Rathi',
    firm_name: 'Rathi Grains & Oilseeds Trading Corp',
    apmc_license_no: 'MH-LUR-APMC-3419',
    location: 'Latur Main Mandi Hub',
    region: 'Latur',
    submitted_date: '5 Sept 2024',
    status: 'Pending',
    email: 'anand@rathigrains.in',
    phone: '+91 94221 88301',
    cin: 'U01111MH2020PTC342019',
    business_type: 'Wholesale Oilseed & Pulse Merchant',
    verified_badge: false,
    documents: {
      license: {
        title: 'APMC Commission Agent License',
        certNo: 'MH-LUR-APMC-3419',
        validity: '31-Mar-2025',
        issuingAuthority: 'Latur APMC Committee',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      gst: {
        title: 'GST Certificate (Active)',
        gstin: '27AABCR3419H1Z8',
        state: 'Maharashtra',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      pan: {
        title: 'Firm PAN Document',
        panNo: 'AABCR3419H',
        entityName: 'RATHI GRAINS & OILSEEDS TRADING CORP',
        fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      address: {
        title: 'APMC Yard Godown Agreement',
        documentNo: 'LTR-YARD-GD-12',
        location: 'Godown No. 12, APMC Market Yard, Latur',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        verified: true
      }
    },
    audit_log: [
      {
        id: 'LOG-103',
        timestamp: '5 Sept 2024, 09:20 AM IST',
        admin_name: 'System Portal',
        action: 'Submitted',
        notes: 'KYC application received with complete documentation.'
      }
    ]
  },
  {
    id: 'APP-2024-0104',
    buyer_id: 'vidarbha_consortium',
    buyer_name: 'Vikramaditya Shastry',
    firm_name: 'Vidarbha Agro Exports Consortium',
    apmc_license_no: 'MH-AKL-APMC-8910',
    location: 'Akola Grain Terminal & Yeola APMC',
    region: 'Akola',
    submitted_date: '1 Sept 2024',
    status: 'More Info Requested',
    email: 'v.shastry@vidarbhaagro.org',
    phone: '+91 97632 99410',
    cin: 'U01409MH2019NPL321044',
    business_type: 'Export Trading Consortium',
    verified_badge: false,
    documents: {
      license: {
        title: 'APMC Trading License (Expired)',
        certNo: 'MH-AKL-APMC-8910',
        validity: '15-Aug-2024 (Needs Renewal)',
        issuingAuthority: 'Akola APMC Directorate',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        verified: false
      },
      gst: {
        title: 'GST Registration Certificate',
        gstin: '27AABCV8910M1Z2',
        state: 'Maharashtra',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      pan: {
        title: 'Corporate PAN Card',
        panNo: 'AABCV8910M',
        entityName: 'VIDARBHA AGRO EXPORTS CONSORTIUM',
        fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      address: {
        title: 'Mandi Hub Allotment Certificate',
        documentNo: 'AKL-APMC-HUB-91',
        location: 'Plot 4, APMC Industrial Gate 2, Akola',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        verified: true
      }
    },
    audit_log: [
      {
        id: 'LOG-104',
        timestamp: '2 Sept 2024, 04:45 PM IST',
        admin_name: 'S. K. Deshmukh',
        action: 'More Info Requested',
        notes: 'APMC Trading License validity expired on 15-Aug-2024. Requested current FY 2024-25 renewal challan before approval.'
      }
    ]
  },
  {
    id: 'APP-2024-0105',
    buyer_id: 'shivshakti',
    buyer_name: 'Dharmendra Joshi',
    firm_name: 'Shiv Shakti Commodity Brokers',
    apmc_license_no: 'MH-PUN-TEMP-0491',
    location: 'Gultekdi Market Yard, Pune',
    region: 'Pune',
    submitted_date: '28 Aug 2024',
    status: 'Rejected',
    rejection_reason: 'Temporary unverified APMC challan submitted instead of certified statutory Form-B trader license under Maharashtra APMC Rules 14-A.',
    email: 'dharmendra@shivshaktitraders.com',
    phone: '+91 98220 77192',
    cin: 'U01122MH2021PTC359120',
    business_type: 'Private Commodity Trader',
    verified_badge: false,
    documents: {
      license: {
        title: 'Provisional Receipt Only (Invalid Form)',
        certNo: 'MH-PUN-TEMP-0491',
        validity: 'Provisional',
        issuingAuthority: 'Uncertified Counter',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        verified: false
      },
      gst: {
        title: 'GST Certificate',
        gstin: '27AABCS0491P1ZX',
        state: 'Maharashtra',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      pan: {
        title: 'PAN Card',
        panNo: 'AABCS0491P',
        entityName: 'SHIV SHAKTI COMMODITY BROKERS',
        fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
        verified: true
      },
      address: {
        title: 'Shop Rent Receipt',
        documentNo: 'PUN-SH-09',
        location: 'Shop 9, Gultekdi Market Yard, Pune',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        verified: true
      }
    },
    audit_log: [
      {
        id: 'LOG-105',
        timestamp: '29 Aug 2024, 02:10 PM IST',
        admin_name: 'S. K. Deshmukh',
        action: 'Rejected',
        notes: 'Rejected: Provisional APMC receipt submitted does not meet statutory requirement for institutional trading.'
      }
    ]
  }
];

export const MOCK_ADMIN_GRIEVANCES = [
  {
    id: 1,
    docket_id: 'DISP-2026-0419',
    ticket_code: 'GRV-2024-0419',
    deal_ref: 'AC-TXN-8841',
    lot_id: 'LOT-NSK-4920',
    lot_code: 'LOT-NSK-4920',
    created_at: '5 Sept 2026, 09:30 AM',
    filed_date: '5 Sept 2026, 09:30 AM',
    farmer_name: 'Santosh Ramdas Shinde',
    farmer_phone: '+91 98224 81920',
    farmer_gut: 'Gut 142/B, Pimpalgaon',
    farmer_mandi: 'Pimpalgaon APMC Yard',
    farmer_location: 'Gut 142/B, Pimpalgaon Baswant, Nashik',
    buyer_firm: 'AgroFresh Supply Chain Pvt Ltd',
    buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
    buyer_rep: 'Rajesh Mehta (Procurement Lead)',
    buyer_phone: '+91 98210 44102',
    buyer_license: 'MH-PUN-APMC-9421',
    category: 'Delayed Assayer Inward Certificate & Escrow Lien Hold',
    issue_type: 'Delayed Inward Inspection',
    crop_variety: 'Nashik Red Onion (Export Grade)',
    crop_name: 'Nashik Red Onion (120 Qtl)',
    quantity_qtl: 120,
    contracted_price_per_qtl: 2425,
    total_contract_value: 291000,
    disputed_amount: 291000,
    escrow_locked_amount: 291000,
    escrow_id: 'SBI-ESC-8841029',
    sla_hours_remaining: 3,
    sla_hours_total: 48,
    sla_deadline: '6 Sept 2026, 01:30 PM (03h remaining)',
    sla_urgent: true,
    status: 'UNDER_ARBITRATION',
    priority: 'HIGH (Statutory Sec 31-B)',
    mandi_node: 'Pimpalgaon Central Yard #MH-NSK-04',
    complaint_statement: 'Consignment of 120 Quintals certified Grade-A onions reached destination yard at 09:30 AM. Transporter was made to wait over 5 hours. Weighment variance of 160 kg was unilaterally deducted by buyer, despite being within 1.8% statutory transit desiccation limits under APMC Rule 19. Full escrow of ₹2,91,000 is withheld without an authorized assayer rejection report.',
    buyer_response_statement: 'Consignment was accepted with inward tare verification. Moisture loss appeared higher than 1.5% and secondary sprouting was noticed on peripheral sacks. We request joint calibration check and 5% price adjustment before releasing escrow.',
    weighbridge_comparison: {
      origin_slip: {
        gross_kg: 18420,
        tare_kg: 6420,
        net_kg: 12000,
        slip_no: 'WB-NSK-2024-8841',
        weighbridge_name: 'Pimpalgaon APMC Electronic Weighbridge #2',
        timestamp: '5 Sept 2026, 08:30 AM'
      },
      destination_slip: {
        gross_kg: 18260,
        tare_kg: 6420,
        net_kg: 11840,
        slip_no: 'WB-LAS-2024-9102',
        weighbridge_name: 'Lasalgaon Mandi Yard Gate 3 Scale',
        timestamp: '5 Sept 2026, 01:15 PM'
      },
      variance_kg: 160,
      variance_percent: 1.33,
      natural_desiccation_allowed_percent: 1.8,
      is_within_tolerance: true
    },
    quality_assessment: {
      pre_dispatch_ai_grade: 'Grade A (Assayer NIR Certified)',
      pre_dispatch_ai_confidence: 96.4,
      pre_dispatch_photo_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
      pre_dispatch_lab_notes: 'Dry outer tunic intact, 55-65mm diameter, zero sprouted bulbs, moisture 11.4% recorded at Pimpalgaon dispatch.',
      buyer_claim_reason: 'Buyer inward inspector reported 8% black mold and neck rot on peripheral crates.',
      buyer_photos: [
        {
          url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
          caption: 'Buyer inward inspection log showing peripheral moisture inspection at Lasalgaon.'
        }
      ]
    },
    evidence: [
      {
        id: 'EV-01',
        title: 'Farmgate Dispatch Photo (NIR 94.6)',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
        caption: 'Uniform 58mm caliber, cured dry scales, moisture 11.2% measured at dispatch.'
      },
      {
        id: 'EV-02',
        title: 'APMC Weighbridge Calibration Slip',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        caption: 'Gross Weight: 18,420 kg, Tare: 6,420 kg, Net: 12,000 kg (Exact 120.0 Qtl).'
      },
      {
        id: 'EV-03',
        title: 'Assay Lab Grade A Certificate',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        caption: 'Certificate #MH-QG-2024-9104 confirming Grade A Institutional Compliance.'
      }
    ],
    timeline: [
      {
        time: '5 Sept 2026, 08:00 AM',
        title: 'B2B Deal Executed & 100% Escrow Deposited',
        actor: 'SBI Escrow Gateway',
        details: '₹2,91,000 deposited in State Escrow Vault #SBI-ESC-8841029.'
      },
      {
        time: '5 Sept 2026, 09:30 AM',
        title: 'Produce Delivered at Buyer Bay 4',
        actor: 'Transporter (Rajesh Patil)',
        details: 'Consignment unloaded at Lasalgaon APMC Logistics Bay 4.'
      },
      {
        time: '5 Sept 2026, 02:00 PM',
        title: 'Statutory 4-Hour Assay Window Breached',
        actor: 'APMC Rule 24 Bot',
        details: 'Automatic alert issued: No assayer certificate uploaded within mandatory 4h window.'
      },
      {
        time: '5 Sept 2026, 02:15 PM',
        title: 'Grievance Docket Filed by Cultivator',
        actor: 'Farmer (Santosh Shinde)',
        details: 'Complaint registered under Maharashtra APMC Act Sec 31-B.'
      },
      {
        time: '6 Sept 2026, 10:00 AM',
        title: 'Assigned to Regulatory Magistrate',
        actor: 'S. K. Deshmukh',
        details: 'Case opened for administrative dispute resolution.'
      }
    ],
    internal_notes: [
      {
        id: 'NOTE-1',
        author: 'S. K. Deshmukh (Magistrate)',
        role: 'District APMC Regulatory Magistrate',
        timestamp: '6 Sept 2026, 10:15 AM',
        note: 'Examined weighbridge net weight and dispatch NIR certificate. Weighbridge variance of 1.33% is well within the 1.8% natural transit desiccation limit for allium cepa. Escrow lien must be decided under Sec 31-B.'
      }
    ],
    resolution: null
  },
  {
    id: 2,
    docket_id: 'DISP-2026-0392',
    ticket_code: 'GRV-2024-0392',
    deal_ref: 'AC-TXN-8890',
    lot_id: 'LOT-NSK-3810',
    lot_code: 'LOT-NSK-3810',
    created_at: '4 Sept 2026, 02:15 PM',
    filed_date: '4 Sept 2026, 02:15 PM',
    farmer_name: 'Dnyaneshwar Gaikwad',
    farmer_phone: '+91 94229 11029',
    farmer_gut: 'Gut 88/1, Niphad',
    farmer_mandi: 'Niphad Sub-Market Yard',
    farmer_location: 'Niphad Mandi Node, Nashik',
    buyer_firm: 'Kisan Fresh Aggregators',
    buyer_name: 'Kisan Fresh Aggregators',
    buyer_rep: 'Ajay Kulkarni',
    buyer_phone: '+91 98223 88102',
    buyer_license: 'MH-NSK-TRD-4410',
    category: 'Transit Weight Discrepancy (1.4% Disputed Deduction)',
    issue_type: 'Weight Discrepancy',
    crop_variety: 'Soyabean JS-335 (Yellow Bold)',
    crop_name: 'Soyabean JS-335 (45 Qtl)',
    quantity_qtl: 45,
    contracted_price_per_qtl: 4800,
    total_contract_value: 216000,
    disputed_amount: 216000,
    escrow_locked_amount: 216000,
    escrow_id: 'SBI-ESC-8890114',
    sla_hours_remaining: 16,
    sla_hours_total: 48,
    sla_deadline: '6 Sept 2026, 06:15 PM (16h remaining)',
    sla_urgent: false,
    status: 'UNDER_ARBITRATION',
    priority: 'MEDIUM',
    mandi_node: 'Niphad Sub-Market Yard',
    complaint_statement: 'Buyer deducted 140 kg weight discrepancy from agreed 45 Qtl consignment without joint calibration. Moisture content was certified at 10.2% before loading.',
    buyer_response_statement: 'Destination weighbridge recorded 4,360 kg vs 4,500 kg dispatch slip. We are willing to split the variance if moisture analysis is confirmed.',
    weighbridge_comparison: {
      origin_slip: {
        gross_kg: 8500,
        tare_kg: 4000,
        net_kg: 4500,
        slip_no: 'WB-NIP-2024-3810',
        weighbridge_name: 'Niphad Mandi Yard Scale',
        timestamp: '4 Sept 2026, 11:30 AM'
      },
      destination_slip: {
        gross_kg: 8360,
        tare_kg: 4000,
        net_kg: 4360,
        slip_no: 'WB-NSK-2024-4401',
        weighbridge_name: 'Kisan Fresh Receiving Dock Scale',
        timestamp: '4 Sept 2026, 01:45 PM'
      },
      variance_kg: 140,
      variance_percent: 3.11,
      natural_desiccation_allowed_percent: 1.0,
      is_within_tolerance: false
    },
    quality_assessment: {
      pre_dispatch_ai_grade: 'Grade A (10.2% Moisture)',
      pre_dispatch_ai_confidence: 94.1,
      pre_dispatch_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      pre_dispatch_lab_notes: 'Soyabean bold grain, seed moisture 10.2%, zero foreign matter.',
      buyer_claim_reason: 'Net weight discrepancy beyond 1% transit desiccation limit.',
      buyer_photos: []
    },
    evidence: [
      {
        id: 'EV-11',
        title: 'Niphad APMC Outward Slip',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        caption: 'Outward weight 4,500 kg certified by Niphad yard weighbridge.'
      }
    ],
    timeline: [
      {
        time: '4 Sept 2026, 02:15 PM',
        title: 'Grievance Docket Lodged',
        actor: 'Farmer (Dnyaneshwar Gaikwad)',
        details: 'Deduction challenged under APMC Weighment Rule 19.'
      }
    ],
    internal_notes: [],
    resolution: null
  },
  {
    id: 3,
    docket_id: 'DISP-2026-0371',
    ticket_code: 'GRV-2024-0371',
    deal_ref: 'AC-TXN-7712',
    lot_id: 'LOT-SOL-1102',
    lot_code: 'LOT-SOL-1102',
    created_at: '3 Sept 2026, 11:00 AM',
    filed_date: '3 Sept 2026, 11:00 AM',
    farmer_name: 'Ananda Bhor Collective',
    farmer_phone: '+91 98211 44901',
    farmer_gut: 'Gut 45, Ranwad',
    farmer_mandi: 'Ranwad Horti Cluster',
    farmer_location: 'Ranwad Horti Cluster, Nashik',
    buyer_firm: 'Sahyadri Farmer Producer Co. Ltd',
    buyer_name: 'Sahyadri Farmer Producer Co. Ltd',
    buyer_rep: 'Vilas Shinde (MD)',
    buyer_phone: '+91 98220 11400',
    buyer_license: 'MH-NSK-APMC-7710',
    category: 'Quality Grade Dispute (Skin Blemish vs Export Specs)',
    issue_type: 'Quality Grade Dispute',
    crop_variety: 'Bhagwa Pomegranate (A-Export)',
    crop_name: 'Bhagwa Pomegranate (80 Qtl)',
    quantity_qtl: 80,
    contracted_price_per_qtl: 9250,
    total_contract_value: 740000,
    disputed_amount: 740000,
    escrow_locked_amount: 740000,
    escrow_id: 'SBI-ESC-7712091',
    sla_hours_remaining: 0,
    sla_hours_total: 48,
    sla_deadline: 'Resolved on 4 Sept 2026',
    sla_urgent: false,
    status: 'RESOLVED',
    priority: 'NORMAL',
    mandi_node: 'Nashik Market Yard',
    complaint_statement: 'Dispute over secondary sorting of 12 Qtl fruit. Re-inspection conducted with accredited APMC horticulturist.',
    buyer_response_statement: 'Mutual conciliation completed. Agreed to accept 94% export grade compliance with minor sorting fee.',
    weighbridge_comparison: {
      origin_slip: {
        gross_kg: 12400,
        tare_kg: 4400,
        net_kg: 8000,
        slip_no: 'WB-RAN-2024-1102',
        weighbridge_name: 'Ranwad Horti Packhouse Scale',
        timestamp: '3 Sept 2026, 09:00 AM'
      },
      destination_slip: {
        gross_kg: 12380,
        tare_kg: 4400,
        net_kg: 7980,
        slip_no: 'WB-SAH-2024-0091',
        weighbridge_name: 'Sahyadri Mohadi Packhouse Scale',
        timestamp: '3 Sept 2026, 10:30 AM'
      },
      variance_kg: 20,
      variance_percent: 0.25,
      natural_desiccation_allowed_percent: 0.5,
      is_within_tolerance: true
    },
    quality_assessment: {
      pre_dispatch_ai_grade: 'Grade A Export Spec (280g+)',
      pre_dispatch_ai_confidence: 97.2,
      pre_dispatch_photo_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      pre_dispatch_lab_notes: 'Uniform aril redness, blemish < 5%, sugar brix 15.4.',
      buyer_claim_reason: 'Skin thrips scar on 6 crates.',
      buyer_photos: []
    },
    evidence: [
      {
        id: 'EV-21',
        title: 'Joint Inspection Report',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        caption: 'Horticulture inspection confirmed 94% export grade compliance.'
      }
    ],
    timeline: [
      {
        time: '3 Sept 2026, 11:00 AM',
        title: 'Grievance Filed',
        actor: 'Farmer Ananda Bhor',
        details: 'Disputed 10% price discount applied by assayer.'
      },
      {
        time: '4 Sept 2026, 03:30 PM',
        title: 'Amicable Resolution Decree Issued',
        actor: 'S. K. Deshmukh',
        details: 'Buyer agreed to payout ₹7,25,000; farmer accepted 2% sorting allowance.'
      }
    ],
    internal_notes: [
      {
        id: 'NOTE-3',
        author: 'S. K. Deshmukh',
        role: 'District APMC Regulatory Magistrate',
        timestamp: '4 Sept 2026, 03:00 PM',
        note: 'Both parties agreed to APMC conciliation terms without penalty.'
      }
    ],
    resolution: {
      date: '4 Sept 2026',
      outcome_type: 'Settlement Accord',
      summary: 'Mutual conciliation under Rule 28: ₹7,25,000 released to farmer, ₹15,000 returned to buyer for sorting allowance.',
      decree_no: 'MH-APMC-ORD-2026-0371',
      authorizer: 'S. K. Deshmukh',
      farmer_award: 725000,
      buyer_refund: 15000,
      ruling: 'Decree issued under Section 31-B of Maharashtra APMC Act, 1963. Mutual conciliation terms satisfied in full.'
    }
  },
  {
    id: 4,
    docket_id: 'DISP-2026-0355',
    ticket_code: 'GRV-2024-0355',
    deal_ref: 'AC-TXN-6910',
    lot_id: 'LOT-YVT-8802',
    lot_code: 'LOT-YVT-8802',
    created_at: '2 Sept 2026, 04:00 PM',
    filed_date: '2 Sept 2026, 04:00 PM',
    farmer_name: 'Godavari Valley FPO Cluster',
    farmer_phone: '+91 98230 55102',
    farmer_gut: 'Yeola Hub Gate 1',
    farmer_mandi: 'Yeola APMC Hub',
    farmer_location: 'Yeola Hub, Nashik',
    buyer_firm: 'Vidarbha Textiles Ltd',
    buyer_name: 'Vidarbha Textiles Ltd',
    buyer_rep: 'Harishankar Rathi',
    buyer_phone: '+91 94231 99014',
    buyer_license: 'MH-YEO-TRD-9912',
    category: 'Payment Default / Escrow Replenishment Delay',
    issue_type: 'Payment Default',
    crop_variety: 'BT Cotton Medium Staple (28mm)',
    crop_name: 'BT Cotton Medium Staple (150 Qtl)',
    quantity_qtl: 150,
    contracted_price_per_qtl: 7420,
    total_contract_value: 1113000,
    disputed_amount: 1113000,
    escrow_locked_amount: 1113000,
    escrow_id: 'SBI-ESC-6910884',
    sla_hours_remaining: 0,
    sla_hours_total: 48,
    sla_deadline: '4 Sept 2026',
    sla_urgent: false,
    status: 'ESCALATED',
    priority: 'HIGH',
    mandi_node: 'Yeola APMC Hub',
    complaint_statement: 'Buyer failed to honor top-up escrow for additional 30 Qtl delivered under contract extension #EXT-04. Case referred to Directorate.',
    buyer_response_statement: 'Corporate banking delays caused escrow hold. Re-capitalization in progress.',
    weighbridge_comparison: {
      origin_slip: {
        gross_kg: 21500,
        tare_kg: 6500,
        net_kg: 15000,
        slip_no: 'WB-YEO-2024-8802',
        weighbridge_name: 'Yeola Yard Main Scale',
        timestamp: '2 Sept 2026, 02:00 PM'
      },
      destination_slip: {
        gross_kg: 21450,
        tare_kg: 6500,
        net_kg: 14950,
        slip_no: 'WB-VID-2024-1109',
        weighbridge_name: 'Vidarbha Receiving Bay Scale',
        timestamp: '2 Sept 2026, 03:45 PM'
      },
      variance_kg: 50,
      variance_percent: 0.33,
      natural_desiccation_allowed_percent: 0.5,
      is_within_tolerance: true
    },
    quality_assessment: {
      pre_dispatch_ai_grade: 'Grade A Medium Staple 28mm',
      pre_dispatch_ai_confidence: 95.8,
      pre_dispatch_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      pre_dispatch_lab_notes: 'Staple length 28.2mm, mic value 4.1, moisture 8.5%.',
      buyer_claim_reason: 'Banking delay on supplementary credit.',
      buyer_photos: []
    },
    evidence: [
      {
        id: 'EV-31',
        title: 'Delivery Receipt & Unloading Challan',
        type: 'document',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        caption: 'Signed delivery challan #YE-4419 with gate entry stamp.'
      }
    ],
    timeline: [
      {
        time: '2 Sept 2026, 04:00 PM',
        title: 'Default Docket Registered',
        actor: 'FPO Secretary',
        details: 'Escrow shortfall reported under Sec 32 of APMC Act.'
      },
      {
        time: '4 Sept 2026, 05:00 PM',
        title: 'Case Escalated to State Directorate',
        actor: 'S. K. Deshmukh',
        details: 'License suspension caution notice forwarded to Commissioner of Agriculture, Pune.'
      }
    ],
    internal_notes: [],
    resolution: null
  }
];

export const MOCK_ADMIN_AUDIT_LOGS = [
  {
    id: 'AUD-901',
    timestamp: 'Today, 10:15 AM',
    admin_name: 'S. K. Deshmukh',
    action: 'Case Docket Inspected',
    target: 'GRV-2024-0419',
    details: 'Opened priority grievance dossier for Nashik Red Onion lot rejection.'
  },
  {
    id: 'AUD-902',
    timestamp: '4 Sept 2024, 03:30 PM',
    admin_name: 'S. K. Deshmukh',
    action: 'Decree Issued',
    target: 'GRV-2024-0371',
    details: 'Issued conciliation decree under Maharashtra APMC Act Sec 31-B releasing ₹7,25,000.'
  },
  {
    id: 'AUD-903',
    timestamp: '3 Sept 2024, 10:15 AM',
    admin_name: 'S. K. Deshmukh',
    action: 'Buyer Approved',
    target: 'AgroFresh Supply Chain Pvt Ltd',
    details: 'Granted Verified Buyer badge #MH-PUN-APMC-9421.'
  },
  {
    id: 'AUD-904',
    timestamp: '2 Sept 2024, 04:45 PM',
    admin_name: 'S. K. Deshmukh',
    action: 'KYC More Info Requested',
    target: 'Vidarbha Agro Exports Consortium',
    details: 'Requested renewal challan for expired Form-B trading license.'
  },
  {
    id: 'AUD-905',
    timestamp: '29 Aug 2024, 02:10 PM',
    admin_name: 'S. K. Deshmukh',
    action: 'Buyer Rejected',
    target: 'Shiv Shakti Commodity Brokers',
    details: 'Rejected uncertified provisional receipt under APMC Rules 14-A.'
  }
];

export const MOCK_FARMER_APPLICATIONS = [
  {
    id: 'KYC-FARM-901',
    farmer_name: 'Dnyaneshwar Gaikwad',
    father_name: 'Narayan Gaikwad',
    phone: '+91 94229 11029',
    village: 'Niphad Shivar',
    taluka: 'Niphad',
    district: 'Nashik (नाशिक)',
    gut_no: 'Gut No. 88/1',
    khata_no: 'Khata No. 492',
    occupant_class: 'Bhogwatadar Class-1 (Occupant Unrestricted)',
    land_area_acres: 4.5,
    land_area_ha_r: '1 Ha 82 Are',
    assessment_tax: '₹ 14.50 / Annual Revenue',
    crops: ['Soyabean JS-335', 'Wheat HD-2967'],
    irrigation_type: 'Open Well + Drip Irrigation',
    aadhaar_masked: 'XXXX-XXXX-9012',
    aadhaar_match_score: '100% Name Match with Mahabhulekh Khatedar',
    dbt_status: 'Active • NPCI Direct Benefit Transfer Seeded',
    bank_name: 'State Bank of India',
    bank_details: 'State Bank of India • A/C: 38291048291 (SBIN0001429)',
    e_pik_pahani: {
      season: 'Kharif 2026',
      crop: 'Soyabean (JS-335 Yellow Bold)',
      area: '4.50 Acres',
      status: 'Digitally Approved by Talathi'
    },
    land_extract_doc_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    submitted_date: '5 Sept 2026',
    verified_badge: false
  },
  {
    id: 'KYC-FARM-902',
    farmer_name: 'Ganesh Bhikaji Patil',
    father_name: 'Bhikaji Patil',
    phone: '+91 98210 33918',
    village: 'Lasalgaon Mandi Fringe',
    taluka: 'Niphad',
    district: 'Nashik (नाशिक)',
    gut_no: 'Gut No. 204/A',
    khata_no: 'Khata No. 714',
    occupant_class: 'Bhogwatadar Class-1',
    land_area_acres: 5.2,
    land_area_ha_r: '2 Ha 10 Are',
    assessment_tax: '₹ 18.20 / Annual Revenue',
    crops: ['Nashik Red Onion (Garwa)', 'Maize (Makar)'],
    irrigation_type: 'Canal + Sprinkler',
    aadhaar_masked: 'XXXX-XXXX-4421',
    aadhaar_match_score: '100% Name Match with Mahabhulekh',
    dbt_status: 'Active • NPCI Direct Benefit Transfer Seeded',
    bank_name: 'Bank of Maharashtra',
    bank_details: 'Bank of Maharashtra • A/C: 60194829104 (MAHB0000142)',
    e_pik_pahani: {
      season: 'Kharif 2026',
      crop: 'Red Onion (Garwa)',
      area: '5.20 Acres',
      status: 'Digitally Approved by Talathi'
    },
    land_extract_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    submitted_date: '4 Sept 2026',
    verified_badge: false
  },
  {
    id: 'KYC-FARM-903',
    farmer_name: 'Mangala Ashokrao Wagh',
    father_name: 'Ashokrao Wagh',
    phone: '+91 94220 77142',
    village: 'Dindori Highland Cluster',
    taluka: 'Dindori',
    district: 'Nashik (नाशिक)',
    gut_no: 'Gut No. 59',
    khata_no: 'Khata No. 288',
    occupant_class: 'Bhogwatadar Class-1',
    land_area_acres: 3.8,
    land_area_ha_r: '1 Ha 54 Are',
    assessment_tax: '₹ 12.60 / Annual Revenue',
    crops: ['Table Grapes (Thomson)', 'Export Pomegranate'],
    irrigation_type: 'Farm Pond + Micro Drip',
    aadhaar_masked: 'XXXX-XXXX-8819',
    aadhaar_match_score: '100% Match',
    dbt_status: 'Active • NPCI DBT Seeded',
    bank_name: 'HDFC Bank',
    bank_details: 'HDFC Bank • A/C: 501004928104 (HDFC0000241)',
    e_pik_pahani: {
      season: 'Annual 2026',
      crop: 'Thomson Seedless Grapes',
      area: '3.80 Acres',
      status: 'Approved by Talathi'
    },
    land_extract_doc_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    submitted_date: '4 Sept 2026',
    verified_badge: false
  },
  {
    id: 'KYC-FARM-904',
    farmer_name: 'Santosh Ramdas Shinde',
    father_name: 'Ramdas Shinde',
    phone: '+91 98224 81920',
    village: 'Pimpalgaon Baswant',
    taluka: 'Niphad',
    district: 'Nashik (नाशिक)',
    gut_no: 'Gut No. 142/B',
    khata_no: 'Khata No. 104',
    occupant_class: 'Bhogwatadar Class-1',
    land_area_acres: 6.2,
    land_area_ha_r: '2 Ha 51 Are',
    assessment_tax: '₹ 22.40 / Annual Revenue',
    crops: ['Nashik Red Onion (Garwa)', 'Soyabean JS-335'],
    irrigation_type: 'Well + Drip Irrigation',
    aadhaar_masked: 'XXXX-XXXX-9012',
    aadhaar_match_score: '100% Match (Mahabhulekh Verified)',
    dbt_status: 'Active • NPCI DBT Seeded',
    bank_name: 'State Bank of India',
    bank_details: 'State Bank of India • A/C: 38291048291 (SBIN0001429)',
    e_pik_pahani: {
      season: 'Kharif 2026',
      crop: 'Red Onion (Garwa)',
      area: '6.20 Acres',
      status: 'Digitally Certified by Talathi'
    },
    land_extract_doc_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'Approved',
    submitted_date: '1 Sept 2026',
    verified_badge: true
  }
];

