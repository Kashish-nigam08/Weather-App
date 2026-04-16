document.getElementById("get-weather").addEventListener("click", async () => {
  const city = document.getElementById("city-input").value.trim();
  const resultDiv = document.getElementById("weather-result");
  const weatherIcon = document.getElementById("weather-icon");
  const weatherDescription = document.getElementById("weather-description");

  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch weather data");
    }

    // Map weather conditions to icons
    const weatherIcons = {
      "Clear sky": "ri-sun-line",
      "Mainly clear": "ri-sun-cloudy-line",
      "Partly cloudy": "ri-cloudy-line",
      Overcast: "ri-cloudy-2-line",
      Fog: "ri-mist-line",
      "Drizzle: Light intensity": "ri-drizzle-line",
      "Rain: Slight": "ri-rainy-line",
      "Rain: Moderate": "ri-heavy-showers-line",
      "Snow fall: Slight": "ri-snowy-line",
      "Thunderstorm: Slight": "ri-thunderstorms-line",
    };

    // Populate the UI dynamically
    resultDiv.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-700 mb-2">${data.city}</h2>
            <div class="text-4xl font-bold text-blue-600 mb-2">${
              data.temperature
            }°C</div>
            <p class="text-gray-600 mb-1">Condition: ${data.condition}</p>
            <p class="text-gray-600 mb-1">Wind Speed: ${
              data.wind_speed
            } km/h</p>
            <p class="text-gray-600">Wind Direction: ${data.wind_direction}°</p>
          </div>
          <div class="flex items-center justify-center">
            <div class="text-6xl text-blue-500">
              <i class="${weatherIcons[data.condition] || "ri-sun-line"}"></i>
            </div>
          </div>
        </div>
      `;

    // Update weather icon and description
    weatherIcon.innerHTML = `<i class="${
      weatherIcons[data.condition] || "ri-sun-line"
    } text-white"></i>`;
    weatherDescription.textContent = data.condition;

    resultDiv.classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
    resultDiv.classList.add("hidden");
  }
});
