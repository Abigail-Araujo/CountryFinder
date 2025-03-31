// API countries url
const apiCountries = "https://restcountries.com/v3.1/all";

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

    console.log(filteredCountries);
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
    displayCountries(filteredCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
});

// Function for display Countries result

const displayCountries = (Countries) => {
    Countries.forEach(country => {

        const countryCard = document.createElement('div');
        countryCard.classList.add('countryCard');

        const flagImg = document.createElement('img');
        flagImg.src = country.flags.svg;
        flagImg.alt = `Flag of ${country.name.common}`;

        const countryName = document.createElement('h2');
        countryName.textContent = country.name.common;

        countryCard.appendChild(flagImg);
        countryCard.appendChild(countryName);
        countriesContainer.appendChild(countryCard);
    });
};