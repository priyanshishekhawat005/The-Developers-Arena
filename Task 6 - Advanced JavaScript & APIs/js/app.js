import {
  fetchCurrentWeatherByCity,
  fetchCurrentWeatherByCoords,
  fetchFiveDayForecastByCity,
  searchCities
} from "./api.js";
import {
  addFavorite,
  loadPreferences,
  removeFavorite,
  updatePreferences
} from "./storage.js";

const elements = {
  body: document.body,
  statusMessage: document.getElementById("statusMessage"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  searchForm: document.getElementById("searchForm"),
  cityInput: document.getElementById("cityInput"),
  suggestions: document.getElementById("searchSuggestions"),
  unitsSelect: document.getElementById("unitsSelect"),
  themeSelect: document.getElementById("themeSelect"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  saveApiKeyBtn: document.getElementById("saveApiKeyBtn"),
  geoBtn: document.getElementById("geoBtn"),
  addFavoriteBtn: document.getElementById("addFavoriteBtn"),
  favoritesList: document.getElementById("favoritesList"),
  currentWeather: document.getElementById("currentWeather"),
  forecastGrid: document.getElementById("forecastGrid")
};

const state = {
  preferences: loadPreferences(),
  currentCity: "",
  debounceTimer: null
};

function canUseLocalStorage() {
  try {
    const key = "__weather_dashboard_test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function getApiKey() {
  return state.preferences.apiKey?.trim();
}

function setStatus(message, isError = false) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.style.color = isError ? "#b53f2a" : "";
}

function setLoading(isLoading) {
  elements.loadingOverlay.hidden = !isLoading;
}

function applyTheme(theme) {
  elements.body.setAttribute("data-theme", theme);
}

function unitSymbol() {
  return state.preferences.units === "imperial" ? "F" : "C";
}

function windUnit() {
  return state.preferences.units === "imperial" ? "mph" : "m/s";
}

function renderCurrentWeather(data) {
  state.currentCity = data.city;
  elements.addFavoriteBtn.disabled = false;

  elements.currentWeather.innerHTML = `
    <div class="city-line">
      <h3>${data.city}, ${data.country}</h3>
      <img src="${data.iconUrl}" alt="${data.description}" width="66" height="66" />
    </div>
    <p class="temperature">${data.temp}°${unitSymbol()}</p>
    <p>${data.description}</p>
    <div class="weather-meta">
      <p><strong>Feels Like:</strong> ${data.feelsLike}°${unitSymbol()}</p>
      <p><strong>Humidity:</strong> ${data.humidity}%</p>
      <p><strong>Wind:</strong> ${data.windSpeed} ${windUnit()}</p>
      <p><strong>Sunrise / Sunset:</strong> ${data.sunrise} / ${data.sunset}</p>
    </div>
  `;
}

function renderForecast(items) {
  if (!items.length) {
    elements.forecastGrid.innerHTML = '<p class="placeholder">No forecast data found.</p>';
    return;
  }

  elements.forecastGrid.innerHTML = items
    .map(
      (item) => `
        <article class="forecast-card">
          <h3>${item.dateLabel}</h3>
          <img src="${item.iconUrl}" alt="${item.description}" width="56" height="56" />
          <p>${item.description}</p>
          <p><strong>${item.max}° / ${item.min}°</strong></p>
          <p>Humidity: ${item.humidity}%</p>
          <p>Wind: ${item.windSpeed} ${windUnit()}</p>
        </article>
      `
    )
    .join("");
}

function renderFavorites() {
  if (!state.preferences.favorites.length) {
    elements.favoritesList.innerHTML = '<p class="placeholder">No favorites yet.</p>';
    return;
  }

  elements.favoritesList.innerHTML = state.preferences.favorites
    .map(
      (city) => `
        <div>
          <button class="favorite-chip" type="button" data-city="${city}">${city}</button>
          <button class="favorite-chip secondary" type="button" data-remove-city="${city}" aria-label="Remove ${city} from favorites">Remove</button>
        </div>
      `
    )
    .join("");
}

function renderSuggestions(items) {
  if (!items.length) {
    elements.suggestions.innerHTML = "";
    return;
  }

  elements.suggestions.innerHTML = items
    .map(
      (item) =>
        `<li><button class="suggestion-btn" type="button" data-suggestion="${item.cityName}">${item.label}</button></li>`
    )
    .join("");
}

async function loadWeatherForCity(city, saveAsDefault = true) {
  const apiKey = getApiKey();

  try {
    setLoading(true);
    setStatus(`Loading weather for ${city}...`);

    const [current, forecast] = await Promise.all([
      fetchCurrentWeatherByCity(city, state.preferences.units, apiKey),
      fetchFiveDayForecastByCity(city, state.preferences.units, apiKey)
    ]);

    renderCurrentWeather(current);
    renderForecast(forecast);

    if (saveAsDefault) {
      state.preferences = updatePreferences(state.preferences, { defaultCity: current.city });
    }

    setStatus(`Showing weather for ${current.city}.`);
  } catch (error) {
    setStatus(error.message || "Could not load weather data.", true);
  } finally {
    setLoading(false);
  }
}

async function loadWeatherByLocation() {
  const apiKey = getApiKey();

  if (!apiKey) {
    setStatus("Save your API key first, then use location.", true);
    return;
  }

  if (!window.isSecureContext) {
    setStatus("Geolocation needs HTTPS or localhost. Open this app with Live Server.", true);
    return;
  }

  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported in this browser.", true);
    return;
  }

  setStatus("Getting your location...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        setLoading(true);

        const current = await fetchCurrentWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
          state.preferences.units,
          apiKey
        );

        const forecast = await fetchFiveDayForecastByCity(current.city, state.preferences.units, apiKey);

        renderCurrentWeather(current);
        renderForecast(forecast);

        state.preferences = updatePreferences(state.preferences, { defaultCity: current.city });
        setStatus(`Showing weather for ${current.city} (your location).`);
      } catch (error) {
        setStatus(error.message || "Unable to load weather from your location.", true);
      } finally {
        setLoading(false);
      }
    },
    () => setStatus("Could not get your location. Please allow location access.", true),
    { timeout: 7000 }
  );
}

