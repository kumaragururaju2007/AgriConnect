export const MOCK_PRICES_TICKER = [
  { crop: 'Soyabean (Latur)', price: '₹4,820/qtl', change: '+3.2%', positive: true },
  { crop: 'Onion (Lasalgaon)', price: '₹2,150/qtl', change: '-1.1%', positive: false },
  { crop: 'Cotton (Akola)', price: '₹7,410/qtl', change: '+1.8%', positive: true },
  { crop: 'Pomegranate (Solapur)', price: '₹9,200/qtl', change: '+4.5%', positive: true },
  { crop: 'Tur Dal (Amravati)', price: '₹9,850/qtl', change: '+0.8%', positive: true },
  { crop: 'Tomato (Narayangaon)', price: '₹1,640/qtl', change: '+6.2%', positive: true },
  { crop: 'Wheat Sharbati (Nagpur)', price: '₹3,180/qtl', change: '+1.4%', positive: true },
  { crop: 'Chana Desi (Jalna)', price: '₹6,150/qtl', change: '-0.5%', positive: false },
  { crop: 'Grapes Thompson (Nashik)', price: '₹11,500/qtl', change: '+5.1%', positive: true },
  { crop: 'Maize Yellow (Dhule)', price: '₹2,240/qtl', change: '+2.0%', positive: true }
];

export const MOCK_FARMER = {
  name: 'Santosh Shinde',
  fatherName: 'Ramdas Shinde',
  avatar: '👨‍🌾',
  role: 'Verified Farmer (MH NAS)',
  farmerId: 'MH-NAS-2024-8821',
  apmcMemberNo: 'MH-NSK-2940',
  mobile: '+91 98224 81920',
  district: 'Nashik',
  taluka: 'Niphad',
  village: 'Pimpalgaon Baswant',
  landGutNo: 'Gut No. 142/B',
  landArea: '4.20 Acres Cultivated (Irrigated)',
  soilHealthCard: 'SHC-MH-2023-7712',
  aadhaarStatus: 'Aadhaar e-KYC Verified',
  mahaEsevaStatus: '7/12 Digital Extract Linked',
  bankAccount: 'State Bank of India (A/C: *******4921) • IFSC: SBIN0001429 • Aadhaar DBT Active',
  trustScore: 98,
  totalDeals: 34,
  onTimeDeliveryRate: '100%',
  zeroDisputeRate: '97.2%',
  escrowWalletPending: '₹2,91,000.00'
};

export const MOCK_COMMODITIES = [
  { id: 'onion', name: 'Onion (Red / लाल कांदा)', variety: 'Gavran / High Pungency (गावराण)', cat: 'Allium Cepa', msp: 1850 },
  { id: 'soyabean', name: 'Soyabean (सोयाबीन)', variety: 'JS-335 / Yellow Seed', cat: 'Glycine max', msp: 4600 },
  { id: 'cotton', name: 'Cotton (कापूस)', variety: 'BT Hybrid / Medium Staple', cat: 'Gossypium', msp: 7020 },
  { id: 'pomegranate', name: 'Pomegranate (डाळिंब)', variety: 'Bhagwa (भगवा)', cat: 'Punica granatum', msp: 7500 },
  { id: 'tomato', name: 'Tomato (टोमॅटो)', variety: 'Abhinav / F1 Hybrid', cat: 'Solanum lycopersicum', msp: 1200 }
];

export const MOCK_MANDI_COMPARISONS = [
  { mandi: 'Lasalgaon APMC', district: 'Nashik', distanceKm: 14, price: 2380, trend: '+4.2%', arrivalToday: '14,200 Qtl', status: 'Highest Rate', recommendation: 'Recommended' },
  { mandi: 'Pimpalgaon APMC', district: 'Nashik', distanceKm: 8, price: 2240, trend: '+1.5%', arrivalToday: '9,800 Qtl', status: 'Moderate', recommendation: 'Nearby Alternate' },
  { mandi: 'Yeola APMC', district: 'Nashik', distanceKm: 32, price: 2210, trend: '-0.8%', arrivalToday: '6,500 Qtl', status: 'Lower Price', recommendation: 'Avoid High Logistics' },
  { mandi: 'Ahmednagar APMC', district: 'Ahmednagar', distanceKm: 88, price: 2190, trend: '-1.4%', arrivalToday: '11,400 Qtl', status: 'Oversupplied', recommendation: 'Not Feasible' },
  { mandi: 'Pune Market Yard', district: 'Pune', distanceKm: 185, price: 2310, trend: '+2.1%', arrivalToday: '18,500 Qtl', status: 'High Transit Cost', recommendation: 'Bulk Lots Only' }
];

