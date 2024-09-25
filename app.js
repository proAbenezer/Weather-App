import USERLOCATION from "./userLocation.js";

const locationNameElement = document.getElementById("location-name");
const temperatureElement = document.getElementById("temperature");
const weatherDescriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const searchInput = document.getElementById("city-input");
const form = document.getElementById("form");
const spinner = document.getElementById("spinner");
const API_KEY = "cdbb28d56b144a0e8c070922242109";
const OPEN_WEATHER_API = "9258c4dd11cc0a1b5701be4f532d7373";

window.onload = async function () {
  const weather = await getCurrentUserWeatehr();
  if (weather) {
    renderWeatherData(weather);
  }
};

form.addEventListener("click", searhCity);

const userlocation = new USERLOCATION();

async function getUserCurrentLocation() {
  try {
    const location = await userlocation.getUserLocation();
    return location;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getWeatherData(location) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location[0]},${location[1]}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}

async function getCurrentUserWeatehr() {
  const currentLocation = await getUserCurrentLocation();
  const weatherData = await getWeatherData(currentLocation);
  return weatherData;
}

function renderWeatherData({ current, location }) {
  locationNameElement.innerHTML = `Current Location: ${location.name}, ${location.country}`;
  temperatureElement.innerHTML = `Temperature: ${current.temp_c}°C`;
  weatherDescriptionElement.innerHTML = `Weather: ${current.condition.text}`;
  humidityElement.innerHTML = `Humidity: ${current.humidity}%`;
  windSpeedElement.innerHTML = `Wind Speed: ${current.wind_kph}km/h`;
}
async function searhCity(e) {
  e.preventDefault();
  const searchTerm = searchInput.value;
  if (!searchTerm) return;
  fetchWeatherData(searchTerm);
}

async function fetchWeatherData(cityName) {
  spinner.style.display = "block";
  try {
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${OPEN_WEATHER_API}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    } else {
      const location = await res.json();
      const lat = location[0]?.lat;
      const lon = location[0]?.lon;

      if (!lat || !lon) {
        throw new Error("Unable to retrieve location coordinates.");
        spinner.style.display = "none";
      }

      try {
        const weatherDataResponse = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`
        );

        if (!weatherDataResponse.ok) {
          throw new Error(`HTTP error! status: ${weatherDataResponse.status}`);
        }

        const weatherData = await weatherDataResponse.json();
        renderWeatherData(weatherData);
        spinner.style.display = "none";
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    }
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
}
