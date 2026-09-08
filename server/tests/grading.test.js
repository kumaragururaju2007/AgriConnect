/**
 * Automated Verification Suite for AgriConnect Quality Grading Service
 * Validates Roboflow Universe model routing, confidence calibration, fallback triggers,
 * multi-photo aggregation, disagreement detection, and farmer-readable errors.
 */

import {
  CROP_MODEL_MAP,
  MODEL_CONFIGS,
  get_model_for_crop,
  evaluatePhotoPredictions,
  gradeLotImages,
  GradingError,
  ERROR_DEFINITIONS
} from '../gradingService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING ROBOFLOW QUALITY GRADING TEST SUITE');
  console.log('====================================================\n');

  // Test Group 1: Extensible Model Map & Normalization Lookup
  console.log('📦 Test Group 1: Model Routing & Crop Normalization');
  assert(CROP_MODEL_MAP.default === 'freshness-fruits-and-vegetables/1', 'CROP_MODEL_MAP default points to general freshness model');
  assert(CROP_MODEL_MAP.onion === 'veg1-hcqsf-2/2', 'CROP_MODEL_MAP onion points to veg1-hcqsf-2/2');

  assert(get_model_for_crop('onion') === 'veg1-hcqsf-2/2', 'get_model_for_crop("onion") -> veg1-hcqsf-2/2');
  assert(get_model_for_crop('  ONION  ') === 'veg1-hcqsf-2/2', 'get_model_for_crop normalizes whitespace and uppercase');
  assert(get_model_for_crop('Onion (Red / लाल कांदा)') === 'veg1-hcqsf-2/2', 'get_model_for_crop matches Marathi/English compound name');
  assert(get_model_for_crop('Nashik Red Onion (Lal Ghadva)') === 'veg1-hcqsf-2/2', 'get_model_for_crop matches variety string with "onion"');
  assert(get_model_for_crop('kanda') === 'veg1-hcqsf-2/2', 'get_model_for_crop matches "kanda" (Marathi colloquial)');
  assert(get_model_for_crop('pyaz') === 'veg1-hcqsf-2/2', 'get_model_for_crop matches "pyaz" (Hindi colloquial)');

  assert(get_model_for_crop('tomato') === 'freshness-fruits-and-vegetables/1', 'get_model_for_crop("tomato") -> default freshness model');
  assert(get_model_for_crop('soyabean') === 'freshness-fruits-and-vegetables/1', 'get_model_for_crop("soyabean") -> default freshness model');
  assert(get_model_for_crop('cotton') === 'freshness-fruits-and-vegetables/1', 'get_model_for_crop("cotton") -> default freshness model');
  assert(get_model_for_crop(null) === 'freshness-fruits-and-vegetables/1', 'get_model_for_crop(null) -> default freshness model');
  assert(get_model_for_crop('') === 'freshness-fruits-and-vegetables/1', 'get_model_for_crop("") -> default freshness model');

  // Verify Single-Dict Extensibility
  CROP_MODEL_MAP['potato'] = 'potato-quality-model/3';
  assert(get_model_for_crop('potato') === 'potato-quality-model/3', 'Easily extensible: adding one entry to CROP_MODEL_MAP routes instantly');
  delete CROP_MODEL_MAP['potato'];

  console.log('\n⚖️ Test Group 2: Model Calibration & Defect Classification');
  // 2a. Onion Model (veg1-hcqsf-2/2) Calibration
  const cleanOnionInference = {
    predictions: [{ class: 'Onion', confidence: 0.92 }]
  };
  const cleanOnionResult = evaluatePhotoPredictions('veg1-hcqsf-2/2', cleanOnionInference);
  assert(cleanOnionResult.grade === 'A' && cleanOnionResult.confidence === 92, 'Onion model: 92% healthy detection -> Grade A');
  assert(cleanOnionResult.needs_fallback === false, 'Onion model: high confidence does NOT trigger fallback');

  const severeDefectInference = {
    predictions: [
      { class: 'Onion', confidence: 0.80 },
      { class: 'Black smut', confidence: 0.72 }
    ]
  };
  const severeDefectResult = evaluatePhotoPredictions('veg1-hcqsf-2/2', severeDefectInference);
  assert(severeDefectResult.grade === 'Reject', 'Onion model: Black smut defect >= 45% -> Grade Reject');
  assert(severeDefectResult.defect_flags.some(d => d.includes('Black smut')), 'Onion model: Black smut recorded in defect_flags');

  const minorDefectInference = {
    predictions: [
      { class: 'Onion', confidence: 0.70 },
      { class: 'Double split', confidence: 0.42 }
    ]
  };
  const minorDefectResult = evaluatePhotoPredictions('veg1-hcqsf-2/2', minorDefectInference);
  assert(minorDefectResult.grade === 'B' || minorDefectResult.grade === 'C', 'Onion model: Double split minor defect -> Grade B or C');

  // Onion model low confidence fallback trigger (< 0.40)
  const lowConfOnionInference = {
    predictions: [{ class: 'Onion', confidence: 0.32 }]
  };
  const lowConfResult = evaluatePhotoPredictions('veg1-hcqsf-2/2', lowConfOnionInference);
  assert(lowConfResult.needs_fallback === true, 'Onion model: Confidence 0.32 below threshold 0.40 triggers needs_fallback');

  // 2b. Freshness Model (freshness-fruits-and-vegetables/1) Calibration
  const freshFruitInference = {
    predictions: [{ class: 'fresh', confidence: 0.88 }]
  };
  const freshResult = evaluatePhotoPredictions('freshness-fruits-and-vegetables/1', freshFruitInference);
  assert(freshResult.grade === 'A' && freshResult.confidence === 88, 'Freshness model: fresh 88% -> Grade A');

  const rottenFruitInference = {
    predictions: [
      { class: 'rotten', confidence: 0.82 },
      { class: 'fresh', confidence: 0.18 }
    ]
  };
  const rottenResult = evaluatePhotoPredictions('freshness-fruits-and-vegetables/1', rottenFruitInference);
  assert(rottenResult.grade === 'Reject', 'Freshness model: rotten dominant (82%) -> Grade Reject');

  console.log('\n🔄 Test Group 3: Multi-Photo Aggregation & Disagreement Detection');
  // Scenario 3a: Agreeing sample photos
  const agreeingPhotosResult = await gradeLotImages({
    crop_type: 'onion',
    photos: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'
    ]
  });

  assert(agreeingPhotosResult.success === true, 'gradeLotImages returns success: true');
  assert(agreeingPhotosResult.model_used === 'veg1-hcqsf-2/2', 'Onion crop routes to veg1-hcqsf-2/2');
  assert(agreeingPhotosResult.used_fallback_model === false, 'Clean inference does not use fallback model');
  assert(agreeingPhotosResult.needs_review === false, 'Uniform photos do not flag needs_review');
  assert(agreeingPhotosResult.per_photo_results.length === 2, '2 photos evaluated in per_photo_results');
  assert(agreeingPhotosResult.audit_log.length >= 3, 'Audit trail populated with MODEL_ROUTED and AGGREGATION_COMPLETE');

  // Scenario 3b: Non-onion crop routing (e.g. tomato routes to default model)
  assert(get_model_for_crop('tomato') === 'freshness-fruits-and-vegetables/1', 'Tomato crop routes to freshness-fruits-and-vegetables/1');

  console.log('\n🚨 Test Group 4: Error Handling & Farmer-Readable Codes');
  assert(ERROR_DEFINITIONS.NO_PRODUCE_DETECTED.code === 'NO_PRODUCE_DETECTED', 'NO_PRODUCE_DETECTED error code exists');
  assert(ERROR_DEFINITIONS.BLURRY_PHOTO.code === 'BLURRY_PHOTO', 'BLURRY_PHOTO error code exists');
  assert(ERROR_DEFINITIONS.API_TIMEOUT.code === 'API_TIMEOUT', 'API_TIMEOUT error code exists');
  assert(ERROR_DEFINITIONS.RATE_LIMIT_EXCEEDED.code === 'RATE_LIMIT_EXCEEDED', 'RATE_LIMIT_EXCEEDED error code exists');

  // Verify farmer-readable multilingual explanations
  assert(ERROR_DEFINITIONS.API_TIMEOUT.mr.includes('१० सेकंदात'), 'Marathi translation for API_TIMEOUT mentions 10s timeout');
  assert(ERROR_DEFINITIONS.RATE_LIMIT_EXCEEDED.en.includes('rate limit'), 'English translation for RATE_LIMIT_EXCEEDED exists');

  // Non-produce photo (building/cityscape) MUST throw NO_PRODUCE_DETECTED
  try {
    await gradeLotImages({
      crop_type: 'onion',
      photos: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400']
    });
    assert(false, 'Building photo should have thrown NO_PRODUCE_DETECTED');
  } catch (err) {
    assert(err.code === 'NO_PRODUCE_DETECTED', 'Building photo correctly rejected with NO_PRODUCE_DETECTED');
  }

  // Empty photos validation throws NO_PRODUCE_DETECTED
  try {
    await gradeLotImages({ crop_type: 'onion', photos: [] });
    assert(false, 'Should have thrown error on empty photos');
  } catch (err) {
    assert(err.code === 'NO_PRODUCE_DETECTED', 'Empty photo list triggers NO_PRODUCE_DETECTED GradingError');
  }

  // Tomato photo on Onion lot triggers CROP_MISMATCH
  try {
    await gradeLotImages({
      crop_type: 'onion',
      photos: ['https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400']
    });
    assert(false, 'Tomato photo on Onion lot should have thrown CROP_MISMATCH');
  } catch (err) {
    assert(err.code === 'CROP_MISMATCH', `Tomato photo for onion lot correctly triggers CROP_MISMATCH error (code: ${err.code})`);
  }

  // Watermelon photo on Onion lot triggers CROP_MISMATCH
  try {
    await gradeLotImages({
      crop_type: 'onion',
      photos: ['https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&title=watermelon']
    });
    assert(false, 'Watermelon photo on Onion lot should have thrown CROP_MISMATCH');
  } catch (err) {
    assert(err.code === 'CROP_MISMATCH', `Watermelon photo for onion lot correctly triggers CROP_MISMATCH error (code: ${err.code})`);
  }

  console.log('\n📋 Test Group 5: Response Contract Verification');
  const requiredFields = [
    'model_used',
    'used_fallback_model',
    'grade',
    'grade_confidence',
    'defect_flags',
    'per_photo_results',
    'needs_review',
    'audit_log',
    'message'
  ];

  for (const field of requiredFields) {
    assert(agreeingPhotosResult[field] !== undefined, `Response contains required field: ${field}`);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
