-- AgriConnect Maharashtra: Comprehensive Seed Data
-- Government of Maharashtra & MSInS Smart India Hackathon

-- 1. Farmers
INSERT INTO farmers (farmer_code, name, father_name, mobile, district, taluka, village, land_gut_no, land_area, soil_health_card, aadhaar_status, maha_eseva_status, bank_name, bank_account, ifsc, trust_score, escrow_wallet_pending)
VALUES 
('MH-NAS-2024-8821', 'Santosh Shinde', 'Ramdas Shinde', '+91 98224 81920', 'Nashik', 'Niphad', 'Pimpalgaon Baswant', 'Gut No. 142/B', '4.20 Acres Cultivated (Irrigated)', 'SHC-MH-2023-7712', 'Aadhaar e-KYC Verified', '7/12 Digital Extract Linked', 'State Bank of India', '*******4921', 'SBIN0001429', 98, 291000.00)
ON CONFLICT (farmer_code) DO NOTHING;

-- 2. Commodities
INSERT INTO commodities (id, name, name_mr, variety, category, msp)
VALUES 
('onion', 'Onion (Red / लाल कांदा)', 'लाल कांदा (गरवा)', 'Gavran / High Pungency (गावराण)', 'Allium Cepa', 1850.00),
('soyabean', 'Soyabean (सोयाबीन)', 'सोयाबीन (पिवळा)', 'JS-335 / Yellow Seed', 'Glycine max', 4600.00),
('cotton', 'Cotton (कापूस)', 'कापूस (मध्यम धागा)', 'BT Hybrid / Medium Staple', 'Gossypium', 7020.00),
('pomegranate', 'Pomegranate (डाळिंब)', 'डाळिंब (भगवा)', 'Bhagwa (भगवा)', 'Punica granatum', 7500.00),
('tomato', 'Tomato (टोमॅटो)', 'टोमॅटो (अभिनव)', 'Abhinav / F1 Hybrid', 'Solanum lycopersicum', 1200.00),
('tur_dal', 'Tur Dal (तूर डाळ)', 'तूर डाळ (पांढरी)', 'Maruti / BDN-2', 'Cajanus cajan', 7000.00)
ON CONFLICT (id) DO NOTHING;

-- 3. Mandi Prices
INSERT INTO mandi_prices (commodity_id, mandi_name, district, distance_km, modal_price, min_price, max_price, trend, arrival_today, status, recommendation)
VALUES 
('onion', 'Lasalgaon APMC', 'Nashik', 14, 2380.00, 1950.00, 2650.00, '+4.2%', '14,200 Qtl', 'Highest Rate', 'Recommended'),
('onion', 'Pimpalgaon APMC', 'Nashik', 8, 2240.00, 1850.00, 2480.00, '+1.5%', '9,800 Qtl', 'Moderate', 'Nearby Alternate'),
('onion', 'Yeola APMC', 'Nashik', 32, 2210.00, 1800.00, 2410.00, '-0.8%', '6,500 Qtl', 'Lower Price', 'Avoid High Logistics'),
('onion', 'Ahmednagar APMC', 'Ahmednagar', 88, 2190.00, 1750.00, 2350.00, '-1.4%', '11,400 Qtl', 'Oversupplied', 'Not Feasible'),
('onion', 'Pune Market Yard', 'Pune', 185, 2310.00, 1900.00, 2580.00, '+2.1%', '18,500 Qtl', 'High Transit Cost', 'Bulk Lots Only'),
('soyabean', 'Latur APMC', 'Latur', 290, 4820.00, 4450.00, 5100.00, '+3.2%', '22,400 Qtl', 'Highest Rate', 'Major Oilseed Hub'),
('cotton', 'Akola APMC', 'Akola', 380, 7410.00, 6800.00, 7850.00, '+1.8%', '16,100 Qtl', 'Firm Demand', 'Textile Mill Parity'),
('pomegranate', 'Solapur APMC', 'Solapur', 310, 9200.00, 7500.00, 11000.00, '+4.5%', '4,500 Qtl', 'Export Premium', 'Grade-A Sourcing'),
('tomato', 'Narayangaon APMC', 'Pune', 115, 1640.00, 1200.00, 1950.00, '+6.2%', '28,000 Qtl', 'Surging Trend', 'High Velocity')
ON CONFLICT DO NOTHING;

