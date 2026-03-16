const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

function ensureApiKey(apiKey) {
  if (!apiKey || apiKey === "your_api_key_here" || apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
    throw new Error("Add your OpenWeatherMap API key in the preferences section before searching.");
  }
}

async function requestJson(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    const fallback = `${errorMessage} (HTTP ${response.status})`;

    try {
      const body = await response.json();
      throw new Error(body.message || fallback);
    } catch {
      throw new Error(fallback);
    }
  }

  return response.json();
}

function capitalizeWords(text) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function weatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function formatLocalTime(unixSeconds, timezoneOffsetSeconds) {
  const localDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return localDate.toISOString().slice(11, 16);
}

function toLocalDateKey(unixSeconds, timezoneOffsetSeconds) {
  const localDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return localDate.toISOString().slice(0, 10);
}

function toLocalHour(unixSeconds, timezoneOffsetSeconds) {
  const localDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return Number(localDate.toISOString().slice(11, 13));
}

export async function fetchCurrentWeatherByCity(city, units, apiKey) {
  ensureApiKey(apiKey);

  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
  const data = await requestJson(url, "Unable to fetch current weather");

  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: capitalizeWords(data.weather[0].description),
    iconUrl: weatherIconUrl(data.weather[0].icon),
    sunrise: formatLocalTime(data.sys.sunrise, data.timezone),
    sunset: formatLocalTime(data.sys.sunset, data.timezone),
    lat: data.coord.lat,
    lon: data.coord.lon,
    timezoneOffset: data.timezone
  };
}

export async function fetchCurrentWeatherByCoords(lat, lon, units, apiKey) {
  ensureApiKey(apiKey);

  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  const data = await requestJson(url, "Unable to fetch current weather");

  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: capitalizeWords(data.weather[0].description),
    iconUrl: weatherIconUrl(data.weather[0].icon),
    sunrise: formatLocalTime(data.sys.sunrise, data.timezone),
    sunset: formatLocalTime(data.sys.sunset, data.timezone),
    lat: data.coord.lat,
    lon: data.coord.lon,
    timezoneOffset: data.timezone
  };
}

export async function fetchFiveDayForecastByCity(city, units, apiKey) {
  ensureApiKey(apiKey);

  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
  const data = await requestJson(url, "Unable to fetch 5-day forecast");

  const groupedByDay = new Map();

  for (const entry of data.list) {
    const dayKey = toLocalDateKey(entry.dt, data.city.timezone);
    if (!groupedByDay.has(dayKey)) groupedByDay.set(dayKey, []);
    groupedByDay.get(dayKey).push(entry);
  }

  const todayKey = toLocalDateKey(data.list[0].dt, data.city.timezone);
  const dayKeys = [...groupedByDay.keys()].filter((key) => key !== todayKey).slice(0, 5);

  return dayKeys.map((dayKey) => {
    const entries = groupedByDay.get(dayKey);

    const representative = entries.reduce((best, current) => {
      const bestDiff = Math.abs(toLocalHour(best.dt, data.city.timezone) - 12);
      const currentDiff = Math.abs(toLocalHour(current.dt, data.city.timezone) - 12);
      return currentDiff < bestDiff ? current : best;
    }, entries[0]);

    const temps = entries.map((item) => item.main.temp);
    const dayDate = new Date(dayKey);

    return {
      dateLabel: dayDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps)),
      humidity: representative.main.humidity,
      windSpeed: representative.wind.speed,
      description: capitalizeWords(representative.weather[0].description),
      iconUrl: weatherIconUrl(representative.weather[0].icon)
    };
  });
}

export async function searchCities(query, apiKey, limit = 5) {
  ensureApiKey(apiKey);

  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `${GEO_URL}?q=${encodeURIComponent(trimmed)}&limit=${limit}&appid=${apiKey}`;
  const data = await requestJson(url, "Unable to fetch city suggestions");

  return data.map((city) => {
    const state = city.state ? `, ${city.state}` : "";
    return {
      label: `${city.name}${state}, ${city.country}`,
      cityName: city.name
    };
  });
}
