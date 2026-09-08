import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ShieldCheck, Users, ArrowRight, 
  Sparkles, CheckCircle2, TrendingUp, Building2, MapPin, Award, Database, Package,
  Truck, Clock, Camera, AlertTriangle, Info, DollarSign, Star, Phone, ExternalLink,
  FileText, Layers, Scale, X, ChevronRight, Eye, FileCheck, Check, Briefcase,
  Calendar, SlidersHorizontal, Grid, List, RefreshCw, MessageSquare, Sprout,
  Send, UserCheck, Heart, MessageCircle, PlusCircle, Store, CreditCard, Download, History,
  QrCode, Copy, Printer, RotateCcw, Globe, Lock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAgri } from '../context/AgriContext';
import { MOCK_BUYER_RFQS, MOCK_FPOS } from '../data/mockData';
import RazorpayQrPaymentModal from '../components/RazorpayQrPaymentModal';
import api from '../services/api';

export default function Step07Marketplace({ setStep, setTerminal, buyerTab = 'lots', setBuyerTab }) {
  const { 
    lots, buyers, deals, deliveryJobs, mandiPools, 
    confirmDeliveryReceived, placePoolBid, addToast,
    initiateBuyDirectPayment,
    LOT_STAGES,
    completeBuyerPurchase,
    confirmTransportSelection,
    approveDeliveryReleaseWorkflow,
    rejectDeliveryReturnWorkflow,
    manuallyVerifiedLots,
    authUser,
    buyerApplications,
    approveBuyerApp,
    switchRole
  } = useAgri();

  // Buyer KYC & APMC Regulatory Verification Check
  const currentBuyerApp = (buyerApplications || []).find(b => 
    b.id === authUser?.user?.id || 
    b.id === authUser?.user?.application_id || 
    (b.firm_name && b.firm_name.toLowerCase() === (authUser?.user?.name || '').toLowerCase()) ||
    (b.company_name && b.company_name.toLowerCase() === (authUser?.user?.name || '').toLowerCase()) ||
    (b.email && b.email.toLowerCase() === (authUser?.user?.email || '').toLowerCase()) ||
    (b.apmc_license_no && b.apmc_license_no === authUser?.user?.licenseNo)
  );

  const isBuyerVerified = authUser?.role !== 'buyer' ? true : (
    currentBuyerApp ? currentBuyerApp.status === 'Approved' : (authUser?.user?.is_verified === true)
  );

  const [showKycLockModal, setShowKycLockModal] = useState(false);
  const [kycLockTargetLot, setKycLockTargetLot] = useState(null);

  // Active View Tab: 'lots' | 'directory' | 'negotiations' | 'pickups' | 'ratings' | 'rfqs'
  const [internalTab, setInternalTab] = useState(buyerTab || 'lots');

  useEffect(() => {
    if (buyerTab) {
      setInternalTab(buyerTab);
    }
  }, [buyerTab]);

  const currentTab = internalTab;
  const handleTabChange = (tab) => {
    setInternalTab(tab);
    if (setBuyerTab) setBuyerTab(tab);
  };

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [villageFilter, setVillageFilter] = useState('all');

  // Modals state
  const [selectedLotForPO, setSelectedLotForPO] = useState(null);
  const [selectedLotForAssay, setSelectedLotForAssay] = useState(null);
  const [showNewRfqModal, setShowNewRfqModal] = useState(false);

  // PO Form State
  const [poQty, setPoQty] = useState(120);
  const [poPrice, setPoPrice] = useState(2425);
  const [selectedEscrowBank, setSelectedEscrowBank] = useState('sbi');
  const [isSubmittingPO, setIsSubmittingPO] = useState(false);
  const [poPaymentTab, setPoPaymentTab] = useState('qr'); // 'qr' | 'card'
  const [copiedUpiVpa, setCopiedUpiVpa] = useState(false);
  const [quickQrLot, setQuickQrLot] = useState(null);

  // Order History Portal State
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED' | 'RETURNED'
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);

  // RFQ Form State
  const [rfqsList, setRfqsList] = useState(MOCK_BUYER_RFQS);
  const [newRfqCommodity, setNewRfqCommodity] = useState('Onion (Red / लाल कांदा)');
  const [newRfqQty, setNewRfqQty] = useState(250);
  const [newRfqPrice, setNewRfqPrice] = useState(2450);
  const [newRfqHub, setNewRfqHub] = useState('Pimpalgaon Baswant Farmgate Cluster');
  const [newRfqDeadline, setNewRfqDeadline] = useState('14 Sept 2024');
  const [newRfqSpecs, setNewRfqSpecs] = useState('Diameter: 55mm+, Moisture: <11.5%, Zero rotting, 50kg aerated mesh bags');

  // Enriched direct spot lots list highlighting human farmer identity
  const baseLotsList = [
    // --- ONION LOTS ---
    {
      id: 1,
      lot_code: 'MH-NSK-2024-LOT-0941',
      commodity_id: 'onion',
      crop_name: 'Onion (Garva Red / लाल कांदा)',
      variety: 'Gavran High Pungency',
      farmer_name: 'Santosh Shinde',
      farmer_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      village: 'Pimpalgaon Baswant',
      origin: 'Gut 142/B, Pimpalgaon Baswant, Niphad',
      farm_size: '4.5 Acres',
      farmer_rating: 4.9,
      reviews_count: 42,
      phone: '+91 98224 81920',
      quantity_qtl: 120,
      quantity_mt: 12.0,
      asking_price: 2425,
      agmarknet_modal: 2380,
      spread_pct: '+1.9%',
      grade: 'Grade A',
      moisture_pct: 11.2,
      size_caliber: '58 mm (Uniform)',
      defect_pct: 1.2,
      nir_score: 94.6,
      packaging: '50kg Aerated Mesh Sacks',
      certificate_no: 'MH-QG-2024-9104',
      harvest_date: '3 Sept 2024'
    },
    {
      id: 101,
      lot_code: 'MH-NSK-2024-LOT-0962',
      commodity_id: 'onion',
      crop_name: 'Onion (Nashik Export Red)',
      variety: 'Bhima Super Export',
      farmer_name: 'Ganesh More',
      farmer_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      village: 'Dindori',
      origin: 'Dindori Horticultural Belt',
      farm_size: '6.0 Acres',
      farmer_rating: 4.8,
      reviews_count: 36,
      phone: '+91 98223 90123',
      quantity_qtl: 220,
      quantity_mt: 22.0,
      asking_price: 2480,
      agmarknet_modal: 2380,
      spread_pct: '+4.2%',
      grade: 'Grade A',
      moisture_pct: 10.8,
      size_caliber: '60 mm Export Cut',
      defect_pct: 0.9,
      nir_score: 96.0,
      packaging: '25kg Poly Mesh Bags',
      certificate_no: 'MH-QG-2024-9188',
      harvest_date: '4 Sept 2024'
    },
    {
      id: 5,
      lot_code: 'MH-NSK-2024-LOT-0955',
      commodity_id: 'onion',
      crop_name: 'Onion (Red Gavran)',
      variety: 'Commercial Garva',
      farmer_name: 'Prakash Wagh',
      farmer_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      village: 'Lasalgaon',
      origin: 'Lasalgaon East Agricultural Belt',
      farm_size: '3.8 Acres',
      farmer_rating: 4.7,
      reviews_count: 29,
      phone: '+91 98221 44510',
      quantity_qtl: 180,
      quantity_mt: 18.0,
      asking_price: 2390,
      agmarknet_modal: 2380,
      spread_pct: '+0.4%',
      grade: 'Grade B FAQ',
      moisture_pct: 12.0,
      size_caliber: '45-55 mm Medium',
      defect_pct: 2.1,
      nir_score: 89.2,
      packaging: '50kg Aerated Mesh Sacks',
      certificate_no: 'MH-QG-2024-9551',
      harvest_date: '2 Sept 2024'
    },
    {
      id: 102,
      lot_code: 'MH-NSK-2024-LOT-0970',
      commodity_id: 'onion',
      crop_name: 'Onion (White Onion / पांढरा कांदा)',
      variety: 'Phule Safed High Dehydration',
      farmer_name: 'Kailas Borse',
      farmer_photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      village: 'Malegaon',
      origin: 'Malegaon Onion Belt',
      farm_size: '5.2 Acres',
      farmer_rating: 4.9,
      reviews_count: 51,
      phone: '+91 98220 78219',
      quantity_qtl: 140,
      quantity_mt: 14.0,
      asking_price: 2250,
      agmarknet_modal: 2200,
      spread_pct: '+2.3%',
      grade: 'Grade B FAQ',
      moisture_pct: 12.4,
      size_caliber: '48 mm Medium',
      defect_pct: 2.4,
      nir_score: 88.5,
      packaging: '50kg Aerated Sacks',
      certificate_no: 'MH-QG-2024-9572',
      harvest_date: '1 Sept 2024'
    },

    // --- SOYABEAN LOTS ---
    {
      id: 2,
      lot_code: 'MH-NSK-2024-LOT-0948',
      commodity_id: 'soyabean',
      crop_name: 'Soyabean (Yellow Seed / सोयाबीन)',
      variety: 'JS-335 Certified Seed',
      farmer_name: 'Dnyaneshwar Gaikwad',
      farmer_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      village: 'Niphad',
      origin: 'Niphad Green Valley',
      farm_size: '4.8 Acres',
      farmer_rating: 5.0,
      reviews_count: 47,
      phone: '+91 98228 34120',
      quantity_qtl: 150,
      quantity_mt: 15.0,
      asking_price: 4850,
      agmarknet_modal: 4790,
      spread_pct: '+1.2%',
      grade: 'Grade A',
      moisture_pct: 10.4,
      size_caliber: '6.5 mm Seed',
      defect_pct: 0.8,
      nir_score: 96.2,
      packaging: 'Standard Jute Gunny Bags',
      certificate_no: 'MH-QG-2024-9402',
      harvest_date: '1 Sept 2024'
    },
    {
      id: 103,
      lot_code: 'MH-LUR-2024-LOT-1102',
      commodity_id: 'soyabean',
      crop_name: 'Soyabean (High Protein Gold)',
      variety: 'JS-9560 Elite',
      farmer_name: 'Mahadev Jadhav',
      farmer_photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      village: 'Latur',
      origin: 'Latur Oilseed Cluster',
      farm_size: '7.5 Acres',
      farmer_rating: 4.8,
      reviews_count: 33,
      phone: '+91 98225 11902',
      quantity_qtl: 200,
      quantity_mt: 20.0,
      asking_price: 4920,
      agmarknet_modal: 4850,
      spread_pct: '+1.4%',
      grade: 'Grade A',
      moisture_pct: 9.8,
      size_caliber: '6.8 mm Bold',
      defect_pct: 0.6,
      nir_score: 97.5,
      packaging: '50kg High-Density Polypropylene',
      certificate_no: 'MH-QG-2024-9421',
      harvest_date: '3 Sept 2024'
    },
    {
      id: 104,
      lot_code: 'MH-AMR-2024-LOT-1115',
      commodity_id: 'soyabean',
      crop_name: 'Soyabean (Commercial Milling / FAQ)',
      variety: 'Phule Kalyani Commercial',
      farmer_name: 'Sunil Deshmukh',
      farmer_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      village: 'Amravati',
      origin: 'Amravati Agro Belt',
      farm_size: '5.0 Acres',
      farmer_rating: 4.7,
      reviews_count: 22,
      phone: '+91 98227 66144',
      quantity_qtl: 175,
      quantity_mt: 17.5,
      asking_price: 4680,
      agmarknet_modal: 4650,
      spread_pct: '+0.6%',
      grade: 'Grade B FAQ',
      moisture_pct: 11.6,
      size_caliber: '5.8 mm Regular',
      defect_pct: 1.9,
      nir_score: 90.1,
      packaging: 'Standard Jute Bags',
      certificate_no: 'MH-QG-2024-9440',
      harvest_date: '2 Sept 2024'
    },
    {
      id: 105,
      lot_code: 'MH-JAL-2024-LOT-1124',
      commodity_id: 'soyabean',
      crop_name: 'Soyabean (Yellow Standard)',
      variety: 'JS-335 Commercial',
      farmer_name: 'Babanrao Shinde',
      farmer_photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      village: 'Jalna',
      origin: 'Jalna Agro Cluster',
      farm_size: '4.2 Acres',
      farmer_rating: 4.8,
      reviews_count: 26,
      phone: '+91 98229 88310',
      quantity_qtl: 130,
      quantity_mt: 13.0,
      asking_price: 4620,
      agmarknet_modal: 4600,
      spread_pct: '+0.4%',
      grade: 'Grade B FAQ',
      moisture_pct: 11.8,
      size_caliber: '5.6 mm Regular',
      defect_pct: 2.2,
      nir_score: 88.8,
      packaging: '50kg Jute Gunny Bags',
      certificate_no: 'MH-QG-2024-9462',
      harvest_date: '31 Aug 2024'
    },

    // --- COTTON LOTS ---
    {
      id: 3,
      lot_code: 'MH-AKL-2024-LOT-0812',
      commodity_id: 'cotton',
      crop_name: 'Cotton (Medium Staple / कापूस)',
      variety: 'BT Hybrid White Gold',
      farmer_name: 'Balasaheb Jagtap',
      farmer_photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      village: 'Yeola',
      origin: 'Yeola Farmstead',
      farm_size: '5.5 Acres',
      farmer_rating: 4.9,
      reviews_count: 45,
      phone: '+91 98222 71092',
      quantity_qtl: 200,
      quantity_mt: 20.0,
      asking_price: 7420,
      agmarknet_modal: 7380,
      spread_pct: '+0.5%',
      grade: 'Grade A',
      moisture_pct: 8.5,
      size_caliber: '29 mm Staple',
      defect_pct: 1.0,
      nir_score: 92.8,
      packaging: 'Compressed Standard Bales',
      certificate_no: 'MH-QG-2024-8819',
      harvest_date: '28 Aug 2024'
    },
    {
      id: 106,
      lot_code: 'MH-YVT-2024-LOT-0834',
      commodity_id: 'cotton',
      crop_name: 'Cotton (Export Long Staple)',
      variety: 'DCH-32 Premium Hybrid',
      farmer_name: 'Nitin Rathod',
      farmer_photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
      village: 'Yavatmal',
      origin: 'Yavatmal White Gold Valley',
      farm_size: '8.0 Acres',
      farmer_rating: 5.0,
      reviews_count: 58,
      phone: '+91 98226 55019',
      quantity_qtl: 160,
      quantity_mt: 16.0,
      asking_price: 7650,
      agmarknet_modal: 7500,
      spread_pct: '+2.0%',
      grade: 'Grade A',
      moisture_pct: 8.2,
      size_caliber: '32 mm Long Staple',
      defect_pct: 0.7,
      nir_score: 95.4,
      packaging: 'Export Pressed Bales',
      certificate_no: 'MH-QG-2024-8835',
      harvest_date: '1 Sept 2024'
    },

    // --- POMEGRANATE LOTS ---
    {
      id: 4,
      lot_code: 'MH-SOL-2024-LOT-0711',
      commodity_id: 'pomegranate',
      crop_name: 'Pomegranate (Bhagwa / डाळिंब)',
      variety: 'Bhagwa Export Grade',
      farmer_name: 'Ananda Bhor',
      farmer_photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      village: 'Ranwad',
      origin: 'Ranwad Horticulture Orchard',
      farm_size: '3.5 Acres',
      farmer_rating: 4.9,
      reviews_count: 62,
      phone: '+91 98224 33819',
      quantity_qtl: 80,
      quantity_mt: 8.0,
      asking_price: 9250,
      agmarknet_modal: 9100,
      spread_pct: '+1.6%',
      grade: 'Grade A',
      moisture_pct: 14.1,
      size_caliber: '280-320g Fruit',
      defect_pct: 0.5,
      nir_score: 97.4,
      packaging: 'Corrugated 4kg Export Cartons',
      certificate_no: 'MH-QG-2024-7714',
      harvest_date: '4 Sept 2024'
    },
    {
      id: 108,
      lot_code: 'MH-SOL-2024-LOT-0735',
      commodity_id: 'pomegranate',
      crop_name: 'Pomegranate (Super Bhagwa Ruby)',
      variety: 'Export Select 350g+',
      farmer_name: 'Pandurang Mane',
      farmer_photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
      village: 'Sangola',
      origin: 'Sangola Pomegranate Belt',
      farm_size: '7.0 Acres',
      farmer_rating: 5.0,
      reviews_count: 48,
      phone: '+91 98221 99042',
      quantity_qtl: 65,
      quantity_mt: 6.5,
      asking_price: 9800,
      agmarknet_modal: 9400,
      spread_pct: '+4.2%',
      grade: 'Grade A',
      moisture_pct: 13.8,
      size_caliber: '340-380g Jumbo',
      defect_pct: 0.3,
      nir_score: 98.6,
      packaging: 'Foam Net Export Trays',
      certificate_no: 'MH-QG-2024-7738',
      harvest_date: '3 Sept 2024'
    },

    // --- WHEAT LOTS ---
    {
      id: 110,
      lot_code: 'MH-AUR-2024-LOT-0610',
      commodity_id: 'wheat',
      crop_name: 'Wheat (Sharbati Golden Premium / गहू)',
      variety: 'MP Sharbati Certified A-1',
      farmer_name: 'Raosaheb Kale',
      farmer_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      village: 'Aurangabad',
      origin: 'Aurangabad Green Grain Farm',
      farm_size: '9.5 Acres',
      farmer_rating: 4.8,
      reviews_count: 39,
      phone: '+91 98229 44102',
      quantity_qtl: 160,
      quantity_mt: 16.0,
      asking_price: 3150,
      agmarknet_modal: 3080,
      spread_pct: '+2.3%',
      grade: 'Grade A',
      moisture_pct: 10.1,
      size_caliber: 'Heavy Lustrous Grain',
      defect_pct: 0.6,
      nir_score: 96.8,
      packaging: '50kg HDPE Poly Sacks',
      certificate_no: 'MH-QG-2024-6610',
      harvest_date: '1 Sept 2024'
    },
    {
      id: 111,
      lot_code: 'MH-PUN-2024-LOT-0622',
      commodity_id: 'wheat',
      crop_name: 'Wheat (Lokwan Milling FAQ)',
      variety: 'Lokwan High Gluten',
      farmer_name: 'Sambhaji Shirole',
      farmer_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      village: 'Shirur',
      origin: 'Shirur River Farm',
      farm_size: '6.5 Acres',
      farmer_rating: 4.7,
      reviews_count: 31,
      phone: '+91 98228 11990',
      quantity_qtl: 210,
      quantity_mt: 21.0,
      asking_price: 2850,
      agmarknet_modal: 2820,
      spread_pct: '+1.1%',
      grade: 'Grade B FAQ',
      moisture_pct: 11.2,
      size_caliber: 'Medium Amber Grain',
      defect_pct: 1.8,
      nir_score: 89.4,
      packaging: '50kg Jute Gunny Bags',
      certificate_no: 'MH-QG-2024-6625',
      harvest_date: '31 Aug 2024'
    },

    // --- TOMATO LOTS ---
    {
      id: 112,
      lot_code: 'MH-NSK-2024-LOT-0518',
      commodity_id: 'tomato',
      crop_name: 'Tomato (Abhinav Hybrid Red / टोमॅटो)',
      variety: 'Abhinav Greenhouse Firm',
      farmer_name: 'Tukaram Darekar',
      farmer_photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      village: 'Pimpalgaon Baswant',
      origin: 'Girna Valley Greenhouse',
      farm_size: '2.8 Acres',
      farmer_rating: 4.9,
      reviews_count: 44,
      phone: '+91 98223 88120',
      quantity_qtl: 110,
      quantity_mt: 11.0,
      asking_price: 1950,
      agmarknet_modal: 1900,
      spread_pct: '+2.6%',
      grade: 'Grade A',
      moisture_pct: 91.5,
      size_caliber: '60-70 mm Firm Round',
      defect_pct: 0.8,
      nir_score: 95.2,
      packaging: '25kg Perforated Plastic Crates',
      certificate_no: 'MH-QG-2024-5518',
      harvest_date: '4 Sept 2024'
    },
    {
      id: 113,
      lot_code: 'MH-PUN-2024-LOT-0529',
      commodity_id: 'tomato',
      crop_name: 'Tomato (Commercial Red Ripe)',
      variety: 'Shiva Hybrid Commercial',
      farmer_name: 'Sopan Gite',
      farmer_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      village: 'Narayangaon',
      origin: 'Narayangaon Tomato Belt',
      farm_size: '3.4 Acres',
      farmer_rating: 4.8,
      reviews_count: 37,
      phone: '+91 98227 44192',
      quantity_qtl: 150,
      quantity_mt: 15.0,
      asking_price: 1650,
      agmarknet_modal: 1620,
      spread_pct: '+1.8%',
      grade: 'Grade B FAQ',
      moisture_pct: 92.4,
      size_caliber: '50-60 mm Medium',
      defect_pct: 2.4,
      nir_score: 88.0,
      packaging: '25kg Plastic Crates',
      certificate_no: 'MH-QG-2024-5530',
      harvest_date: '3 Sept 2024'
    }
  ];

  // Helper function to normalize crop names and aliases
  const normalizeCrop = (str = '') => {
    const s = String(str).toLowerCase();
    if (s.includes('soya') || s.includes('soybean') || s.includes('सोयाबीन') || s.includes('js-335') || s.includes('js-9560')) return 'soyabean';
    if (s.includes('onion') || s.includes('kanda') || s.includes('कांदा') || s.includes('garva') || s.includes('gavran')) return 'onion';
    if (s.includes('cotton') || s.includes('kapas') || s.includes('कापूस') || s.includes('staple')) return 'cotton';
    if (s.includes('pomegranate') || s.includes('anar') || s.includes('डाळिंब') || s.includes('bhagwa') || s.includes('arakta')) return 'pomegranate';
    if (s.includes('wheat') || s.includes('gehu') || s.includes('गहू') || s.includes('sharbati') || s.includes('lokwan')) return 'wheat';
    if (s.includes('tomato') || s.includes('tamatar') || s.includes('टोमॅटो') || s.includes('abhinav')) return 'tomato';
    return s;
  };

  // Helper to cross-reference Field Agent verification data (> 3 stars)
  const resolveVerification = (item) => {
    const v = (manuallyVerifiedLots && (manuallyVerifiedLots[item.lot_code] || manuallyVerifiedLots[item.id])) || null;
    const isManuallyVerified = Boolean(
      v?.manually_verified || 
      item.manually_verified || 
      item.is_manually_verified || 
      (Number(item.field_agent_rating) > 3)
    );
    const rating = v?.rating || item.field_agent_rating || (isManuallyVerified ? 5 : null);
    const isExportable = v ? v.is_exportable : (item.is_exportable !== undefined ? item.is_exportable : true);
    const assayerPhoto = v?.photo_url || item.assayer_photo || null;
    const assayerName = v?.assayer_name || item.assayed_by || 'Sachin B. Kadam (Krishi Sahayak)';
    const assayedAt = v?.assayed_at || item.assayed_at || 'Recently Verified';
    return {
      manually_verified: isManuallyVerified,
      is_manually_verified: isManuallyVerified,
      field_agent_rating: rating,
      is_exportable: isExportable,
      assayer_photo: assayerPhoto,
      assayed_by: assayerName,
      assayed_at: assayedAt
    };
  };

  // Merge lots from AgriContext if user added new lots, deduplicating identical repeated lots
  const displayLots = [...lots.map((l, idx) => {
    const verifiedData = resolveVerification(l);
    return {
      id: l.id || `custom-${idx}`,
      lot_code: l.lot_code || `MH-LOT-${1000 + idx}`,
      commodity_id: l.commodity_id || (l.crop_name ? l.crop_name.toLowerCase() : 'onion'),
      crop_name: l.crop_name || 'Onion (Red / लाल कांदा)',
      variety: l.variety || 'Gavran Hybrid',
      farmer_name: l.farmer_name || 'Santosh Shinde',
      farmer_photo: l.farmer_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      village: l.village || 'Pimpalgaon Baswant',
      origin: l.origin || l.gut_no || 'Gut 142/B, Pimpalgaon',
      farm_size: l.farm_size || '4.5 Acres',
      farmer_rating: l.farmer_rating || 4.9,
      reviews_count: l.reviews_count || 42,
      phone: l.phone || '+91 98224 81920',
      quantity_qtl: Number(l.quantity_qtl) || 120,
      quantity_mt: ((Number(l.quantity_qtl) || 120) / 10).toFixed(1),
      asking_price: Number(l.asking_price) || 2450,
      agmarknet_modal: Number(l.agmarknet_modal) || 2380,
      spread_pct: l.spread_pct || '+1.5%',
      grade: l.grade || 'Grade A',
      moisture_pct: Number(l.moisture_pct) || 11.2,
      size_caliber: l.size_caliber || '58 mm',
      defect_pct: Number(l.defect_pct) || 1.2,
      nir_score: Number(l.nir_score) || 94.6,
      packaging: l.packaging || '50kg Aerated Mesh Sacks',
      certificate_no: l.certificate_no || `MH-QG-2024-${9104 + idx}`,
      harvest_date: l.harvest_date || 'Today',
      status: l.status || LOT_STAGES?.LISTED_MARKETPLACE || 'LISTED_MARKETPLACE',
      ...verifiedData
    };
  }), ...baseLotsList.map(b => {
    const verifiedData = resolveVerification(b);
    return {
      ...b,
      status: b.status || LOT_STAGES?.LISTED_MARKETPLACE || 'LISTED_MARKETPLACE',
      ...verifiedData
    };
  })].filter((v, i, a) => 
    a.findIndex(t => 
      t.lot_code === v.lot_code || 
      (t.farmer_name === v.farmer_name && t.quantity_qtl === v.quantity_qtl && normalizeCrop(t.crop_name) === normalizeCrop(v.crop_name) && Math.abs(t.asking_price - v.asking_price) < 50)
    ) === i
  );

  // Filtered Lots with Farmer Location/Village Search
  const filteredLots = displayLots.filter(lot => {
    // Step 3 Requirement: Buyer sees the lot in Buyer Portal listings (only if status is LISTED_MARKETPLACE)
    const marketplaceStatus = LOT_STAGES?.LISTED_MARKETPLACE || 'LISTED_MARKETPLACE';
    if (lot.status && lot.status !== marketplaceStatus) {
      return false;
    }

    // 1. Keyword search (farmer name, village, location, crop, variety, farm size)
    const q = String(searchTerm || '').trim().toLowerCase();
    const matchesSearch = !q || [
      lot.farmer_name,
      lot.village,
      lot.origin,
      lot.farm_size,
      lot.crop_name,
      lot.variety,
      lot.grade,
      lot.packaging,
      lot.lot_code
    ].some(field => field && String(field).toLowerCase().includes(q));

    // 2. Crop / Commodity filter
    const matchesCommodity = 
      commodityFilter === 'all' || 
      normalizeCrop(lot.crop_name) === commodityFilter ||
      normalizeCrop(lot.commodity_id) === commodityFilter ||
      (lot.crop_name && lot.crop_name.toLowerCase().includes(commodityFilter.toLowerCase())) ||
      (lot.variety && lot.variety.toLowerCase().includes(commodityFilter.toLowerCase()));

    // 3. Grade filter
    const matchesGrade = 
      gradeFilter === 'all' || (() => {
        const lotGrade = String(lot.grade || '').toLowerCase();
        const filter = String(gradeFilter).toLowerCase();
        if (filter === 'grade a') {
          return lotGrade.includes('grade a') || lotGrade === 'a' || lotGrade.includes('grade-a') || lotGrade.includes('export');
        }
        if (filter === 'grade b') {
          return lotGrade.includes('grade b') || lotGrade === 'b' || lotGrade.includes('grade-b') || lotGrade.includes('faq') || lotGrade.includes('commercial');
        }
        return lotGrade.includes(filter);
      })();

    // 4. Village / Location filter
    const matchesVillage = 
      villageFilter === 'all' ||
      (lot.village && lot.village.toLowerCase().includes(villageFilter.toLowerCase())) ||
      (lot.origin && lot.origin.toLowerCase().includes(villageFilter.toLowerCase()));

    return matchesSearch && matchesCommodity && matchesGrade && matchesVillage;
  });

  // Open Direct Chat Drawer / Modal
  const handleOpenChat = (lotOrFarmer) => {
    const farmerName = lotOrFarmer.farmer_name || lotOrFarmer.name || 'Santosh Shinde';
    setSelectedFarmerForChat(lotOrFarmer);
    setActiveNegotiationFarmer(farmerName);
    if (lotOrFarmer.asking_price) {
      setCounterOfferRate(lotOrFarmer.asking_price - 25);
    }
  };

  // Send Direct Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg = { sender: 'buyer', text: chatInputText, time: 'Just now' };
    const currentMsgs = chatThreads[activeNegotiationFarmer] || [];
    const updated = [...currentMsgs, newMsg];
    
    setChatThreads({
      ...chatThreads,
      [activeNegotiationFarmer]: updated
    });
    setChatInputText('');

    // Simulated Farmer Reply after 700ms
    setTimeout(() => {
      const replies = [
        `Thank you! I can hold this lot for your pickup. Let me know when your transport reaches ${selectedFarmerForChat?.village || 'the village'}.`,
        `Deal agreed! I will keep the 50kg bags weighed and ready at my farmgate. Looking forward to instant escrow release.`,
        `Understood! My farm is right off the main road in ${selectedFarmerForChat?.village || 'Niphad'}. Easy access for 6-wheel trucks.`
      ];
      const replyMsg = { 
        sender: 'farmer', 
        text: replies[Math.floor(Math.random() * replies.length)], 
        time: 'Just now' 
      };
      setChatThreads(prev => ({
        ...prev,
        [activeNegotiationFarmer]: [...(prev[activeNegotiationFarmer] || updated), replyMsg]
      }));
    }, 700);
  };

  // Propose Counter-Offer Rate
  const handleSendCounterOffer = () => {
    const newMsg = { 
      sender: 'buyer', 
      text: `🤝 Proposed Counter-Offer: ₹${counterOfferRate.toLocaleString('en-IN')}/Qtl for direct purchase with instant escrow lock.`, 
      time: 'Just now' 
    };
    const currentMsgs = chatThreads[activeNegotiationFarmer] || [];
    setChatThreads({
      ...chatThreads,
      [activeNegotiationFarmer]: [...currentMsgs, newMsg]
    });

    addToast({
      type: 'success',
      title: `Counter-Offer Sent: ₹${counterOfferRate}/Qtl`,
      message: `Proposal submitted directly to ${activeNegotiationFarmer}.`
    });

    setTimeout(() => {
      const replyMsg = { 
        sender: 'farmer', 
        text: `I accept ₹${counterOfferRate}/Qtl! Please proceed with locking the escrow PO so we can schedule farmgate loading.`, 
        time: 'Just now' 
      };
      setChatThreads(prev => ({
        ...prev,
        [activeNegotiationFarmer]: [...(prev[activeNegotiationFarmer] || []), replyMsg]
      }));
    }, 800);
  };

  // Open PO Drawer / Modal
  const handleOpenPOModal = (lot) => {
    if (!isBuyerVerified) {
      setKycLockTargetLot(lot);
      setShowKycLockModal(true);
      return;
    }
    setSelectedLotForPO(lot);
    setPoQty(lot.quantity_qtl);
    setPoPrice(lot.asking_price);
  };

  // Trigger Quick UPI QR Deposit
  const handleQuickQrClick = (lot) => {
    if (!isBuyerVerified) {
      setKycLockTargetLot(lot);
      setShowKycLockModal(true);
      return;
    }
    setQuickQrLot(lot);
  };

  // Submit PO & Trigger Razorpay Escrow Checkout
  const handleConfirmPO = async (e) => {
    e.preventDefault();
    if (!selectedLotForPO) return;
    setIsSubmittingPO(true);

    const freightAmount = Math.round(poQty * 70);

    try {
      await initiateBuyDirectPayment({
        lot: {
          ...selectedLotForPO,
          quantity_qtl: poQty,
          asking_price: poPrice
        },
        agreedPrice: poPrice,
        transportAmount: freightAmount,
        buyerInfo: {
          id: 'agrofresh',
          name: 'AgroFresh Supply Chain Pvt Ltd'
        },
        onSuccess: (deal) => {
          completeBuyerPurchase(selectedLotForPO.id, {
            quantity_qtl: poQty,
            agreed_price: poPrice,
            transport_amount: freightAmount,
            buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
            deal_ref: deal?.deal_ref
          });
          setIsSubmittingPO(false);
          setSelectedLotForPO(null);
          setStep(17); // Automatically routed to existing Transportation & Fleets tab
        },
        onError: (err) => {
          setIsSubmittingPO(false);
        }
      });
    } catch (err) {
      setIsSubmittingPO(false);
    }
  };

  const handleCopyUpiVpa = (vpa = 'agriconnect.escrow@sbi') => {
    navigator.clipboard.writeText(vpa);
    setCopiedUpiVpa(true);
    setTimeout(() => setCopiedUpiVpa(false), 2000);
  };

  // Submit PO via Instant UPI QR Scan
  const handleConfirmUpiQRPayment = async () => {
    if (!selectedLotForPO) return;
    setIsSubmittingPO(true);

    const freightAmount = Math.round(poQty * 70);
    const prodAmt = Math.round(poQty * poPrice);
    const totalAmt = prodAmt + freightAmount;

    try {
      // 1. Create order on backend
      const orderRes = await api.createPaymentOrder({
        lot_id: selectedLotForPO.id,
        lot_code: selectedLotForPO.lot_code || `AC-${selectedLotForPO.id || '892'}`,
        product_amount: prodAmt,
        transport_amount: freightAmount,
        agreed_price: poPrice,
        quantity_qtl: poQty,
        crop_summary: `Lot #${selectedLotForPO.lot_code || 'AC-892'} (${poQty} Qtl ${selectedLotForPO.crop_name})`,
        buyer_id: 'agrofresh',
        buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
        farmer_id: selectedLotForPO.farmer_id || 1,
        farmer_name: selectedLotForPO.farmer_name || 'Santosh Shinde',
        transporter_id: 1,
        driver_name: 'Rajesh Patil'
      });

      // 2. Capture payment in escrow
      const simPaymentId = `pay_qr_${Date.now()}`;
      await api.verifyPaymentAndHold({
        order_id: orderRes.order?.orderId || `order_${Date.now()}`,
        payment_id: simPaymentId,
        signature: 'simulated_upi_qr_sig',
        deal_ref: orderRes.dealRef
      });

      completeBuyerPurchase(selectedLotForPO.id, {
        quantity_qtl: poQty,
        agreed_price: poPrice,
        transport_amount: freightAmount,
        buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
        deal_ref: orderRes?.dealRef,
        payment_id: simPaymentId
      });

      addToast({
        type: 'success',
        title: 'UPI Escrow Deposit Locked!',
        message: `₹${totalAmt.toLocaleString('en-IN')} locked safely in SBI Vault under APMC Rule 24. Routing to Transportation & Fleets.`
      });

      setIsSubmittingPO(false);
      setSelectedLotForPO(null);
      setStep(17); // Automatically routed to existing Transportation & Fleets tab
    } catch (err) {
      console.error(err);
      setIsSubmittingPO(false);
      addToast({
        type: 'error',
        title: 'Payment Verification Error',
        message: err.message || 'Failed to lock escrow'
      });
    }
  };

  // Submit New Direct Sourcing Requirement
  const handleCreateRfq = (e) => {
    e.preventDefault();
    const newRfq = {
      id: `DIR-REQ-${Math.floor(100 + Math.random() * 900)}`,
      title: `${newRfqCommodity} (${newRfqQty} MT)`,
      commodity: newRfqCommodity,
      targetQuantityMt: Number(newRfqQty),
      targetPriceQtl: Number(newRfqPrice),
      deliveryHub: newRfqHub,
      deliveryDeadline: newRfqDeadline,
      qualitySpecs: newRfqSpecs,
      status: 'ACTIVE_SOURCING',
      bidsReceived: []
    };

    setRfqsList([newRfq, ...rfqsList]);
    setShowNewRfqModal(false);
    addToast({
      type: 'success',
      title: `Direct Sourcing Requirement Published`,
      message: `Broadcasted directly to 148 verified farmers across Maharashtra.`
    });
  };

  // Farmer Directory Data
  const farmerDirectoryList = [
    {
      id: 1,
      name: 'Santosh Shinde',
      village: 'Pimpalgaon Baswant',
      district: 'Nashik',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      farm_size: '4.5 Acres Cultivated',
      primary_crops: 'Red Onion (Garva), Soybean, Tomato',
      phone: '+91 98224 81920',
      rating: 4.9,
      reviews_count: 42,
      deals_completed: 34,
      on_time_rate: '100%',
      bio: 'Third-generation horticulturist in Pimpalgaon. Equipped with drip irrigation, aerated onion curing sheds, and certified soil testing.'
    },
    {
      id: 2,
      name: 'Dnyaneshwar Gaikwad',
      village: 'Niphad',
      district: 'Nashik',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      farm_size: '4.8 Acres Irrigated',
      primary_crops: 'JS-335 Soyabean, Garlic, Wheat',
      phone: '+91 98228 34120',
      rating: 5.0,
      reviews_count: 47,
      deals_completed: 41,
      on_time_rate: '98%',
      bio: 'Specialist in organic-certified high protein oilseeds and Lokwan wheat varieties with certified seed certification.'
    },
    {
      id: 3,
      name: 'Ananda Bhor',
      village: 'Ranwad',
      district: 'Nashik',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      farm_size: '3.5 Acres Orchard',
      primary_crops: 'Bhagwa Pomegranate, Export Table Grapes',
      phone: '+91 98224 33819',
      rating: 4.9,
      reviews_count: 62,
      deals_completed: 55,
      on_time_rate: '100%',
      bio: 'Export-certified pomegranate grower. Zero chemical residue tolerance with GlobalGAP practices.'
    },
    {
      id: 4,
      name: 'Nitin Rathod',
      village: 'Yavatmal',
      district: 'Yavatmal',
      photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&auto=format&fit=crop&q=80',
      farm_size: '8.0 Acres Black Soil',
      primary_crops: 'Long Staple BT Cotton, Tur Dal, Soyabean',
      phone: '+91 98226 55019',
      rating: 5.0,
      reviews_count: 58,
      deals_completed: 49,
      on_time_rate: '100%',
      bio: 'Leading cotton grower in Vidarbha. Delivers clean, trash-free long staple bolls ready for ginning.'
    },
    {
      id: 5,
      name: 'Pandurang Mane',
      village: 'Sangola',
      district: 'Solapur',
      photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
      farm_size: '7.0 Acres Drip Orchard',
      primary_crops: 'Super Bhagwa Ruby Pomegranate, Figs',
      phone: '+91 98221 99042',
      rating: 5.0,
      reviews_count: 48,
      deals_completed: 39,
      on_time_rate: '98%',
      bio: 'Renowned Solapur horticulture pioneer producing 350g+ jumbo export fruits with deep ruby arils.'
    },
    {
      id: 6,
      name: 'Raosaheb Kale',
      village: 'Aurangabad',
      district: 'Chhatrapati Sambhajinagar',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      farm_size: '9.5 Acres Cultivated',
      primary_crops: 'Sharbati Wheat, Bajra, Mustard',
      phone: '+91 98229 44102',
      rating: 4.8,
      reviews_count: 39,
      deals_completed: 30,
      on_time_rate: '96%',
      bio: 'Golden grain wheat producer. Certified clean harvesting with mechanical winnowers and moisture control.'
    }
  ];

  return (
    <div className="animate-slide-in" style={{ paddingBottom: 60 }}>
      
      {/* Statutory APMC Buyer Verification Notice Banner */}
      {!isBuyerVerified && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fde68a',
          borderLeft: '6px solid #d97706',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: '#fef3c7', color: '#b45309',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, border: '1px solid #fcd34d'
            }}>
              <Lock size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.94rem', fontWeight: 900, color: '#92400e' }}>
                  APMC Trading License Verification Pending (Sec 14-A Scrutiny)
                </span>
                <span style={{
                  background: '#f59e0b', color: '#ffffff',
                  fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: 999
                }}>
                  QUEUE REF: #{currentBuyerApp?.id || authUser?.user?.application_id || 'BAPP-NEW'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#78350f', lineHeight: 1.4 }}>
                Newly registered corporate buyers cannot directly place orders or commit escrow until credentials (Form B Trading License, GSTIN active validation) are approved by the APMC Administrator.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => {
                if (setTerminal) setTerminal('admin');
                if (setStep) setStep(21);
              }}
              style={{
                background: '#ffffff', border: '1px solid #d97706',
                color: '#92400e', padding: '8px 14px', borderRadius: 8,
                fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>🏛️ View in Admin Portal</span>
            </button>

            <button
              onClick={() => {
                if (currentBuyerApp?.id) {
                  approveBuyerApp(currentBuyerApp.id, 'Fast-track verification granted via Instant APMC Demo Pass.');
                } else if (authUser?.user?.id) {
                  approveBuyerApp(authUser.user.id, 'Instant APMC Demo Pass.');
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff', border: 'none',
                padding: '8px 16px', borderRadius: 8,
                fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>⚡ Instant Admin Verify (Demo)</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. DIRECT-TO-FARMER MARKETPLACE COMMAND HEADER */}
      <div className="panel" style={{ 
        padding: '22px 26px', marginBottom: 20, 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        color: '#ffffff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ 
                background: '#15803d', color: '#ffffff', padding: '3px 10px', 
                borderRadius: 6, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em',
                display: 'inline-flex', alignItems: 'center', gap: 5
              }}>
                <Sprout size={13} /> Direct Farmer Sourcing
              </span>
              <span style={{ 
                background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: 5
              }}>
                <ShieldCheck size={13} /> Verified Buyer Profile
              </span>
              <span style={{ 
                background: 'rgba(34,197,94,0.15)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)',
                padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 
              }}>
                Zero Middlemen • No Mandi Fees
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
              AgroFresh Direct Farmer Marketplace
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0, maxWidth: 840, lineHeight: 1.4 }}>
              Connect directly with verified farmers, negotiate fair prices, and pay instantly via escrow — no middlemen, no mandi fees.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowNewRfqModal(true)}
              style={{
                background: '#15803d', color: '#ffffff', border: 'none',
                padding: '9px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(21,128,61,0.35)'
              }}
            >
              <PlusCircle size={15} />
              <span>+ Post Sourcing Requirement</span>
            </button>

            <button
              onClick={() => { setTerminal('apmc'); setStep(13); }}
              style={{
                background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.2)',
                padding: '9px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'
              }}
            >
              <ShieldCheck size={15} />
              <span>Verified Buyer Profile</span>
            </button>
          </div>
        </div>

        {/* 4 Big Relationship-Driven KPI Cards */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 12, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              FARMERS CONNECTED
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', marginTop: 2 }}>
              148 Verified
            </div>
            <div style={{ fontSize: '0.72rem', color: '#86efac', marginTop: 2 }}>
              38 Villages across Maharashtra
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              DIRECT PAYMENTS RELEASED
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#86efac', marginTop: 2 }}>
              ₹1.84 Crore
            </div>
            <div style={{ fontSize: '0.72rem', color: '#86efac', marginTop: 2 }}>
              100% Instant Escrow to Farmgate
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              AVG. PRICE PREMIUM VS MANDI RATE
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fde047', marginTop: 2 }}>
              +8.5% Fair Price
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
              Direct to farmer earnings (₹165/Qtl saved)
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              DIRECT DEALS FULFILLED
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', marginTop: 2 }}>
              24 Direct Orders
            </div>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: 2 }}>
              100% Farmgate Inspection Passed
            </div>
          </div>
        </div>
      </div>



      {/* =========================================================
          MODULE 1: DIRECT FARMER LOTS
          ========================================================= */}
      {currentTab === 'lots' && (
        <div>
          {/* Direct Sourcing Filters & Search Bar */}
          <div className="panel" style={{ padding: '16px 20px', marginBottom: 20, background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              
              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '7px 12px', width: 320, maxWidth: '100%' }}>
                <Search size={16} style={{ color: '#94a3b8', marginRight: 8 }} />
                <input 
                  type="text" 
                  placeholder="Search farmer name, village, location, crop..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.84rem', width: '100%' }}
                />
                {searchTerm && (
                  <X size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSearchTerm('')} />
                )}
              </div>

              {/* Commodity Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: 2 }}>
                  Crop:
                </span>
                {['all', 'onion', 'soyabean', 'cotton', 'pomegranate', 'wheat', 'tomato'].map(c => {
                  const isSelected = commodityFilter === c;
                  const count = c === 'all'
                    ? displayLots.length
                    : displayLots.filter(l => normalizeCrop(l.crop_name) === c || normalizeCrop(l.commodity_id) === c || String(l.crop_name || '').toLowerCase().includes(c)).length;

                  return (
                    <button
                      key={c}
                      onClick={() => setCommodityFilter(commodityFilter === c && c !== 'all' ? 'all' : c)}
                      style={{
                        padding: '5px 11px', borderRadius: 6, fontSize: '0.76rem',
                        fontWeight: isSelected ? 800 : 500,
                        background: isSelected ? '#0f172a' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        border: isSelected ? '1px solid #0f172a' : '1px solid #cbd5e1',
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.15s ease'
                      }}
                      title={`Filter by ${c === 'all' ? 'all crops' : c}`}
                    >
                      <span>{c === 'all' ? 'All Crops' : c.charAt(0).toUpperCase() + c.slice(1)}</span>
                      <span style={{
                        fontSize: '0.66rem', padding: '1px 5px', borderRadius: 999,
                        background: isSelected ? 'rgba(255,255,255,0.22)' : '#e2e8f0',
                        color: isSelected ? '#ffffff' : '#64748b', fontWeight: 700
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Village / Farmer Location Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Village:
                </span>
                <select
                  value={villageFilter}
                  onChange={(e) => setVillageFilter(e.target.value)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1',
                    fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', fontWeight: 600
                  }}
                >
                  <option value="all">All Villages / Locations</option>
                  <option value="Pimpalgaon Baswant">Pimpalgaon Baswant (Nashik)</option>
                  <option value="Dindori">Dindori (Nashik)</option>
                  <option value="Lasalgaon">Lasalgaon (Nashik)</option>
                  <option value="Malegaon">Malegaon (Nashik)</option>
                  <option value="Niphad">Niphad (Nashik)</option>
                  <option value="Yeola">Yeola (Nashik)</option>
                  <option value="Yavatmal">Yavatmal (Vidarbha)</option>
                  <option value="Sangola">Sangola (Solapur)</option>
                  <option value="Latur">Latur (Marathwada)</option>
                  <option value="Amravati">Amravati (Vidarbha)</option>
                  <option value="Jalna">Jalna (Marathwada)</option>
                  <option value="Aurangabad">Aurangabad (Marathwada)</option>
                  <option value="Shirur">Shirur (Pune)</option>
                  <option value="Narayangaon">Narayangaon (Pune)</option>
                </select>
              </div>

              {/* Grade Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Grade:
                </span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1',
                    fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', fontWeight: 600
                  }}
                >
                  <option value="all">All Quality Grades</option>
                  <option value="grade a">Grade A (Export / Premium)</option>
                  <option value="grade b">Grade B (FAQ / Commercial)</option>
                </select>
              </div>

              {/* View Mode Toggle (Grid vs Table) */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: 3, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '4px 10px', borderRadius: 4, border: 'none',
                    background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                    color: viewMode === 'grid' ? '#0f172a' : '#64748b',
                    boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700
                  }}
                >
                  <Grid size={13} />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '4px 10px', borderRadius: 4, border: 'none',
                    background: viewMode === 'table' ? '#ffffff' : 'transparent',
                    color: viewMode === 'table' ? '#0f172a' : '#64748b',
                    boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700
                  }}
                >
                  <List size={13} />
                  <span>Table</span>
                </button>
              </div>

            </div>
          </div>

          {/* Active Filter Bar & Results Count */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            padding: '8px 14px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: '0.76rem',
            color: '#475569',
            flexWrap: 'wrap',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>
                Showing {filteredLots.length} direct farmgate lots from verified growers
              </span>
              {commodityFilter !== 'all' && (
                <span style={{
                  background: '#0f172a', color: '#ffffff', padding: '3px 8px', borderRadius: 6,
                  fontWeight: 700, fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: 5
                }}>
                  Crop: {commodityFilter.charAt(0).toUpperCase() + commodityFilter.slice(1)}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setCommodityFilter('all')} />
                </span>
              )}
              {villageFilter !== 'all' && (
                <span style={{
                  background: '#ea580c', color: '#ffffff', padding: '3px 8px', borderRadius: 6,
                  fontWeight: 700, fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: 5
                }}>
                  Village: {villageFilter}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setVillageFilter('all')} />
                </span>
              )}
              {gradeFilter !== 'all' && (
                <span style={{
                  background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 6,
                  fontWeight: 700, fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: 5
                }}>
                  Grade: {gradeFilter === 'grade a' ? 'Grade A' : 'Grade B'}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setGradeFilter('all')} />
                </span>
              )}
              {searchTerm && (
                <span style={{
                  background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                  padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: '0.72rem',
                  display: 'inline-flex', alignItems: 'center', gap: 5
                }}>
                  Query: "{searchTerm}"
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchTerm('')} />
                </span>
              )}
            </div>

            {(commodityFilter !== 'all' || gradeFilter !== 'all' || villageFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setCommodityFilter('all');
                  setGradeFilter('all');
                  setVillageFilter('all');
                  setSearchTerm('');
                }}
                style={{
                  background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6,
                  color: '#b91c1c', fontWeight: 700, cursor: 'pointer', fontSize: '0.74rem',
                  padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5
                }}
              >
                <RefreshCw size={11} />
                Reset All Filters
              </button>
            )}
          </div>

          {/* TABLE VIEW */}
          {viewMode === 'table' ? (
            <div className="panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 24, background: '#ffffff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '12px 16px' }}>Farmer & Village</th>
                      <th style={{ padding: '12px 16px' }}>Crop & Variety</th>
                      <th style={{ padding: '12px 16px' }}>Volume (Qtl / MT)</th>
                      <th style={{ padding: '12px 16px' }}>Direct Rate vs Modal</th>
                      <th style={{ padding: '12px 16px' }}>AI Quality Grade</th>
                      <th style={{ padding: '12px 16px' }}>Trust Rating</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Direct Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLots.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff' }}>
                          <Filter size={28} style={{ color: '#94a3b8', marginBottom: 10, display: 'inline-block' }} />
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: 4 }}>
                            No direct farmer lots match your criteria
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 14 }}>
                            Try adjusting crop, village, or grade filters.
                          </div>
                          <button
                            onClick={() => { setCommodityFilter('all'); setGradeFilter('all'); setVillageFilter('all'); setSearchTerm(''); }}
                            style={{
                              padding: '6px 14px', borderRadius: 6, background: '#0f172a', color: '#ffffff',
                              fontSize: '0.76rem', fontWeight: 700, border: 'none', cursor: 'pointer'
                            }}
                          >
                            Reset All Filters
                          </button>
                        </td>
                      </tr>
                    ) : filteredLots.map((lot, idx) => (
                      <tr key={lot.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                        
                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img 
                              src={lot.farmer_photo} 
                              alt={lot.farmer_name} 
                              style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #16a34a' }}
                            />
                            <div>
                              <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{lot.farmer_name}</strong>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                📍 {lot.village} • 🌾 {lot.farm_size}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{lot.crop_name}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {lot.variety} • Harvest: {lot.harvest_date}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{lot.quantity_qtl} Qtl</strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>({lot.quantity_mt} MT) • Farmgate</div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#15803d' }}>
                            ₹{lot.asking_price.toLocaleString('en-IN')}/Qtl
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Modal: ₹{lot.agmarknet_modal} ({lot.spread_pct})
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 800 }}>
                                {lot.grade}
                              </span>
                              <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 7px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700 }}>
                                {lot.size_caliber}
                              </span>
                            </div>
                            {lot.manually_verified && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{
                                  background: '#ecfdf5', border: '1px solid #86efac', color: '#15803d',
                                  padding: '2px 6px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800,
                                  display: 'inline-flex', alignItems: 'center', gap: 3
                                }}>
                                  <ShieldCheck size={11} />
                                  <span>Manually Verified</span>
                                  <span style={{ background: '#15803d', color: '#ffffff', padding: '0 4px', borderRadius: 3, fontSize: '0.64rem' }}>
                                    ⭐ {lot.field_agent_rating || 5}.0
                                  </span>
                                </span>
                                {lot.is_exportable && (
                                  <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '1px 5px', borderRadius: 3, fontSize: '0.64rem', fontWeight: 700 }}>
                                    🌍 Export
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <span style={{ color: '#b45309', fontWeight: 800, fontSize: '0.8rem' }}>
                            ⭐ {lot.farmer_rating || '4.9'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: 4 }}>
                            ({lot.reviews_count || '38'} reviews)
                          </span>
                        </td>

                        <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleQuickQrClick(lot)}
                              style={{
                                padding: '6px 10px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 800,
                                background: isBuyerVerified ? '#f0fdf4' : '#fffbeb',
                                border: isBuyerVerified ? '1px solid #86efac' : '1px solid #fde68a',
                                color: isBuyerVerified ? '#15803d' : '#b45309',
                                cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 4
                              }}
                              title="Scan dynamic UPI QR Code"
                            >
                              <QrCode size={13} />
                              <span>Scan QR</span>
                            </button>
                            <button
                              onClick={() => handleOpenPOModal(lot)}
                              style={{
                                padding: '6px 14px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 800,
                                background: isBuyerVerified ? '#15803d' : '#d97706',
                                border: 'none', color: '#ffffff', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 4
                              }}
                            >
                              {!isBuyerVerified && <Lock size={12} />}
                              <span>{isBuyerVerified ? 'Buy Direct' : 'Lock PO'}</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* GRID VIEW CARDS - HUMAN & FARMER IDENTITY */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16, marginBottom: 24 }}>
              {filteredLots.length === 0 ? (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: '#ffffff',
                  borderRadius: 12,
                  border: '1px dashed #cbd5e1'
                }}>
                  <Filter size={32} style={{ color: '#94a3b8', marginBottom: 10, display: 'inline-block' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    No matching direct farmer lots found
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px', maxWidth: 440, marginInline: 'auto' }}>
                    Try adjusting your crop, village, or grade selection to see available produce.
                  </p>
                  <button
                    onClick={() => { setCommodityFilter('all'); setGradeFilter('all'); setVillageFilter('all'); setSearchTerm(''); }}
                    style={{
                      padding: '7px 16px', borderRadius: 6, background: '#0f172a', color: '#ffffff',
                      fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer'
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : filteredLots.map((lot) => (
                <div 
                  key={lot.id} 
                  className="panel" 
                  style={{ 
                    padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: 12,
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Row: Farmer Profile Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={lot.farmer_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                          alt={lot.farmer_name}
                          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #16a34a' }}
                        />
                        <span style={{ 
                          position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, 
                          borderRadius: '50%', background: '#22c55e', border: '2px solid #ffffff' 
                        }} title="Online & Ready to Transact" />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{lot.farmer_name}</strong>
                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 800 }}>
                            ✓ Verified Farmer
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#64748b', marginTop: 2, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MapPin size={11} color="#ea580c" />
                            {lot.village}
                          </span>
                          <span>•</span>
                          <span style={{ fontWeight: 700, color: '#166534' }}>
                            🌾 {lot.farm_size}
                          </span>
                          <span>•</span>
                          <span style={{ color: '#b45309', fontWeight: 700 }}>
                            ⭐ {lot.farmer_rating || '4.9'} ({lot.reviews_count || '38'})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MANUALLY VERIFIED BADGE BANNER (if Field Agent Rating > 3) */}
                    {lot.manually_verified && (
                      <div style={{
                        background: '#ecfdf5',
                        border: '1.5px solid #22c55e',
                        borderRadius: 10,
                        padding: '8px 12px',
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 8,
                        boxShadow: '0 2px 6px rgba(34, 197, 94, 0.12)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#15803d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ShieldCheck size={15} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#15803d', display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span>✓ Manually Verified</span>
                              <span style={{ fontSize: '0.62rem', background: '#bbf7d0', color: '#065f46', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                                FIELD AGENT CERTIFIED
                              </span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#166534' }}>
                              Assayed by {lot.assayed_by || 'Sachin B. Kadam (Krishi Sahayak)'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <div style={{
                            background: '#15803d', color: '#ffffff', padding: '3px 8px', borderRadius: 12,
                            fontSize: '0.72rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3
                          }}>
                            <span>⭐ {lot.field_agent_rating || 5}.0</span>
                            <span style={{ fontSize: '0.62rem', opacity: 0.9 }}>/ 5.0</span>
                          </div>
                          {lot.is_exportable ? (
                            <span style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 6px', borderRadius: 6, fontSize: '0.66rem', fontWeight: 800 }}>
                              🌍 Export Compliant
                            </span>
                          ) : (
                            <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: 6, fontSize: '0.66rem', fontWeight: 700 }}>
                              🇮🇳 Domestic Mandi
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLotForAssay(lot);
                            }}
                            style={{
                              background: '#ffffff', border: '1px solid #86efac', color: '#15803d',
                              padding: '3px 8px', borderRadius: 5, fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer'
                            }}
                          >
                            View Certificate
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Commodity Title & Variety */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 2px' }}>
                          {lot.crop_name}
                        </h3>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          {lot.variety} • Harvest: <strong>{lot.harvest_date}</strong>
                        </div>
                      </div>
                      <span style={{ 
                        background: lot.grade.includes('A') ? '#dcfce7' : '#fef3c7', 
                        color: lot.grade.includes('A') ? '#15803d' : '#b45309', 
                        padding: '3px 9px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800 
                      }}>
                        {lot.grade}
                      </span>
                    </div>

                    {/* Volume & Direct Fair Pricing */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0' }}>
                      <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Direct Volume</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                          {lot.quantity_qtl} Qtl
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>({lot.quantity_mt} MT) • Farmgate</div>
                      </div>

                      <div style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Direct Asking Rate</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d', margin: '2px 0' }}>
                          ₹{lot.asking_price.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/Qtl</span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#166534' }}>
                          Mandi Modal: ₹{lot.agmarknet_modal} ({lot.spread_pct})
                        </div>
                      </div>
                    </div>

                    {/* Middleman Savings Tag */}
                    <div style={{ background: '#f0fdf4', padding: '6px 10px', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: '0.72rem', color: '#166534', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>✨ Zero Mandi Cess & 0% Middleman Deduction — 100% to Farmer</span>
                    </div>

                    {/* Scientific Quality Chips */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                        Caliber: {lot.size_caliber}
                      </span>
                      <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                        Moisture: {lot.moisture_pct}%
                      </span>
                      <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                        NIR Index: {lot.nir_score}/100
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleQuickQrClick(lot)}
                        style={{
                          flex: 1,
                          padding: '10px 10px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                          background: isBuyerVerified ? '#f0fdf4' : '#fffbeb',
                          border: isBuyerVerified ? '1px solid #86efac' : '1px solid #fde68a',
                          color: isBuyerVerified ? '#15803d' : '#b45309',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                        }}
                        title="Scan dynamic UPI QR Code with Google Pay, PhonePe, Paytm"
                      >
                        <QrCode size={15} />
                        <span>Scan QR</span>
                      </button>

                      <button
                        onClick={() => handleOpenPOModal(lot)}
                        style={{
                          flex: 2,
                          padding: '10px 14px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
                          background: isBuyerVerified ? '#15803d' : '#d97706',
                          border: 'none', color: '#ffffff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          boxShadow: isBuyerVerified ? '0 2px 8px rgba(21,128,61,0.25)' : '0 2px 8px rgba(217,119,6,0.25)'
                        }}
                      >
                        {!isBuyerVerified && <Lock size={14} />}
                        <span>{isBuyerVerified ? 'Buy Direct & Escrow' : 'Verification Required'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          MODULE 2: FARMER DIRECTORY & PROFILES
          ========================================================= */}
      {currentTab === 'directory' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                Verified Maharashtra Farmer Directory
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Directly contact 148 verified smallholders across Maharashtra with verified 7/12 land titles and direct farmgate trade accounts.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16, marginBottom: 24 }}>
            {farmerDirectoryList.map((farmer) => (
              <div key={farmer.id} className="panel" style={{ padding: '22px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                  <img 
                    src={farmer.photo} 
                    alt={farmer.name} 
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #16a34a' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{farmer.name}</strong>
                      <span style={{ background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800 }}>
                        ✓ 7/12 Verified
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                      📍 {farmer.village}, {farmer.district} • 🌾 {farmer.farm_size}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700, marginTop: 2 }}>
                      ⭐ {farmer.rating} ({farmer.reviews_count} reviews) • {farmer.deals_completed} Deals Closed
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4, marginBottom: 14 }}>
                  {farmer.bio}
                </p>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 14, fontSize: '0.76rem' }}>
                  <strong>Crops Grown:</strong> <span style={{ color: '#166534', fontWeight: 700 }}>{farmer.primary_crops}</span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      const lot = baseLotsList.find(l => l.farmer_name === farmer.name) || baseLotsList[0];
                      handleOpenPOModal(lot);
                    }}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800,
                      background: '#15803d', color: '#ffffff', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <span>View Lots & Order</span>
                    <ArrowRight size={14} />
                  </button>

                  <a 
                    href={`tel:${farmer.phone}`}
                    style={{
                      padding: '9px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700,
                      background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none'
                    }}
                  >
                    <Phone size={14} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          MODULE 3: FARMGATE PICKUP SCHEDULING
          ========================================================= */}
      {(currentTab === 'transport' || currentTab === 'pickups') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                Farmgate Pickup Scheduling & Vehicle Dispatch
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Schedule dedicated logistics pickup vehicles straight to the farmer's barn. Zero mandi unloading, zero weighbridge wait times.
              </p>
            </div>

            <button
              onClick={() => {
                addToast({
                  type: 'success',
                  title: 'New Farmgate Pickup Scheduled',
                  message: 'Dedicated 6-wheel transporter allocated for Pimpalgaon Baswant route.'
                });
              }}
              style={{
                background: '#15803d', color: '#ffffff', border: 'none',
                padding: '9px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'
              }}
            >
              <Truck size={15} />
              <span>+ Schedule New Farmgate Pickup</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {[
              ...deliveryJobs.map(j => ({
                id: j.job_code || `JOB-${j.id}`,
                farmer: j.pickup_farmer_name || 'Santosh Shinde',
                village: j.pickup_location || 'Gut 142/B, Pimpalgaon Baswant',
                crop: j.commodity || '120 Qtl Grade-A Red Onion',
                driver: j.driver_name || 'Rajesh Vitthal Patil',
                vehicle: `${j.vehicle_type || 'Eicher Pro 2049'} • ${j.vehicle_reg || 'MH 15 EG 4402'}`,
                status: j.workflow_status || (j.status === 'COMPLETED' ? LOT_STAGES?.COMPLETED_FUNDS_RELEASED : j.status === 'PICKED_UP' ? LOT_STAGES?.PICKED_UP_IN_TRANSIT : LOT_STAGES?.TRANSPORT_CONFIRMED),
                slot: j.time_slot || 'Today, Scheduled',
                distance: j.drop_location || 'Receiving Dock',
                deal_ref: j.deal_ref,
                delivery_fee: j.delivery_fee,
                isReturnJob: j.isReturnJob,
                delivery_arrived: j.delivery_arrived || j.status === 'DELIVERED_PENDING_CONFIRMATION'
              })),
              {
                id: 'PICKUP-2024-8842',
                farmer: 'Dnyaneshwar Gaikwad',
                village: 'Niphad Agro Zone',
                crop: '150 Qtl JS-335 Soyabean',
                driver: 'Ganesh Suresh Chavan',
                vehicle: 'Tata 1109 (6-Wheel) • MH 15 AK 9104',
                status: 'Scheduled for Loading',
                slot: 'Tomorrow, 02:00 PM',
                distance: '24 km from Hub'
              }
            ].map(p => {
              const isAwaitingBuyerDecision = (p.status === LOT_STAGES?.PICKED_UP_IN_TRANSIT || p.status === 'IN_TRANSIT' || p.status === 'PICKED_UP') && (p.delivery_arrived || true);
              const isCompleted = p.status === LOT_STAGES?.COMPLETED_FUNDS_RELEASED || p.status === 'COMPLETED';
              const isRejectedReturn = p.status === LOT_STAGES?.REJECTED_RETURN_IN_PROGRESS;
              const isReturnedClosed = p.status === LOT_STAGES?.RETURNED_CLOSED;

              return (
                <div key={p.id} className="panel" style={{ padding: '20px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ background: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800 }}>
                          {p.id}
                        </span>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{p.crop}</strong>
                        <span style={{ 
                          background: isCompleted ? '#dcfce7' : isRejectedReturn ? '#fee2e2' : isReturnedClosed ? '#f1f5f9' : '#dbeafe', 
                          color: isCompleted ? '#15803d' : isRejectedReturn ? '#dc2626' : isReturnedClosed ? '#475569' : '#1d4ed8', 
                          padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 800 
                        }}>
                          ● {p.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        Farmgate Origin: <strong>{p.farmer}</strong> ({p.village})
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Destination</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{p.distance}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Truck size={18} color="#2563eb" />
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                          Driver: {p.driver}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {p.vehicle}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToast({
                          type: 'info',
                          title: 'Connecting with Driver',
                          message: `Calling ${p.driver} via direct driver bridge.`
                        });
                      }}
                      style={{
                        padding: '6px 12px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 700,
                        background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 5
                      }}
                    >
                      <Phone size={13} />
                      <span>Contact Driver</span>
                    </button>
                  </div>

                  {/* Step 6: Delivery & Buyer Approval Actions */}
                  {p.deal_ref && p.status === LOT_STAGES?.PICKED_UP_IN_TRANSIT && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => approveDeliveryReleaseWorkflow(p.deal_ref)}
                        style={{
                          flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                          background: '#15803d', border: 'none', color: '#ffffff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          boxShadow: '0 2px 6px rgba(21,128,61,0.25)'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Approve Delivery (Release Escrow Split)</span>
                      </button>

                      <button
                        onClick={() => rejectDeliveryReturnWorkflow(p.deal_ref, p.delivery_fee || 8450, 'Produce quality did not meet agreed Agmark grade')}
                        style={{
                          flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 800,
                          background: '#ffffff', border: '1px solid #f87171', color: '#dc2626', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                        }}
                      >
                        <AlertTriangle size={16} />
                        <span>Reject / Send Back (Return via Transporter)</span>
                      </button>
                    </div>
                  )}

                  {isCompleted && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={16} color="#15803d" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>
                        Dual Escrow Settled: Net crop payment released to Farmer; Freight released to Transporter.
                      </span>
                    </div>
                  )}

                  {isRejectedReturn && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={16} color="#dc2626" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>
                        Consignment Rejected. Return trip en route back to farmgate. Return freight charged to Farmer escrow account.
                      </span>
                    </div>
                  )}

                  {isReturnedClosed && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={16} color="#475569" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        Return Completed at Farmgate. Buyer refund credited. Transaction closed.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          MODULE 5: TRUST & RATINGS (COMMUNITY REPUTATION)
          ========================================================= */}
      {currentTab === 'ratings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                Farmer Trust & Direct Trade Reviews
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Transparent reviews from verified commercial buyers and direct trade growers across Maharashtra.
              </p>
            </div>
          </div>

          {/* Overall Rating Banner */}
          <div className="panel" style={{ padding: '24px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#15803d' }}>4.92</div>
                  <div>
                    <div style={{ color: '#b45309', fontSize: '1.1rem' }}>★★★★★</div>
                    <div style={{ fontSize: '0.76rem', color: '#166534', fontWeight: 700 }}>
                      Based on 482 verified direct farmgate settlements
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>100%</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>DIRECT ESCROW PAYOUTS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>0.0%</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>MIDDLEMAN DEDUCTIONS</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>&lt; 15 mins</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>AVG. RELEASE AFTER INSPECTION</div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Reviews Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
            {[
              {
                buyer: 'Reliance Fresh Procurement Hub',
                farmer: 'Santosh Shinde (Pimpalgaon Baswant)',
                crop: 'Red Onion Grade A',
                date: '2 Sept 2024',
                rating: 5,
                comment: 'Sensational produce quality. 120 Qtl loaded cleanly at Santosh ji’s farm barn within 40 minutes of our truck arrival. Zero rotting, uniform 58mm diameter. Escrow released right at farmgate.'
              },
              {
                buyer: 'ITC Agri Business Division',
                farmer: 'Dnyaneshwar Gaikwad (Niphad)',
                crop: 'JS-335 Soyabean',
                date: '31 Aug 2024',
                rating: 5,
                comment: 'Direct sourcing saved us 1.5% in mandi handling delays and cess. Dnyaneshwar ji provided lab moisture certification upfront. Highly recommended partner.'
              },
              {
                buyer: 'FreshToHome Agri Desk',
                farmer: 'Ananda Bhor (Ranwad)',
                crop: 'Bhagwa Pomegranate Export',
                date: '28 Aug 2024',
                rating: 5,
                comment: 'Pomegranates were packaged in export corrugated boxes with foam netting. Excellent color and sweetness. Transacted straight with zero commission fees.'
              }
            ].map((rev, i) => (
              <div key={i} className="panel" style={{ padding: '20px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{rev.buyer}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                      Transacted with {rev.farmer}
                    </div>
                  </div>
                  <span style={{ color: '#b45309', fontWeight: 800 }}>{'★'.repeat(rev.rating)}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4, margin: '0 0 10px' }}>
                  "{rev.comment}"
                </p>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Produce: <strong>{rev.crop}</strong> • Verified Direct Settlement ({rev.date})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          MODULE 6: DIRECT ESCROW & INSTANT PAYMENTS
          ========================================================= */}
      {currentTab === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 14, padding: '22px 26px', color: '#ffffff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 800 }}>
                  100% DIRECT ESCROW
                </span>
                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700 }}>
                  Zero Middleman Deductions
                </span>
              </div>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.35rem', fontWeight: 900 }}>
                Direct Farmgate Escrow & Instant Payouts
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
                Tri-party escrow vault with SBI. Funds released straight to farmer DBT accounts within 15 minutes of farmgate QC clearance.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Escrow Ledger Synced',
                    message: 'All bank balances verified with State Bank of India API gateway.'
                  });
                }}
                style={{
                  padding: '9px 16px', background: '#15803d', color: '#ffffff',
                  borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.82rem',
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} />
                <span>Sync Bank Escrow</span>
              </button>
            </div>
          </div>

          {/* 4 Financial Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Escrow Locked in Vault</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>₹18,42,500</div>
              <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: 2, fontWeight: 600 }}>3 Active Purchase Orders</div>
            </div>

            <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Released to Farmers Today</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>₹7,27,500</div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>Direct IMPS / NEFT transfers</div>
            </div>

            <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Mandi Cess & Commission Saved</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284c7', marginTop: 4 }}>₹64,200</div>
              <div style={{ fontSize: '0.76rem', color: '#0284c7', marginTop: 2, fontWeight: 600 }}>0% Middleman Deduction</div>
            </div>

            <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Settlement SLA Guarantee</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', marginTop: 4 }}>&lt; 15 Mins</div>
              <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: 2, fontWeight: 600 }}>Post Physical QC Check</div>
            </div>
          </div>

          {/* Active Escrow Orders List */}
          <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Active Escrow Transactions & Payout Approvals
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                {
                  id: 'ESCROW-MH-0941',
                  farmer: 'Santosh Shinde',
                  village: 'Pimpalgaon Baswant',
                  crop: 'Onion (Garva Red / लाल कांदा)',
                  qty: '120 Qtl (12 MT)',
                  rate: '₹2,425/Qtl',
                  amount: '₹2,91,000',
                  bank: 'SBI Agri Escrow Branch, Nashik',
                  status: 'LOCKED_IN_ESCROW',
                  statusText: 'Escrow Locked • Awaiting Loading QC',
                  badgeBg: '#fef3c7',
                  badgeColor: '#b45309'
                },
                {
                  id: 'ESCROW-MH-0948',
                  farmer: 'Dnyaneshwar Gaikwad',
                  village: 'Niphad Green Valley',
                  crop: 'Soyabean (JS-335 Certified)',
                  qty: '150 Qtl (15 MT)',
                  rate: '₹4,850/Qtl',
                  amount: '₹7,27,500',
                  bank: 'HDFC Escrow Vault, Pune',
                  status: 'RELEASED_TO_FARMER',
                  statusText: '100% Released to Farmer Account',
                  badgeBg: '#dcfce7',
                  badgeColor: '#15803d'
                },
                {
                  id: 'ESCROW-MH-1102',
                  farmer: 'Mahadev Jadhav',
                  village: 'Latur Oilseed Cluster',
                  crop: 'Soyabean (High Protein Gold)',
                  qty: '200 Qtl (20 MT)',
                  rate: '₹4,920/Qtl',
                  amount: '₹9,84,000',
                  bank: 'SBI Agri Escrow Branch, Latur',
                  status: 'LOCKED_IN_ESCROW',
                  statusText: 'Escrow Locked • Transport Dispatched',
                  badgeBg: '#dbeafe',
                  badgeColor: '#1d4ed8'
                }
              ].map((tx) => (
                <div key={tx.id} style={{
                  padding: 18, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>
                        {tx.id}
                      </span>
                      <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{tx.farmer}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({tx.village})</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                      {tx.crop} • <strong>{tx.qty}</strong> @ {tx.rate}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                      Custody Bank: <strong>{tx.bank}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{tx.amount}</div>
                      <span style={{
                        display: 'inline-block', fontSize: '0.72rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: 6, background: tx.badgeBg, color: tx.badgeColor, marginTop: 3
                      }}>
                        {tx.statusText}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      {tx.status === 'LOCKED_IN_ESCROW' && (
                        <button
                          onClick={() => {
                            addToast({
                              type: 'success',
                              title: `Escrow Released: ${tx.amount}`,
                              message: `Instant payment deposited into ${tx.farmer}'s bank account.`
                            });
                          }}
                          style={{
                            padding: '8px 14px', background: '#15803d', color: '#ffffff',
                            borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.8rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>Release Escrow</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: 'Downloading Voucher',
                            message: `Bank escrow transfer voucher for ${tx.id} generated.`
                          });
                        }}
                        style={{
                          padding: '8px 12px', background: '#ffffff', color: '#334155',
                          borderRadius: 6, border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.8rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                        }}
                      >
                        <Download size={13} />
                        <span>Voucher</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODULE 7: ORDER HISTORY & SOURCING LOG (RECTIFIED & COMPLETE)
          ========================================================= */}
      {currentTab === 'history' && (() => {
        // Base historical settled direct procurement orders
        const baseHistoricalOrders = [
          {
            id: 'ORD-DIR-8812',
            date: '3 Sept 2024',
            time: '11:45 AM',
            farmer: 'Dnyaneshwar Gaikwad',
            village: 'Niphad, Nashik',
            farmerPhone: '+91 98224 81920',
            landRecord: '7/12 Gut 142/B Verified',
            crop: 'Soyabean (JS-335 / पिवळी सोयाबीन)',
            grade: 'Grade A',
            qtyNum: 150,
            qty: '150 Qtl (15 MT)',
            rateNum: 4850,
            rate: '₹4,850/Qtl',
            productAmount: 727500,
            transportAmount: 8450,
            totalAmount: 735950,
            total: '₹7,35,950',
            qc: 'NIR 96.2 • 10.4% Moisture • Zero Foreign Matter',
            status: LOT_STAGES?.COMPLETED_FUNDS_RELEASED || 'COMPLETED_FUNDS_RELEASED',
            statusText: 'Delivered & Settled • Escrow Released',
            category: 'COMPLETED',
            escrowRef: 'SBIN-MH-ESC-8812',
            transporter: 'Sahyadri Kisan Fleet',
            vehicleNo: 'MH 15 EG 4402',
            driverName: 'Balasaheb Gaikwad',
            driverPhone: '+91 98220 11942'
          },
          {
            id: 'ORD-DIR-8809',
            date: '1 Sept 2024',
            time: '02:30 PM',
            farmer: 'Santosh Shinde',
            village: 'Pimpalgaon Baswant, Nashik',
            farmerPhone: '+91 98224 81920',
            landRecord: '7/12 Gut 88/1 Verified',
            crop: 'Red Onion (Garva / लाल कांदा)',
            grade: 'Grade A',
            qtyNum: 120,
            qty: '120 Qtl (12 MT)',
            rateNum: 2425,
            rate: '₹2,425/Qtl',
            productAmount: 291000,
            transportAmount: 8450,
            totalAmount: 299450,
            total: '₹2,99,450',
            qc: 'NIR 94.8 • 58mm Caliber • 11.2% Moisture',
            status: LOT_STAGES?.COMPLETED_FUNDS_RELEASED || 'COMPLETED_FUNDS_RELEASED',
            statusText: 'Delivered & Settled • Escrow Released',
            category: 'COMPLETED',
            escrowRef: 'SBIN-MH-ESC-8809',
            transporter: 'Maharashtra Kisan Express',
            vehicleNo: 'MH 15 EG 4402',
            driverName: 'Balasaheb Gaikwad',
            driverPhone: '+91 98220 11942'
          },
          {
            id: 'ORD-DIR-8794',
            date: '28 Aug 2024',
            time: '10:15 AM',
            farmer: 'Ananda Bhor',
            village: 'Ranwad, Niphad',
            farmerPhone: '+91 98231 44520',
            landRecord: '7/12 Gut 204/C Verified',
            crop: 'Pomegranate (Bhagwa / भगवा डाळिंब)',
            grade: 'Export A-1',
            qtyNum: 80,
            qty: '80 Qtl (8 MT)',
            rateNum: 12400,
            rate: '₹12,400/Qtl',
            productAmount: 992000,
            transportAmount: 11200,
            totalAmount: 1003200,
            total: '₹10,03,200',
            qc: 'Brix 16.5° • Zero Rot • 250g+ Ruby Arils',
            status: LOT_STAGES?.COMPLETED_FUNDS_RELEASED || 'COMPLETED_FUNDS_RELEASED',
            statusText: 'Delivered & Settled • Escrow Released',
            category: 'COMPLETED',
            escrowRef: 'SBIN-MH-ESC-8794',
            transporter: 'MahaCold Reefer Lines',
            vehicleNo: 'MH 12 RN 8819',
            driverName: 'Ramesh Jadhav',
            driverPhone: '+91 97654 32109'
          },
          {
            id: 'ORD-DIR-8782',
            date: '25 Aug 2024',
            time: '04:45 PM',
            farmer: 'Raosaheb Kale',
            village: 'Gangapur, Chhatrapati Sambhajinagar',
            farmerPhone: '+91 94222 18901',
            landRecord: '7/12 Gut 56/A Verified',
            crop: 'Wheat (Sharbati Golden / शरबती गहू)',
            grade: 'Grade A',
            qtyNum: 160,
            qty: '160 Qtl (16 MT)',
            rateNum: 3150,
            rate: '₹3,150/Qtl',
            productAmount: 504000,
            transportAmount: 9500,
            totalAmount: 513500,
            total: '₹5,13,500',
            qc: 'Moisture 10.1% • Lustrous Hard Grain',
            status: LOT_STAGES?.COMPLETED_FUNDS_RELEASED || 'COMPLETED_FUNDS_RELEASED',
            statusText: 'Delivered & Settled • Escrow Released',
            category: 'COMPLETED',
            escrowRef: 'SBIN-MH-ESC-8782',
            transporter: 'Marathwada Freight Lines',
            vehicleNo: 'MH 20 DV 1109',
            driverName: 'Sanjay Pawar',
            driverPhone: '+91 98229 88120'
          },
          {
            id: 'ORD-DIR-8761',
            date: '21 Aug 2024',
            time: '08:30 AM',
            farmer: 'Tukaram Darekar',
            village: 'Pimpalgaon Baswant, Nashik',
            farmerPhone: '+91 98221 77610',
            landRecord: '7/12 Gut 312 Verified',
            crop: 'Tomato (Abhinav Hybrid / लाल टोमॅटो)',
            grade: 'Grade A',
            qtyNum: 110,
            qty: '110 Qtl (11 MT)',
            rateNum: 1950,
            rate: '₹1,950/Qtl',
            productAmount: 214500,
            transportAmount: 7800,
            totalAmount: 222300,
            total: '₹2,22,300',
            qc: 'Firm 65mm • 25kg Crates • Zero Bruise',
            status: LOT_STAGES?.COMPLETED_FUNDS_RELEASED || 'COMPLETED_FUNDS_RELEASED',
            statusText: 'Delivered & Settled • Escrow Released',
            category: 'COMPLETED',
            escrowRef: 'SBIN-MH-ESC-8761',
            transporter: 'Nashik Agro Logistics',
            vehicleNo: 'MH 15 AG 7711',
            driverName: 'Kailas More',
            driverPhone: '+91 98220 99401'
          }
        ];

        // Map live deals from context into order records
        const liveOrders = (deals || []).map(deal => {
          const matchedLot = lots?.find(l => l.id === deal.lot_id || l.lot_code === deal.lot_code);
          const qtyNum = Number(deal.quantity_qtl || 120);
          const rateNum = Number(deal.agreed_price || 2425);
          const prodAmt = Number(deal.product_amount || (qtyNum * rateNum));
          const transAmt = Number(deal.transport_amount || 8450);
          const totalAmt = Number(deal.total_escrow_amount || (prodAmt + transAmt));
          const currentStatus = deal.workflow_status || deal.status || (LOT_STAGES?.PAYMENT_DONE_AWAITING_TRANSPORT || 'PAYMENT_DONE_AWAITING_TRANSPORT');

          let category = 'ACTIVE';
          let statusText = 'Escrow Funded • Awaiting Fleet Booking';
          if (currentStatus === (LOT_STAGES?.TRANSPORT_CONFIRMED || 'TRANSPORT_CONFIRMED')) {
            statusText = 'Transport Confirmed • Scheduled';
            category = 'ACTIVE';
          } else if (currentStatus === (LOT_STAGES?.PICKED_UP_IN_TRANSIT || 'PICKED_UP_IN_TRANSIT')) {
            statusText = 'In Transit • Dispatched from Farmgate';
            category = 'ACTIVE';
          } else if (currentStatus === (LOT_STAGES?.COMPLETED_FUNDS_RELEASED || 'COMPLETED_FUNDS_RELEASED') || currentStatus === 'SETTLED_RELEASED') {
            statusText = 'Delivered & Settled • Escrow Released';
            category = 'COMPLETED';
          } else if (currentStatus === (LOT_STAGES?.REJECTED_RETURN_IN_PROGRESS || 'REJECTED_RETURN_IN_PROGRESS')) {
            statusText = 'QC Rejected • Return In Progress';
            category = 'RETURNED';
          } else if (currentStatus === (LOT_STAGES?.RETURNED_CLOSED || 'RETURNED_CLOSED')) {
            statusText = 'Returned to Farmgate • Refund Cleared';
            category = 'RETURNED';
          }

          const createdDate = deal.created_at ? new Date(deal.created_at) : new Date();
          const dateFormatted = createdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          const timeFormatted = createdDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

          return {
            id: deal.deal_ref || `AC-TXN-${deal.id}`,
            date: dateFormatted,
            time: timeFormatted,
            farmer: deal.farmer_name || matchedLot?.farmer_name || 'Santosh Shinde',
            village: deal.village || matchedLot?.village || 'Pimpalgaon Baswant, Nashik',
            farmerPhone: deal.farmer_phone || matchedLot?.phone || '+91 98224 81920',
            landRecord: matchedLot?.certificate_no ? `7/12 Cert #${matchedLot.certificate_no}` : '7/12 Gut 142/B Verified',
            crop: matchedLot?.crop_name || deal.crop_summary || 'Direct Produce Lot',
            grade: matchedLot?.grade || deal.grade || 'Grade A',
            qtyNum: qtyNum,
            qty: `${qtyNum} Qtl (${(qtyNum / 10).toFixed(1)} MT)`,
            rateNum: rateNum,
            rate: `₹${rateNum.toLocaleString('en-IN')}/Qtl`,
            productAmount: prodAmt,
            transportAmount: transAmt,
            totalAmount: totalAmt,
            total: `₹${totalAmt.toLocaleString('en-IN')}`,
            qc: matchedLot?.nir_score ? `NIR ${matchedLot.nir_score} • Moisture ${matchedLot.moisture_pct || '11.2%'}` : 'Assayed NIR Grade A • Mandi Calibrated',
            status: currentStatus,
            statusText: statusText,
            category: category,
            escrowRef: deal.escrow_vault_ref || `SBIN-MH-ESC-${deal.id || 9001}`,
            transporter: deal.transporter_name || 'Maharashtra Kisan Express',
            vehicleNo: deal.vehicle_no || 'MH 15 EG 4402',
            driverName: deal.driver_name || 'Balasaheb Gaikwad',
            driverPhone: deal.driver_phone || '+91 98220 11942',
            isLiveDeal: true
          };
        });

        // Combined Order History
        const allOrders = [...liveOrders, ...baseHistoricalOrders];

        // Overall KPIs
        const totalVolumeQtl = allOrders.reduce((sum, o) => sum + (o.qtyNum || 0), 0);
        const totalSpendAmount = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const activeOrdersCount = allOrders.filter(o => o.category === 'ACTIVE').length;
        const completedOrdersCount = allOrders.filter(o => o.category === 'COMPLETED').length;
        const returnedOrdersCount = allOrders.filter(o => o.category === 'RETURNED').length;

        // Filtered Orders
        const filteredOrders = allOrders.filter(o => {
          const matchesCategory = 
            historyStatusFilter === 'ALL' ||
            (historyStatusFilter === 'ACTIVE' && o.category === 'ACTIVE') ||
            (historyStatusFilter === 'COMPLETED' && o.category === 'COMPLETED') ||
            (historyStatusFilter === 'RETURNED' && o.category === 'RETURNED');

          const sLower = historySearchTerm.trim().toLowerCase();
          const matchesSearch = 
            !sLower ||
            o.id.toLowerCase().includes(sLower) ||
            o.farmer.toLowerCase().includes(sLower) ||
            o.village.toLowerCase().includes(sLower) ||
            o.crop.toLowerCase().includes(sLower) ||
            o.statusText.toLowerCase().includes(sLower) ||
            o.escrowRef.toLowerCase().includes(sLower);

          return matchesCategory && matchesSearch;
        });

        // CSV Export Function
        const exportOrdersCSV = () => {
          const headers = ['Order ID', 'Date', 'Time', 'Farmer Name', 'Village', 'Crop', 'Grade', 'Quantity (Qtl)', 'Rate (INR/Qtl)', 'Produce Amount (INR)', 'Transport Freight (INR)', 'Total Settled (INR)', 'Workflow Status', 'Escrow Vault Ref'];
          const rows = allOrders.map(o => [
            o.id,
            o.date,
            o.time || '12:00 PM',
            `"${o.farmer}"`,
            `"${o.village}"`,
            `"${o.crop}"`,
            o.grade,
            o.qtyNum,
            o.rateNum,
            o.productAmount,
            o.transportAmount,
            o.totalAmount,
            `"${o.statusText}"`,
            o.escrowRef
          ]);
          const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', `agriconnect_buyer_order_history_${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          addToast({
            type: 'success',
            title: 'Order History CSV Exported',
            message: `${allOrders.length} direct sourcing transaction records exported successfully.`
          });
        };

        // Status Badge Helper
        const renderStatusBadge = (status, statusText) => {
          if (status === (LOT_STAGES?.PAYMENT_DONE_AWAITING_TRANSPORT || 'PAYMENT_DONE_AWAITING_TRANSPORT')) {
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 16, fontSize: '0.72rem', fontWeight: 800, background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
                <Clock size={12} />
                <span>{statusText}</span>
              </span>
            );
          }
          if (status === (LOT_STAGES?.TRANSPORT_CONFIRMED || 'TRANSPORT_CONFIRMED')) {
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 16, fontSize: '0.72rem', fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                <Truck size={12} />
                <span>{statusText}</span>
              </span>
            );
          }
          if (status === (LOT_STAGES?.PICKED_UP_IN_TRANSIT || 'PICKED_UP_IN_TRANSIT')) {
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 16, fontSize: '0.72rem', fontWeight: 800, background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                <Truck size={12} />
                <span>{statusText}</span>
              </span>
            );
          }
          if (status === (LOT_STAGES?.REJECTED_RETURN_IN_PROGRESS || 'REJECTED_RETURN_IN_PROGRESS')) {
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 16, fontSize: '0.72rem', fontWeight: 800, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                <AlertTriangle size={12} />
                <span>{statusText}</span>
              </span>
            );
          }
          if (status === (LOT_STAGES?.RETURNED_CLOSED || 'RETURNED_CLOSED')) {
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 16, fontSize: '0.72rem', fontWeight: 800, background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>
                <RotateCcw size={12} />
                <span>{statusText}</span>
              </span>
            );
          }
          // Default Completed
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 16, fontSize: '0.72rem', fontWeight: 800, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={12} />
              <span>{statusText || 'Delivered & Settled'}</span>
            </span>
          );
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #064e3b 100%)',
              borderRadius: 14, padding: '24px 28px', color: '#ffffff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '3px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                    🏛️ APMC DIRECT SOURCING AUDIT LEDGER
                  </span>
                  <span style={{ background: '#22c55e', color: '#ffffff', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800 }}>
                    {allOrders.length} Total Purchases
                  </span>
                  {activeOrdersCount > 0 && (
                    <span style={{ background: '#f59e0b', color: '#ffffff', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800 }}>
                      ⚡ {activeOrdersCount} In Transit / Active
                    </span>
                  )}
                </div>
                <h2 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Direct Farmer Sourcing Order History
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#cbd5e1', maxWidth: 820, lineHeight: 1.5 }}>
                  Real-time immutable ledger of all farmgate purchase orders, instant escrow locks, verified tare weighbridge slips, and automated payment releases.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={exportOrdersCSV}
                  style={{
                    padding: '10px 18px', background: '#ffffff', color: '#0f172a',
                    borderRadius: 8, border: 'none', fontWeight: 800, fontSize: '0.82rem',
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.15s ease'
                  }}
                >
                  <Download size={15} color="#15803d" />
                  <span>Export Full Ledger (CSV)</span>
                </button>
              </div>
            </div>

            {/* 4 Summary Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="panel" style={{ padding: '18px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TOTAL PROCUREMENT CAPITAL
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
                  ₹{(totalSpendAmount / 100000).toFixed(2)} Lakhs
                </div>
                <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700 }}>
                  100% Escrow Vault Protected
                </div>
              </div>

              <div className="panel" style={{ padding: '18px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TOTAL SOURCED VOLUME
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 2px' }}>
                  {(totalVolumeQtl / 10).toFixed(1)} MT
                </div>
                <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700 }}>
                  {totalVolumeQtl} Quintals (Direct Farmgate)
                </div>
              </div>

              <div className="panel" style={{ padding: '18px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ACTIVE IN PIPELINE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: activeOrdersCount > 0 ? '#ea580c' : '#0f172a', margin: '4px 0 2px' }}>
                  {activeOrdersCount} Consignments
                </div>
                <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700 }}>
                  Awaiting Fleet & In-Transit
                </div>
              </div>

              <div className="panel" style={{ padding: '18px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SETTLED & DELIVERED
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d', margin: '4px 0 2px' }}>
                  {completedOrdersCount} Orders
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                  {returnedOrdersCount > 0 ? `${returnedOrdersCount} Return/Dispute • ` : ''}100% Quality Passed
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="panel" style={{
              padding: '16px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
            }}>
              {/* Category Tabs */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Orders', count: allOrders.length },
                  { id: 'ACTIVE', label: 'Active & In-Transit', count: activeOrdersCount },
                  { id: 'COMPLETED', label: 'Delivered & Settled', count: completedOrdersCount },
                  { id: 'RETURNED', label: 'Returns & Disputed', count: returnedOrdersCount }
                ].map((tab) => {
                  const isActive = historyStatusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setHistoryStatusFilter(tab.id)}
                      style={{
                        padding: '7px 14px', borderRadius: 8, fontSize: '0.8rem',
                        fontWeight: isActive ? 800 : 600,
                        background: isActive ? '#0f172a' : '#f1f5f9',
                        color: isActive ? '#ffffff' : '#475569',
                        border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                      }}
                    >
                      <span>{tab.label}</span>
                      <span style={{
                        fontSize: '0.7rem', padding: '1px 7px', borderRadius: 12,
                        background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                        color: isActive ? '#ffffff' : '#475569', fontWeight: 800
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '7px 12px', width: 340, maxWidth: '100%' }}>
                <Search size={16} color="#64748b" style={{ marginRight: 8 }} />
                <input
                  type="text"
                  placeholder="Search order ID, farmer, crop, village..."
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.84rem', width: '100%', color: '#0f172a' }}
                />
                {historySearchTerm && (
                  <X size={14} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setHistorySearchTerm('')} />
                )}
              </div>
            </div>

            {/* Orders History Table */}
            <div style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      <th style={{ padding: '14px 16px' }}>Order ID & Date</th>
                      <th style={{ padding: '14px 16px' }}>Farmer & Origin</th>
                      <th style={{ padding: '14px 16px' }}>Commodity & Grade</th>
                      <th style={{ padding: '14px 16px' }}>Quantity</th>
                      <th style={{ padding: '14px 16px' }}>Direct Rate</th>
                      <th style={{ padding: '14px 16px' }}>Total Escrow</th>
                      <th style={{ padding: '14px 16px' }}>Workflow Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                          <History size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>No purchase orders match your filter</div>
                          <div style={{ fontSize: '0.78rem', marginTop: 4 }}>
                            Try adjusting your search keywords or switching category tabs.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o, idx) => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{o.id}</strong>
                              {o.isLiveDeal && (
                                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.65rem', fontWeight: 900, padding: '1px 6px', borderRadius: 4 }}>
                                  LIVE
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                              📅 {o.date} • {o.time}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#0369a1', fontFamily: 'monospace', marginTop: 2 }}>
                              Vault: {o.escrowRef}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{o.farmer}</div>
                            <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: 1 }}>📍 {o.village}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 1 }}>{o.landRecord}</div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{o.crop}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: '#e0f2fe', color: '#0369a1', fontWeight: 800 }}>
                                {o.grade}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                {o.qc}
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                            <div>{o.qty}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                              Weighbridge Verified
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px', fontWeight: 800, color: '#15803d' }}>
                            {o.rate}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.9rem' }}>
                              {o.total}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 1 }}>
                              Crop: ₹{o.productAmount?.toLocaleString('en-IN')} + Freight: ₹{o.transportAmount?.toLocaleString('en-IN')}
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            {renderStatusBadge(o.status, o.statusText)}
                          </td>

                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                              {o.category === 'ACTIVE' && (
                                <button
                                  onClick={() => handleTabChange('pickups')}
                                  style={{
                                    padding: '6px 10px', background: '#eff6ff', border: '1px solid #bfdbfe',
                                    borderRadius: 6, fontSize: '0.74rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: 4
                                  }}
                                >
                                  <Truck size={12} />
                                  <span>Track</span>
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedOrderForReceipt(o)}
                                style={{
                                  padding: '6px 12px', background: '#ffffff', border: '1px solid #cbd5e1',
                                  borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer',
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}
                              >
                                <FileText size={13} color="#ea580c" />
                                <span>Tax Invoice</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          MODAL 1: DIRECT-TO-FARMER PURCHASE ORDER & ESCROW DEPOSIT
          ========================================================= */}
      {selectedLotForPO && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="panel animate-slide-in" style={{ 
            width: 580, maxWidth: '100%', background: '#ffffff', borderRadius: 12, 
            padding: 0, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' 
          }}>
            
            {/* Modal Header */}
            <div style={{ background: '#0f172a', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#86efac', fontWeight: 800, textTransform: 'uppercase' }}>
                  DIRECT-TO-FARMER ESCROW PROTECTION
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '2px 0 0' }}>
                  Create Direct Purchase Order & Lock Escrow
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLotForPO(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmPO} style={{ padding: '20px' }}>
              
              {/* Target Farmer Info Banner */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedLotForPO.crop_name}</strong>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Farmer: <strong>{selectedLotForPO.farmer_name}</strong> • 📍 {selectedLotForPO.village} ({selectedLotForPO.farm_size || 'Family Farm'})
                    </div>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800 }}>
                    {selectedLotForPO.grade || 'Grade A'}
                  </span>
                </div>
              </div>

              {/* Editable Inputs: Qty & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Purchase Volume (Quintals):
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 6, padding: '7px 10px', background: '#ffffff' }}>
                    <input 
                      type="number"
                      value={poQty}
                      onChange={(e) => setPoQty(Number(e.target.value))}
                      min={10}
                      max={500}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 800 }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap' }}>Qtl ({(poQty / 10).toFixed(1)} MT)</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Agreed Direct Rate (₹/Qtl):
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 6, padding: '7px 10px', background: '#ffffff' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b', marginRight: 4 }}>₹</span>
                    <input 
                      type="number"
                      value={poPrice}
                      onChange={(e) => setPoPrice(Number(e.target.value))}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 800 }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>/Qtl</span>
                  </div>
                </div>
              </div>

              {/* Transparent Direct Settlement Breakdown */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 8, border: '1px solid #cbd5e1', marginBottom: 16 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                  Direct-to-Farmer Escrow Breakdown
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#334155', marginBottom: 4 }}>
                  <span>Direct Farmgate Produce Value ({poQty} Qtl @ ₹{poPrice}):</span>
                  <strong>₹{(poQty * poPrice).toLocaleString('en-IN')}.00</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#166534', marginBottom: 4 }}>
                  <span>Middleman / APMC Mandi Cess:</span>
                  <strong>₹0.00 (Zero Fee Direct Savings)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#334155', marginBottom: 8 }}>
                  <span>Direct Farmgate Pickup Freight Reserve:</span>
                  <span>₹{(poQty * 70).toLocaleString('en-IN')}.00</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 900, color: '#15803d' }}>
                  <span>Total Direct Escrow Deposit Required:</span>
                  <span>
                    ₹{(
                      (poQty * poPrice) + 
                      (poQty * 70)
                    ).toLocaleString('en-IN')}.00
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <button
                  type="button"
                  onClick={() => setPoPaymentTab('qr')}
                  style={{
                    padding: '9px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800,
                    background: poPaymentTab === 'qr' ? '#f0fdf4' : '#f8fafc',
                    border: `2px solid ${poPaymentTab === 'qr' ? '#16a34a' : '#cbd5e1'}`,
                    color: poPaymentTab === 'qr' ? '#15803d' : '#64748b',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: poPaymentTab === 'qr' ? '0 2px 6px rgba(22,163,74,0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <QrCode size={16} />
                  <span>📱 Scan UPI & QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPoPaymentTab('card')}
                  style={{
                    padding: '9px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800,
                    background: poPaymentTab === 'card' ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${poPaymentTab === 'card' ? '#2563eb' : '#cbd5e1'}`,
                    color: poPaymentTab === 'card' ? '#1d4ed8' : '#64748b',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: poPaymentTab === 'card' ? '0 2px 6px rgba(37,99,235,0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <CreditCard size={16} />
                  <span>💳 Cards / NetBanking</span>
                </button>
              </div>

              {poPaymentTab === 'qr' ? (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 10, border: '1px solid #cbd5e1', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{
                      background: '#ffffff', padding: 8, borderRadius: 10, border: '2px solid #16a34a',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(22,163,74,0.12)'
                    }}>
                      <QRCodeSVG
                        value={`upi://pay?pa=agriconnect.escrow@sbi&pn=AgriConnect%20State%20Escrow&mc=5411&tr=AC-PO-${selectedLotForPO.id || '892'}&tn=AgriConnect%20Escrow&am=${(poQty * poPrice) + (poQty * 70)}&cu=INR`}
                        size={120}
                        level="H"
                        includeMargin={false}
                      />
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#15803d', marginTop: 4 }}>
                        SCAN TO DEPOSIT
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: 4, fontSize: '0.66rem', fontWeight: 800 }}>
                          Rule 24 Escrow VPA
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          Verified SBI Escrow
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                        Pay Total: <strong style={{ color: '#15803d', fontSize: '1rem', fontWeight: 900 }}>₹{((poQty * poPrice) + (poQty * 70)).toLocaleString('en-IN')}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '3px 8px', fontSize: '0.72rem', fontFamily: 'monospace', color: '#334155' }}>
                          agriconnect.escrow@sbi
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyUpiVpa('agriconnect.escrow@sbi')}
                          style={{
                            background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6,
                            padding: '3px 8px', fontSize: '0.68rem', fontWeight: 700, color: '#475569',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3
                          }}
                        >
                          {copiedUpiVpa ? <Check size={11} color="#15803d" /> : <Copy size={11} />}
                          <span>{copiedUpiVpa ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Cred'].map((app) => (
                          <span key={app} style={{
                            fontSize: '0.62rem', fontWeight: 700, background: '#ffffff', border: '1px solid #e2e8f0',
                            padding: '2px 5px', borderRadius: 4, color: '#475569'
                          }}>
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #e2e8f0', fontSize: '0.7rem', color: '#64748b' }}>
                    🔒 <strong>APMC Rule 24:</strong> Funds will be securely held in escrow and released only after you inspect and accept shipment at destination hub.
                  </div>
                </div>
              ) : (
                <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <CreditCard size={16} color="#1d4ed8" />
                    <strong style={{ fontSize: '0.78rem', color: '#1e40af' }}>
                      Razorpay Standard Gateway (Test Mode)
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb', lineHeight: 1.4 }}>
                    Pay securely using Corporate Credit Cards, Debit Cards, or NetBanking across 50+ Indian banks.
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setSelectedLotForPO(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>

                {poPaymentTab === 'qr' ? (
                  <button
                    type="button"
                    onClick={handleConfirmUpiQRPayment}
                    disabled={isSubmittingPO}
                    style={{
                      flex: 2, padding: '10px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
                      background: '#15803d', border: 'none', color: '#ffffff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 2px 8px rgba(21,128,61,0.3)'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>
                      {isSubmittingPO ? 'Verifying & Holding Escrow...' : `Confirm UPI Payment & Lock Escrow`}
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmittingPO}
                    style={{
                      flex: 2, padding: '10px', borderRadius: 8, fontSize: '0.84rem', fontWeight: 800,
                      background: '#2563eb', border: 'none', color: '#ffffff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                    }}
                  >
                    <CreditCard size={16} />
                    <span>
                      {isSubmittingPO ? 'Opening Razorpay...' : `Pay ₹${((poQty * poPrice) + (poQty * 70)).toLocaleString('en-IN')} via Razorpay`}
                    </span>
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Quick QR Payment Modal */}
      {quickQrLot && (
        <RazorpayQrPaymentModal
          isOpen={!!quickQrLot}
          lot={quickQrLot}
          amount={Math.round((quickQrLot.quantity_qtl || 120) * (quickQrLot.asking_price || 2425) + ((quickQrLot.quantity_qtl || 120) * 70))}
          productAmount={Math.round((quickQrLot.quantity_qtl || 120) * (quickQrLot.asking_price || 2425))}
          transportAmount={Math.round((quickQrLot.quantity_qtl || 120) * 70)}
          onClose={() => setQuickQrLot(null)}
          onPaymentSuccess={() => {
            completeBuyerPurchase(quickQrLot.id, {
              quantity_qtl: quickQrLot.quantity_qtl || 120,
              agreed_price: quickQrLot.asking_price || 2425,
              transport_amount: Math.round((quickQrLot.quantity_qtl || 120) * 70),
              buyer_name: 'AgroFresh Supply Chain Pvt Ltd'
            });
            setQuickQrLot(null);
            setStep(17);
          }}
        />
      )}

      {/* APMC Statutory Buyer Verification Required Modal */}
      {showKycLockModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="panel animate-slide-in" style={{
            maxWidth: 520, width: '100%', background: '#ffffff', borderRadius: 16,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
            border: '1px solid #fed7aa', padding: 0
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #9a3412 0%, #c2410c 100%)',
              padding: '20px 24px', color: '#ffffff', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>
                  🔒
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                    Direct Purchase Locked — Admin Verification Required
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#ffedd5', marginTop: 2 }}>
                    Statutory APMC Mandi Regulation (Form-B Trading Scrutiny)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowKycLockModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{
                background: '#fffaf5', border: '1px solid #fed7aa', borderRadius: 10,
                padding: 14, fontSize: '0.84rem', color: '#7c2d12', lineHeight: 1.5
              }}>
                As a newly registered procurement entity, your trading account 
                <strong> ({authUser?.user?.name || 'Registered Buyer'})</strong> cannot directly place purchase orders or deposit escrow until the APMC Regulatory Magistrate verifies your statutory documents.
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
                  Application Status in Scrutiny Queue:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Application ID:</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{currentBuyerApp?.id || 'BAPP-PENDING'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>APMC License Status:</span>
                    <span style={{ fontWeight: 800, color: '#d97706' }}>Pending Magistrate Validation</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, fontSize: '0.82rem' }}>
                    <span style={{ color: '#64748b' }}>Attempted Lot:</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{kycLockTargetLot?.crop_name || 'Agricultural Produce Lot'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 10 }}>
                <button
                  onClick={() => {
                    setShowKycLockModal(false);
                    if (setTerminal) setTerminal('admin');
                    if (setStep) setStep(21);
                  }}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 8,
                    background: '#f1f5f9', border: '1px solid #cbd5e1',
                    color: '#334155', fontWeight: 800, fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  🏛️ Go to Admin Portal Queue
                </button>
                <button
                  onClick={() => {
                    if (currentBuyerApp?.id) {
                      approveBuyerApp(currentBuyerApp.id, 'Instant verification from Marketplace regulatory modal.');
                    } else if (authUser?.user?.id) {
                      approveBuyerApp(authUser.user.id, 'Instant verification from Marketplace regulatory modal.');
                    }
                    setShowKycLockModal(false);
                    if (kycLockTargetLot) {
                      handleOpenPOModal(kycLockTargetLot);
                    }
                  }}
                  style={{
                    flex: 1.2, padding: '12px', borderRadius: 8,
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    border: 'none', color: '#ffffff', fontWeight: 900, fontSize: '0.84rem',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  ⚡ Instant Verify (Demo Fast-Pass)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* =========================================================
          MODAL 3: POST DIRECT SOURCING REQUIREMENT
          ========================================================= */}
      {showNewRfqModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="panel animate-slide-in" style={{ 
            width: 580, maxWidth: '100%', background: '#ffffff', borderRadius: 12, 
            padding: 0, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' 
          }}>
            
            {/* Header */}
            <div style={{ background: '#15803d', padding: '16px 22px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#dcfce7', fontWeight: 800, textTransform: 'uppercase' }}>
                  DIRECT-TO-FARMER SOURCING
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '2px 0 0' }}>
                  Post Direct Purchase Requirement
                </h3>
              </div>
              <button 
                onClick={() => setShowNewRfqModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} style={{ padding: '22px' }}>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Target Commodity:
                </label>
                <select
                  value={newRfqCommodity}
                  onChange={(e) => setNewRfqCommodity(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Onion (Red / लाल कांदा)">Onion (Red / लाल कांदा)</option>
                  <option value="Soyabean (Yellow / पिवळी सोयाबीन)">Soyabean (Yellow / पिवळी सोयाबीन)</option>
                  <option value="Cotton (Medium Staple / कापूस)">Cotton (Medium Staple / कापूस)</option>
                  <option value="Pomegranate (Bhagwa / डाळिंब)">Pomegranate (Bhagwa / डाळिंब)</option>
                  <option value="Wheat (Sharbati / शरबती गहू)">Wheat (Sharbati / शरबती गहू)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Required Volume (Metric Tonnes):
                  </label>
                  <input 
                    type="number"
                    value={newRfqQty}
                    onChange={(e) => setNewRfqQty(Number(e.target.value))}
                    min={10}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Ceiling Direct Purchase Rate (₹/Qtl):
                  </label>
                  <input 
                    type="number"
                    value={newRfqPrice}
                    onChange={(e) => setNewRfqPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Preferred Sourcing Belt / Cluster:
                  </label>
                  <input 
                    type="text"
                    value={newRfqHub}
                    onChange={(e) => setNewRfqHub(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Fulfillment Deadline:
                  </label>
                  <input 
                    type="text"
                    value={newRfqDeadline}
                    onChange={(e) => setNewRfqDeadline(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Quality Tolerances & Packaging Specifications:
                </label>
                <textarea 
                  value={newRfqSpecs}
                  onChange={(e) => setNewRfqSpecs(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowNewRfqModal(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 2, padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 800,
                    background: '#15803d', border: 'none', color: '#ffffff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  <Sprout size={16} />
                  <span>Broadcast Direct Requirement</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: OFFICIAL APMC TAX INVOICE & FARMGATE SETTLEMENT RECEIPT
          ========================================================= */}
      {selectedOrderForReceipt && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20
        }}>
          <div className="panel animate-slide-in" style={{
            width: 720, maxWidth: '100%', maxHeight: '90vh', background: '#ffffff', borderRadius: 14,
            padding: 0, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '20px 24px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ background: '#22c55e', color: '#ffffff', padding: '2px 8px', borderRadius: 12, fontSize: '0.68rem', fontWeight: 800 }}>
                    FORM 6 • RULE 24 COMPLIANT
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    APMC Direct Sourcing Electronic Receipt
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '2px 0 0', color: '#ffffff' }}>
                  Electronic Mandi Tax Invoice & Settlement
                </h3>
                <div style={{ fontSize: '0.76rem', color: '#cbd5e1', marginTop: 3 }}>
                  Order ID: <strong style={{ color: '#ffffff' }}>{selectedOrderForReceipt.id}</strong> • Escrow Vault Ref: <strong style={{ color: '#38bdf8' }}>{selectedOrderForReceipt.escrowRef}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForReceipt(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ffffff', borderRadius: 8, padding: 6, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Parties Two Column Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: '#f8fafc', padding: '16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                    BUYER CONVOY (खरेदीदार)
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>AgroFresh Supply Chain Pvt Ltd</strong>
                  <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 2 }}>Direct Sourcing Terminal • Nashik & Pune Hubs</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 1 }}>GSTIN: 27AABCA1234F1Z8 • APMC License: MH-DIR-4409</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                    PRODUCER / FARMER (शेतकरी)
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedOrderForReceipt.farmer}</strong>
                  <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: 2, fontWeight: 700 }}>📍 {selectedOrderForReceipt.village}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 1 }}>Land Record: {selectedOrderForReceipt.landRecord} • {selectedOrderForReceipt.farmerPhone}</div>
                </div>
              </div>

              {/* Commodity & Quality Specs */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '10px 14px', fontWeight: 800, fontSize: '0.76rem', color: '#334155', textTransform: 'uppercase' }}>
                  Farmgate Assayed Commodity Details
                </div>
                <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Commodity</div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{selectedOrderForReceipt.crop}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Quality Grade</div>
                    <div style={{ fontWeight: 800, color: '#0284c7', marginTop: 2 }}>{selectedOrderForReceipt.grade}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Verified Volume</div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{selectedOrderForReceipt.qty}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Weighbridge QC</div>
                    <div style={{ fontWeight: 700, color: '#15803d', marginTop: 2 }}>{selectedOrderForReceipt.qc}</div>
                  </div>
                </div>
              </div>

              {/* Logistics & Transporter Details */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '10px 14px', fontWeight: 800, fontSize: '0.76rem', color: '#334155', textTransform: 'uppercase' }}>
                  Transporter & Transit Verification
                </div>
                <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Fleet Operator</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{selectedOrderForReceipt.transporter}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Vehicle Reg (Vahan)</div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2, fontFamily: 'monospace' }}>{selectedOrderForReceipt.vehicleNo}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Assigned Driver</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{selectedOrderForReceipt.driverName} ({selectedOrderForReceipt.driverPhone})</div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: '#f1f5f9', padding: '10px 14px', fontWeight: 800, fontSize: '0.76rem', color: '#334155', textTransform: 'uppercase' }}>
                  Statutory Dual-Split Escrow Settlement Breakdown
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>
                        Farmer Net Produce Value ({selectedOrderForReceipt.qtyNum} Qtl @ {selectedOrderForReceipt.rate})
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ₹{selectedOrderForReceipt.productAmount?.toLocaleString('en-IN')}.00
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>
                        Dedicated Farmgate Freight (Transporter Payout)
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        ₹{selectedOrderForReceipt.transportAmount?.toLocaleString('en-IN')}.00
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', color: '#15803d', fontWeight: 600 }}>
                        APMC Direct Market Fee / Mandi Cess (Exempted under Direct Farmgate Rule 24)
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#15803d' }}>
                        ₹0.00 (100% Direct Rebate)
                      </td>
                    </tr>
                    <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 900, color: '#0f172a' }}>
                        Total Escrow Settlement Debited
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#15803d', fontSize: '1.05rem' }}>
                        {selectedOrderForReceipt.total}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Statutory Notice */}
              <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: '0.74rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} color="#15803d" />
                <span>
                  This electronic tax receipt is issued under Section 31 of the Maharashtra Agricultural Produce Marketing (Regulation) Act. 100% funds disbursed via State Bank of India Multi-Party Escrow Vault.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '14px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Status: <strong style={{ color: '#0f172a' }}>{selectedOrderForReceipt.statusText}</strong>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(selectedOrderForReceipt.escrowRef);
                    }
                    addToast({
                      type: 'success',
                      title: 'Escrow Vault Ref Copied',
                      message: `${selectedOrderForReceipt.escrowRef} copied to clipboard.`
                    });
                  }}
                  style={{
                    padding: '8px 14px', borderRadius: 8, background: '#ffffff',
                    border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.78rem',
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Copy size={13} />
                  <span>Copy Vault Ref</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: '8px 16px', borderRadius: 8, background: '#0f172a',
                    border: 'none', color: '#ffffff', fontSize: '0.8rem',
                    fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <Printer size={14} />
                  <span>Print Official Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrderForReceipt(null)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, background: '#f1f5f9',
                    border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.8rem',
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ASSAYER PHYSICAL VERIFICATION CERTIFICATE MODAL                          */}
      {/* ========================================================================= */}
      {selectedLotForAssay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 16, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                    Physical Quality Assay Certificate
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Maharashtra APMC & APEDA Statutory Verification Ledger
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedLotForAssay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.82rem' }}>
              {/* Official Seal Banner */}
              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#15803d' }}>
                    ✓ MANUALLY VERIFIED PRODUCE LOT
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: 2 }}>
                    Lot Ref: <strong>{selectedLotForAssay.lot_code}</strong> • Certified by Authorized APMC Assayer
                  </div>
                </div>
                <div style={{
                  background: '#15803d', color: '#ffffff', padding: '6px 14px', borderRadius: 20,
                  fontSize: '0.9rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4
                }}>
                  <span>⭐ {selectedLotForAssay.field_agent_rating || 5}.0</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>/ 5.0</span>
                </div>
              </div>

              {/* Assayer Inspection Photo */}
              {selectedLotForAssay.assayer_photo && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ background: '#f8fafc', padding: '8px 12px', fontSize: '0.74rem', fontWeight: 800, color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📷 Field Gate Inspection Photograph</span>
                    <span style={{ color: '#15803d', fontWeight: 700 }}>Geo-Tagged & Verified</span>
                  </div>
                  <div style={{ position: 'relative', maxHeight: 220, overflow: 'hidden', background: '#0f172a' }}>
                    <img
                      src={selectedLotForAssay.assayer_photo}
                      alt="Assayer Field Capture"
                      style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.68rem', padding: '3px 8px', borderRadius: 4 }}>
                      📍 20.1745° N, 73.9842° E • Niphad Zone APMC Cadastral Boundary
                    </div>
                  </div>
                </div>
              )}

              {/* Metric Breakdown Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600, width: '40%' }}>Assayed Produce</td>
                      <td style={{ padding: '8px 12px', fontWeight: 800, color: '#0f172a' }}>{selectedLotForAssay.crop_name} ({selectedLotForAssay.variety})</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Cultivator / Land Record</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{selectedLotForAssay.farmer_name} • {selectedLotForAssay.origin || selectedLotForAssay.village}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Assigned Grade</td>
                      <td style={{ padding: '8px 12px', fontWeight: 800, color: '#15803d' }}>{selectedLotForAssay.grade}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>NIR Moisture Content</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{selectedLotForAssay.moisture_pct}% (Calibrated NIR Sensor)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Bulb Caliber / Sizing</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{selectedLotForAssay.size_caliber}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Export Compliance</td>
                      <td style={{ padding: '8px 12px', fontWeight: 800, color: selectedLotForAssay.is_exportable ? '#1d4ed8' : '#64748b' }}>
                        {selectedLotForAssay.is_exportable ? '🌍 Meets APEDA & Global Phytosanitary Specifications' : '🇮🇳 Domestic APMC Wholesale Standard'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600 }}>Certified Assaying Officer</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{selectedLotForAssay.assayed_by || 'Sachin B. Kadam (Authorized Krishi Sahayak)'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Statutory Guarantee */}
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, fontSize: '0.72rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
                🔒 <strong>Quality Guarantee:</strong> In case of transit spoilage or disparity upon receipt, buyer is insured under Maharashtra APMC Direct Transaction Guarantee (Section 31-B).
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
              <button
                type="button"
                onClick={() => setSelectedLotForAssay(null)}
                style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
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
