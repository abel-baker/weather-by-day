
var dateInputEl = document.querySelector("#date-input");
var addressInputEl = document.querySelector("#location-input");
var locationSelectContainer = document.querySelector("#date-and-location-form");
var weatherFeaturesEl = document.querySelector("#weather-features");
var whenAndWhereContainerEl = document.querySelector("#when-and-where");

var locationSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  let address = addressInputEl.value.trim();
  let date = dateInputEl.value.trim();

  if (date && address) {
    getWeatherData(date, address);

    // clear old content
    weatherFeaturesEl.textContent = "";
    whenAndWhereContainerEl.textContent = "";
  } else {
    alert("Please enter a valid date");
  }
};

var getWeatherData = function(date, address) {
    const APIKEY = "TG354CRJY4Z63JNSXQG9GRMXE";
    // format the Visual Crossing API url - returned data in US units
    var apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${date}T00:00:00&endDateTime=${date}T00:00:00&unitGroup=us&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${address}&key=${APIKEY}`; // update address to use Mapbox API
    
    // make a fetch request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(fetchData) {
            displayWeatherData(fetchData, date, address);
            displayMapData(fetchData, address);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to Visual Crossing");
      });
  };

  var displayMapData = function(fetchData, address) {
    if (fetchData.length === 0) {
      whenAndWhereContainerEl.textContent = "No weather data found. Update your search parameters and please try again.";
      return;
    }

    const mapboxKey = "pk.eyJ1IjoiYWJlbC1iYWtlciIsImEiOiJjbDFtc3o5eDcwMnEwM2xxN2ZwMmVxaGtrIn0.SV657KdmvCUZgHPzj46b-g";

    var dimensions = "500x400";
    var lat = fetchData.locations[address].latitude;
    var long = fetchData.locations[address].longitude;

    var apiUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${long},${lat},12,0/${dimensions}?access_token=${mapboxKey}`;

    document.querySelector("#map-container").innerHTML = `
      <figure class="image box p-0" style="overflow: hidden">
        <img src="${apiUrl}" alt="Map of ${address}">
      </figure>`;

    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);

        }
      })
  }

  var displayWeatherData = function(fetchData, date, address) {
    // check if api returned any repos
    if (fetchData.length === 0) {
      whenAndWhereContainerEl.textContent = "No weather data found. Update your search parameters and please try again.";
      return;
    }
    
    console.log(fetchData);
    whenAndWhereContainerEl.innerHTML = `${date} in ${fetchData.locations[address].name}`;

    // store returned weather data in obj for parsing later
    // Returns weatherDateObj
    let weatherDataObj = {
        temperature: fetchData.locations[address].values[0].temp + "°F",
        humidity: fetchData.locations[address].values[0].humidity + "% humidity",
        cloudCover: fetchData.locations[address].values[0].cloudcover + "% cloud cover",
        precipitation: fetchData.locations[address].values[0].precip + " precipitation",
        windspeed: fetchData.locations[address].values[0].wspd + " m/s",
    };

    return weatherDataObj;
  };

  locationSelectContainer.addEventListener("submit", locationSubmitHandler);


