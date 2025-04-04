// API countries url
const apiCountries = "https://restcountries.com/v3.1/all";

// API key for OpenWeatherMap
// import { APIkey } from './key.js';

// RegExp for country name
const countryNameRegExp = /^[a-zA-Z\s]+$/;

//Dom elements
const countryInput = document.querySelector("#countryInput");
let countriesContainer = document.querySelector("#countriesContainer");
const message = document.querySelector("#message");

let inputValue;

// Filtered countries array
let filteredCountries = [];

// Display countries elements
let countryCard;
let flagImg;
let countryName;

// Display country details elements
let lat;
let lon;
let icon;
let temperature;
let weather;

//bool for message
let messageVisible = false;

// Function to fetch countries data from API
const getCountries = async () => {
  try {
    countriesContainer.innerHTML = `<div class="loader"></div>`;
    const response = await fetch(apiCountries);
    const countries = await response.json();
    filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().startsWith(inputValue)
    );
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
  finally {
    countriesContainer.innerHTML = ""; // Clear loader
  }
};

// Function to fetch weather data from OpenWeatherMap API
const getWeather = async () => {
  try {
    countriesContainer.innerHTML = `<div class="loader"></div>`;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`
    );
    const weatherDetails = await response.json();

    weather = weatherDetails.weather[0].description;
    icon = weatherDetails.weather[0].icon;
    temperature = (weatherDetails.main.temp - 273.15).toFixed(2);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

// Function to filter based on input value
countryInput.addEventListener("input", async (event) => {
  // Clear previous results
  countriesContainer.innerHTML = "";
  // Hide message if it was previously shown
  if (messageVisible) {
    message.classList.add("hidden");
  }
  // Check if the input contains two spaces
  event.target.value = event.target.value.replace(/\s{2,}/g, " ");
  // Check if the input start with a space
  event.target.value = event.target.value.replace(/^\s/g, "");

  inputValue = event.target.value;

  // Check if the input is empty
  if (inputValue === "") {
    message.textContent = "Type a country name to search";
    console.log(message);
    message.classList.remove("hidden");
    messageVisible = true;
    return;
  }
  // Validate input against the regex
  if (!countryNameRegExp.test(inputValue)) {
    message.textContent = "Please enter a valid country name (letters only).";
    message.classList.remove("hidden");
    messageVisible = true;
    return;
  }

  // Fetch countries data from API and filter based on input
  inputValue = inputValue.toLowerCase();
  await getCountries();
  // messages
  if (filteredCountries.length > 10) {
    message.textContent = "Too many results. Please refine your search.";
    message.classList.remove("hidden");
    messageVisible = true;
    return;
  }
  if (filteredCountries.length === 0) {
    message.textContent = `No countries found for "${inputValue}"`;
    message.classList.remove("hidden");
    messageVisible = true;
    return;
  }
  if (filteredCountries.length === 1) {
    lat = filteredCountries[0].latlng[0];
    lon = filteredCountries[0].latlng[1];
    await getWeather();
    displayCountryDetails(filteredCountries[0]);
    return;
  }
  displayCountries(filteredCountries);
});

// Function for display Countries result

const displayCountries = (countries) => {
  countries.forEach((country) => {
    countryCard = document.createElement("div");
    countryCard.classList.add("countryCard");

    flagImg = document.createElement("img");
    flagImg.src = country.flags.svg;
    flagImg.alt = `Flag of ${country.name.common}`;

    countryName = document.createElement("h2");
    countryName.textContent = country.name.common;

    countryCard.appendChild(flagImg);
    countryCard.appendChild(countryName);
    countriesContainer.appendChild(countryCard);
  });
};

// Function for display country details

const displayCountryDetails = (country) => {
  countriesContainer.innerHTML = `
  <div class="countryDetails">
    <div class="flagAndWeather">
      <img class="flag" src="${country.flags.svg}"alt="Flag of ${
    country.name.common
  }">
      <div class="weatherDetails">
        <div class="weather">
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather} icon">
          <p>${weather}</p>
        </div>
        <p>${temperature} °C</p>
      </div>
    </div>
    <div class="countryInfo">
      <h2>${country.name.common}</h2>
      <p>Capital: ${country.capital}</p>
      <p>Population: ${country.population.toLocaleString("en-US")}</p>
      <p>Region: ${country.region}</p>
      <p>Continent: ${country.continents}</p>
      <p>Timezone: ${country.timezones}</p>
    </div>
  </div>
  `;
};
