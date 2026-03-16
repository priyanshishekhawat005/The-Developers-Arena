# Weather Dashboard Application

A responsive weather dashboard built with vanilla JavaScript modules, async/await, REST API integration, and Local Storage persistence.

## Project Overview

This project is the Week 6 capstone for Advanced JavaScript & APIs. It demonstrates:

- Asynchronous JavaScript with Promise-based API calls and async/await
- REST API integration with OpenWeatherMap
- JSON parsing, transformation, and rendering
- Local Storage for persistent user preferences
- Search with debouncing
- Loading states, error handling, and accessible UI patterns

## Folder Structure

```text
index.html
css/
  styles.css
js/
  app.js
  api.js
  storage.js
screenshots/
README.md
```

## Setup Instructions

1. Clone or download the project.
2. Open the folder in VS Code.
3. Create a free OpenWeatherMap account: https://openweathermap.org/
4. Generate your API key from your account dashboard.
5. Run the app:
   - Option A: Open index.html directly in browser.
   - Option B (recommended): Use a local server (Live Server extension).
6. Paste your API key in the app and click Save Key.

## Features Implemented

- City search with async/await
- Debounced city suggestions (OpenWeatherMap geocoding)
- Current weather card
- 5-day forecast cards
- Unit switching (metric/imperial)
- Theme preferences
- Favorites management
- Geolocation weather lookup
- Persistent preferences in Local Storage
- Loading overlay and friendly error states
- Responsive layout for mobile and desktop
- Basic accessibility support (ARIA live regions, labels, skip link)

## Technical Details

### Async JavaScript

- API calls are handled using async functions and await.
- Fetch errors are normalized and surfaced to UI.
- Parallel fetching is used for better performance where possible.

### Data Handling

- Raw JSON from OpenWeatherMap is transformed into small UI-focused objects.
- Forecast data (3-hour intervals) is grouped by day and summarized.
- A representative midday forecast entry is selected for each day.

### Local Storage

- User preferences are stored under one key:
  - weatherDashboard.preferences
- Stored fields:
  - defaultCity
  - units
  - theme
  - apiKey
  - favorites

### Architecture

- app.js: UI orchestration, event handling, rendering
- api.js: API requests, validation, response transformation
- storage.js: persistence utilities and preference updates

## API Documentation

Base service: OpenWeatherMap

### 1) Current Weather by City

- Endpoint: /data/2.5/weather
- Method: GET
- Example:

```text
https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric
```

### 2) 5-Day / 3-Hour Forecast by City

- Endpoint: /data/2.5/forecast
- Method: GET
- Example:

```text
https://api.openweathermap.org/data/2.5/forecast?q=London&appid=YOUR_API_KEY&units=metric
```

### 3) City Search (Geocoding)

- Endpoint: /geo/1.0/direct
- Method: GET
- Example:

```text
https://api.openweathermap.org/geo/1.0/direct?q=Lon&limit=5&appid=YOUR_API_KEY
```

## Testing Evidence

### Manual Test Cases

1. Valid city search
   - Input: Delhi
   - Expected: Current weather and 5-day forecast displayed.

2. Invalid city search
   - Input: randomcityxyz
   - Expected: Error message shown in status area.

3. Unit change
   - Action: Switch metric to imperial
   - Expected: Temperatures and wind units update.

4. API key missing
   - Action: Search without saving key
   - Expected: Friendly instruction/error shown.

5. Favorites persistence
   - Action: Add favorite and reload page
   - Expected: Favorite still visible.

6. Geolocation
   - Action: Click Use My Location and allow permission
   - Expected: Weather for detected city shown.

7. Mobile responsiveness
   - Action: Open dev tools mobile view
   - Expected: Layout stacks cleanly with readable text and controls.

## Submission Checklist Mapping

- Project overview: Included
- Setup instructions: Included
- Code structure: Included
- Visual documentation: Add screenshots in screenshots/ folder
- Technical details: Included
- Testing evidence: Included
- API documentation: Included with endpoint examples

## Notes

- Do not commit a paid or sensitive API key in public repositories.
- For submission screenshots, capture:
  - Search results for a city
  - Forecast cards
  - Favorites and preferences
  - Error state example