-- 4. Buyers
INSERT INTO buyers (id, name, type, badge, license_no, cin, incorporated, contact_person, rating, trust_score, escrow_deposit_limit, settled_deals, active_offer_range, location)
VALUES 
('agrofresh', 'AgroFresh Supply Chain Pvt Ltd', 'Commercial Mandi Aggregator & Institutional Processor', 'Government Verified', 'MH-PUN-APMC-9421', 'U01100MH2018PTC309112', 'May 2018 (Nashik, MH)', 'Rajesh Mehta (Dir. Sourcing & Procurement)', 4.9, 98, '₹5.00 Crore', 842, '₹2,380 - ₹2,425 / Qtl', 'Lasalgaon Mandi Grid, Nashik'),
('sahyadri', 'Sahyadri Farmer Producer Co. Ltd', 'Accredited Farmer Producer Organization & Export Grid', 'Government Verified', 'MH-NSK-APMC-1104', 'U01403MH2011PTC212344', 'January 2011 (Mohadi, Nashik)', 'Vilas Shinde (Managing Director)', 5.0, 99, '₹12.50 Crore', 2150, '₹2,410 / Qtl (Export Grade A)', 'Mohadi, Dindori Road, Nashik'),
('mahaagro', 'MahaAgro Food Processors & Exporters', 'Institutional Food Processor & Dehydration Plant', 'KYC Verified', 'MH-VSH-APMC-6733', 'U15400MH2016PTC281900', 'August 2016 (Vashi Navi Mumbai)', 'Kishore Bhende (Head of Procurement)', 4.7, 94, '₹3.20 Crore', 490, '₹2,350 / Qtl', 'APMC Market II, Vashi, Navi Mumbai'),
('reliance_fresh', 'Reliance Retail Agro Hub', 'Modern Organized Retail Aggregation Center', 'Enterprise Escrow Verified', 'MH-MUM-APMC-8812', 'U51900MH2000PLC128420', 'March 2006 (Mumbai, MH)', 'Sunil Deshmukh (Agri Ops)', 4.8, 97, '₹25.00 Crore', 4120, '₹2,400 - ₹2,450 / Qtl', 'Ghoti Sourcing Hub, Nashik')
ON CONFLICT (id) DO NOTHING;

-- 5. Lots
INSERT INTO lots (lot_code, farmer_id, farmer_name, commodity_id, crop_name, variety, quantity_qtl, asking_price, mandi, moisture_pct, defect_pct, size_caliber, grade, insure_transit, include_residue, residue_value, status, certificate_no)
VALUES 
('AC-892', 1, 'Santosh Shinde', 'onion', 'Onion (Red / लाल कांदा)', 'Gavran / High Pungency (गावराण)', 120.00, 2450.00, 'Lasalgaon APMC', 11.2, 1.2, '58.4 mm', 'Grade A', TRUE, TRUE, 18000.00, 'ESCROW_LOCKED', 'MH-QG-2024-8841'),
('AC-1049', 1, 'Santosh Shinde', 'onion', 'Nashik Red Onion (Lal Ghadva)', 'Garwa / Export Grade', 80.00, 2420.00, 'Lasalgaon APMC', 11.8, 1.6, '55.0 mm', 'Grade A', TRUE, FALSE, 0.00, 'ACTIVE', 'MH-QG-2024-9104'),
('AC-2041', 1, 'Santosh Shinde', 'soyabean', 'Soyabean (Yellow Seed)', 'JS-335 Certified', 150.00, 4850.00, 'Pimpalgaon APMC', 10.4, 0.8, '6.5 mm', 'Grade A', TRUE, TRUE, 22000.00, 'ACTIVE', 'MH-QG-2024-9402')
ON CONFLICT (lot_code) DO NOTHING;

