async function run() {
  console.log('Testing Driver & Delivery Endpoints...\n');

  // 1. Nearby Jobs
  const nearbyRes = await fetch('http://localhost:5000/api/v1/drivers/jobs/nearby');
  const nearbyJobs = await nearbyRes.json();
  console.log('1. Nearby Jobs count:', nearbyJobs.length);
  console.log('   Job 1:', nearbyJobs[0]?.job_code, nearbyJobs[0]?.commodity_summary, 'Fee: ₹' + nearbyJobs[0]?.delivery_fee);
  console.log('   Pooled Job:', nearbyJobs.find(j => j.is_pooled)?.job_code, 'Lots count:', nearbyJobs.find(j => j.is_pooled)?.pooled_lots_count);

  // 2. Pickup
  const pickupRes = await fetch('http://localhost:5000/api/v1/delivery-jobs/1/pickup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const pickupData = await pickupRes.json();
  console.log('\n2. Pickup Result:', pickupData.success, pickupData.message, pickupData.escrow_status);

  // 3. Deliver with photo proof
  const deliverRes = await fetch('http://localhost:5000/api/v1/delivery-jobs/1/deliver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proof_photo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'
    })
  });
  const deliverData = await deliverRes.json();
  console.log('\n3. Deliver Result:', deliverData.success, deliverData.message, '48h SLA:', deliverData.auto_release_deadline);

  // 4. Confirm (Dual Escrow Split)
  const confirmRes = await fetch('http://localhost:5000/api/v1/delivery-jobs/1/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const confirmData = await confirmRes.json();
  console.log('\n4. Confirm (Dual Split) Result:', confirmData.success);
  console.log('   Dual Split Details:', confirmData.dual_escrow_split);

  // 5. Three-way rating
  const rateRes = await fetch('http://localhost:5000/api/v1/ratings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deal_ref: 'AC-TXN-8841',
      job_id: 1,
      from_role: 'farmer',
      to_role: 'driver',
      from_name: 'Santosh Shinde',
      to_name: 'Rajesh Patil',
      stars: 5,
      feedback: 'Very polite driver, on-time farm gate pickup with clean aerated tarpaulin.'
    })
  });
  const rateData = await rateRes.json();
  console.log('\n5. Rating Result:', rateData.id, rateData.from_role, '->', rateData.to_role, rateData.stars, 'stars');
}

run();
