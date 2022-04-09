# Weather by Day

A small utility to look up the weather at a certain date in the past within the range of the available data set.  Select any city or location in the world and a date to go along with it.  Then Weather by Day will tell you the weather conditions on that day.  A simple map accompanies the result.

Application: [Weather by Day](https://abel-baker.github.io/weather-by-day/)

## Contributors

* [abel-baker](https://github.com/abel-baker/) Seth K on UI design/map fetching
* [hlee92](https://github.com/hlee92/) Hanna L on dynamic DOM manipulation
* [thevcr](https://github.com/thevcr/) Veronica R on weather data fetching

## Features

The response to your weather query includes temperature, humidity, cloud cover, precipitation, and wind direction & speed, along with a map of the local area.  Weather data goes back to 1970, with results becoming finer and more accurate through the late 1980s and early 1990s.  Responsive for mobile, tablet, and desktop browsing.

<img width="450" alt="weatherbydayPNG" src="https://user-images.githubusercontent.com/2822827/162255299-3a34e9d2-4fe1-4c51-a69d-d9f9d8d810dd.PNG">

## Utilities Used
Weather data is provided by [Visual Crossing](https://www.visualcrossing.com/resources/documentation/weather-api/weather-api-documentation/#history).

Static map images provided by [Mapbox](https://docs.mapbox.com/api/overview/).

Date & time information provided by [Luxon](https://moment.github.io/luxon/#/).

The interface was designed with the [Bulma](https://bulma.io) CSS framework using [Bootstrap Icons](https://icons.getbootstrap.com/).

## Future

Future elements on this project's wishlist:
* Location validation and suggestions ("Did you mean ... ?")
* Astronomical data like sunrise & sunset, night sky rotation, visible astronomical bodies
* Additional meteorological data such as visibility, pollen count
* Additional historical data such as top headlines