function wireEvents() {
  elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = elements.cityInput.value.trim();
    if (!city) return;

    elements.suggestions.innerHTML = "";
    loadWeatherForCity(city);
  });

  elements.cityInput.addEventListener("input", () => {
    const query = elements.cityInput.value.trim();

    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(async () => {
      if (query.length < 2) {
        renderSuggestions([]);
        return;
      }

      try {
        const items = await searchCities(query, getApiKey(), 5);
        renderSuggestions(items);
      } catch {
        renderSuggestions([]);
      }
    }, 350);
  });

  elements.suggestions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const city = target.dataset.suggestion;
    if (!city) return;

    elements.cityInput.value = city;
    renderSuggestions([]);
    loadWeatherForCity(city);
  });

  elements.unitsSelect.addEventListener("change", () => {
    state.preferences = updatePreferences(state.preferences, { units: elements.unitsSelect.value });

    if (state.currentCity) {
      loadWeatherForCity(state.currentCity, false);
    }
  });

  elements.themeSelect.addEventListener("change", () => {
    const theme = elements.themeSelect.value;
    state.preferences = updatePreferences(state.preferences, { theme });
    applyTheme(theme);
  });

  elements.saveApiKeyBtn.addEventListener("click", () => {
    const apiKey = elements.apiKeyInput.value.trim();

    if (!apiKey) {
      setStatus("Please paste a valid API key before saving.", true);
      return;
    }

    if (!canUseLocalStorage()) {
      setStatus("Local Storage is blocked in this browser. Enable site storage and try again.", true);
      return;
    }

    state.preferences = updatePreferences(state.preferences, { apiKey });
    setStatus("API key saved in Local Storage.");
    elements.apiKeyInput.value = "";

    // Validate that persistence worked before making API requests.
    const persistedApiKey = loadPreferences().apiKey;
    if (persistedApiKey !== apiKey) {
      setStatus("Could not persist API key. Check browser storage permissions.", true);
      return;
    }

    if (state.preferences.defaultCity) {
      setStatus("API key saved. Loading your default city...");
      loadWeatherForCity(state.preferences.defaultCity, false);
    }
  });

  elements.geoBtn.addEventListener("click", loadWeatherByLocation);

  elements.addFavoriteBtn.addEventListener("click", () => {
    if (!state.currentCity) return;

    state.preferences = addFavorite(state.preferences, state.currentCity);
    renderFavorites();
    setStatus(`${state.currentCity} saved to favorites.`);
  });

  elements.favoritesList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const city = target.dataset.city;
    if (city) {
      loadWeatherForCity(city, false);
      return;
    }

    const removeCity = target.dataset.removeCity;
    if (removeCity) {
      state.preferences = removeFavorite(state.preferences, removeCity);
      renderFavorites();
      setStatus(`${removeCity} removed from favorites.`);
    }
  });
}

function initialize() {
  applyTheme(state.preferences.theme);
  elements.unitsSelect.value = state.preferences.units;
  elements.themeSelect.value = state.preferences.theme;

  renderFavorites();
  wireEvents();

  if (state.preferences.apiKey) {
    loadWeatherForCity(state.preferences.defaultCity, false);
  } else {
    setStatus("Save your API key to start fetching weather data.");
  }
}

initialize();