export const MOCK_BUYERS = [
  {
    id: 'agrofresh',
    name: 'AgroFresh Supply Chain Pvt Ltd',
    type: 'Commercial Mandi Aggregator & Institutional Processor',
    badge: 'Government Verified',
    license: 'MH-PUN-APMC-9421',
    cin: 'U01100MH2018PTC309112',
    incorporated: 'May 2018 (Nashik, MH)',
    contact: 'Rajesh Mehta (Dir. Sourcing & Procurement)',
    rating: 4.9,
    trustScore: 98,
    escrowDepositLimit: '₹5.00 Crore',
    settledDeals: 842,
    activeOffer: '₹2,380 - ₹2,425 / Qtl',
    location: 'Lasalgaon Mandi Grid, Nashik'
  },
  {
    id: 'sahyadri',
    name: 'Sahyadri Farmer Producer Co. Ltd',
    type: 'Accredited Farmer Producer Organization & Export Grid',
    badge: 'Government Verified',
    license: 'MH-NSK-APMC-1104',
    cin: 'U01403MH2011PTC212344',
    incorporated: 'January 2011 (Mohadi, Nashik)',
    contact: 'Vilas Shinde (Managing Director)',
    rating: 5.0,
    trustScore: 99,
    escrowDepositLimit: '₹12.50 Crore',
    settledDeals: 2150,
    activeOffer: '₹2,410 / Qtl (Export Grade A)',
    location: 'Mohadi, Dindori Road, Nashik'
  },
  {
    id: 'mahaagro',
    name: 'MahaAgro Food Processors & Exporters',
    type: 'Institutional Food Processor & Dehydration Plant',
    badge: 'KYC Verified',
    license: 'MH-VSH-APMC-6733',
    cin: 'U15400MH2016PTC281900',
    incorporated: 'August 2016 (Vashi Navi Mumbai)',
    contact: 'Kishore Bhende (Head of Procurement)',
    rating: 4.7,
    trustScore: 94,
    escrowDepositLimit: '₹3.20 Crore',
    settledDeals: 490,
    activeOffer: '₹2,350 / Qtl',
    location: 'APMC Market II, Vashi, Navi Mumbai'
  }
];

export const MOCK_WAREHOUSES = [
  {
    id: 'wh-niphad',
    name: 'Maharashtra State Warehousing Corp (MSWC) Niphad Godown',
    type: 'Government Godown (MSWC)',
    distance: '12 km from Gut 142/B',
    totalCapacity: '4,500 MT',
    availableCapacity: '1,200 MT',
    occupancyRate: '73%',
    ratePerMtMonth: '₹115 / MT / Month',
    govtSubsidyEligible: '75% MSWC Rental Concession Active',
    wdraCertified: 'WDRA-REG-MH-2021-0941',
    insuranceCover: 'Comprehensive Fire & Flood Covered',
    pledgeFinancing: 'e-NWR Bank Loan up to 70% Lot Value via SBI/MGB'
  },
  {
    id: 'wh-lasalgaon',
    name: 'Lasalgaon Agro Integrated Cold Storage & Chawl',
    type: 'Private WDRA Accredited Cold Chain',
    distance: '18 km from Gut 142/B',
    totalCapacity: '2,800 MT',
    availableCapacity: '450 MT',
    occupancyRate: '84%',
    ratePerMtMonth: '₹320 / MT / Month',
    govtSubsidyEligible: 'MSAMB 25% Capital Subsidy Facility',
    wdraCertified: 'WDRA-REG-MH-2022-1402',
    insuranceCover: 'Refrigeration Breakdown & Transit Included',
    pledgeFinancing: 'Instant Kisan Credit Card (KCC) Limit Enhancement'
  },
  {
    id: 'wh-pimpalgaon',
    name: 'MSWC Pimpalgaon Baswant Regional Depot',
    type: 'Government Godown (MSWC)',
    distance: '6.5 km from Gut 142/B',
    totalCapacity: '6,200 MT',
    availableCapacity: '1,850 MT',
    occupancyRate: '70%',
    ratePerMtMonth: '₹115 / MT / Month',
    govtSubsidyEligible: 'SC/ST & Smallholder 80% Subsidy',
    wdraCertified: 'WDRA-REG-MH-2020-0419',
    insuranceCover: 'Govt Risk Coverage Guarantee',
    pledgeFinancing: 'Direct NABARD Warehouse Infrastructure Fund Linkage'
  }
];

