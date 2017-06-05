# HowsTheWeather
The forecast.

Fetch hourly weather predictions for the next 7 days, straight from NOAA's weather service.

Developed and tested with U.S. residents in mind. Pull requests are considered and feedback is welcome!

## Requirements

 * Node.js
 * Internet connection (9600 baud and up!)

## To run

`node app.js <latitude> <longitude>`


Coordinates are in WGS 1984 decimal degrees.

For example, Washington D.C.:

`node app.js 38.8951100 -77.0363700`

## To do

 * Location menu (Let's face it, who really wants to always enter coordinates?)
 * Multinational support (Locations)
 * Caching (Location and weather data, selections)
 * Additional weather services (Not sure, but international users might prefer local services)

Have fun! :)