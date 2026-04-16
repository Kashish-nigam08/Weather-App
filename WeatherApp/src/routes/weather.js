const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    // Step 1: Geocoding API
    const geocodeURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      city
    )}&format=json&limit=1`;

    const geocodeResponse = await axios.get(geocodeURL, {
      headers: {
        "User-Agent": "WeatherApp/1.0",
      },
    });

    if (!geocodeResponse.data.length) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon } = geocodeResponse.data[0];

    // Step 2: Weather API
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const weatherResponse = await axios.get(API_URL);

    const weather = weatherResponse.data.current_weather;

    res.json({
      city: city.charAt(0).toUpperCase() + city.slice(1),
      temperature: weather.temperature,
      wind_speed: weather.windspeed,
      wind_direction: weather.winddirection,
      condition_code: weather.weathercode,
      condition: mapWeatherCodeToDescription(weather.weathercode),
    });
  } catch (error) {
    console.error("Detailed error:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }

    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message,
    });
  }
});

function mapWeatherCodeToDescription(code) {
  const weatherCodeMapping = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light intensity",
    53: "Drizzle: Moderate intensity",
    55: "Drizzle: Dense intensity",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy",
    71: "Snow fall: Slight",
    73: "Snow fall: Moderate",
    75: "Snow fall: Heavy",
    95: "Thunderstorm: Slight",
    96: "Thunderstorm: Heavy",
  };
  return weatherCodeMapping[code] || "Unknown condition";
}

module.exports = router;
