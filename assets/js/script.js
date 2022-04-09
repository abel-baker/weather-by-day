var dateInputEl = document.querySelector("#date-input");
var addressInputEl = document.querySelector("#location-input");
var locationInputEl = document.querySelector("#date-and-location-form");
var weatherFeaturesEl = document.querySelector("#weather-features");
var whenAndWhereContainerEl = document.querySelector("#when-and-where");
var messageInfoEl = document.querySelector(".message");
var messageContainerEl = document.querySelector("#message-container");
var closeNotificationEl = document.querySelector(".delete");
var introMessageEl = document.querySelector("#intro-message");
var closeIntroEl = document.querySelector("#close-message");

var locationSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  let address = addressInputEl.value.trim();
  let date = dateInputEl.value.trim();
  
  // remove warning styling for invalid input onblur
  addressInputEl.onblur = addressOnblur;
  dateInputEl.onblur = dateOnblur;
  function addressOnblur() {
    if (addressInputEl.classList.contains("is-danger")) {
      addressInputEl.classList.remove("is-danger");
    }
  }
      
  function dateOnblur() {
    if (dateInputEl.classList.contains("is-danger")) {
      dateInputEl.classList.remove("is-danger");
    }     
  }

  if (date && address) {
    getWeatherData(date, address);

  } else {
    alert("Please enter a valid date");
  }
};
var closeMessageHandler = function (event) {
  messageContainerEl.style.display = "none";
  window.localStorage.setItem("intro-message-seen", "true");
}

function makeInitialCall() {
  let date = "1999-07-25";
  let address = "Lagos, Nigeria";
  getWeatherData(date, address);
}

var notificationClickHandler = function (event) {
  messageInfo = messageContainerEl.querySelector(".notification");
  messageContainerEl.removeChild(messageInfo);
};

var getWeatherData = function (date, address) {
  const APIKEY = "TG354CRJY4Z63JNSXQG9GRMXE";
  // format the Visual Crossing API url - returned data in US units
  var apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${date}T00:00:00&endDateTime=${date}T00:00:00&unitGroup=us&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${address}&key=${APIKEY}`;

  // make a fetch request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (fetchData) {
          displayWeatherData(fetchData, date, address);
          displayMapData(fetchData, address);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Visual Crossing");
    });
};

var displayMapData = function (fetchData, address) {
  if (fetchData.length === 0) {
    whenAndWhereContainerEl.textContent =
      "No weather data found. Update your search parameters and please try again.";
    return;
  }

  const mapboxKey =
    "pk.eyJ1IjoiYWJlbC1iYWtlciIsImEiOiJjbDFtc3o5eDcwMnEwM2xxN2ZwMmVxaGtrIn0.SV657KdmvCUZgHPzj46b-g";

  var dimensions = "500x400";
  var lat = fetchData.locations[address].latitude;
  var long = fetchData.locations[address].longitude;

  var apiUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${long},${lat},12,0/${dimensions}?access_token=${mapboxKey}`;

  document.querySelector("#map-container").innerHTML = `
      <figure class="image box p-0" style="overflow: hidden">
        <img src="${apiUrl}" alt="Map of ${address}">
      </figure>`;

  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      console.log(response);
    }
  });
};

var displayWeatherData = function (fetchData, date, address) {
  validateUserInputs(fetchData, date);

  const locationH2 = document.createElement("h2");
  locationH2.setAttribute("class", "is-size-4");

  date = luxon.DateTime.fromFormat(date, "yyyy-MM-dd");
  var formattedDate = date.toLocaleString(luxon.DateTime.DATE_FULL);

  locationH2.textContent = `${formattedDate} in ${fetchData.locations[address].name}`;
  whenAndWhereContainerEl.appendChild(locationH2);

  // store returned weather data in obj for parsing later
  // Returns weatherDateObj
  let weatherDataObj = {
    temperature: fetchData.locations[address].values[0].temp + "°F",
    humidity: fetchData.locations[address].values[0].humidity + "% humidity",
    cloudCover:
      fetchData.locations[address].values[0].cloudcover + "% cloud cover",
    precipitation:
      fetchData.locations[address].values[0].precip + " precipitation",
    windspeed: fetchData.locations[address].values[0].wspd + " m/s"
  };
  weatherFeaturesEl.innerHTML = "";

  if (weatherDataObj.temperature) {
    weatherFeaturesEl.appendChild(
      generateWeatherData(
        "thermometer",
        "Temperature",
        weatherDataObj.temperature
      )
    );
    weatherFeaturesEl.appendChild(
      generateWeatherData("droplet", "Humidity", weatherDataObj.humidity)
    );
    weatherFeaturesEl.appendChild(
      generateWeatherData("cloud", "Cloud Coverage", weatherDataObj.cloudCover)
    );
    weatherFeaturesEl.appendChild(
      generateWeatherData(
        "umbrella",
        "Precipitation",
        weatherDataObj.precipitation
      )
    );
    weatherFeaturesEl.appendChild(
      generateWeatherData(
        "wind",
        "Wind speed and direction",
        weatherDataObj.windspeed
      )
    );

    return weatherDataObj;
  }
};

var validateUserInputs = function (fetchData, date) {
  // check if api returned any data
  if (fetchData.length === 0) {
    whenAndWhereContainerEl.textContent =
      "No weather data found. Update your search parameters and please try again.";
    return;
  }

  if (fetchData.errorCode === 999) {
    // both date and location errorcodes return 999, so filtering by invalid date first
    if (date < "01/01/1970") {
      dateInputEl.classList.add("is-danger");
      // validating against an invalid location
    } if (fetchData.message.includes("The geographic location")) {
      addressInputEl.classList.add("is-danger");
      // validating against a future date
    } if (fetchData.message.includes("Historical data requests")) {
      dateInputEl.classList.add("is-danger");
    }

    messageContainerEl.innerHTML = `
    <div class="notification is-danger is-light">
      <button class="delete"></button>
      <strong>Please fix the following issue and try again:</strong> ${fetchData.message}
    </div>`;
    return;
  } else {
    // clear old content
    weatherFeaturesEl.textContent = "";
    whenAndWhereContainerEl.textContent = "";
  }
};

function generateWeatherData(classHelper, label, weatherData) {
  const article = document.createElement("article");
  article.setAttribute("class", "media px-4");
  const figure = document.createElement("figure");
  figure.setAttribute("class", "media-left");
  const pIcon = document.createElement("p");
  pIcon.setAttribute("class", "icon");
  const icon = document.createElement("i");
  icon.setAttribute("class", "bi-" + classHelper);
  icon.setAttribute("role", "img");
  icon.setAttribute("aria-label", label);
  const media = document.createElement("div");
  media.setAttribute("class", "media-content");
  const content = document.createElement("div");
  content.setAttribute("class", "content");
  const pContent = document.createElement("p");
  pContent.textContent = weatherData;
  content.appendChild(pContent);
  media.appendChild(content);
  pIcon.appendChild(icon);
  figure.appendChild(pIcon);
  article.appendChild(figure);
  article.appendChild(media);

  return article;
}

closeIntroEl.addEventListener("click", closeMessageHandler);

// Check localStorage for "intro message seen"
if (!window.localStorage.getItem("intro-message-seen")) {
  introMessageEl.style.display = "block";
}

locationInputEl.addEventListener("submit", locationSubmitHandler);
messageContainerEl.addEventListener("click", notificationClickHandler);
document.addEventListener("DOMContentLoaded", makeInitialCall());
