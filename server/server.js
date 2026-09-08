import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, isPgConnected } from './db.js';
import { gradeLotImages, get_model_for_crop, CROP_MODEL_MAP, MODEL_CONFIGS, GradingError } from './gradingService.js';
import agmarknetService from './agmarknetService.js';
import apmcFeedService from './services/apmcFeedService.js';
import weatherService from './services/weatherService.js';
import forecastService from './services/forecastService.js';
import razorpayService from './services/razorpayService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// In-memory reactive mirror for fallback & fast reactivity
let memoryStore = {
  lots: [
    {
      id: 1,
      lot_code: 'AC-892',
      farmer_id: 1,
      farmer_name: 'Santosh Shinde',
      commodity_id: 'onion',
      crop_name: 'Onion (Red / लाल कांदा)',
      variety: 'Gavran / High Pungency (गावराण)',
      quantity_qtl: 120,
      asking_price: 2450,
      mandi: 'Lasalgaon APMC',
      moisture_pct: 11.2,
      defect_pct: 1.2,
      size_caliber: '58.4 mm',
      grade: 'Grade A',
      insure_transit: true,
      include_residue: true,
      residue_value: 18000,
      status: 'ESCROW_LOCKED',
      certificate_no: 'MH-QG-2024-8841',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      lot_code: 'AC-1049',
      farmer_id: 1,
      farmer_name: 'Santosh Shinde',
      commodity_id: 'onion',
      crop_name: 'Nashik Red Onion (Lal Ghadva)',
      variety: 'Garwa / Export Grade',
      quantity_qtl: 80,
      asking_price: 2420,
      mandi: 'Lasalgaon APMC',
      moisture_pct: 11.8,
      defect_pct: 1.6,
      size_caliber: '55.0 mm',
      grade: 'Grade A',
      insure_transit: true,
      include_residue: false,
      residue_value: 0,
      status: 'ACTIVE',
      certificate_no: 'MH-QG-2024-9104',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      lot_code: 'AC-2041',
      farmer_id: 1,
      farmer_name: 'Santosh Shinde',
      commodity_id: 'soyabean',
      crop_name: 'Soyabean (Yellow Seed)',
      variety: 'JS-335 Certified',
      quantity_qtl: 150,
      asking_price: 4850,
      mandi: 'Pimpalgaon APMC',
      moisture_pct: 10.4,
      defect_pct: 0.8,
      size_caliber: '6.5 mm',
      grade: 'Grade A',
      insure_transit: true,
      include_residue: true,
      residue_value: 22000,
      status: 'ACTIVE',
      certificate_no: 'MH-QG-2024-9402',
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  deals: [
    {
      id: 1,
      deal_ref: 'AC-TXN-8841',
      lot_id: 1,
      lot_code: 'AC-892',
      buyer_id: 'agrofresh',
      buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
      farmer_id: 1,
      farmer_name: 'Santosh Shinde',
      driver_id: 1,
      driver_name: 'Rajesh Patil',
      crop_summary: 'Lot #AC-892 (120 Qtl Grade-A Red Onion)',
      quantity_qtl: 120,
      agreed_price: 2425,
      product_amount: 291000,
      transport_amount: 8450,
      total_escrow_amount: 299450,
      current_stage: 2,
      delivery_status: 'in_transit',
      escrow_status: 'PAYMENT_CAPTURED_ESCROW_HELD',
      transport_escrow_status: 'In Transit',
      razorpay_order_id: 'order_test_884101',
      razorpay_payment_id: 'pay_test_884101',
      razorpay_transfer_farmer_id: null,
      razorpay_transfer_driver_id: null,
      transporter_info: 'VRL Logistics (MH 15 EG 4402 - Rajesh Patil)',
      escrow_vault_ref: '#SBI-MH-ESC-8841029',
      status: 'PAYMENT_CAPTURED_ESCROW_HELD',
      created_at: new Date(Date.now() - 6 * 3600000).toISOString()
    },
    {
      id: 2,
      deal_ref: 'AC-TXN-8890',
      lot_id: 2,
      lot_code: 'AC-1049',
      buyer_id: 'sahyadri_fpc',
      buyer_name: 'Sahyadri Farmer Producer Co',
      farmer_id: 1,
      farmer_name: 'Santosh Shinde',
      driver_id: 2,
      driver_name: 'Sunil Jadhav',
      crop_summary: 'Lot #AC-1049 (80 Qtl Grade-A Nashik Red Onion)',
      quantity_qtl: 80,
      agreed_price: 2420,
      product_amount: 193600,
      transport_amount: 6200,
      total_escrow_amount: 199800,
      current_stage: 4,
      delivery_status: 'delivered',
      escrow_status: 'AWAITING_DELIVERY_CONFIRMATION',
      transport_escrow_status: 'Delivered — Awaiting Buyer Confirmation',
      razorpay_order_id: 'order_test_889002',
      razorpay_payment_id: 'pay_test_889002',
      razorpay_transfer_farmer_id: null,
      razorpay_transfer_driver_id: null,
      transporter_info: 'Godavari Kisan Carrier (MH 12 QX 9821 - Sunil Jadhav)',
      escrow_vault_ref: '#SBI-MH-ESC-8890142',
      status: 'AWAITING_DELIVERY_CONFIRMATION',
      created_at: new Date(Date.now() - 18 * 3600000).toISOString()
    },
    {
      id: 3,
      deal_ref: 'AC-TXN-9021',
      lot_id: 3,
      lot_code: 'AC-2041',
      buyer_id: 'agrofresh',
      buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
      farmer_id: 1,
      farmer_name: 'Santosh Shinde',
      driver_id: 1,
      driver_name: 'Rajesh Patil',
      crop_summary: 'Lot #AC-2041 (150 Qtl Grade-A Yellow Soyabean)',
      quantity_qtl: 150,
      agreed_price: 4850,
      product_amount: 727500,
      transport_amount: 12500,
      total_escrow_amount: 740000,
      current_stage: 5,
      delivery_status: 'confirmed',
      escrow_status: 'COMPLETED_FUNDS_RELEASED',
      transport_escrow_status: 'Fee Released',
      razorpay_order_id: 'order_test_902103',
      razorpay_payment_id: 'pay_test_902103',
      razorpay_transfer_farmer_id: 'trf_farmer_test_9021',
      razorpay_transfer_driver_id: 'trf_driver_test_9021',
      transporter_info: 'Sahyadri Cold Chain (MH 15 EG 4402 Reefer)',
      escrow_vault_ref: '#SBI-MH-ESC-9021990',
      status: 'COMPLETED_FUNDS_RELEASED',
      created_at: new Date(Date.now() - 36 * 3600000).toISOString()
    }
  ],
  grievances: [
    {
      id: 1,
      ticket_code: 'GRV-2024-0419',
      deal_ref: 'AC-TXN-8841',
      farmer_name: 'Santosh Shinde',
      buyer_name: 'AgroFresh Supply Chain Pvt Ltd',
      category: 'Delayed Assayer Inward Certificate & Escrow Lock',
      description: 'Produce truck arrived at Lasalgaon hub at 09:30 AM. Mandi assayer report not uploaded within statutory 4-hour window under Maharashtra APMC Act Rule 24.',
      sla_deadline: new Date(Date.now() + 3 * 3600000 + 12 * 60000).toISOString(),
      status: 'Under Review by APMC Officer',
      priority: 'HIGH (Statutory Sec 31-B)',
      escrow_locked_amount: 291000,
      filed_at: 'Today, 08:30 AM IST'
    },
    {
      id: 2,
      ticket_code: 'GRV-2024-0392',
      deal_ref: 'ESC-MH-2024-94100234',
      farmer_name: 'Dnyaneshwar Gaikwad',
      buyer_name: 'Kisan Fresh Aggregators',
      category: 'Transit Weight Discrepancy (1.4% Loss)',
      description: 'Weighbridge calibrated variance of 140 kg on 100 Qtl lot. Disputed deduction of ₹3,400 from agreed payout.',
      sla_deadline: new Date(Date.now() + 19 * 3600000 + 45 * 60000).toISOString(),
      status: 'Escalated to Mandi Arbitrator',
      priority: 'MEDIUM',
      escrow_locked_amount: 242000,
      filed_at: 'Yesterday, 02:15 PM IST'
    }
  ],
  farmer: {
    name: 'Santosh Shinde',
    father_name: 'Ramdas Shinde',
    farmer_code: 'MH-NAS-2024-8821',
    mobile: '+91 98224 81920',
    district: 'Nashik',
    taluka: 'Niphad',
    village: 'Pimpalgaon Baswant',
    land_gut_no: 'Gut No. 142/B',
    land_area: '4.20 Acres Cultivated (Irrigated)',
    soil_health_card: 'SHC-MH-2023-7712',
    aadhaar_status: 'Aadhaar e-KYC Verified',
    maha_eseva_status: '7/12 Digital Extract Linked',
    bank_name: 'State Bank of India',
    bank_account: 'State Bank of India (A/C: *******4921)',
    ifsc: 'SBIN0001429',
    trust_score: 98,
    escrow_wallet_pending: 291000
  },
  drivers: [
    {
      id: 1,
      driver_code: 'DRV-MH-8841',
      user_id: 'driver_1',
      name: 'Rajesh Patil',
      mobile: '+91 98231 77410',
      vehicle_reg_no: 'MH 15 EG 4402',
      license_no: 'MH15 20180049210',
      vehicle_type: 'Ashok Leyland Ecomet 1215 (LCV)',
      vehicle_capacity_kg: 6000,
      vahan_status: 'Vahan Verified',
      fitness_valid_until: '2026-11-30',
      insurance_valid_until: '2026-08-15',
      puc_valid_until: '2025-12-31',
      trust_score: 96,
      rating_avg: 4.9,
      settled_trips: 142,
      bank_name: 'State Bank of India',
      bank_account: '*******6819',
      ifsc: 'SBIN0001429'
    },
    {
      id: 2,
      driver_code: 'DRV-MH-9104',
      user_id: 'driver_2',
      name: 'Sunil Jadhav',
      mobile: '+91 94222 18940',
      vehicle_reg_no: 'MH 12 QX 9821',
      license_no: 'MH12 20160018402',
      vehicle_type: 'Tata 1109 LPT High-Deck (HGV)',
      vehicle_capacity_kg: 8500,
      vahan_status: 'Vahan Verified',
      fitness_valid_until: '2026-09-20',
      insurance_valid_until: '2026-07-10',
      puc_valid_until: '2025-11-15',
      trust_score: 94,
      rating_avg: 4.8,
      settled_trips: 98,
      bank_name: 'Bank of Maharashtra',
      bank_account: '*******4402',
      ifsc: 'MAHB0000142'
    }
  ],
  delivery_jobs: [
    {
      id: 1,
      job_code: 'JOB-2024-8841',
      deal_ref: 'AC-TXN-8841',
      driver_id: 1,
      driver_name: 'Rajesh Patil',
      vehicle_reg_no: 'MH 15 EG 4402',
      pickup_location: 'Farm Gate: Gut No. 142/B, Pimpalgaon, Niphad Taluka, Nashik',
      drop_location: 'AgroFresh Central Sourcing Hub, Lasalgaon Mandi Grid, Nashik',
      distance_km: 18,
      commodity_summary: 'Lot #AC-892 (120 Qtl Grade-A Red Onion)',
      weight_qtl: 120.00,
      is_pooled: false,
      pooled_lots_count: 1,
      delivery_fee: 8450.00,
      status: 'assigned', // 'assigned' | 'picked_up' | 'delivered' | 'confirmed'
      proof_photo_url: null,
      picked_up_at: null,
      delivered_at: null,
      confirmed_at: null,
      auto_release_deadline: null,
      transit_insurance_id: 'ICICI-LOMB-AGRI-8841',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      job_code: 'JOB-POOL-0941',
      deal_ref: null,
      driver_id: null,
      driver_name: null,
      vehicle_reg_no: null,
      pickup_location: 'FPO Aggregation Center: Pimpalgaon Mandi Yard (3 Farm Pickups)',
      drop_location: 'Sahyadri Farmers Producer Co. Mega Food Park, Dindori, Nashik',
      distance_km: 42,
      commodity_summary: 'Pooled Lot #POOL-88 (240 Qtl Combined Red Onion - 3 Farmers)',
      weight_qtl: 240.00,
      is_pooled: true,
      pooled_lots_count: 3,
      delivery_fee: 14800.00,
      status: 'assigned',
      proof_photo_url: null,
      picked_up_at: null,
      delivered_at: null,
      confirmed_at: null,
      auto_release_deadline: null,
      transit_insurance_id: 'ICICI-LOMB-AGRI-9902',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      job_code: 'JOB-2024-7712',
      deal_ref: null,
      driver_id: 1,
      driver_name: 'Rajesh Patil',
      vehicle_reg_no: 'MH 15 EG 4402',
      pickup_location: 'Farm Gate: Gut 88, Vinchur, Nashik',
      drop_location: 'Pune Market Yard Gate #4, Gultekdi, Pune',
      distance_km: 185,
      commodity_summary: 'Soyabean (Yellow Seed) - 80 Qtl',
      weight_qtl: 80.00,
      is_pooled: false,
      pooled_lots_count: 1,
      delivery_fee: 16200.00,
      status: 'delivered',
      proof_photo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
      picked_up_at: new Date(Date.now() - 6 * 3600000).toISOString(),
      delivered_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      confirmed_at: null,
      auto_release_deadline: new Date(Date.now() + 46 * 3600000).toISOString(),
      transit_insurance_id: 'ICICI-LOMB-AGRI-7712',
      created_at: new Date(Date.now() - 8 * 3600000).toISOString()
    }
  ],
  driver_payouts: [
    {
      id: 1,
      payout_code: 'PO-DRV-8841',
      job_id: 1,
      driver_id: 1,
      amount: 8450.00,
      escrow_status: 'LOCKED_IN_ESCROW',
      bank_ref: '#SBI-MH-ESC-8841029-DRV',
      released_at: null,
      created_at: new Date().toISOString()
    }
  ],
  ratings: [
    {
      id: 1,
      deal_ref: 'AC-TXN-8841',
      job_id: 1,
      from_role: 'buyer',
      to_role: 'driver',
      from_name: 'AgroFresh Supply Chain Pvt Ltd',
      to_name: 'Rajesh Patil',
      stars: 5,
      feedback: 'Excellent punctuality and careful handling of fresh onion sacks.',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

// 1. Health & Database Status
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await query('SELECT NOW() as now, current_database() as db;');
    res.json({
      status: 'connected',
      backend: 'Node.js Express',
      database: 'PostgreSQL 18',
      dbName: dbRes.rows[0].db,
      serverTime: dbRes.rows[0].now,
      liveSync: true
    });
  } catch (err) {
    res.json({
      status: 'running_fallback',
      backend: 'Node.js Express',
      database: 'In-Memory Mirror',
      notice: 'PostgreSQL connecting or offline: ' + err.message,
      liveSync: false
    });
  }
});

// 2. Farmer Profile
app.get('/api/farmer/profile', async (req, res) => {
  try {
    const result = await query('SELECT * FROM farmers LIMIT 1;');
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
  } catch (e) {
    // fallback
  }
  res.json(memoryStore.farmer);
});

// 3a. Daily Average Modal Price Trend Endpoint (Agmarknet)
app.get(['/api/v1/prices/daily-average', '/api/prices/daily-average'], async (req, res) => {
  const crop = req.query.crop || req.query.commodity || 'onion';
  const days = parseInt(req.query.days, 10) || 7;

  try {
    const dailyData = await agmarknetService.getDailyAveragePrices({ crop, days });
    return res.json(dailyData);
  } catch (err) {
    console.error('[AgriConnect Server] Daily average price service error:', err.message);
    res.status(500).json({
      error: 'Failed to compute daily average price data',
      message: err.message,
      data: []
    });
  }
});

// 3. Mandi Prices & Live Agmarknet Tracking
app.get(['/api/v1/prices', '/api/prices'], async (req, res) => {
  const crop = req.query.crop || req.query.commodity || 'onion';
  const district = req.query.district || 'all';
  const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';

  try {
    const livePriceData = await agmarknetService.getLiveMandiPrices({
      crop,
      district,
      forceRefresh,
      homeDistrict: memoryStore.farmer?.district || 'Nashik'
    });

    // If client requested format=array or legacy array format
    if (req.query.format === 'array') {
      return res.json(livePriceData.records);
    }

    return res.json(livePriceData);
  } catch (err) {
    console.error('[AgriConnect Server] Agmarknet price service error:', err.message);
    res.status(500).json({
      error: 'Failed to fetch Agmarknet price data',
      message: err.message,
      records: []
    });
  }
});

// 3b. AI Crop Price Forecasting (Hybrid SARIMA + Lag-Llama + IMD Weather)
app.get(['/api/v1/forecast', '/api/forecast'], async (req, res) => {
  const crop = req.query.crop || req.query.commodity || 'onion';
  const mandi = req.query.mandi || 'Lasalgaon APMC';
  const days = parseInt(req.query.days, 10) || 7;
  const forceRefresh = req.query.refresh === 'true' || req.query.refresh === '1';

  try {
    const forecast = await forecastService.getForecast({
      crop,
      mandi,
      horizonDays: days,
      forceRefresh
    });
    return res.json(forecast);
  } catch (err) {
    console.error('[AgriConnect Server] Forecast endpoint error:', err.message);
    return res.status(500).json({
      error: 'Failed to generate hybrid crop price forecast',
      message: err.message
    });
  }
});

// 3c. Official APMC Mandi Bulletin Feeds
app.get(['/api/v1/apmc/feed', '/api/apmc/feed'], async (req, res) => {
  try {
    const feed = await apmcFeedService.fetchOfficialAPMCFeed();
    return res.json(feed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3d. IMD Weather Agrometeorological Grid
app.get(['/api/v1/weather/grid', '/api/weather/grid'], async (req, res) => {
  try {
    const district = req.query.district || 'all';
    const grid = await weatherService.getWeatherGrid(district);
    return res.json(grid);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Commodities List
app.get('/api/commodities', async (req, res) => {
  try {
    const result = await query('SELECT * FROM commodities ORDER BY name;');
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {
    console.error('[DB Error - /api/commodities]:', e.message);
  }

  res.json([
    { id: 'onion', name: 'Onion (Red / लाल कांदा)', variety: 'Gavran / High Pungency (गावराण)', category: 'Allium Cepa', msp: 1850 },
    { id: 'soyabean', name: 'Soyabean (सोयाबीन)', variety: 'JS-335 / Yellow Seed', category: 'Glycine max', msp: 4600 },
    { id: 'cotton', name: 'Cotton (कापूस)', variety: 'BT Hybrid / Medium Staple', category: 'Gossypium', msp: 7020 },
    { id: 'pomegranate', name: 'Pomegranate (डाळिंब)', variety: 'Bhagwa (भगवा)', category: 'Punica granatum', msp: 7500 },
    { id: 'tomato', name: 'Tomato (टोमॅटो)', variety: 'Abhinav / F1 Hybrid', category: 'Solanum lycopersicum', msp: 1200 }
  ]);
});

// 5. Lots Listing & Creation
app.get('/api/lots', async (req, res) => {
  try {
    const result = await query('SELECT * FROM lots ORDER BY created_at DESC;');
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {
    console.error('[DB Error - /api/lots GET]:', e.message);
  }
  res.json(memoryStore.lots);
});

app.post('/api/lots', async (req, res) => {
  const lotData = req.body;
  const lotCode = `AC-${Math.floor(1000 + Math.random() * 9000)}`;
  const certNo = `MH-QG-2024-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLot = {
    lot_code: lotCode,
    farmer_id: 1,
    farmer_name: lotData.farmer_name || 'Santosh Shinde',
    commodity_id: lotData.commodity_id || 'onion',
    crop_name: lotData.crop_name || 'Onion (Red / लाल कांदा)',
    variety: lotData.variety || 'Gavran / High Pungency (गावराण)',
    quantity_qtl: Number(lotData.quantity_qtl) || 120,
    asking_price: Number(lotData.asking_price) || 2450,
    mandi: lotData.mandi || 'Lasalgaon APMC',
    moisture_pct: Number(lotData.moisture_pct) || 11.4,
    defect_pct: Number(lotData.defect_pct) || 1.2,
    size_caliber: lotData.size_caliber || '58.4 mm',
    grade: lotData.grade || 'Grade A',
    insure_transit: Boolean(lotData.insure_transit),
    include_residue: Boolean(lotData.include_residue),
    residue_value: lotData.include_residue ? 18000 : 0,
    status: 'ACTIVE',
    certificate_no: certNo
  };

  try {
    const result = await query(
      `INSERT INTO lots 
        (lot_code, farmer_id, farmer_name, commodity_id, crop_name, variety, quantity_qtl, asking_price, mandi, moisture_pct, defect_pct, size_caliber, grade, insure_transit, include_residue, residue_value, status, certificate_no)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *;`,
      [
        newLot.lot_code, newLot.farmer_id, newLot.farmer_name, newLot.commodity_id, newLot.crop_name, newLot.variety,
        newLot.quantity_qtl, newLot.asking_price, newLot.mandi, newLot.moisture_pct, newLot.defect_pct,
        newLot.size_caliber, newLot.grade, newLot.insure_transit, newLot.include_residue, newLot.residue_value,
        newLot.status, newLot.certificate_no
      ]
    );
    if (result.rows.length > 0) {
      memoryStore.lots.unshift(result.rows[0]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (e) {
    console.error('[DB Error - /api/lots POST]:', e.message);
  }

  newLot.id = memoryStore.lots.length + 1;
  newLot.created_at = new Date().toISOString();
  memoryStore.lots.unshift(newLot);
  res.status(201).json(newLot);
});

// 5b. AI Quality Grading (Roboflow Universe Multi-Model Routing & Fallback)
// Model Registry & Crop Routing Info
app.get(['/api/v1/grading/models', '/api/grading/models'], (req, res) => {
  res.json({
    crop_model_map: CROP_MODEL_MAP,
    model_configs: MODEL_CONFIGS,
    routing_info: {
      onion: get_model_for_crop('onion'),
      tomato: get_model_for_crop('tomato'),
      soyabean: get_model_for_crop('soyabean'),
      default: get_model_for_crop('default')
    }
  });
});

// Main Quality Grading Endpoint for Lots
async function handleGradeLot(req, res) {
  const { id } = req.params;
  const { photos, crop_type, moisture_pct, size_caliber, foreign_matter, damage_pct } = req.body;
  const apiKey = req.headers['x-roboflow-api-key'] || req.body.api_key || req.body.apiKey;

  try {
    let resolvedCropType = crop_type;
    let targetLot = null;

    // Resolve lot from DB or memoryStore if not a draft
    if (id && id !== 'draft' && id !== 'new' && id !== '0') {
      try {
        const lotRes = await query('SELECT * FROM lots WHERE id::text = $1 OR lot_code = $1 LIMIT 1;', [String(id)]);
        if (lotRes && lotRes.rows.length > 0) {
          targetLot = lotRes.rows[0];
          resolvedCropType = resolvedCropType || targetLot.commodity_id || targetLot.crop_name;
        }
      } catch (dbErr) {
        // Fall back to memoryStore
      }

      if (!targetLot) {
        targetLot = memoryStore.lots.find(l => String(l.id) === String(id) || l.lot_code === String(id));
        if (targetLot) {
          resolvedCropType = resolvedCropType || targetLot.commodity_id || targetLot.crop_name;
        }
      }
    }

    if (!resolvedCropType) {
      resolvedCropType = 'onion';
    }

    // Call gradingService
    const gradingResult = await gradeLotImages({
      crop_type: resolvedCropType,
      photos: Array.isArray(photos) && photos.length > 0 ? photos : [
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80'
      ],
      apiKey
    });

    // If lot exists, update lot record with grading audit trail
    if (targetLot) {
      targetLot.grade = gradingResult.full_grade_title;
      targetLot.grade_confidence = gradingResult.grade_confidence;
      targetLot.defect_flags = gradingResult.defect_flags;
      targetLot.model_used = gradingResult.model_used;
      targetLot.used_fallback_model = gradingResult.used_fallback_model;
      targetLot.fallback_reason = gradingResult.fallback_reason;
      targetLot.grading_audit = gradingResult.audit_log;
      targetLot.needs_review = gradingResult.needs_review;
      if (moisture_pct !== undefined) targetLot.moisture_pct = Number(moisture_pct);
      if (size_caliber !== undefined) targetLot.size_caliber = String(size_caliber);

      try {
        await query(
          `UPDATE lots SET 
            grade = $1, 
            moisture_pct = COALESCE($2, moisture_pct), 
            size_caliber = COALESCE($3, size_caliber),
            status = CASE WHEN $4 = true THEN 'UNDER_REVIEW' ELSE status END
           WHERE id = $5;`,
          [targetLot.grade, moisture_pct || null, size_caliber || null, gradingResult.needs_review, targetLot.id]
        );
      } catch (dbErr) {
        // In-memory update succeeded
      }
    }

    return res.status(200).json({
      lot_id: targetLot ? targetLot.id : id,
      crop_type: resolvedCropType,
      ...gradingResult
    });
  } catch (err) {
    if (err instanceof GradingError) {
      return res.status(422).json({
        success: false,
        error_code: err.code,
        message: err.messages,
        error: err.message
      });
    }

    return res.status(500).json({
      success: false,
      error_code: 'GRADING_FAILED',
      message: {
        en: 'Grading failed: ' + err.message,
        mr: 'गुणवत्ता तपासणी अयशस्वी: ' + err.message,
        hi: 'गुणवत्ता जांच विफल: ' + err.message
      },
      error: err.message
    });
  }
}

app.post('/api/v1/lots/:id/grade', handleGradeLot);
app.post('/api/lots/:id/grade', handleGradeLot);

// 6. Buyers Catalog
app.get('/api/buyers', async (req, res) => {
  try {
    const result = await query('SELECT * FROM buyers ORDER BY rating DESC;');
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {}

  res.json([
    {
      id: 'agrofresh',
      name: 'AgroFresh Supply Chain Pvt Ltd',
      type: 'Commercial Mandi Aggregator & Institutional Processor',
      badge: 'Government Verified',
      license_no: 'MH-PUN-APMC-9421',
      cin: 'U01100MH2018PTC309112',
      incorporated: 'May 2018 (Nashik, MH)',
      contact_person: 'Rajesh Mehta (Dir. Sourcing & Procurement)',
      rating: 4.9,
      trust_score: 98,
      escrow_deposit_limit: '₹5.00 Crore',
      settled_deals: 842,
      active_offer_range: '₹2,380 - ₹2,425 / Qtl',
      location: 'Lasalgaon Mandi Grid, Nashik'
    },
    {
      id: 'sahyadri',
      name: 'Sahyadri Farmer Producer Co. Ltd',
      type: 'Accredited Farmer Producer Organization & Export Grid',
      badge: 'Government Verified',
      license_no: 'MH-NSK-APMC-1104',
      cin: 'U01403MH2011PTC212344',
      incorporated: 'January 2011 (Mohadi, Nashik)',
      contact_person: 'Vilas Shinde (Managing Director)',
      rating: 5.0,
      trust_score: 99,
      escrow_deposit_limit: '₹12.50 Crore',
      settled_deals: 2150,
      active_offer_range: '₹2,410 / Qtl (Export Grade A)',
      location: 'Mohadi, Dindori Road, Nashik'
    },
    {
      id: 'mahaagro',
      name: 'MahaAgro Food Processors & Exporters',
      type: 'Institutional Food Processor & Dehydration Plant',
      badge: 'KYC Verified',
      license_no: 'MH-VSH-APMC-6733',
      cin: 'U15400MH2016PTC281900',
      incorporated: 'August 2016 (Vashi Navi Mumbai)',
      contact_person: 'Kishore Bhende (Head of Procurement)',
      rating: 4.7,
      trust_score: 94,
      escrow_deposit_limit: '₹3.20 Crore',
      settled_deals: 490,
      active_offer_range: '₹2,350 / Qtl',
      location: 'APMC Market II, Vashi, Navi Mumbai'
    },
    {
      id: 'reliance_fresh',
      name: 'Reliance Retail Agro Hub',
      type: 'Modern Organized Retail Aggregation Center',
      badge: 'Enterprise Escrow Verified',
      license_no: 'MH-MUM-APMC-8812',
      cin: 'U51900MH2000PLC128420',
      incorporated: 'March 2006 (Mumbai, MH)',
      contact_person: 'Sunil Deshmukh (Agri Ops)',
      rating: 4.8,
      trust_score: 97,
      escrow_deposit_limit: '₹25.00 Crore',
      settled_deals: 4120,
      active_offer_range: '₹2,400 - ₹2,450 / Qtl',
      location: 'Ghoti Sourcing Hub, Nashik'
    }
  ]);
});

// ============================================================================
// 7. Razorpay Payment Gateway & Dual Escrow Pipeline
// ============================================================================

// A. Razorpay Public Config (Key ID & currency)
app.get(['/api/v1/payment/config', '/api/payment/config'], (req, res) => {
  res.json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TZ2MRrzjvZvfqW',
    currency: 'INR',
    testMode: true
  });
});

// Helper to enrich a deal record with escrow and transport statuses
function enrichDealRecord(d) {
  if (!d) return d;
  const stage = Number(d.current_stage || 2);
  const qty = Number(d.quantity_qtl || 120);
  const price = Number(d.agreed_price || 2425);
  const prodAmt = Number(d.product_amount) || (price * qty) || (Number(d.total_escrow_amount) - 8450) || 291000;
  const transAmt = Number(d.transport_amount) || 8450;
  const totalAmt = Number(d.total_escrow_amount) || (prodAmt + transAmt);

  let escrowStatus = d.escrow_status || d.status || 'PAYMENT_CAPTURED_ESCROW_HELD';
  let transportStatus = d.transport_escrow_status;
  let deliveryStatus = d.delivery_status;

  if (!deliveryStatus) {
    if (stage >= 5) deliveryStatus = 'confirmed';
    else if (stage === 4) deliveryStatus = 'delivered';
    else if (stage >= 2) deliveryStatus = 'in_transit';
    else deliveryStatus = 'pending';
  }

  if (!transportStatus) {
    if (stage >= 5) transportStatus = 'Fee Released';
    else if (stage === 4) transportStatus = 'Delivered — Awaiting Buyer Confirmation';
    else if (stage >= 2) transportStatus = 'In Transit';
    else transportStatus = 'Assigned';
  }

  if (escrowStatus === 'ESCROW_LOCKED') {
    if (stage >= 5) escrowStatus = 'COMPLETED_FUNDS_RELEASED';
    else if (stage === 4) escrowStatus = 'AWAITING_DELIVERY_CONFIRMATION';
    else escrowStatus = 'PAYMENT_CAPTURED_ESCROW_HELD';
  }

  return {
    ...d,
    lot_code: d.lot_code || `AC-${d.lot_id || '892'}`,
    product_amount: prodAmt,
    transport_amount: transAmt,
    total_escrow_amount: totalAmt,
    delivery_status: deliveryStatus,
    escrow_status: escrowStatus,
    transport_escrow_status: transportStatus,
    status: escrowStatus,
    driver_name: d.driver_name || 'Rajesh Patil',
    driver_id: d.driver_id || 1,
    farmer_id: d.farmer_id || 1,
    farmer_name: d.farmer_name || 'Santosh Shinde'
  };
}

// B. Get all deals (Supports role filtering: farmer, buyer, driver/transporter)
app.get(['/api/v1/deals', '/api/deals'], async (req, res) => {
  const { role, user_id, status } = req.query;
  try {
    const result = await query('SELECT * FROM deals ORDER BY id DESC;');
    if (result.rows.length > 0) {
      let rows = result.rows.map(enrichDealRecord);
      if (status) rows = rows.filter(d => d.status === status || d.escrow_status === status);
      return res.json(rows);
    }
  } catch (e) {}

  let deals = memoryStore.deals.map(enrichDealRecord);
  if (status) {
    deals = deals.filter(d => d.status === status || d.escrow_status === status);
  }
  res.json(deals);
});

// C. Get single deal by reference
app.get(['/api/v1/deals/:ref', '/api/deals/:ref'], async (req, res) => {
  const { ref } = req.params;
  try {
    const result = await query('SELECT * FROM deals WHERE deal_ref = $1 OR id::text = $1 LIMIT 1;', [ref]);
    if (result.rows.length > 0) return res.json(enrichDealRecord(result.rows[0]));
  } catch (e) {}

  const deal = memoryStore.deals.find(d => d.deal_ref === ref || String(d.id) === String(ref));
  if (deal) return res.json(enrichDealRecord(deal));
  res.status(404).json({ error: 'Deal not found' });
});

// D. Create Razorpay Order for "Buy Direct"
// Itemizes produce cost and transport cost as separate line amounts in notes
app.post(['/api/v1/payment/create-order', '/api/payment/create-order'], async (req, res) => {
  const {
    lot_id,
    lot_code,
    product_amount,
    transport_amount,
    agreed_price,
    quantity_qtl,
    crop_summary,
    buyer_id,
    buyer_name,
    farmer_id,
    farmer_name,
    transporter_id,
    driver_name
  } = req.body;

  try {
    const prodAmt = Number(product_amount) || (Number(agreed_price || 2425) * Number(quantity_qtl || 120));
    const transAmt = Number(transport_amount) || 8450;
    const dealRef = `AC-TXN-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderResult = await razorpayService.createOrder({
      productAmount: prodAmt,
      transportAmount: transAmt,
      dealRef,
      lotCode: lot_code || `AC-${lot_id || '892'}`,
      buyerName: buyer_name || 'Accredited Buyer',
      farmerName: farmer_name || 'Santosh Shinde',
      farmerId: farmer_id || 1,
      transporterId: transporter_id || 1
    });

    // Create / register the deal in memoryStore with PAYMENT_INITIATED
    const newDeal = {
      id: memoryStore.deals.length + 1,
      deal_ref: dealRef,
      lot_id: lot_id || 1,
      lot_code: lot_code || 'AC-892',
      buyer_id: buyer_id || 'agrofresh',
      buyer_name: buyer_name || 'AgroFresh Supply Chain Pvt Ltd',
      farmer_id: farmer_id || 1,
      farmer_name: farmer_name || 'Santosh Shinde',
      driver_id: transporter_id || 1,
      driver_name: driver_name || 'Rajesh Patil',
      crop_summary: crop_summary || `Lot #${lot_code || 'AC-892'} (${quantity_qtl || 120} Qtl)`,
      quantity_qtl: Number(quantity_qtl) || 120,
      agreed_price: Number(agreed_price) || Math.round(prodAmt / (Number(quantity_qtl) || 1)),
      product_amount: prodAmt,
      transport_amount: transAmt,
      total_escrow_amount: prodAmt + transAmt,
      current_stage: 1,
      delivery_status: 'pending',
      escrow_status: 'PAYMENT_INITIATED',
      transport_escrow_status: 'Assigned',
      razorpay_order_id: orderResult.orderId,
      razorpay_payment_id: null,
      razorpay_transfer_farmer_id: null,
      razorpay_transfer_driver_id: null,
      transporter_info: `${driver_name || 'Rajesh Patil'} (MH 15 EG 4402)`,
      escrow_vault_ref: `#SBI-MH-ESC-${dealRef.replace('AC-TXN-', '')}`,
      status: 'PAYMENT_INITIATED',
      created_at: new Date().toISOString()
    };

    memoryStore.deals.unshift(newDeal);

    // Save to PostgreSQL if active
    try {
      await query(
        `INSERT INTO deals 
          (deal_ref, lot_id, buyer_id, buyer_name, farmer_name, crop_summary, quantity_qtl, agreed_price, product_amount, transport_amount, total_escrow_amount, current_stage, transporter_info, escrow_vault_ref, status, escrow_status, transport_escrow_status, razorpay_order_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);`,
        [
          newDeal.deal_ref, newDeal.lot_id, newDeal.buyer_id, newDeal.buyer_name,
          newDeal.farmer_name, newDeal.crop_summary, newDeal.quantity_qtl, newDeal.agreed_price,
          newDeal.product_amount, newDeal.transport_amount, newDeal.total_escrow_amount,
          newDeal.current_stage, newDeal.transporter_info, newDeal.escrow_vault_ref,
          newDeal.status, newDeal.escrow_status, newDeal.transport_escrow_status, newDeal.razorpay_order_id
        ]
      );
    } catch (dbErr) {}

    return res.status(201).json({
      success: true,
      dealRef,
      order: orderResult
    });
  } catch (err) {
    console.error('[AgriConnect Server] Create order error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay Order: ' + err.message });
  }
});

// E. Verify payment capture & Lock funds in Escrow
// CRITICAL: Does NOT transfer funds to farmer yet. Sets PAYMENT_CAPTURED_ESCROW_HELD.
app.post(['/api/v1/payment/verify-and-hold', '/api/payment/verify-and-hold'], async (req, res) => {
  const { order_id, payment_id, signature, deal_ref } = req.body;

  try {
    const isSignatureValid = razorpayService.verifyPaymentSignature({
      orderId: order_id,
      paymentId: payment_id,
      signature
    });

    if (!isSignatureValid) {
      console.warn(`[Razorpay Service] Signature verification failed for order ${order_id}`);
      // In development test mode with simulated orders or QR payments, we allow bypass
      if (
        !order_id?.startsWith('order_sim_') && 
        !order_id?.startsWith('order_test_') &&
        !payment_id?.startsWith('pay_upi_') &&
        !payment_id?.startsWith('pay_qr_') &&
        !signature?.startsWith('simulated')
      ) {
        return res.status(400).json({ success: false, error: 'Invalid Razorpay signature' });
      }
    }

    // Find and update deal
    let deal = memoryStore.deals.find(d => d.deal_ref === deal_ref || d.razorpay_order_id === order_id);
    if (!deal) {
      deal = memoryStore.deals[0];
    }

    deal.razorpay_payment_id = payment_id;
    deal.razorpay_order_id = order_id || deal.razorpay_order_id;
    deal.escrow_status = 'PAYMENT_CAPTURED_ESCROW_HELD';
    deal.status = 'PAYMENT_CAPTURED_ESCROW_HELD';
    deal.transport_escrow_status = 'In Transit';
    deal.delivery_status = 'in_transit';
    deal.current_stage = 3;

    // Create or update linked delivery job
    let job = memoryStore.delivery_jobs.find(j => j.deal_ref === deal.deal_ref);
    if (!job) {
      job = {
        id: memoryStore.delivery_jobs.length + 1,
        job_code: `JOB-${deal.deal_ref.replace('AC-TXN-', '')}`,
        deal_ref: deal.deal_ref,
        driver_id: deal.driver_id || 1,
        driver_name: deal.driver_name || 'Rajesh Patil',
        vehicle_reg_no: 'MH 15 EG 4402',
        pickup_location: 'Farm Gate: Gut No. 142/B, Pimpalgaon, Niphad Taluka, Nashik',
        drop_location: `${deal.buyer_name}, Lasalgaon Mandi Grid, Nashik`,
        distance_km: 24,
        commodity_summary: deal.crop_summary,
        weight_qtl: deal.quantity_qtl,
        is_pooled: false,
        pooled_lots_count: 1,
        delivery_fee: deal.transport_amount || 8450.00,
        status: 'picked_up',
        picked_up_at: new Date().toISOString(),
        delivered_at: null,
        confirmed_at: null,
        auto_release_deadline: null,
        transit_insurance_id: `ICICI-LOMB-${deal.deal_ref.replace('AC-TXN-', '')}`,
        created_at: new Date().toISOString()
      };
      memoryStore.delivery_jobs.unshift(job);
    } else {
      job.status = 'picked_up';
      job.picked_up_at = new Date().toISOString();
    }

    // Update Postgres
    try {
      await query(
        `UPDATE deals SET 
          razorpay_payment_id = $1, 
          escrow_status = 'PAYMENT_CAPTURED_ESCROW_HELD',
          status = 'PAYMENT_CAPTURED_ESCROW_HELD',
          transport_escrow_status = 'In Transit',
          delivery_status = 'in_transit',
          current_stage = 3
         WHERE deal_ref = $2;`,
        [payment_id, deal.deal_ref]
      );
    } catch (e) {}

    console.log(`[AgriConnect Escrow] Funds held for ${deal.deal_ref}: ₹${deal.total_escrow_amount} (Produce: ₹${deal.product_amount}, Freight: ₹${deal.transport_amount})`);

    return res.json({
      success: true,
      deal,
      message: `Payment captured successfully! ₹${deal.total_escrow_amount.toLocaleString('en-IN')} held securely in Escrow Vault. Funds sit in platform account until Buyer delivery approval.`
    });
  } catch (err) {
    console.error('[AgriConnect Server] Verify payment error:', err);
    res.status(500).json({ error: 'Payment verification failed: ' + err.message });
  }
});

// F. Simulate Delivery Arrival (For testing inspection & approval)
app.post(['/api/v1/deals/simulate-delivery', '/api/deals/simulate-delivery'], async (req, res) => {
  const { deal_ref } = req.body;
  const deal = memoryStore.deals.find(d => d.deal_ref === deal_ref);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  deal.delivery_status = 'delivered';
  deal.escrow_status = 'AWAITING_DELIVERY_CONFIRMATION';
  deal.transport_escrow_status = 'Delivered — Awaiting Buyer Confirmation';
  deal.current_stage = 4;

  const job = memoryStore.delivery_jobs.find(j => j.deal_ref === deal_ref);
  if (job) {
    job.status = 'delivered';
    job.delivered_at = new Date().toISOString();
    job.auto_release_deadline = new Date(Date.now() + 48 * 3600000).toISOString();
  }

  try {
    await query(
      `UPDATE deals SET delivery_status = 'delivered', escrow_status = 'AWAITING_DELIVERY_CONFIRMATION', transport_escrow_status = 'Delivered — Awaiting Buyer Confirmation', current_stage = 4 WHERE deal_ref = $1;`,
      [deal_ref]
    );
  } catch (e) {}

  return res.json({
    success: true,
    deal,
    message: 'Shipment arrived at destination. Inspection and delivery approval enabled.'
  });
});

// G. Approve Delivery & Release Escrow Funds (Dual Razorpay Transfers Split)
// ONLY triggered when Buyer inspects and approves delivered lot.
app.post(['/api/v1/payment/approve-and-release', '/api/payment/approve-and-release'], async (req, res) => {
  const { deal_ref } = req.body;

  try {
    const deal = memoryStore.deals.find(d => d.deal_ref === deal_ref);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Ensure delivery is completed before release
    if (deal.delivery_status !== 'delivered' && deal.current_stage < 4) {
      console.warn(`[Escrow Release Warning] Delivery not marked 'delivered' yet for ${deal_ref}. Simulating auto-delivered state for approval.`);
      deal.delivery_status = 'delivered';
    }

    // 1. Resolve Linked Accounts for Farmer & Driver
    const farmerAccountId = await razorpayService.getOrCreateLinkedAccount({
      role: 'farmer',
      id: deal.farmer_id || 1,
      name: deal.farmer_name || 'Santosh Shinde',
      phone: '+91 98224 81920'
    });

    const transporterAccountId = await razorpayService.getOrCreateLinkedAccount({
      role: 'driver',
      id: deal.driver_id || 1,
      name: deal.driver_name || 'Rajesh Patil',
      phone: '+91 98231 77410'
    });

    // 2. Call Razorpay Transfers API
    const transferResult = await razorpayService.transferEscrowFunds({
      paymentId: deal.razorpay_payment_id || `pay_sim_${deal.deal_ref}`,
      farmerAccountId,
      productAmount: deal.product_amount,
      transporterAccountId,
      transportAmount: deal.transport_amount,
      dealRef: deal.deal_ref
    });

    // 3. Mark deal as COMPLETED_FUNDS_RELEASED
    deal.escrow_status = 'COMPLETED_FUNDS_RELEASED';
    deal.status = 'COMPLETED_FUNDS_RELEASED';
    deal.transport_escrow_status = 'Fee Released';
    deal.delivery_status = 'confirmed';
    deal.current_stage = 5;
    deal.razorpay_transfer_farmer_id = transferResult.farmerTransfer?.transferId;
    deal.razorpay_transfer_driver_id = transferResult.transporterTransfer?.transferId;

    // Update delivery job
    const job = memoryStore.delivery_jobs.find(j => j.deal_ref === deal_ref);
    if (job) {
      job.status = 'confirmed';
      job.confirmed_at = new Date().toISOString();
    }

    // Update Postgres
    try {
      await query(
        `UPDATE deals SET 
          escrow_status = 'COMPLETED_FUNDS_RELEASED',
          status = 'COMPLETED_FUNDS_RELEASED',
          transport_escrow_status = 'Fee Released',
          delivery_status = 'confirmed',
          current_stage = 5,
          razorpay_transfer_farmer_id = $1,
          razorpay_transfer_driver_id = $2
         WHERE deal_ref = $3;`,
        [deal.razorpay_transfer_farmer_id, deal.razorpay_transfer_driver_id, deal.deal_ref]
      );
    } catch (e) {}

    return res.json({
      success: true,
      deal,
      transferResult,
      message: `Delivery approved! Escrow funds released via Razorpay Route: ₹${deal.product_amount.toLocaleString('en-IN')} to Farmer (${farmerAccountId}) & ₹${deal.transport_amount.toLocaleString('en-IN')} to Transporter (${transporterAccountId}).`
    });
  } catch (err) {
    console.error('[AgriConnect Server] Approve and release error:', err);
    res.status(500).json({ error: 'Release transfer failed: ' + err.message });
  }
});

// H. Reject Delivery / Raise Dispute (Freezes Escrow - NO Transfers Called)
app.post(['/api/v1/payment/raise-dispute', '/api/payment/raise-dispute'], async (req, res) => {
  const { deal_ref, reason, category, filer_role, filer_name } = req.body;

  try {
    const deal = memoryStore.deals.find(d => d.deal_ref === deal_ref);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });

    // Mark Escrow as FROZEN
    deal.escrow_status = 'DISPUTED_ESCROW_FROZEN';
    deal.status = 'DISPUTED_ESCROW_FROZEN';

    const ticketCode = `GRV-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    deal.dispute_ticket = ticketCode;

    const newGrievance = {
      id: memoryStore.grievances.length + 1,
      ticket_code: ticketCode,
      deal_ref,
      farmer_name: deal.farmer_name,
      buyer_name: deal.buyer_name,
      filer_role: filer_role || 'buyer',
      filer_name: filer_name || deal.buyer_name,
      counterparty_name: deal.farmer_name,
      category: category || 'Produce Quality Rejection / Transit Damage',
      description: reason || 'Buyer rejected produce during delivery inspection. Escrow frozen pending APMC resolution.',
      sla_deadline: new Date(Date.now() + 48 * 3600000).toISOString(),
      status: 'Escrow Frozen — APMC Officer Assigned',
      priority: 'HIGH',
      priority_reason: `Frozen Escrow Vault (₹${deal.total_escrow_amount?.toLocaleString('en-IN')}) requires statutory arbitration`,
      escrow_locked_amount: deal.total_escrow_amount,
      filed_at: new Date().toISOString()
    };

    memoryStore.grievances.unshift(newGrievance);

    try {
      await query(
        `UPDATE deals SET escrow_status = 'DISPUTED_ESCROW_FROZEN', status = 'DISPUTED_ESCROW_FROZEN' WHERE deal_ref = $1;`,
        [deal_ref]
      );
    } catch (e) {}

    return res.status(201).json({
      success: true,
      deal,
      grievance: newGrievance,
      ticket_code: ticketCode,
      message: `Escrow frozen. Grievance ticket #${ticketCode} opened. Funds remain locked in platform escrow vault.`
    });
  } catch (err) {
    console.error('[AgriConnect Server] Dispute error:', err);
    res.status(500).json({ error: 'Dispute filing failed: ' + err.message });
  }
});

// I. Razorpay Webhooks (For payment.captured and transfer.processed events)
app.post(['/api/v1/razorpay/webhook', '/api/razorpay/webhook'], (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = JSON.stringify(req.body);

  const isValid = razorpayService.verifyWebhookSignature({ rawBody, signature });
  if (!isValid) {
    console.warn('[Razorpay Webhook] Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body.event;
  console.log(`[Razorpay Webhook] Received event: ${event}`);

  if (event === 'payment.captured') {
    const payment = req.body.payload?.payment?.entity;
    const dealRef = payment?.notes?.deal_ref;
    if (dealRef) {
      const deal = memoryStore.deals.find(d => d.deal_ref === dealRef);
      if (deal && deal.escrow_status !== 'COMPLETED_FUNDS_RELEASED') {
        deal.razorpay_payment_id = payment.id;
        deal.escrow_status = 'PAYMENT_CAPTURED_ESCROW_HELD';
        deal.status = 'PAYMENT_CAPTURED_ESCROW_HELD';
      }
    }
  } else if (event === 'transfer.processed') {
    const transfer = req.body.payload?.transfer?.entity;
    console.log(`[Razorpay Webhook] Transfer processed: ${transfer?.id} for ₹${(transfer?.amount || 0) / 100}`);
  }

  res.json({ status: 'ok' });
});

// J. Legacy Deal Stage Update (Backward compatibility)
app.post('/api/deals/stage', async (req, res) => {
  const { deal_ref, stage, agreed_price } = req.body;
  const newStage = Number(stage);

  try {
    const result = await query(
      `UPDATE deals 
       SET current_stage = $1, 
           agreed_price = COALESCE($2, agreed_price),
           total_escrow_amount = COALESCE($2 * quantity_qtl, total_escrow_amount),
           status = CASE WHEN $1 = 5 THEN 'COMPLETED_FUNDS_RELEASED' ELSE status END
       WHERE deal_ref = $3 
       RETURNING *;`,
      [newStage, agreed_price || null, deal_ref]
    );
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
  } catch (e) {}

  const deal = memoryStore.deals.find(d => d.deal_ref === deal_ref);
  if (deal) {
    deal.current_stage = newStage;
    if (agreed_price) {
      deal.agreed_price = agreed_price;
      deal.product_amount = agreed_price * deal.quantity_qtl;
      deal.total_escrow_amount = deal.product_amount + (deal.transport_amount || 8450);
    }
    if (newStage === 5) {
      deal.status = 'COMPLETED_FUNDS_RELEASED';
      deal.escrow_status = 'COMPLETED_FUNDS_RELEASED';
      deal.transport_escrow_status = 'Fee Released';
      deal.delivery_status = 'confirmed';
    }
    return res.json(deal);
  }
  res.status(404).json({ error: 'Deal not found' });
});

// 8. Grievances & Arbitration
// 8. Grievances & Arbitration
app.get('/api/grievances', async (req, res) => {
  const { user_name, role } = req.query;
  let list = memoryStore.grievances;

  try {
    const result = await query('SELECT * FROM grievances ORDER BY filed_at DESC;');
    if (result.rows.length > 0) {
      list = result.rows;
    }
  } catch (e) {}

  if (user_name && role && role !== 'apmc') {
    const u = user_name.toLowerCase().trim();
    list = list.filter(g => {
      const fName = (g.farmer_name || '').toLowerCase();
      const bName = (g.buyer_name || '').toLowerCase();
      const filer = (g.filer_name || '').toLowerCase();
      const counter = (g.counterparty_name || '').toLowerCase();
      return fName.includes(u) || bName.includes(u) || filer.includes(u) || counter.includes(u);
    });
  }

  res.json(list);
});

app.post('/api/grievances', async (req, res) => {
  const data = req.body;
  const ticketCode = `GRV-2024-0${Math.floor(400 + Math.random() * 90)}`;
  const slaDeadline = new Date(Date.now() + 48 * 3600000); // Statutory 48-Hour SLA Guarantee

  // Auto-resolve linked deal and counterparty
  const dealRef = data.deal_ref || 'AC-TXN-8841';
  const linkedDeal = memoryStore.deals.find(d => d.deal_ref === dealRef);
  const amount = Number(data.escrow_locked_amount) || (linkedDeal ? Number(linkedDeal.total_escrow_amount) : 291000);

  const farmerName = data.farmer_name || (linkedDeal ? linkedDeal.farmer_name : 'Santosh Shinde');
  const buyerName = data.buyer_name || (linkedDeal ? linkedDeal.buyer_name : 'AgroFresh Supply Chain Ltd');
  const filerRole = data.filer_role || 'farmer';
  const filerName = data.filer_name || (filerRole === 'buyer' ? buyerName : farmerName);
  const counterpartyName = data.counterparty_name || (filerRole === 'buyer' ? farmerName : buyerName);

  // AUTO-SEVERITY RULES (Not user selectable)
  let computedSeverity = 'MEDIUM';
  let severityReason = '';

  if (data.category === 'Non-Delivery' || data.category === 'Payment Delay') {
    computedSeverity = 'HIGH';
    severityReason = 'Statutory default under APMC Act Rule 24';
  } else if (amount > 50000) {
    computedSeverity = 'HIGH';
    severityReason = `Disputed escrow (₹${amount.toLocaleString('en-IN')}) exceeds ₹50,000 statutory threshold`;
  } else if (
    data.category === 'Quality Grade Dispute' || 
    data.category === 'Transit Damage' || 
    data.category === 'Weight/Quantity Discrepancy'
  ) {
    computedSeverity = 'MEDIUM';
    severityReason = 'Standard technical dispute subject to assayer/weighment review';
  } else if (data.category === 'Process/Certificate Delay') {
    computedSeverity = 'LOW';
    severityReason = 'Administrative / certification delay under APMC supervision';
  } else {
    computedSeverity = 'LOW';
    severityReason = 'General commercial inquiry';
  }

  // AUTO-FREEZE LINKED ESCROW
  if (linkedDeal) {
    linkedDeal.status = 'ESCROW_FROZEN_DISPUTE';
    linkedDeal.dispute_ticket = ticketCode;
  }
  try {
    await query(
      `UPDATE deals SET status = 'ESCROW_FROZEN_DISPUTE' WHERE deal_ref = $1;`,
      [dealRef]
    );
  } catch (e) {}

  const newTicket = {
    ticket_code: ticketCode,
    deal_ref: dealRef,
    farmer_name: farmerName,
    buyer_name: buyerName,
    filer_role: filerRole,
    filer_name: filerName,
    counterparty_name: counterpartyName,
    category: data.category || 'Quality Grade Dispute',
    description: data.description || 'Statutory dispute filed under APMC Act Sec 31-B.',
    evidence_url: data.evidence_url || null,
    sla_deadline: slaDeadline.toISOString(),
    status: 'Statutory 48h SLA Clock Active',
    priority: computedSeverity,
    priority_reason: severityReason,
    escrow_locked_amount: amount,
    filed_at: new Date().toISOString()
  };

  try {
    const result = await query(
      `INSERT INTO grievances 
        (ticket_code, deal_ref, farmer_name, buyer_name, category, description, sla_deadline, status, priority, escrow_locked_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *;`,
      [
        newTicket.ticket_code, newTicket.deal_ref, newTicket.farmer_name, newTicket.buyer_name,
        newTicket.category, newTicket.description, slaDeadline, newTicket.status,
        newTicket.priority, newTicket.escrow_locked_amount
      ]
    );
    if (result.rows.length > 0) {
      const row = { ...result.rows[0], ...newTicket };
      memoryStore.grievances.unshift(row);
      return res.status(201).json(row);
    }
  } catch (e) {}

  newTicket.id = memoryStore.grievances.length + 1;
  memoryStore.grievances.unshift(newTicket);
  res.status(201).json(newTicket);
});

app.put('/api/grievances/:ticket_code/resolve', async (req, res) => {
  const { ticket_code } = req.params;
  const { resolution_notes } = req.body;

  try {
    const result = await query(
      `UPDATE grievances
       SET status = 'Resolved by APMC Statutory Decree',
           resolution_notes = $1,
           resolved_at = NOW()
       WHERE ticket_code = $2
       RETURNING *;`,
      [resolution_notes || 'APMC Officer Decree: 100% Escrow released to farmer.', ticket_code]
    );
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
  } catch (e) {}

  const g = memoryStore.grievances.find(item => item.ticket_code === ticket_code);
  if (g) {
    g.status = 'Resolved by APMC Statutory Decree';
    g.resolution_notes = resolution_notes || 'APMC Officer Decree: 100% Escrow released to farmer.';
    g.resolved_at = new Date().toISOString();
    return res.json(g);
  }
  res.status(404).json({ error: 'Grievance not found' });
});

// 9. Warehouses
app.get('/api/warehouses', async (req, res) => {
  try {
    const result = await query('SELECT * FROM warehouses ORDER BY total_capacity_mt DESC;');
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {}

  res.json([
    {
      id: 'wh-niphad',
      name: 'Maharashtra State Warehousing Corp (MSWC) Niphad Godown',
      type: 'Government Godown (MSWC)',
      district: 'Nashik',
      distance: '12 km from Gut 142/B',
      total_capacity_mt: 4500,
      available_capacity_mt: 1200,
      rate_per_mt_month: 115,
      govt_subsidy_eligible: '75% MSWC Rental Concession Active',
      wdra_certified: 'WDRA-REG-MH-2021-0941',
      insurance_cover: 'Comprehensive Fire & Flood Covered',
      pledge_financing: 'e-NWR Bank Loan up to 70% Lot Value via SBI/MGB'
    },
    {
      id: 'wh-lasalgaon',
      name: 'Lasalgaon Agro Integrated Cold Storage & Chawl',
      type: 'Private WDRA Accredited Cold Chain',
      district: 'Nashik',
      distance: '18 km from Gut 142/B',
      total_capacity_mt: 2800,
      available_capacity_mt: 450,
      rate_per_mt_month: 320,
      govt_subsidy_eligible: 'MSAMB 25% Capital Subsidy Facility',
      wdra_certified: 'WDRA-REG-MH-2022-1402',
      insurance_cover: 'Refrigeration Breakdown & Transit Included',
      pledge_financing: 'Instant Kisan Credit Card (KCC) Limit Enhancement'
    },
    {
      id: 'wh-pimpalgaon',
      name: 'MSWC Pimpalgaon Baswant Regional Depot',
      type: 'Government Godown (MSWC)',
      district: 'Nashik',
      distance: '6.5 km from Gut 142/B',
      total_capacity_mt: 6200,
      available_capacity_mt: 1850,
      rate_per_mt_month: 115,
      govt_subsidy_eligible: 'SC/ST & Smallholder 80% Subsidy',
      wdra_certified: 'WDRA-REG-MH-2020-0419',
      insurance_cover: 'Govt Risk Coverage Guarantee',
      pledge_financing: 'Direct NABARD Warehouse Infrastructure Fund Linkage'
    }
  ]);
});

// 10. Statewide Summary Statistics
app.get('/api/stats', async (req, res) => {
  res.json({
    farmersOnboarded: '4,28,940+',
    districtsCovered: '36 / 36',
    mandisSynced: '305 Live Mandis',
    escrowVolumeSettled: '₹842.60 Cr',
    avgRealizationBoost: '24.8%',
    activeLotsValuation: '₹142.80 Cr',
    statutorySlaCompliance: '99.4%'
  });
});

// 11. Authentication & Registration Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { usernameOrEmail, password, role } = req.body;
  const userRole = role || 'farmer';

  try {
    if (userRole === 'farmer') {
      const dbRes = await query('SELECT * FROM farmers LIMIT 1;');
      const farmer = dbRes.rows[0] || memoryStore.farmer;
      return res.json({
        success: true,
        role: 'farmer',
        token: 'auth-token-farmer-demo',
        user: {
          id: farmer.id || 1,
          name: farmer.name || 'Santosh Shinde',
          fatherName: farmer.father_name || 'Ramdas Shinde',
          code: farmer.farmer_code || 'MH-NAS-2024-8821',
          mobile: farmer.mobile || '+91 98224 81920',
          district: farmer.district || 'Nashik',
          taluka: farmer.taluka || 'Niphad',
          village: farmer.village || 'Pimpalgaon Baswant',
          landGutNo: farmer.land_gut_no || 'Gut No. 142/B',
          landArea: farmer.land_area || '4.20 Acres Cultivated',
          bankAccount: farmer.bank_account || 'State Bank of India (A/C: *******4921)',
          trustScore: farmer.trust_score || 98
        }
      });
    } else if (userRole === 'driver') {
      const dbRes = await query('SELECT * FROM drivers LIMIT 1;');
      const driver = (dbRes && dbRes.rows && dbRes.rows[0]) || memoryStore.drivers[0];
      return res.json({
        success: true,
        role: 'driver',
        token: 'auth-token-driver-demo',
        user: {
          id: driver.id || 1,
          driverCode: driver.driver_code || 'DRV-MH-8841',
          name: driver.name || 'Rajesh Patil',
          mobile: driver.mobile || '+91 98231 77410',
          vehicleRegNo: driver.vehicle_reg_no || 'MH 15 EG 4402',
          licenseNo: driver.license_no || 'MH15 20180049210',
          vehicleType: driver.vehicle_type || 'Ashok Leyland Ecomet 1215 (LCV)',
          vehicleCapacityKg: driver.vehicle_capacity_kg || 6000,
          vahanStatus: driver.vahan_status || 'Vahan Verified',
          fitnessValidUntil: driver.fitness_valid_until || '2026-11-30',
          insuranceValidUntil: driver.insurance_valid_until || '2026-08-15',
          pucValidUntil: driver.puc_valid_until || '2025-12-31',
          trustScore: driver.trust_score || 96,
          ratingAvg: Number(driver.rating_avg) || 4.9,
          settledTrips: driver.settled_trips || 142,
          bankName: driver.bank_name || 'State Bank of India',
          bankAccount: driver.bank_account || '*******6819'
        }
      });
    } else {
      const dbRes = await query('SELECT * FROM buyers LIMIT 1;');
      const buyer = dbRes.rows[0] || {
        id: 'agrofresh',
        name: 'AgroFresh Supply Chain Pvt Ltd',
        contact_person: 'Rajesh Mehta',
        license_no: 'MH-PUN-APMC-9421',
        location: 'Lasalgaon Mandi Grid, Nashik',
        rating: 4.9,
        type: 'Commercial Mandi Aggregator'
      };
      return res.json({
        success: true,
        role: 'buyer',
        token: 'auth-token-buyer-demo',
        user: {
          id: buyer.id,
          name: buyer.name,
          contactPerson: buyer.contact_person || buyer.contactPerson,
          licenseNo: buyer.license_no || buyer.licenseNo,
          location: buyer.location,
          rating: buyer.rating,
          type: buyer.type
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Authentication error: ' + err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const data = req.body;
  const role = data.role || 'farmer';

  if (role === 'farmer') {
    const farmerCode = `MH-${(data.district || 'NAS').substring(0, 3).toUpperCase()}-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFarmer = {
      farmer_code: farmerCode,
      name: data.fullName || 'New Cultivator',
      father_name: data.fatherName || '',
      mobile: data.mobile || '+91 98000 12345',
      district: data.district || 'Nashik',
      taluka: data.taluka || 'Niphad',
      village: data.village || 'Pimpalgaon',
      land_gut_no: data.landGutNo || 'Gut No. 101/A',
      land_area: `${data.landArea || '3.5'} Acres Cultivated`,
      soil_health_card: `SHC-MH-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      aadhaar_status: 'Aadhaar e-KYC Verified',
      maha_eseva_status: '7/12 Digital Extract Linked',
      bank_name: data.bankName || 'State Bank of India',
      bank_account: data.bankAccount ? `State Bank of India (A/C: *******${data.bankAccount.slice(-4)})` : 'State Bank of India (A/C: *******8812)',
      ifsc: data.ifsc || 'SBIN0001429',
      trust_score: 95
    };

    try {
      const result = await query(
        `INSERT INTO farmers 
          (farmer_code, name, father_name, mobile, district, taluka, village, land_gut_no, land_area, soil_health_card, aadhaar_status, maha_eseva_status, bank_name, bank_account, ifsc, trust_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING *;`,
        [
          newFarmer.farmer_code, newFarmer.name, newFarmer.father_name, newFarmer.mobile,
          newFarmer.district, newFarmer.taluka, newFarmer.village, newFarmer.land_gut_no,
          newFarmer.land_area, newFarmer.soil_health_card, newFarmer.aadhaar_status,
          newFarmer.maha_eseva_status, newFarmer.bank_name, newFarmer.bank_account,
          newFarmer.ifsc, newFarmer.trust_score
        ]
      );
      const created = result.rows[0];
      return res.status(201).json({
        success: true,
        role: 'farmer',
        user: {
          id: created.id,
          name: created.name,
          code: created.farmer_code,
          mobile: created.mobile,
          district: created.district,
          taluka: created.taluka,
          village: created.village,
          landGutNo: created.land_gut_no,
          landArea: created.land_area,
          bankAccount: created.bank_account,
          trustScore: created.trust_score
        }
      });
    } catch (e) {
      console.warn('PostgreSQL register fallback:', e.message);
      newFarmer.id = Date.now();
      return res.status(201).json({
        success: true,
        role: 'farmer',
        user: newFarmer
      });
    }
  } else if (role === 'buyer') {
    // Buyer registration
    const buyerId = `buyer_${Date.now()}`;
    const newBuyer = {
      id: buyerId,
      name: data.companyName || 'Corporate Sourcing Hub',
      type: data.businessType || 'Commercial Mandi Aggregator',
      badge: 'Government Verified',
      license_no: data.licenseNo || `MH-APMC-${Math.floor(1000 + Math.random() * 9000)}`,
      cin: data.cin || 'U01100MH2024PTC99812',
      incorporated: '2024 (Maharashtra)',
      contact_person: data.contactPerson || 'Procurement Head',
      rating: 5.0,
      trust_score: 95,
      escrow_deposit_limit: '₹5.00 Crore',
      settled_deals: 1,
      active_offer_range: 'Market Competitive',
      location: data.location || 'Nashik APMC Grid'
    };

    try {
      const result = await query(
        `INSERT INTO buyers 
          (id, name, type, badge, license_no, cin, incorporated, contact_person, rating, trust_score, escrow_deposit_limit, settled_deals, active_offer_range, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *;`,
        [
          newBuyer.id, newBuyer.name, newBuyer.type, newBuyer.badge, newBuyer.license_no,
          newBuyer.cin, newBuyer.incorporated, newBuyer.contact_person, newBuyer.rating,
          newBuyer.trust_score, newBuyer.escrow_deposit_limit, newBuyer.settled_deals,
          newBuyer.active_offer_range, newBuyer.location
        ]
      );
      const created = result.rows[0];
      return res.status(201).json({
        success: true,
        role: 'buyer',
        user: {
          id: created.id,
          name: created.name,
          contactPerson: created.contact_person,
          licenseNo: created.license_no,
          location: created.location,
          rating: created.rating,
          type: created.type
        }
      });
    } catch (e) {
      console.warn('PostgreSQL buyer register fallback:', e.message);
      return res.status(201).json({
        success: true,
        role: 'buyer',
        user: newBuyer
      });
    }
  } else if (role === 'driver') {
    // Driver / Transporter registration
    const driverCode = `DRV-MH-${Math.floor(1000 + Math.random() * 9000)}`;
    const regNo = (data.vehicleRegNo || data.vehicle_reg_no || 'MH 15 EG 4402').toUpperCase().trim();
    const licenseNo = (data.licenseNo || data.license_no || 'MH15 20180049210').toUpperCase().trim();
    const capacityKg = Number(data.vehicleCapacityKg || data.vehicle_capacity_kg || (Number(data.vehicleCapacityTons || 6) * 1000)) || 6000;
    
    // Vahan portal verification simulation: Fitness, Insurance, PUC
    const isVahanValid = regNo.length >= 8;
    const vahanStatus = isVahanValid ? 'Vahan Verified' : 'Pending Verification';
    
    const newDriver = {
      driver_code: driverCode,
      name: data.fullName || data.name || 'Rajesh Patil',
      mobile: data.mobile || '+91 98231 77410',
      vehicle_reg_no: regNo,
      license_no: licenseNo,
      vehicle_type: data.vehicleType || data.vehicle_type || 'Commercial Goods Carrier (LCV/HGV)',
      vehicle_capacity_kg: capacityKg,
      vahan_status: vahanStatus,
      fitness_valid_until: '2026-11-30',
      insurance_valid_until: '2026-08-15',
      puc_valid_until: '2025-12-31',
      vehicle_photo_url: data.vehiclePhotoUrl || data.vehicle_photo_url || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500',
      trust_score: 96,
      rating_avg: 4.9,
      settled_trips: 0,
      bank_name: data.bankName || 'State Bank of India',
      bank_account: data.bankAccount ? `State Bank of India (A/C: *******${data.bankAccount.slice(-4)})` : 'State Bank of India (A/C: *******6819)',
      ifsc: data.ifsc || 'SBIN0001429'
    };

    try {
      const result = await query(
        `INSERT INTO drivers 
          (driver_code, name, mobile, vehicle_reg_no, license_no, vehicle_type, vehicle_capacity_kg, vahan_status, fitness_valid_until, insurance_valid_until, puc_valid_until, vehicle_photo_url, trust_score, rating_avg, settled_trips, bank_name, bank_account, ifsc)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         RETURNING *;`,
        [
          newDriver.driver_code, newDriver.name, newDriver.mobile, newDriver.vehicle_reg_no,
          newDriver.license_no, newDriver.vehicle_type, newDriver.vehicle_capacity_kg,
          newDriver.vahan_status, newDriver.fitness_valid_until, newDriver.insurance_valid_until,
          newDriver.puc_valid_until, newDriver.vehicle_photo_url, newDriver.trust_score,
          newDriver.rating_avg, newDriver.settled_trips, newDriver.bank_name,
          newDriver.bank_account, newDriver.ifsc
        ]
      );
      const created = (result && result.rows && result.rows[0]) || newDriver;
      memoryStore.drivers.unshift(created);
      return res.status(201).json({
        success: true,
        role: 'driver',
        user: {
          id: created.id,
          driverCode: created.driver_code,
          name: created.name,
          mobile: created.mobile,
          vehicleRegNo: created.vehicle_reg_no,
          licenseNo: created.license_no,
          vehicleCapacityKg: created.vehicle_capacity_kg,
          vahanStatus: created.vahan_status,
          trustScore: created.trust_score
        }
      });
    } catch (e) {
      console.warn('PostgreSQL driver register fallback:', e.message);
      newDriver.id = Date.now();
      memoryStore.drivers.unshift(newDriver);
      return res.status(201).json({
        success: true,
        role: 'driver',
        user: newDriver
      });
    }
  }
});

// Dedicated Driver Registration Endpoint
app.post(['/api/v1/drivers/register', '/api/drivers/register'], async (req, res) => {
  req.body.role = 'driver';
  // Forward to registration logic
  const data = req.body;
  const driverCode = `DRV-MH-${Math.floor(1000 + Math.random() * 9000)}`;
  const regNo = (data.vehicleRegNo || data.vehicle_reg_no || 'MH 15 EG 4402').toUpperCase().trim();
  const licenseNo = (data.licenseNo || data.license_no || 'MH15 20180049210').toUpperCase().trim();
  const capacityKg = Number(data.vehicleCapacityKg || data.vehicle_capacity_kg || (Number(data.vehicleCapacityTons || 6) * 1000)) || 6000;
  
  const isVahanValid = regNo.length >= 8;
  const vahanStatus = isVahanValid ? 'Vahan Verified' : 'Pending Verification';
  
  const newDriver = {
    driver_code: driverCode,
    name: data.fullName || data.name || 'Rajesh Patil',
    mobile: data.mobile || '+91 98231 77410',
    vehicle_reg_no: regNo,
    license_no: licenseNo,
    vehicle_type: data.vehicleType || data.vehicle_type || 'Commercial Goods Carrier (LCV/HGV)',
    vehicle_capacity_kg: capacityKg,
    vahan_status: vahanStatus,
    fitness_valid_until: '2026-11-30',
    insurance_valid_until: '2026-08-15',
    puc_valid_until: '2025-12-31',
    vehicle_photo_url: data.vehiclePhotoUrl || data.vehicle_photo_url || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500',
    trust_score: 96,
    rating_avg: 4.9,
    settled_trips: 0,
    bank_name: data.bankName || 'State Bank of India',
    bank_account: data.bankAccount ? `State Bank of India (A/C: *******${data.bankAccount.slice(-4)})` : 'State Bank of India (A/C: *******6819)',
    ifsc: data.ifsc || 'SBIN0001429'
  };

  try {
    const result = await query(
      `INSERT INTO drivers 
        (driver_code, name, mobile, vehicle_reg_no, license_no, vehicle_type, vehicle_capacity_kg, vahan_status, fitness_valid_until, insurance_valid_until, puc_valid_until, vehicle_photo_url, trust_score, rating_avg, settled_trips, bank_name, bank_account, ifsc)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *;`,
      [
        newDriver.driver_code, newDriver.name, newDriver.mobile, newDriver.vehicle_reg_no,
        newDriver.license_no, newDriver.vehicle_type, newDriver.vehicle_capacity_kg,
        newDriver.vahan_status, newDriver.fitness_valid_until, newDriver.insurance_valid_until,
        newDriver.puc_valid_until, newDriver.vehicle_photo_url, newDriver.trust_score,
        newDriver.rating_avg, newDriver.settled_trips, newDriver.bank_name,
        newDriver.bank_account, newDriver.ifsc
      ]
    );
    const created = (result && result.rows && result.rows[0]) || newDriver;
    memoryStore.drivers.unshift(created);
    return res.status(201).json({
      success: true,
      driver: created,
      vahan_verification: {
        status: created.vahan_status,
        fitness: 'Valid up to Nov 2026',
        insurance: 'Valid up to Aug 2026 (New India Assurance)',
        puc: 'Valid up to Dec 2025'
      }
    });
  } catch (e) {
    newDriver.id = Date.now();
    memoryStore.drivers.unshift(newDriver);
    return res.status(201).json({
      success: true,
      driver: newDriver,
      vahan_verification: {
        status: newDriver.vahan_status,
        fitness: 'Valid up to Nov 2026',
        insurance: 'Valid up to Aug 2026',
        puc: 'Valid up to Dec 2025'
      }
    });
  }
});

// ============================================================================
// 12. Delivery Jobs & Driver Flow Endpoints
// ============================================================================

// A. Nearby available delivery jobs (with pooled-lot consolidation and upfront payout)
app.get(['/api/v1/drivers/jobs/nearby', '/api/drivers/jobs/nearby'], async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM delivery_jobs 
       WHERE status IN ('assigned', 'pending') 
       ORDER BY distance_km ASC, created_at DESC;`
    );
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {}
  res.json(memoryStore.delivery_jobs.filter(j => j.status === 'assigned' || j.status === 'pending'));
});

// B. All delivery jobs
app.get(['/api/v1/delivery-jobs', '/api/delivery-jobs'], async (req, res) => {
  const { driver_id, deal_ref, status } = req.query;
  try {
    let sql = 'SELECT * FROM delivery_jobs WHERE 1=1';
    const params = [];
    if (driver_id) {
      params.push(driver_id);
      sql += ` AND driver_id::text = $${params.length}`;
    }
    if (deal_ref) {
      params.push(deal_ref);
      sql += ` AND deal_ref = $${params.length}`;
    }
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    sql += ' ORDER BY created_at DESC;';
    const result = await query(sql, params);
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {}

  let jobs = memoryStore.delivery_jobs;
  if (driver_id) jobs = jobs.filter(j => String(j.driver_id) === String(driver_id));
  if (deal_ref) jobs = jobs.filter(j => j.deal_ref === deal_ref);
  if (status) jobs = jobs.filter(j => j.status === status);
  res.json(jobs);
});

// C. Single delivery job detail
app.get(['/api/v1/delivery-jobs/:id', '/api/delivery-jobs/:id'], async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM delivery_jobs WHERE id::text = $1 OR job_code = $1 LIMIT 1;', [String(id)]);
    if (result.rows.length > 0) return res.json(result.rows[0]);
  } catch (e) {}
  const job = memoryStore.delivery_jobs.find(j => String(j.id) === String(id) || j.job_code === id);
  if (job) return res.json(job);
  res.status(404).json({ error: 'Delivery job not found' });
});

// D. Accept a job
app.post(['/api/v1/delivery-jobs/:id/accept', '/api/delivery-jobs/:id/accept'], async (req, res) => {
  const { id } = req.params;
  const { driver_id, driver_name, vehicle_reg_no } = req.body;
  try {
    const result = await query(
      `UPDATE delivery_jobs 
       SET driver_id = COALESCE($1, driver_id),
           driver_name = COALESCE($2, driver_name),
           vehicle_reg_no = COALESCE($3, vehicle_reg_no),
           status = 'assigned'
       WHERE (id::text = $4 OR job_code = $4)
       RETURNING *;`,
      [driver_id || 1, driver_name || 'Rajesh Patil', vehicle_reg_no || 'MH 15 EG 4402', String(id)]
    );
    if (result.rows.length > 0) return res.json(result.rows[0]);
  } catch (e) {}

  const job = memoryStore.delivery_jobs.find(j => String(j.id) === String(id) || j.job_code === id);
  if (job) {
    job.driver_id = driver_id || 1;
    job.driver_name = driver_name || 'Rajesh Patil';
    job.vehicle_reg_no = vehicle_reg_no || 'MH 15 EG 4402';
    job.status = 'assigned';
    return res.json(job);
  }
  res.status(404).json({ error: 'Job not found' });
});

// E. PICKUP (Farmer / Driver confirms pickup) - DOES NOT RELEASE ESCROW PAYMENT
app.post(['/api/v1/delivery-jobs/:id/pickup', '/api/delivery-jobs/:id/pickup'], async (req, res) => {
  const { id } = req.params;
  const now = new Date().toISOString();

  try {
    const result = await query(
      `UPDATE delivery_jobs 
       SET status = 'picked_up',
           picked_up_at = NOW()
       WHERE (id::text = $1 OR job_code = $1)
       RETURNING *;`,
      [String(id)]
    );
    if (result.rows.length > 0) {
      const updatedJob = result.rows[0];
      if (updatedJob.deal_ref) {
        await query(`UPDATE deals SET current_stage = 3 WHERE deal_ref = $1;`, [updatedJob.deal_ref]);
      }
      return res.json({
        success: true,
        message: 'Pickup confirmed. Produce is in transit with assigned vehicle.',
        job: updatedJob,
        escrow_status: 'ESCROW_LOCKED (100% funds safely held in State Vault; releases on Buyer Confirmation)'
      });
    }
  } catch (e) {}

  const job = memoryStore.delivery_jobs.find(j => String(j.id) === String(id) || j.job_code === id);
  if (job) {
    job.status = 'picked_up';
    job.picked_up_at = now;
    const deal = memoryStore.deals.find(d => d.deal_ref === job.deal_ref);
    if (deal) deal.current_stage = 3;
    return res.json({
      success: true,
      message: 'Pickup confirmed. Produce is in transit with assigned vehicle.',
      job,
      escrow_status: 'ESCROW_LOCKED (100% funds safely held in State Vault; releases on Buyer Confirmation)'
    });
  }
  res.status(404).json({ error: 'Delivery job not found' });
});

// F. DELIVER (Driver marks delivered with proof photo) - STARTS 48H TIMER, DOES NOT RELEASE ESCROW
app.post(['/api/v1/delivery-jobs/:id/deliver', '/api/delivery-jobs/:id/deliver'], async (req, res) => {
  const { id } = req.params;
  const { proof_photo_url } = req.body;
  const now = new Date().toISOString();
  const deadline = new Date(Date.now() + 48 * 3600000).toISOString();

  try {
    const result = await query(
      `UPDATE delivery_jobs 
       SET status = 'delivered',
           proof_photo_url = COALESCE($1, proof_photo_url),
           delivered_at = NOW(),
           auto_release_deadline = NOW() + INTERVAL '48 hours'
       WHERE (id::text = $2 OR job_code = $2)
       RETURNING *;`,
      [proof_photo_url || null, String(id)]
    );
    if (result.rows.length > 0) {
      const updatedJob = result.rows[0];
      if (updatedJob.deal_ref) {
        await query(`UPDATE deals SET current_stage = 4 WHERE deal_ref = $1;`, [updatedJob.deal_ref]);
      }
      return res.json({
        success: true,
        message: 'Delivery proof recorded. 48-hour auto-confirmation SLA clock active.',
        job: updatedJob,
        auto_release_deadline: updatedJob.auto_release_deadline,
        escrow_status: 'ESCROW_LOCKED (₹0 released; awaiting buyer verification or 48h timer)'
      });
    }
  } catch (e) {}

  const job = memoryStore.delivery_jobs.find(j => String(j.id) === String(id) || j.job_code === id);
  if (job) {
    job.status = 'delivered';
    job.proof_photo_url = proof_photo_url || job.proof_photo_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';
    job.delivered_at = now;
    job.auto_release_deadline = deadline;
    const deal = memoryStore.deals.find(d => d.deal_ref === job.deal_ref);
    if (deal) deal.current_stage = 4;
    return res.json({
      success: true,
      message: 'Delivery proof recorded. 48-hour auto-confirmation SLA clock active.',
      job,
      auto_release_deadline: deadline,
      escrow_status: 'ESCROW_LOCKED (₹0 released; awaiting buyer verification or 48h timer)'
    });
  }
  res.status(404).json({ error: 'Delivery job not found' });
});

// G. CONFIRM (Buyer confirms delivery received) - CRITICAL DUAL ESCROW SPLIT PAYOUT!
app.post(['/api/v1/delivery-jobs/:id/confirm', '/api/delivery-jobs/:id/confirm'], async (req, res) => {
  const { id } = req.params;
  const now = new Date().toISOString();

  try {
    const jobRes = await query('SELECT * FROM delivery_jobs WHERE id::text = $1 OR job_code = $1 LIMIT 1;', [String(id)]);
    const job = (jobRes && jobRes.rows && jobRes.rows[0]) || memoryStore.delivery_jobs.find(j => String(j.id) === String(id) || j.job_code === id);

    if (!job) {
      return res.status(404).json({ error: 'Delivery job not found' });
    }

    let deal = null;
    if (job.deal_ref) {
      const dealRes = await query('SELECT * FROM deals WHERE deal_ref = $1 LIMIT 1;', [job.deal_ref]);
      deal = (dealRes && dealRes.rows && dealRes.rows[0]) || memoryStore.deals.find(d => d.deal_ref === job.deal_ref);
    }
    deal = deal || memoryStore.deals[0];

    const lotPrice = Number(deal.total_escrow_amount || (deal.agreed_price * deal.quantity_qtl) || 291000);
    const deliveryFee = Number(job.delivery_fee || 8450);

    // Update job status to confirmed
    await query(
      `UPDATE delivery_jobs 
       SET status = 'confirmed',
           confirmed_at = NOW()
       WHERE id = $1;`,
      [job.id]
    );

    // Update deal status to SETTLED_RELEASED (Stage 5)
    if (deal && deal.deal_ref) {
      await query(
        `UPDATE deals 
         SET status = 'SETTLED_RELEASED',
             current_stage = 5
         WHERE deal_ref = $1;`,
        [deal.deal_ref]
      );
    }

    // Insert or update driver payout record
    const payoutCode = `PO-DRV-${job.id || Math.floor(1000 + Math.random() * 9000)}`;
    await query(
      `INSERT INTO driver_payouts (payout_code, job_id, driver_id, amount, escrow_status, bank_ref, released_at)
       VALUES ($1, $2, $3, $4, 'RELEASED_TO_ACCOUNT', $5, NOW())
       ON CONFLICT (payout_code) DO UPDATE 
       SET escrow_status = 'RELEASED_TO_ACCOUNT', released_at = NOW();`,
      [payoutCode, job.id, job.driver_id || 1, deliveryFee, `#SBI-MH-ESC-SPLIT-DRV-${job.id}`]
    );

    // In-memory sync
    job.status = 'confirmed';
    job.confirmed_at = now;
    if (deal) {
      deal.status = 'SETTLED_RELEASED';
      deal.current_stage = 5;
    }
    memoryStore.farmer.escrow_wallet_pending = 0;

    return res.json({
      success: true,
      message: 'Buyer confirmed delivery. Dual Escrow Split successfully settled to Farmer & Driver!',
      dual_escrow_split: {
        farmer_payout: {
          recipient: deal.farmer_name || 'Santosh Shinde',
          bank_account: 'State Bank of India (A/C: *******4921)',
          amount: lotPrice,
          formatted: `₹${lotPrice.toLocaleString('en-IN')}.00`,
          status: 'RELEASED_TO_ACCOUNT',
          transfer_mode: 'Aadhaar Direct Benefit Transfer (DBT)'
        },
        driver_payout: {
          recipient: job.driver_name || 'Rajesh Patil',
          vehicle: job.vehicle_reg_no || 'MH 15 EG 4402',
          bank_account: 'State Bank of India (A/C: *******6819)',
          amount: deliveryFee,
          formatted: `₹${deliveryFee.toLocaleString('en-IN')}.00`,
          status: 'RELEASED_TO_ACCOUNT',
          transfer_mode: 'Instant Mandi Commercial Freight Settlement'
        },
        total_escrow_released: lotPrice + deliveryFee,
        settlement_timestamp: now,
        escrow_vault_ref: deal.escrow_vault_ref || '#SBI-MH-ESC-8841029'
      },
      job
    });
  } catch (err) {
    return res.status(500).json({ error: 'Dual Escrow Split settlement failed: ' + err.message });
  }
});

// Three-Way Ratings Endpoints
app.post(['/api/v1/ratings', '/api/ratings'], async (req, res) => {
  const { deal_ref, job_id, from_role, to_role, from_name, to_name, stars, feedback } = req.body;
  try {
    const result = await query(
      `INSERT INTO ratings (deal_ref, job_id, from_role, to_role, from_name, to_name, stars, feedback)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *;`,
      [deal_ref || null, job_id || null, from_role, to_role, from_name, to_name, Number(stars) || 5, feedback || '']
    );
    if (result.rows.length > 0) return res.status(201).json(result.rows[0]);
  } catch (e) {}

  const newRating = {
    id: memoryStore.ratings.length + 1,
    deal_ref,
    job_id,
    from_role,
    to_role,
    from_name,
    to_name,
    stars: Number(stars) || 5,
    feedback,
    created_at: new Date().toISOString()
  };
  memoryStore.ratings.unshift(newRating);
  res.status(201).json(newRating);
});

app.get(['/api/v1/ratings', '/api/ratings'], async (req, res) => {
  try {
    const result = await query('SELECT * FROM ratings ORDER BY created_at DESC LIMIT 50;');
    if (result.rows.length > 0) return res.json(result.rows);
  } catch (e) {}
  res.json(memoryStore.ratings);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// Serve static frontend assets from Vite build in production
app.use(express.static(distPath));

// SPA catch-all handler for client routing (excluding /api routes)
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next(err);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌾 [AgriConnect Server] Backend API & Frontend running at http://0.0.0.0:${PORT}`);
  console.log(`📊 PostgreSQL status: ${isPgConnected() ? 'CONNECTED (Port 5432)' : 'INITIALIZING...'}`);
});


