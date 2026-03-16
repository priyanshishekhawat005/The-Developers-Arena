const STORAGE_KEY = "weatherDashboard.preferences";

const DEFAULT_PREFERENCES = {
  defaultCity: "London",
  units: "metric",
  theme: "sunrise",
  apiKey: "",
  favorites: []
};

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadPreferences() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { ...DEFAULT_PREFERENCES };
  }

  const parsed = safeJsonParse(raw);
  if (!parsed || typeof parsed !== "object") {
    return { ...DEFAULT_PREFERENCES };
  }

  return {
    ...DEFAULT_PREFERENCES,
    ...parsed,
    favorites: Array.isArray(parsed.favorites) ? parsed.favorites.slice(0, 8) : []
  };
}

export function savePreferences(nextPreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
}

export function updatePreferences(current, partial) {
  const updated = {
    ...current,
    ...partial
  };

  savePreferences(updated);
  return updated;
}

export function addFavorite(current, cityName) {
  const city = cityName.trim();
  if (!city) return current;

  const favorites = [city, ...current.favorites.filter((item) => item.toLowerCase() !== city.toLowerCase())].slice(0, 8);

  return updatePreferences(current, { favorites });
}

export function removeFavorite(current, cityName) {
  const favorites = current.favorites.filter((item) => item.toLowerCase() !== cityName.toLowerCase());
  return updatePreferences(current, { favorites });
}

export { DEFAULT_PREFERENCES };
