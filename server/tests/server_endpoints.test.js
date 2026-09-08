/**
 * Server Endpoints Verification for Quality Grading
 */

import http from 'http';

// We can test against server by starting it or testing the handlers
import { gradeLotImages, get_model_for_crop, CROP_MODEL_MAP } from '../gradingService.js';

console.log('Testing Server Integration Logic...');

const modelForOnion = get_model_for_crop('onion');
console.log('Model for onion:', modelForOnion);
if (modelForOnion !== 'veg1-hcqsf-2/2') {
  console.error('FAIL: Expected veg1-hcqsf-2/2');
  process.exit(1);
}

const modelForTomato = get_model_for_crop('tomato');
console.log('Model for tomato:', modelForTomato);
if (modelForTomato !== 'freshness-fruits-and-vegetables/1') {
  console.error('FAIL: Expected freshness-fruits-and-vegetables/1');
  process.exit(1);
}

console.log('Testing multi-photo grading aggregation with disagreement...');
const testResult = await gradeLotImages({
  crop_type: 'onion',
  photos: [
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'
  ]
});

console.log('Grading Result Keys:', Object.keys(testResult));
console.log('Success:', testResult.success);
console.log('Model Used:', testResult.model_used);
console.log('Grade:', testResult.grade);
console.log('Audit Log entries:', testResult.audit_log.length);

if (!testResult.success || !testResult.model_used || !testResult.grade) {
  console.error('FAIL: Missing key attributes in grading response');
  process.exit(1);
}

console.log('✓ Server Integration Logic verified successfully!');