export const MOCK_SUBSIDIES = [
  {
    id: 'sub-onion',
    name: 'Kanda Chawl (Onion Storage Structure) Subsidy',
    dept: 'Department of Agriculture & Horticulture, Maharashtra',
    portal: 'MahaDBT (mahadbt.maharashtra.gov.in)',
    rate: '₹1,500 per Metric Tonne (up to ₹75,000 for 50 MT unit)',
    status: 'Auto-Matched (Eligible via 7/12 Niphad land record)',
    benefitType: 'Direct Benefit Transfer (DBT) to Aadhaar Linked Bank A/C',
    documentsRequired: '7/12 Extract, 8-A Extract, Geotagged Photo, Caste Certificate if applicable'
  },
  {
    id: 'sub-cold',
    name: 'MSAMB Cold Storage Infrastructure Subsidy',
    dept: 'Maharashtra State Agricultural Marketing Board (MSAMB)',
    portal: 'MahaDBT / National Horticulture Mission',
    rate: 'Up to 25% of capital project cost (up to ₹50,00,000)',
    status: 'Eligible for FPO / Individual progressive growers',
    benefitType: 'Back-ended capital investment subsidy',
    documentsRequired: 'Detailed Project Report (DPR), Bank sanction letter, WDRA alignment plan'
  },
  {
    id: 'sub-nabard',
    name: 'Gramin Bhandaran Yojana & NABARD WIF Scheme',
    dept: 'NABARD & Ministry of Agriculture',
    portal: 'NABARD Rural Infrastructure Grid',
    rate: '33.33% subsidy for SC/ST and Women, 25% for General farmers',
    status: 'Active for Kharif/Rabi storage creation',
    benefitType: 'Credit-linked bank subsidy',
    documentsRequired: 'Approved building estimate, Village Patwari clearance'
  }
];

export const MOCK_GRIEVANCES = [
  {
    ticketId: 'GRV-2024-0419',
    txnId: 'ESC-MH-2024-99823101',
    farmer: 'Santosh Shinde',
    buyer: 'AgroFresh Supply Chain Ltd',
    category: 'Delayed Assayer Inward Certificate & Escrow Lock',
    description: 'Produce truck arrived at Lasalgaon hub at 09:30 AM. Mandi assayer report not uploaded within statutory 4-hour window under Maharashtra APMC Act Rule 24.',
    slaRemainingHours: '03h 12m',
    status: 'Under Review by APMC Officer',
    priority: 'HIGH (Statutory Sec 31-B)',
    escrowAmountLocked: '₹2,91,000.00',
    filedAt: 'Today, 08:30 AM IST'
  },
  {
    ticketId: 'GRV-2024-0392',
    txnId: 'ESC-MH-2024-94100234',
    farmer: 'Dnyaneshwar Gaikwad',
    buyer: 'Kisan Fresh Aggregators',
    category: 'Transit Weight Discrepancy (1.4% Loss)',
    description: 'Weighbridge calibrated variance of 140 kg on 100 Qtl lot. Disputed deduction of ₹3,400 from agreed payout.',
    slaRemainingHours: '19h 45m',
    status: 'Escalated to Mandi Arbitrator',
    priority: 'MEDIUM',
    escrowAmountLocked: '₹2,42,000.00',
    filedAt: 'Yesterday, 02:15 PM IST'
  }
];

export const MOCK_APMC_METRICS = {
  division: 'Nashik Division (5 Districts / 34 Mandis)',
  totalArrivalsToday: '84,200 MT',
  totalTurnoverToday: '₹34.20 Crore',
  activeTradersPresent: '1,420 Licensed Buyers',
  dealsSettledViaEscrow: '18,920 Deals (100% Guaranteed)',
  disputesApproachingSLA: 3,
  statutoryNotice: 'MAHARASHTRA APMC ACT SEC 31-B URGENT: 3 grievances approaching statutory 48h SLA deadline in Niphad & Malegaon jurisdictions. Automated buyer escrow holds enforced.'
};

