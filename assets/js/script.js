
// API Key
var APIKey = "39f8345ba66f69f0e9119d46f084bbe7";

// Function to retrieve search history from local storage
function getSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    console.log("Search History:", searchHistory);
  
     // Display the search history on the page
     displaySearchHistory(searchHistory);

     // Fetch and display weather data for the most recent search
     if (searchHistory.length > 0) {
         getWeatherData(searchHistory[searchHistory.length - 1]);
     } else {
         // If no search history, load weather data for a default city
         getWeatherData("Atlanta");
     }
 }

// Function to display search history on the page
function displaySearchHistory(searchHistory) {
  var searchHistoryList = document.getElementById("searchHistoryList");

  // Clear previous entries
  searchHistoryList.innerHTML = "";

  // Loop through the search history and create list items with event listeners
  for (var i = 0; i < searchHistory.length; i++) {
    var listItem = document.createElement("li");
    listItem.textContent = searchHistory[i];

    // Attach a click event listener to each list item
    listItem.addEventListener("click", function () {
      // Fetch and display weather data for the clicked city
      getWeatherData(this.textContent);
    });

    searchHistoryList.appendChild(listItem);
  }
}
getSearchHistory();
// Function to fetch and display forecast data
function getForecast(latitude, longitude) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=imperial`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      var forecastData = data.list;
      displayForecastData(forecastData);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

// Event listener for the search form
document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    // Get the value from the input field
    var cityInput = document.getElementById("cityInput").value.trim();
    // Call the function to fetch weather data
    if (cityInput !== "") {
      getWeatherData(cityInput);
    }
  });
  

// Save a search history to local storage
function saveToLocalStorage(city) {
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    // Update the displayed search history
    displaySearchHistory(searchHistory);
  }

  console.log("Saved to local storage. Updated search history:", searchHistory);
}

// Function to fetch and display weather data
function getWeatherData(city) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
  // Make the API request
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherData(data);
      // Call the function to fetch and display the forecast data
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
// Function to display weather data
function displayWeatherData(data) {
  // Update the DOM with weather data
  document.getElementById(
    "weatherIcon"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("currentDate").textContent = new Date(
    data.dt * 1000
  ).toLocaleDateString();
  // Display temperature in Fahrenheit
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°F`;
  // Display humidity as a percentage
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  // Display wind speed in mph
  document.getElementById("windSpeed").textContent = `Wind Speed: ${data.wind.speed} mph`;

  // Save the city to the search history
  saveToLocalStorage(data.name);
}
// Function to fetch and display forecast data
function displayForecastData(forecastData) {
  var forecastContainer = document.getElementById("forecastData");

  forecastContainer.innerHTML = ""; // Clear previous forecast data

  // Filter forecast data for noon entries
  var noonEntries = forecastData.filter((entry) => entry.dt_txt.includes("12:00:00"));

  for (var i = 0; i < noonEntries.length; i++) {
    var dayElement = document.createElement("div");
    dayElement.classList.add("col-md-2", "mb-3");

    var forecastCard = document.createElement("div");
    forecastCard.classList.add("forecastCard");

    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Create separate elements for each piece of information
    var dateElement = document.createElement("h5");
    dateElement.classList.add("card-title");
    dateElement.textContent = new Date(noonEntries[i].dt * 1000).toLocaleDateString();

    var iconElement = document.createElement("img");
    iconElement.classList.add("card-img-top");
    iconElement.id = "day" + (i / 8 + 1) + "Icon";
    iconElement.alt = "Weather Icon";
    // Set the icon source based on the forecast data
    iconElement.src = `https://openweathermap.org/img/wn/${noonEntries[i].weather[0].icon}.png`;

    var tempElement = document.createElement("p");
    tempElement.classList.add("card-text");
    tempElement.id = "day" + (i / 8 + 1) + "Temp";
    // Display temperature in Fahrenheit
    tempElement.textContent = `Temperature: ${noonEntries[i].main.temp}°F`;

    var humidityElement = document.createElement("p");
    humidityElement.classList.add("card-text");
    humidityElement.id = "day" + (i / 8 + 1) + "Humidity";
    // Display humidity as a percentage
    humidityElement.textContent = `Humidity: ${noonEntries[i].main.humidity}%`;

    var windElement = document.createElement("p");
    windElement.classList.add("card-text");
    windElement.id = "day" + (i / 8 + 1) + "WindSpeed";
    // Display wind speed in mph
    windElement.textContent = `Wind Speed: ${noonEntries[i].wind.speed} mph`;

    // Append each element to the dayElement
    cardBody.appendChild(dateElement);
    cardBody.appendChild(iconElement);
    cardBody.appendChild(tempElement);
    cardBody.appendChild(humidityElement);
    cardBody.appendChild(windElement);

    forecastCard.appendChild(cardBody);
    dayElement.appendChild(forecastCard);

    // Append the dayElement to the forecastContainer
    forecastContainer.appendChild(dayElement);
  }
}
// Call getSearchHistory on page load to display the initial search history
getSearchHistory();