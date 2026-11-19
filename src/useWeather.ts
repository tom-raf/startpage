import { useEffect, useState } from "react";
import type { Weather, WeatherPlace } from "./types";

// Open-Meteo: free, no API key, CORS-enabled. https://open-meteo.com
const CACHE_KEY = "startpage.weather.v1";
const MAX_AGE_MS = 30 * 60_000;

function readCache(place: WeatherPlace): Weather | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const w = JSON.parse(raw) as Weather;
    if (w.lat !== place.lat || w.lon !== place.lon) return null;
    return w;
  } catch {
    return null;
  }
}

function writeCache(w: Weather) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(w));
  } catch {
    // no cache, it just refetches
  }
}

async function fetchWeather(place: WeatherPlace): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(place.lat),
    longitude: String(place.lon),
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "1",
    wind_speed_unit: "mph",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const j = await res.json();
  return {
    fetchedAt: Date.now(),
    lat: place.lat,
    lon: place.lon,
    temp: j.current.temperature_2m,
    code: j.current.weather_code,
    wind: j.current.wind_speed_10m,
    max: j.daily.temperature_2m_max[0],
    min: j.daily.temperature_2m_min[0],
    rainChance: j.daily.precipitation_probability_max?.[0] ?? null,
    sunrise: String(j.daily.sunrise[0]).slice(11, 16),
    sunset: String(j.daily.sunset[0]).slice(11, 16),
  };
}

export async function geocode(query: string): Promise<WeatherPlace | null> {
  const params = new URLSearchParams({ name: query.trim(), count: "1", language: "en", format: "json" });
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!res.ok) return null;
  const j = await res.json();
  const r = j.results?.[0];
  if (!r) return null;
  return { name: r.name, lat: Number(r.latitude.toFixed(4)), lon: Number(r.longitude.toFixed(4)) };
}

export function useWeather(place: WeatherPlace) {
  const [weather, setWeather] = useState<Weather | null>(() => readCache(place));
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = readCache(place);
      if (cached && Date.now() - cached.fetchedAt < MAX_AGE_MS) {
        setWeather(cached);
        return;
      }
      try {
        const w = await fetchWeather(place);
        if (cancelled) return;
        writeCache(w);
        setWeather(w);
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    setWeather(readCache(place));
    load();
    const t = setInterval(load, MAX_AGE_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [place]);

  return { weather, error };
}

// WMO weather interpretation codes
export function describeWeather(code: number): string {
  if (code === 0) return "CLEAR";
  if (code === 1) return "MOSTLY CLEAR";
  if (code === 2) return "PARTLY CLOUDY";
  if (code === 3) return "OVERCAST";
  if (code === 45 || code === 48) return "FOG";
  if (code >= 51 && code <= 57) return "DRIZZLE";
  if (code >= 61 && code <= 65) return "RAIN";
  if (code === 66 || code === 67) return "FREEZING RAIN";
  if (code >= 71 && code <= 77) return "SNOW";
  if (code >= 80 && code <= 82) return "SHOWERS";
  if (code === 85 || code === 86) return "SNOW SHOWERS";
  if (code >= 95) return "THUNDERSTORM";
  return "-";
}
