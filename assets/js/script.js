var dateInputEl = document.querySelector("#date-input");
var locationInputEl = document.querySelector("#location-input");
var locationSelectContainer = document.querySelector("#date-and-location-form");
var weatherFeaturesEl = document.querySelector("#weather-features");
var whenAndWhereContainerEl = document.querySelector("#when-and-where");
var messageContainerEl = document.querySelector(".message");

var locationSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    let location = locationInputEl.value.trim();
    let date = dateInputEl.value.trim();

    if (date && location) {
      getWeatherData(date, location);

      // clear old content
      weatherFeaturesEl.textContent = "";
      whenAndWhereContainerEl.textContent = "";
    } else {
      alert("Please enter a valid date");
    }
};

var getWeatherData = function(date, location) {
    const APIKEY = "TG354CRJY4Z63JNSXQG9GRMXE";
    // format the Visual Crossing API url - returned data in US units
    var apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${date}T00:00:00&endDateTime=${date}T00:00:00&unitGroup=us&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${location}&key=${APIKEY}`; // update location to use Mapbox API
    
    // make a fetch request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
          console.log(response);
          response.json().then(function(fetchData) {
            displayWeatherData(fetchData, date, location);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to Visual Crossing");
      });
  };

  var displayWeatherData = function(fetchData, date, location) {
    // check if api returned any repos
    if (fetchData.length === 0) {
      whenAndWhereContainerEl.textContent = "No weather data found. Update your search parameters and please try again.";
      return;
    }
    
    if (fetchData.errorCode === 999) {
      //Both date and location errors return 999, so filtering by invalid date first
      if(this.date < "01/01/1970") {
        dateInputEl.classList.add('is-danger');
      } else {
        dateInputEl.classList.add('is-danger');
        locationInputEl.classList.add('is-danger');
      }
      
      messageContainerEl.innerHTML = `
      <div class="notification is-danger is-light">
        <button class="delete"></button>
        <strong>Please fix the following issue and try again:</strong> ${fetchData.message}
      </div>`
    }      
    console.log(fetchData);
    whenAndWhereContainerEl.innerHTML = `${date} in ${fetchData.locations[location].name}`;

    // store returned weather data in obj for parsing later
    // Returns weatherDateObj
    let weatherDataObj = {
        temperature: fetchData.locations[location].values[0].temp + "°F",
        humidity: fetchData.locations[location].values[0].humidity + "% humidity",
        cloudCover: fetchData.locations[location].values[0].cloudcover + "% cloud cover",
        precipitation: fetchData.locations[location].values[0].precip + " precipitation",
        windspeed: fetchData.locations[location].values[0].wspd + " m/s",
    };

    return weatherDataObj;
  };

  locationSelectContainer.addEventListener("submit", locationSubmitHandler);
  // messageContainerEl.addEventListener('DOMContentLoaded', () => {
  //   (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
  //     const $notification = $delete.parentNode;
  
  //     $delete.addEventListener('click', () => {
  //       $notification.parentNode.removeChild($notification);
  //     });
  //   });
  // });
