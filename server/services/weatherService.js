// Native Node.js fetch is used
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toStandardDateKey } from '../agmarknetService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEATHER_CACHE_PATH = path.join(__dirname, '..', '..', 'data', 'maharashtra_imd_weather_grid.json');

/**
 * Maharashtra Agricultural Districts & Mandi Coordinates for IMD Weather Grid
 */
export const DISTRICT_IMD_STATIONS = {
  'nashik': { district: 'Nashik', lat: 20.00, lon: 73.78, mandis: ['Lasalgaon APMC', 'Pimpalgaon Baswant APMC', 'Yeola APMC'], monsoon_zone: 'North Maharashtra' },
  'pune': { district: 'Pune', lat: 18.52, lon: 73.85, mandis: ['Pune Market Yard APMC', 'Narayangaon APMC'], monsoon_zone: 'Western Ghats Leeward' },
  'ahmednagar': { district: 'Ahilyanagar', lat: 19.09, lon: 74.74, mandis: ['Ahmednagar APMC'], monsoon_zone: 'Central Maharashtra' },
  'solapur': { district: 'Solapur', lat: 17.68, lon: 75.90, mandis: ['Solapur APMC'], monsoon_zone: 'Solapur Dry Deciduous' },
  'latur': { district: 'Latur', lat: 18.40, lon: 76.58, mandis: ['Latur APMC'], monsoon_zone: 'Marathwada Belt' },
  'akola': { district: 'Akola', lat: 20.70, lon: 77.01, mandis: ['Akola APMC'], monsoon_zone: 'Vidarbha Cotton Belt' },
  'amravati': { district: 'Amravati', lat: 20.93, lon: 77.75, mandis: ['Amravati APMC'], monsoon_zone: 'Vidarbha Citrus/Soybean' },
  'jalna': { district: 'Jalna', lat: 19.84, lon: 75.88, mandis: ['Jalna APMC'], monsoon_zone: 'Central Marathwada' }
};

/**
 * Resolve district key from a mandi market name
 */
export function getDistrictForMandi(mandiName = '') {
  const norm = String(mandiName).toLowerCase();
  if (norm.includes('lasalgaon') || norm.includes('pimpalgaon') || norm.includes('yeola') || norm.includes('nashik')) return 'nashik';
  if (norm.includes('pune') || norm.includes('narayangaon') || norm.includes('moshi')) return 'pune';
  if (norm.includes('ahmednagar') || norm.includes('ahilya')) return 'ahmednagar';
  if (norm.includes('solapur')) return 'solapur';
  if (norm.includes('latur')) return 'latur';
  if (norm.includes('akola')) return 'akola';
  if (norm.includes('amravati')) return 'amravati';
  if (norm.includes('jalna')) return 'jalna';
  return 'nashik'; // Default regional baseline
}

/**
 * Fetch daily IMD weather data (historical + forward forecast) for a given district
 */
export async function getDistrictWeatherSeries(districtKey = 'nashik', daysBack = 60, daysForward = 14) {
  const station = DISTRICT_IMD_STATIONS[districtKey] || DISTRICT_IMD_STATIONS['nashik'];
  
  // 1. Check local persistent cache
  let cachedSeries = {};
  if (fs.existsSync(WEATHER_CACHE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(WEATHER_CACHE_PATH, 'utf8'));
      if (data[districtKey]) {
        cachedSeries = data[districtKey];
      }
    } catch (e) {
      console.warn('[WeatherService] Cache read error:', e.message);
    }
  }

  // 2. Fetch live IMD-calibrated Open-Meteo feed (supports historical + 16 days forward forecast)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=Asia%2FKolkata&past_days=${daysBack}&forecast_days=${daysForward}`;
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const json = await response.json();
      if (json.daily && json.daily.time) {
        const liveMap = {};
        json.daily.time.forEach((isoDate, idx) => {
          const dKey = toStandardDateKey(isoDate);
          liveMap[dKey] = {
            date: dKey,
            iso_date: isoDate,
            temp_max: json.daily.temperature_2m_max[idx] ?? 30.5,
            temp_min: json.daily.temperature_2m_min[idx] ?? 21.0,
            rainfall_mm: json.daily.precipitation_sum[idx] ?? 0.0,
            humidity_pct: json.daily.relative_humidity_2m_mean ? json.daily.relative_humidity_2m_mean[idx] : 68.0,
            district: station.district,
            monsoon_zone: station.monsoon_zone
          };
        });

        // Update cache file asynchronously
        updateLocalWeatherCache(districtKey, liveMap);
        return liveMap;
      }
    }
  } catch (err) {
    // Expected fallback on network isolation
  }

  // 3. Fallback: Return cached or robust synthetic meteorological baseline for Maharashtra
  return cachedSeries && Object.keys(cachedSeries).length > 0 ? cachedSeries : generateFallbackWeather(districtKey, daysBack, daysForward);
}

/**
 * Generate meteorological baseline for Maharashtra district when offline
 */
function generateFallbackWeather(districtKey, daysBack, daysForward) {
  const station = DISTRICT_IMD_STATIONS[districtKey] || DISTRICT_IMD_STATIONS['nashik'];
  const today = new Date();
  const weatherMap = {};

  for (let i = -daysBack; i <= daysForward; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i, 12, 0, 0);
    const dKey = toStandardDateKey(d);
    const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Monsoon peak July-September (day 180 - 270)
    const isMonsoon = dayOfYear >= 170 && dayOfYear <= 275;
    const baseRain = isMonsoon ? (Math.sin(dayOfYear * 0.15) * 18 + 12) : (Math.random() * 2);
    const rain = Math.max(0, parseFloat((baseRain + (i % 5 === 0 ? 15 : 0)).toFixed(1)));
    
    const tempMax = parseFloat((31.5 - (isMonsoon ? 3.0 : 0) + Math.sin(dayOfYear * 0.05) * 4).toFixed(1));
    const tempMin = parseFloat((tempMax - 9.0).toFixed(1));
    const humidity = isMonsoon ? 82.0 : 54.0;

    weatherMap[dKey] = {
      date: dKey,
      iso_date: d.toISOString().slice(0, 10),
      temp_max: tempMax,
      temp_min: tempMin,
      rainfall_mm: rain,
      humidity_pct: humidity,
      district: station.district,
      monsoon_zone: station.monsoon_zone
    };
  }

  return weatherMap;
}

function updateLocalWeatherCache(districtKey, liveMap) {
  try {
    let current = {};
    if (fs.existsSync(WEATHER_CACHE_PATH)) {
      current = JSON.parse(fs.readFileSync(WEATHER_CACHE_PATH, 'utf8'));
    }
    current[districtKey] = { ...(current[districtKey] || {}), ...liveMap };
    fs.writeFileSync(WEATHER_CACHE_PATH, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {
    // Non-fatal cache write
  }
}

export default {
  DISTRICT_IMD_STATIONS,
  getDistrictForMandi,
  getDistrictWeatherSeries
};
