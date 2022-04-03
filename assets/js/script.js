var dateInputEl = document.querySelector("#date-input");
var addressInputEl = document.querySelector("#location-input");
var locationSelectContainer = document.querySelector("#date-and-location-form");
var weatherFeaturesEl = document.querySelector("#weather-features");
var whenAndWhereContainerEl = document.querySelector("#when-and-where");
var address;
var date;
var historicalWeatherData;

var locationSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    address = addressInputEl.value.trim();
    date = dateInputEl.value.trim();

    if (date && address) {
      getWeatherData(date, address);

      // clear old content
      weatherFeaturesEl.textContent = "";
      whenAndWhereContainerEl.textContent = "";
    } else {
      alert("Please enter a valid date");
    }
};

var getWeatherData = function(addressLocationData) {
    // format the Visual Crossing API url - returned data in US units
    var apiUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=" + date +"T00:00:00&endDateTime=" + date + "T00:00:00&unitGroup=us&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=" + address + "&key=TG354CRJY4Z63JNSXQG9GRMXE"; // update address to use Mapbox API
    
    // make a fetch request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data);
            displayWeatherData(data, addressLocationData);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to Visual Crossing");
      });
  };

  var displayWeatherData = function(historicalWeatherData, searchTerm) {
    // check if api returned any repos
    if (historicalWeatherData.length === 0) {
      repoContainerEl.textContent = "No weather data found. Update your search parameters and please try again.";
      return;
    }
    
    whenAndWhereContainerEl.innerHTML = date + " " + "in " + historicalWeatherData.locations[address].name;

    // store returned weather data in obj for parsing later
    var weatherDataObj = {
        temperature: historicalWeatherData.locations[address].values[0].temp + "°F",
        humidity: historicalWeatherData.locations[address].values[0].humidity + "% humidity",
        cloudCover: historicalWeatherData.locations[address].values[0].cloudcover + "% cloud cover",
        precipitation: historicalWeatherData.locations[address].values[0].precip+ " precipitation",
        windspeed: historicalWeatherData.locations[address].values[0].wspd + " m/s",
    };
  };

  locationSelectContainer.addEventListener("submit", locationSubmitHandler);


