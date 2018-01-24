const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
.options({
  a: {
    demand: true,
    alias: 'address',
    describe: 'Address to fetch whether for',
    string: true
  }
})
.help()
.alias('help', 'h')
.argv;

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
  if (errorMessage) {
    console.log(errorMessage);
  } else {
    console.log(results.address);
    weather.getWeather(results.lattitude, results.longitude, (errorMessage, weatherResults) => {
      if (errorMessage) {
        console.log(errorMessage);
      } else {
        console.log(`It is currently ${weatherResults.summary}`);
        console.log(`The temperature is currently ${weatherResults.temperature} °C`);
        console.log(`But it feels like ${weatherResults.feelsLike} °C`);
      }
    });
  }
});
