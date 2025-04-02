// API countries url
const apiCountries = "https://restcountries.com/v3.1/all";

// API key for OpenWeatherMap
const APIkey = "";

// RegExp for country name
const countryNameRegExp = /^[a-zA-Z\s]+$/;

//Dom elements
const countryInput = document.querySelector("#countryInput");
const countriesContainer = document.querySelector("#countriesContainer");
const message = document.querySelector("#message");

//bool for message
let messageVisible = false;

// Function to fetch countries data from API and filter based on input
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

  const inputValue = event.target.value;

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
  const search = inputValue.toLowerCase();
  try {
    const response = await fetch(apiCountries);
    const countries = await response.json();
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().startsWith(search)
    );

    // messages
    if (filteredCountries.length > 10) {
      message.textContent = "Too many results. Please refine your search.";
      message.classList.remove("hidden");
      messageVisible = true;
      return;
    }
    if (filteredCountries.length === 0) {
      message.textContent = `No countries found for "${search}"`;
      message.classList.remove("hidden");
      messageVisible = true;
      return;
    }
    if (filteredCountries.length === 1) {
      displayCountryDetails(filteredCountries[0]);
      return;
    }
    displayCountries(filteredCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
});

// Function for display Countries result

const displayCountries = (Countries) => {
  Countries.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("countryCard");

    const flagImg = document.createElement("img");
    flagImg.src = country.flags.svg;
    flagImg.alt = `Flag of ${country.name.common}`;

    const countryName = document.createElement("h2");
    countryName.textContent = country.name.common;

    countryCard.appendChild(flagImg);
    countryCard.appendChild(countryName);
    countriesContainer.appendChild(countryCard);
  });
};

// Function to fetch weather data from OpenWeatherMap API
const getWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`
    );
    const weatherDetails = await response.json();

    return {
      weather: weatherDetails.weather[0].description,
      icon: weatherDetails.weather[0].icon,
      temperature: weatherDetails.main.temp - 273.15,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};

// Function for display country details

const displayCountryDetails = async (country) => {
  const lat = country.latlng[0];
  const lon = country.latlng[1];
  const weatherInfo = await getWeather(lat, lon);
  const icon = weatherInfo.icon;
  const temperature = weatherInfo.temperature;
  const weather = weatherInfo.weather;

  const countryDetails = document.createElement("div");
  countryDetails.classList.add("countryDetails");

  const flagImg = document.createElement("img");
  flagImg.src = country.flags.svg;
  flagImg.alt = `Flag of ${country.name.common}`;

  const countryName = document.createElement("h2");
  countryName.textContent = country.name.common;

  const capital = document.createElement("p");
  capital.textContent = `Capital: ${country.capital}`;

  const population = document.createElement("p");
  population.textContent = `Population: ${country.population.toLocaleString(
    "en-US"
  )}`;

  const region = document.createElement("p");
  region.textContent = `Region: ${country.region}`;

  const continent = document.createElement("p");
  continent.textContent = `Continent: ${country.continents}`;

  const timezone = document.createElement("p");
  timezone.textContent = `Timezone: ${country.timezones}`;

  const iconImg = document.createElement("img");

  iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  iconImg.alt = `${weather} icon`;

  const weatherDescription = document.createElement("p");
  weatherDescription.textContent = `${weather}`;

  const temperatureDescription = document.createElement("p");
  temperatureDescription.textContent = `${temperature} °C`;

  countryDetails.appendChild(flagImg);
  countryDetails.appendChild(countryName);
  countryDetails.appendChild(capital);
  countryDetails.appendChild(population);
  countryDetails.appendChild(region);
  countryDetails.appendChild(continent);
  countryDetails.appendChild(timezone);
  countryDetails.appendChild(iconImg);
  countryDetails.appendChild(weatherDescription);
  countryDetails.appendChild(temperatureDescription);

  countriesContainer.appendChild(countryDetails);
};
