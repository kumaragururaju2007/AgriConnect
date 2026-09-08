-- ============================================================================
-- AgriConnect Maharashtra: Complete Supabase Schema, RLS Policies & Grants
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- 1. Farmers
CREATE TABLE IF NOT EXISTS public.farmers (
  id SERIAL PRIMARY KEY,
  farmer_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  father_name VARCHAR(100),
  mobile VARCHAR(20),
  district VARCHAR(50),
  taluka VARCHAR(50),
  village VARCHAR(100),
  land_gut_no VARCHAR(50),
  land_area VARCHAR(50),
  soil_health_card VARCHAR(50),
  aadhaar_status VARCHAR(50) DEFAULT 'Aadhaar e-KYC Verified',
  maha_eseva_status VARCHAR(50) DEFAULT '7/12 Digital Extract Linked',
  bank_name VARCHAR(100) DEFAULT 'State Bank of India',
  bank_account VARCHAR(50) DEFAULT '*******4921',
  ifsc VARCHAR(20) DEFAULT 'SBIN0001429',
  trust_score INT DEFAULT 98,
  escrow_wallet_pending NUMERIC(12, 2) DEFAULT 291000.00,
  razorpay_account_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Commodities
CREATE TABLE IF NOT EXISTS public.commodities (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_mr VARCHAR(100),
  variety VARCHAR(100),
  category VARCHAR(50),
  msp NUMERIC(10, 2) NOT NULL
);

-- 3. Mandi Prices
CREATE TABLE IF NOT EXISTS public.mandi_prices (
  id SERIAL PRIMARY KEY,
  commodity_id VARCHAR(50) REFERENCES public.commodities(id) ON DELETE CASCADE,
  mandi_name VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL,
  distance_km INT DEFAULT 0,
  modal_price NUMERIC(10, 2) NOT NULL,
  min_price NUMERIC(10, 2),
  max_price NUMERIC(10, 2),
  trend VARCHAR(20) DEFAULT '+0.0%',
  arrival_today VARCHAR(50),
  status VARCHAR(50),
  recommendation VARCHAR(50),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Lots
CREATE TABLE IF NOT EXISTS public.lots (
  id SERIAL PRIMARY KEY,
  lot_code VARCHAR(50) UNIQUE NOT NULL,
  farmer_id INT REFERENCES public.farmers(id) ON DELETE SET NULL,
  farmer_name VARCHAR(100) NOT NULL,
  commodity_id VARCHAR(50) REFERENCES public.commodities(id) ON DELETE SET NULL,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100) NOT NULL,
  quantity_qtl NUMERIC(10, 2) NOT NULL,
  asking_price NUMERIC(10, 2) NOT NULL,
  mandi VARCHAR(100) DEFAULT 'Lasalgaon APMC',
  moisture_pct NUMERIC(5, 2) DEFAULT 11.4,
  defect_pct NUMERIC(5, 2) DEFAULT 1.2,
  size_caliber VARCHAR(20) DEFAULT '58.4 mm',
  grade VARCHAR(20) DEFAULT 'Grade A',
  insure_transit BOOLEAN DEFAULT TRUE,
  include_residue BOOLEAN DEFAULT TRUE,
  residue_value NUMERIC(10, 2) DEFAULT 18000.00,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  certificate_no VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Buyers
CREATE TABLE IF NOT EXISTS public.buyers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(150) NOT NULL,
  badge VARCHAR(50) DEFAULT 'Government Verified',
  license_no VARCHAR(50) NOT NULL,
  cin VARCHAR(50),
  incorporated VARCHAR(50),
  contact_person VARCHAR(100),
  rating NUMERIC(3, 2) DEFAULT 4.9,
  trust_score INT DEFAULT 98,
  escrow_deposit_limit VARCHAR(50) DEFAULT '₹5.00 Crore',
  settled_deals INT DEFAULT 842,
  active_offer_range VARCHAR(100) DEFAULT '₹2,380 - ₹2,425 / Qtl',
  location VARCHAR(100) DEFAULT 'Lasalgaon Mandi Grid, Nashik'
);

-- 6. Deals
CREATE TABLE IF NOT EXISTS public.deals (
  id SERIAL PRIMARY KEY,
  deal_ref VARCHAR(50) UNIQUE NOT NULL,
  lot_id INT,
  buyer_id VARCHAR(50),
  buyer_name VARCHAR(100) NOT NULL,
  farmer_name VARCHAR(100) NOT NULL,
  crop_summary VARCHAR(150) NOT NULL,
  quantity_qtl NUMERIC(10, 2) NOT NULL,
  agreed_price NUMERIC(10, 2) NOT NULL,
  product_amount NUMERIC(12, 2),
  transport_amount NUMERIC(12, 2),
  total_escrow_amount NUMERIC(12, 2) NOT NULL,
  current_stage INT DEFAULT 2,
  transporter_info VARCHAR(100) DEFAULT 'VRL Logistics (MH 15 EG 4402)',
  escrow_vault_ref VARCHAR(50) DEFAULT '#SBI-MH-ESC-8841029',
  delivery_job_id INT,
  delivery_fee NUMERIC(10, 2) DEFAULT 8450.00,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_transfer_farmer_id VARCHAR(100),
  razorpay_transfer_driver_id VARCHAR(100),
  escrow_status VARCHAR(50) DEFAULT 'ESCROW_LOCKED',
  transport_escrow_status VARCHAR(50) DEFAULT 'ASSIGNED',
  status VARCHAR(50) DEFAULT 'ESCROW_LOCKED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Grievances
CREATE TABLE IF NOT EXISTS public.grievances (
  id SERIAL PRIMARY KEY,
  ticket_code VARCHAR(50) UNIQUE NOT NULL,
  deal_ref VARCHAR(50),
  farmer_name VARCHAR(100) NOT NULL,
  buyer_name VARCHAR(100) NOT NULL,
  category VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'Statutory 48h SLA Clock Active',
  priority VARCHAR(50) DEFAULT 'HIGH (APMC Sec 31-B)',
  escrow_locked_amount NUMERIC(12, 2) DEFAULT 291000.00,
  resolution_notes TEXT,
  job_id INT,
  driver_id INT,
  filed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 8. Warehouses
CREATE TABLE IF NOT EXISTS public.warehouses (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(100) NOT NULL,
  district VARCHAR(50) NOT NULL,
  distance VARCHAR(50) NOT NULL,
  total_capacity_mt INT NOT NULL,
  available_capacity_mt INT NOT NULL,
  rate_per_mt_month NUMERIC(10, 2) NOT NULL,
  govt_subsidy_eligible VARCHAR(150),
  wdra_certified VARCHAR(50),
  insurance_cover VARCHAR(150),
  pledge_financing VARCHAR(150)
);

-- 9. Drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id SERIAL PRIMARY KEY,
  driver_code VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(50),
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  vehicle_reg_no VARCHAR(50) NOT NULL,
  license_no VARCHAR(50) NOT NULL,
  vehicle_type VARCHAR(100) DEFAULT 'Commercial Heavy Goods Vehicle (LCV/HGV)',
  vehicle_capacity_kg INT NOT NULL,
  vahan_status VARCHAR(50) DEFAULT 'Vahan Verified',
  fitness_valid_until DATE,
  insurance_valid_until DATE,
  puc_valid_until DATE,
  vehicle_photo_url TEXT,
  trust_score INT DEFAULT 96,
  rating_avg NUMERIC(3, 2) DEFAULT 4.9,
  settled_trips INT DEFAULT 142,
  bank_name VARCHAR(100) DEFAULT 'State Bank of India',
  bank_account VARCHAR(50) DEFAULT '*******6819',
  ifsc VARCHAR(20) DEFAULT 'SBIN0001429',
  razorpay_account_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Delivery Jobs
CREATE TABLE IF NOT EXISTS public.delivery_jobs (
  id SERIAL PRIMARY KEY,
  job_code VARCHAR(50) UNIQUE NOT NULL,
  deal_ref VARCHAR(50),
  driver_id INT REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name VARCHAR(100),
  vehicle_reg_no VARCHAR(50),
  pickup_location VARCHAR(150) NOT NULL,
  pickup_geohash VARCHAR(50),
  drop_location VARCHAR(150) NOT NULL,
  drop_geohash VARCHAR(50),
  distance_km INT DEFAULT 115,
  commodity_summary VARCHAR(150) NOT NULL,
  weight_qtl NUMERIC(10, 2) NOT NULL,
  is_pooled BOOLEAN DEFAULT FALSE,
  pooled_lots_count INT DEFAULT 1,
  delivery_fee NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'assigned',
  proof_photo_url TEXT,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  auto_release_deadline TIMESTAMP WITH TIME ZONE,
  transit_insurance_id VARCHAR(50) DEFAULT 'ICICI-LOMB-AGRI-8841',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Driver Payouts
CREATE TABLE IF NOT EXISTS public.driver_payouts (
  id SERIAL PRIMARY KEY,
  payout_code VARCHAR(50) UNIQUE NOT NULL,
  job_id INT REFERENCES public.delivery_jobs(id) ON DELETE CASCADE,
  driver_id INT REFERENCES public.drivers(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  escrow_status VARCHAR(50) DEFAULT 'LOCKED_IN_ESCROW',
  bank_ref VARCHAR(50),
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Multi-Party Ratings
CREATE TABLE IF NOT EXISTS public.ratings (
  id SERIAL PRIMARY KEY,
  deal_ref VARCHAR(50),
  job_id INT,
  from_role VARCHAR(20) NOT NULL,
  to_role VARCHAR(20) NOT NULL,
  from_name VARCHAR(100),
  to_name VARCHAR(100),
  stars INT CHECK (stars BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Admin Applications & Audit Logs
CREATE TABLE IF NOT EXISTS public.buyer_applications (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company VARCHAR(150) NOT NULL,
  apmc_license VARCHAR(50) NOT NULL,
  gstin VARCHAR(50),
  category VARCHAR(100),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  actor VARCHAR(100) NOT NULL,
  target VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Supabase Permissions & Grants
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role, postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role, postgres;

-- ============================================================================
-- Row Level Security (RLS) Enablement & Permissive Policies
-- ============================================================================
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for farmers" ON public.farmers;
CREATE POLICY "Allow all for farmers" ON public.farmers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for commodities" ON public.commodities;
CREATE POLICY "Allow all for commodities" ON public.commodities FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for mandi_prices" ON public.mandi_prices;
CREATE POLICY "Allow all for mandi_prices" ON public.mandi_prices FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for lots" ON public.lots;
CREATE POLICY "Allow all for lots" ON public.lots FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for buyers" ON public.buyers;
CREATE POLICY "Allow all for buyers" ON public.buyers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for deals" ON public.deals;
CREATE POLICY "Allow all for deals" ON public.deals FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for grievances" ON public.grievances;
CREATE POLICY "Allow all for grievances" ON public.grievances FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for warehouses" ON public.warehouses;
CREATE POLICY "Allow all for warehouses" ON public.warehouses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for drivers" ON public.drivers;
CREATE POLICY "Allow all for drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.delivery_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for delivery_jobs" ON public.delivery_jobs;
CREATE POLICY "Allow all for delivery_jobs" ON public.delivery_jobs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.driver_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for driver_payouts" ON public.driver_payouts;
CREATE POLICY "Allow all for driver_payouts" ON public.driver_payouts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for ratings" ON public.ratings;
CREATE POLICY "Allow all for ratings" ON public.ratings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.buyer_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for buyer_applications" ON public.buyer_applications;
CREATE POLICY "Allow all for buyer_applications" ON public.buyer_applications FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for audit_logs" ON public.audit_logs;
CREATE POLICY "Allow all for audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for key operational tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals, public.lots, public.delivery_jobs, public.mandi_prices, public.grievances;

-- Seed initial records
INSERT INTO public.farmers (farmer_code, name, father_name, mobile, district, taluka, village, land_gut_no, land_area, soil_health_card, aadhaar_status, maha_eseva_status, bank_name, bank_account, ifsc, trust_score, escrow_wallet_pending)
VALUES 
('MH-NAS-2024-8821', 'Santosh Shinde', 'Ramdas Shinde', '+91 98224 81920', 'Nashik', 'Niphad', 'Pimpalgaon Baswant', 'Gut No. 142/B', '4.20 Acres Cultivated', 'SHC-MH-2023-7712', 'Aadhaar e-KYC Verified', '7/12 Digital Extract Linked', 'State Bank of India', '*******4921', 'SBIN0001429', 98, 291000.00)
ON CONFLICT (farmer_code) DO NOTHING;

INSERT INTO public.commodities (id, name, name_mr, variety, category, msp)
VALUES 
('onion', 'Onion (Red / लाल कांदा)', 'लाल कांदा (गरवा)', 'Gavran / High Pungency', 'Allium Cepa', 1850.00),
('soyabean', 'Soyabean (सोयाबीन)', 'सोयाबीन (पिवळा)', 'JS-335 / Yellow Seed', 'Glycine max', 4600.00),
('cotton', 'Cotton (कापूस)', 'कापूस (मध्यम धागा)', 'BT Hybrid', 'Gossypium', 7020.00),
('pomegranate', 'Pomegranate (डाळिंब)', 'डाळिंब (भगवा)', 'Bhagwa', 'Punica granatum', 7500.00),
('tomato', 'Tomato (टोमॅटो)', 'टोमॅटो (अभिनव)', 'Abhinav / F1 Hybrid', 'Solanum lycopersicum', 1200.00),
('tur', 'Tur Dal (तूर डाळ)', 'तूर डाळ (पांढरी)', 'Maruti / BDN-2', 'Cajanus cajan', 7000.00)
ON CONFLICT (id) DO NOTHING;
