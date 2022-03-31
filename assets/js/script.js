var dateInputEl = document.querySelector("#date-input");
var addressInputEl = document.querySelector("#address-input");
var locationPresetEl = document.querySelector("#location-options");
var locationSelectContainer = document.querySelector("#main-container");
var weatherContainerEl = document.querySelector("#weather-container");
var address;

var locationSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    address = addressInputEl.value.trim();
  
    if (address) {
      getAddressWeatherData(address);
  
      // clear old content
      weatherContainerEl.textContent = "";
    } else {
      alert("Please enter a valid date");
    }
};

var getAddressWeatherData = function(address) {
    // format the oikos api url
    var apiUrl = "https://api.oikolab.com/weather/?api-key=APIKEY&location=" + address;
  
    // make a get request to url
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
  