export const MOCK_BUYER_RFQS = [
  {
    id: 'RFQ-2024-881',
    title: 'Garva Red Onion (Export Grade A)',
    commodity: 'Onion (Red / लाल कांदा)',
    targetQuantityMt: 200,
    targetPriceQtl: 2420,
    deliveryHub: 'Lasalgaon APMC Logistics Bay 4',
    deliveryDeadline: '12 Sept 2024',
    qualitySpecs: 'Diameter: 55mm+, Moisture: <11.5%, Zero rotting, 50kg aerated mesh bags',
    status: 'ACTIVE_BIDDING',
    bidsReceived: [
      { id: 'BID-F-1', bidderName: 'Santosh Shinde & Niphad Cluster', volumeQtl: 120, offeredPrice: 2425, moisture: '11.2%', status: 'UNDER_EVALUATION', time: '10 mins ago' },
      { id: 'BID-F-2', bidderName: 'Godavari Valley Onion FPC', volumeQtl: 500, offeredPrice: 2440, moisture: '10.8%', status: 'QUALIFIED', time: '1 hour ago' },
      { id: 'BID-F-3', bidderName: 'Pimpalgaon Growers Collective', volumeQtl: 250, offeredPrice: 2415, moisture: '11.4%', status: 'MATCHED', time: '3 hours ago' }
    ]
  },
  {
    id: 'RFQ-2024-904',
    title: 'Certified Yellow Soyabean (JS-335)',
    commodity: 'Soyabean (Yellow / पिवळी सोयाबीन)',
    targetQuantityMt: 150,
    targetPriceQtl: 4850,
    deliveryHub: 'Pimpalgaon Central Silo / Warehouse',
    deliveryDeadline: '15 Sept 2024',
    qualitySpecs: 'Oil content: >19.5%, Moisture: <10%, Foreign matter: <0.5%',
    status: 'ACTIVE_BIDDING',
    bidsReceived: [
      { id: 'BID-F-4', bidderName: 'Niphad Soyabean Seed Collective (Pool #08)', volumeQtl: 80, offeredPrice: 4850, moisture: '10.2%', status: 'MATCHED', time: 'Yesterday' },
      { id: 'BID-F-5', bidderName: 'Krishna Valley Oilseed Growers', volumeQtl: 300, offeredPrice: 4880, moisture: '9.8%', status: 'UNDER_EVALUATION', time: '2 days ago' }
    ]
  }
];

export const MOCK_FPOS = [
  {
    id: 'fpo-sahyadri',
    name: 'Sahyadri Farmer Producer Co. Ltd',
    region: 'Mohadi, Dindori (Nashik)',
    cropSpecialization: 'Export Red Onion, Grapes, Pomegranate',
    memberCount: '18,500 Farmers',
    totalAcreage: '32,000 Acres',
    certifications: ['GLOBAL G.A.P.', 'APMC Sec 29 Verified', 'ISO 22000'],
    rating: 4.95,
    fulfillmentRate: '99.4%',
    activeCapacity: '2,500 MT / Month',
    contactPerson: 'Vilas Shinde (Managing Director)',
    phone: '+91 253 280 4000',
    apmcReg: 'MH-NSK-FPO-1104',
    availableBatches: '3 Active Export Batches Ready for Inward'
  },
  {
    id: 'fpo-godavari',
    name: 'Godavari Valley Onion & Agro Producers Co.',
    region: 'Niphad & Lasalgaon Grid (Nashik)',
    cropSpecialization: 'Gavran Red Onion, Garlic, Green Chilly',
    memberCount: '4,200 Cultivators',
    totalAcreage: '8,400 Acres',
    certifications: ['MahaAgri e-KYC', 'APMC Cold Chain Assayed'],
    rating: 4.85,
    fulfillmentRate: '98.1%',
    activeCapacity: '1,200 MT / Month',
    contactPerson: 'Dattatray Bhor (FPO Secretary)',
    phone: '+91 98220 55102',
    apmcReg: 'MH-NSK-FPO-2091',
    availableBatches: 'Garva Summer Onion (11.0% Moisture) - 450 MT'
  },
  {
    id: 'fpo-krishna',
    name: 'Krishna River Basin Oilseeds Producer Co.',
    region: 'Latur & Ahmednagar Division',
    cropSpecialization: 'Yellow Soyabean JS-335, Chana, Tur Dal',
    memberCount: '3,800 Smallholders',
    totalAcreage: '6,500 Acres',
    certifications: ['NPOP Organic Certified', 'APMC Grade A'],
    rating: 4.78,
    fulfillmentRate: '97.6%',
    activeCapacity: '800 MT / Month',
    contactPerson: 'Kailas Patil (Procurement Head)',
    phone: '+91 94221 88390',
    apmcReg: 'MH-LTR-FPO-0842',
    availableBatches: 'High-Oil Soyabean JS-335 - 300 MT'
  }
];

