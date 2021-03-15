const axios = require('axios');

// API key from open weather map
const API_KEY = 'c5886a843267bc554dac2c1a2273abb0';

// Send response in table format for single city result
function formatCityResponse(data) {
  return `
    <h2>${data.name}, ${data.sys.country}</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Description</th>
          <th>Values</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Main</td><td>City's Main Weather</td><td>${data.weather[0].main}</td></tr>
        <tr><td>Description</td><td>A short description of the city's weather</td><td>${data.weather[0].description}</td></tr>
        <tr><td>Temp</td><td>The City's current temperature</td><td>${data.main.temp} F</td></tr>
        <tr><td>Pressure</td><td>The current air pressure</td><td>${data.main.pressure} hPa</td></tr>
        <tr><td>Humidity</td><td>The city's humidity index</td><td>${data.main.humidity}%</td></tr>
        <tr><td>Speed</td><td>The city's wind speed</td><td>${data.wind.speed} mph NW</td></tr>
      </tbody>
    </table>`;
}

// API request to single city OpenWeather map API
async function getCityWeather(cityName) {
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;
  const { data } = await axios.get(apiUrl);
  return data;
}

// Send response in ordered list format for multiple cities
function formatMultipleCitiesResponse(response) {
  const htmlResp = response.map((data) => `<li>${data.name}, ${data.weather[0].main}, ${data.weather[0].description}, ${data.main.temp} F</li>`);
  return `<ol>${htmlResp.join('')}</ol>`;
}

async function getMultipleCityWeather(cities) {
  const results = cities.map((city) => getCityWeather(city));
  return formatMultipleCitiesResponse(await Promise.all(results));
}

module.exports = { getCityWeather, getMultipleCityWeather, formatCityResponse };