-- 6. Deals
INSERT INTO deals (deal_ref, lot_id, buyer_id, buyer_name, farmer_name, crop_summary, quantity_qtl, agreed_price, total_escrow_amount, current_stage, transporter_info, escrow_vault_ref, status)
VALUES 
('AC-TXN-8841', 1, 'agrofresh', 'AgroFresh Supply Chain Pvt Ltd', 'Santosh Shinde', 'Lot #AC-892 (120 Qtl Grade-A Red Onion)', 120.00, 2425.00, 291000.00, 2, 'VRL Logistics (MH 15 EG 4402)', '#SBI-MH-ESC-8841029', 'ESCROW_LOCKED')
ON CONFLICT (deal_ref) DO NOTHING;

-- 7. Grievances
INSERT INTO grievances (ticket_code, deal_ref, farmer_name, buyer_name, category, description, sla_deadline, status, priority, escrow_locked_amount, filed_at)
VALUES 
('GRV-2024-0419', 'AC-TXN-8841', 'Santosh Shinde', 'AgroFresh Supply Chain Pvt Ltd', 'Delayed Assayer Inward Certificate & Escrow Lock', 'Produce truck arrived at Lasalgaon hub at 09:30 AM. Mandi assayer report not uploaded within statutory 4-hour window under Maharashtra APMC Act Rule 24.', NOW() + INTERVAL '3 hours 12 minutes', 'Under Review by APMC Officer', 'HIGH (Statutory Sec 31-B)', 291000.00, NOW() - INTERVAL '44 hours 48 minutes'),
('GRV-2024-0392', 'ESC-MH-2024-94100234', 'Dnyaneshwar Gaikwad', 'Kisan Fresh Aggregators', 'Transit Weight Discrepancy (1.4% Loss)', 'Weighbridge calibrated variance of 140 kg on 100 Qtl lot. Disputed deduction of ₹3,400 from agreed payout.', NOW() + INTERVAL '19 hours 45 minutes', 'Escalated to Mandi Arbitrator', 'MEDIUM', 242000.00, NOW() - INTERVAL '28 hours 15 minutes')
ON CONFLICT (ticket_code) DO NOTHING;

-- 8. Warehouses
INSERT INTO warehouses (id, name, type, district, distance, total_capacity_mt, available_capacity_mt, rate_per_mt_month, govt_subsidy_eligible, wdra_certified, insurance_cover, pledge_financing)
VALUES 
('wh-niphad', 'Maharashtra State Warehousing Corp (MSWC) Niphad Godown', 'Government Godown (MSWC)', 'Nashik', '12 km from Gut 142/B', 4500, 1200, 115.00, '75% MSWC Rental Concession Active', 'WDRA-REG-MH-2021-0941', 'Comprehensive Fire & Flood Covered', 'e-NWR Bank Loan up to 70% Lot Value via SBI/MGB'),
('wh-lasalgaon', 'Lasalgaon Agro Integrated Cold Storage & Chawl', 'Private WDRA Accredited Cold Chain', 'Nashik', '18 km from Gut 142/B', 2800, 450, 320.00, 'MSAMB 25% Capital Subsidy Facility', 'WDRA-REG-MH-2022-1402', 'Refrigeration Breakdown & Transit Included', 'Instant Kisan Credit Card (KCC) Limit Enhancement'),
('wh-pimpalgaon', 'MSWC Pimpalgaon Baswant Regional Depot', 'Government Godown (MSWC)', 'Nashik', '6.5 km from Gut 142/B', 6200, 1850, 115.00, 'SC/ST & Smallholder 80% Subsidy', 'WDRA-REG-MH-2020-0419', 'Govt Risk Coverage Guarantee', 'Direct NABARD Warehouse Infrastructure Fund Linkage')
ON CONFLICT (id) DO NOTHING;

