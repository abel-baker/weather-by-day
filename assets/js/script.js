var dateInputEl = document.querySelector("#date-input");
var addressInputEl = document.querySelector("#location-input");
var locationSelectContainer = document.querySelector("#date-and-location-form");
var weatherContainerEl = document.querySelector("#weather-features");
var address;
var date;

var locationSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    address = addressInputEl.value.trim();
    date = dateInputEl.value.trim();

    if (date && address) {
      getWeatherData(date, address);

      // clear old content
      weatherContainerEl.textContent = "";
    } else {
      alert("Please enter a valid date");
    }
};

var getWeatherData = function(weatherDateAddress) {
    // format the oikos api url
    var apiUrl = "https://shrouded-forest-37296.herokuapp.com/https://api.oikolab.com/weather/?api-key=APIKEY&location=" + address + "&start=" + date + "&end=" + date;

    // make a fetch request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            // display weather data function here
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to Oikolab");
      });
  };

locationSelectContainer.addEventListener("submit", locationSubmitHandler);