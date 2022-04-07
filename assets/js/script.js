
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

var getWeatherData = function (date, address) {
  const APIKEY = "TG354CRJY4Z63JNSXQG9GRMXE";
  // format the Visual Crossing API url - returned data in US units
  var apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=24&startDateTime=${date}T00:00:00&endDateTime=${date}T00:00:00&unitGroup=us&contentType=json&dayStartTime=0:0:00&dayEndTime=0:0:00&location=${address}&key=${APIKEY}`; // update address to use Mapbox API

  // make a fetch request to url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Error: " + response.statusText)
      }
    })
    .then(function (fetchData) {
      displayWeatherData(fetchData, date, address);
    })
    .catch(function (error) {
      alert("Unable to connect to Visual Crossing");
    });
};

var displayWeatherData = function (fetchData, date, address) {
  // check if api returned any repos
  if (!fetchData) {
    whenAndWhereContainerEl.textContent = "No weather data found. Update your search parameters and please try again.";
    return;
  }

  console.log(fetchData);
  const locationH2 = document.createElement("h2");
  locationH2.setAttribute("class", "is-size-4");
  locationH2.textContent = `${date} in ${fetchData.locations[address].name}`;
  whenAndWhereEl.appendChild(locationH2);

  // store returned weather data in obj for parsing later
  // Returns weatherDateObj
  let weatherDataObj = {
    temperature: fetchData.locations[address].values[0].temp + "°F",
    humidity: fetchData.locations[address].values[0].humidity + "% humidity",
    cloudCover: fetchData.locations[address].values[0].cloudcover + "% cloud cover",
    precipitation: fetchData.locations[address].values[0].precip + " precipitation",
    windspeed: fetchData.locations[address].values[0].wspd + " m/s",
  };
  weatherFeaturesEl.innerHTML = "";


  if (weatherDataObj.temperature) {
    weatherFeaturesEl.appendChild(generateWeatherData("thermometer", "Temperature", weatherDataObj.temperature))
    weatherFeaturesEl.appendChild(generateWeatherData("droplet", "Humidity", weatherDataObj.humidity))
    weatherFeaturesEl.appendChild(generateWeatherData("cloud", "Cloud Coverage", weatherDataObj.cloudCover))
    weatherFeaturesEl.appendChild(generateWeatherData("umbrella", "Precipitation", weatherDataObj.precipitation))
    weatherFeaturesEl.appendChild(generateWeatherData("wind", "Wind speed and direction", weatherDataObj.windspeed))
  }
};


function generateWeatherData(classHelper, label, weatherData) {
  const article = document.createElement("article");
  article.setAttribute("class", "media px-4")
  const figure = document.createElement("figure")
  figure.setAttribute("class", "media-left")
  const pIcon = document.createElement("p")
  pIcon.setAttribute("class", "icon")
  const icon = document.createElement("i")
  icon.setAttribute("class", "bi-" + classHelper)
  icon.setAttribute("role", "img")
  icon.setAttribute("aria-label", label)
  const media = document.createElement("div")
  media.setAttribute("class", "media-content")
  const content = document.createElement("div")
  content.setAttribute("class", "content")
  const pContent = document.createElement("p")
  pContent.textContent = weatherData
  content.appendChild(pContent);
  media.appendChild(content)
  pIcon.appendChild(icon)
  figure.appendChild(pIcon)
  article.appendChild(figure)
  article.appendChild(media)

  return article;
}

locationSelectContainer.addEventListener("submit", locationSubmitHandler);