-- 9. Drivers (Transporters)
INSERT INTO drivers (driver_code, user_id, name, mobile, vehicle_reg_no, license_no, vehicle_type, vehicle_capacity_kg, vahan_status, fitness_valid_until, insurance_valid_until, puc_valid_until, trust_score, rating_avg, settled_trips)
VALUES
('DRV-MH-8841', 'driver_1', 'Rajesh Patil', '+91 98231 77410', 'MH 15 EG 4402', 'MH15 20180049210', 'Ashok Leyland Ecomet 1215 (LCV)', 6000, 'Vahan Verified', '2026-11-30', '2026-08-15', '2025-12-31', 96, 4.9, 142),
('DRV-MH-9104', 'driver_2', 'Sunil Jadhav', '+91 94222 18940', 'MH 12 QX 9821', 'MH12 20160018402', 'Tata 1109 LPT High-Deck (HGV)', 8500, 'Vahan Verified', '2026-09-20', '2026-07-10', '2025-11-15', 94, 4.8, 98),
('DRV-MH-7730', 'driver_3', 'Amit Deshmukh', '+91 98810 44029', 'MH 14 BT 3120', 'MH14 20210088190', 'Mahindra Bolero Maxi Truck Plus', 1800, 'Pending Verification', '2025-10-15', '2025-10-01', '2025-09-30', 82, 4.6, 28)
ON CONFLICT (driver_code) DO NOTHING;

-- 10. Delivery Jobs (including standard and pooled jobs)
INSERT INTO delivery_jobs (job_code, deal_ref, driver_id, driver_name, vehicle_reg_no, pickup_location, drop_location, distance_km, commodity_summary, weight_qtl, is_pooled, pooled_lots_count, delivery_fee, status, picked_up_at, transit_insurance_id)
VALUES
('JOB-2024-8841', 'AC-TXN-8841', 1, 'Rajesh Patil', 'MH 15 EG 4402', 'Farm Gate: Gut No. 142/B, Pimpalgaon, Niphad Taluka, Nashik', 'AgroFresh Central Sourcing Hub, Lasalgaon Mandi Grid, Nashik', 18, 'Lot #AC-892 (120 Qtl Grade-A Red Onion)', 120.00, FALSE, 1, 8450.00, 'assigned', NULL, 'ICICI-LOMB-AGRI-8841'),
('JOB-POOL-0941', NULL, NULL, NULL, NULL, 'FPO Aggregation Center: Pimpalgaon Mandi Yard (3 Farm Pickups)', 'Sahyadri Farmers Producer Co. Mega Food Park, Dindori, Nashik', 42, 'Pooled Lot #POOL-88 (240 Qtl Combined Red Onion - 3 Farmers)', 240.00, TRUE, 3, 14800.00, 'assigned', NULL, 'ICICI-LOMB-AGRI-9902'),
('JOB-2024-7712', NULL, 1, 'Rajesh Patil', 'MH 15 EG 4402', 'Farm Gate: Gut 88, Vinchur, Nashik', 'Pune Market Yard Gate #4, Gultekdi, Pune', 185, 'Soyabean (Yellow Seed) - 80 Qtl', 80.00, FALSE, 1, 16200.00, 'delivered', NOW() - INTERVAL '2 hours', 'ICICI-LOMB-AGRI-7712')
ON CONFLICT (job_code) DO NOTHING;

-- 11. Driver Payouts
INSERT INTO driver_payouts (payout_code, job_id, driver_id, amount, escrow_status, bank_ref)
VALUES
('PO-DRV-8841', 1, 1, 8450.00, 'LOCKED_IN_ESCROW', '#SBI-MH-ESC-8841029-DRV')
ON CONFLICT (payout_code) DO NOTHING;

