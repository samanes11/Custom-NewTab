import { API_CONFIG } from "@/config";
import type { WeatherData } from "@/types";

// Open-Meteo WMO weather codes collapsed into short, human labels.
const CONDITION_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

function labelFor(code: number): string {
  return CONDITION_LABELS[code] ?? "Unknown";
}

export async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string }> {
  const url = `${API_CONFIG.weather.geocoding}?name=${encodeURIComponent(city)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding error (${res.status})`);
  const json: { results?: { latitude: number; longitude: number; name: string; country?: string }[] } = await res.json();
  const first = json.results?.[0];
  if (!first) throw new Error(`Couldn't find "${city}"`);
  return {
    lat: first.latitude,
    lon: first.longitude,
    name: first.country ? `${first.name}, ${first.country}` : first.name,
  };
}

export async function fetchWeatherByCoords(lat: number, lon: number, locationName: string): Promise<WeatherData> {
  const url = `${API_CONFIG.weather.forecast}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error (${res.status})`);
  const json: {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      weather_code: number;
      apparent_temperature: number;
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  } = await res.json();

  const forecast = json.daily.time.slice(1, 4).map((date, i) => ({
    day: new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
    code: json.daily.weather_code[i + 1],
    maxC: Math.round(json.daily.temperature_2m_max[i + 1]),
    minC: Math.round(json.daily.temperature_2m_min[i + 1]),
  }));

  return {
    temperatureC: Math.round(json.current.temperature_2m),
    condition: labelFor(json.current.weather_code),
    humidity: Math.round(json.current.relative_humidity_2m),
    windKph: Math.round(json.current.wind_speed_10m),
    locationName,
    feelsLikeC: Math.round(json.current.apparent_temperature),
    tempMaxC: Math.round(json.daily.temperature_2m_max[0]),
    tempMinC: Math.round(json.daily.temperature_2m_min[0]),
    forecast,
  };
}

export function getBrowserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 8000,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

export async function fetchWeather(city: string, useGeolocation: boolean): Promise<WeatherData> {
  if (useGeolocation) {
    try {
      const pos = await getBrowserLocation();
      return await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, "Your location");
    } catch {
      // Fall through to manual city if geolocation is denied/unavailable.
      if (!city.trim()) throw new Error("Location unavailable — set a city in Settings");
    }
  }
  if (!city.trim()) throw new Error("No city configured");
  const geo = await geocodeCity(city.trim());
  return fetchWeatherByCoords(geo.lat, geo.lon, geo.name);
}
