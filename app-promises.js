const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
.options({
  a: {
    alias: 'address',
    describe: 'Address to fetch whether for',
    string: true
  },
  f: {
    alias: 'forecast',
    describe: 'Specifies whether display the daily weather forecast, max 7 days',
    number: true
  },
  m: {
    alias: 'minutely',
    describe: 'Specifies to display the forecast for the next hour',
    boolean: true
  },
  o: {
    alias: 'hourly',
    describe: 'Specifies to display the forecast for the next specified number of hours, max 48 hours',
    number: true
  }
})
.help()
.alias('help', 'h')
.argv;

if (argv.address) {
  var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
  encodeURIComponent(argv.address);
} else {
  var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=Toronto%20Ontario';
}

axios.get(geocodeURL)
     .then((response) => {
       if (response.data.status === 'ZERO_RESULTS') {
         throw new Error('Unable to find address.');
       }

       var lat = response.data.results[0].geometry.location.lat;
       var lng = response.data.results[0].geometry.location.lng;
       var weatherURL = `https://api.darksky.net/forecast/c381a4c8ac2708de13909bcc3ec7987d/${lat},${lng}`;

       console.log(`Weather for: ${response.data.results[0].formatted_address}.`);

       return axios.get(weatherURL);
     })
     .then((response) => {
       var temperature = Math.round((response.data.currently.temperature - 32)*5/9);
       var apparentTemperature = Math.round((response.data.currently.apparentTemperature - 32)*5/9)

       console.log(`The weather right now is ${response.data.currently.summary}.`);
       console.log(`It is currently ${temperature}C and it feels like ${apparentTemperature}C.`);
      if (argv.minutely) {
         console.log('-------------------------------------------------------------');
         console.log('Forecast for the hour');
         console.log('-------------------------------------------------------------');
         console.log(`The weather will be: ${response.data.minutely.summary}`);
       } else if (argv.hourly) {
         console.log('-------------------------------------------------------------');
         console.log('Forecast for the next 8 hours');
         console.log('-------------------------------------------------------------');
         var i = 0;
         for (var {summary:summary, precipProbability:precipProbability,
                   precipType:precipType, temperature:temperature,
                   apparentTemperature: apparentTemperature, cloudCover:cloudCover}
                   of response.data.hourly.data){
            i++;
            if (argv.hourly <= 48 && i <= argv.hourly) {
              console.log(`In ${i} hour(s):`);
              console.log(`It will be ${summary}`);
              console.log(`The temperature will be ${ Math.round((temperature- 32)*5/9)}C and it will feel like ${Math.round((apparentTemperature- 32)*5/9)}C.`);
              console.log(`The chance of ${precipType} will be ${Math.round(precipProbability*100)}% with a cloud cover of ${Math.round(cloudCover*100)}%`);
              console.log('-------------------------------------------------------------');
            } else {
              console.log(`In ${i} hour(s):`);
              console.log(`It will be ${summary}`);
              console.log(`The temperature will be ${ Math.round((temperature- 32)*5/9)}C and it will feel like ${Math.round((apparentTemperature- 32)*5/9)}C.`);
              console.log(`The chance of ${precipType} will be ${Math.round(precipProbability*100)}% with a cloud cover of ${Math.round(cloudCover*100)}%`);
              console.log('-------------------------------------------------------------');
              break;
            }
         }
       } else if (argv.forecast){
         console.log('-------------------------------------------------------------');
         console.log('Daily Forecast:');
         console.log('-------------------------------------------------------------');
         console.log(response.data.daily.summary);
         console.log('-------------------------------------------------------------');
         var i = 0;
         for (var {summary:summary, precipProbability:precipProbability,
                   precipType:precipType, temperatureHigh:temperatureHigh,
                   apparentTemperatureHigh: apparentTemperatureHigh,
                   cloudCover:cloudCover, temperatureLow:temperatureLow,
                   apparentTemperatureLow: apparentTemperatureLow}
                   of response.data.daily.data){
            i++;
            if (argv.daily <= 7 && i <= argv.daily) {
              console.log(`In ${i} day(s):`);
              console.log(`It will be ${summary}`);
              console.log(`The temperature high will be ${ Math.round((temperatureHigh - 32)*5/9)}C and it will feel like ${Math.round((apparentTemperatureHigh - 32)*5/9)}C.`);
              console.log(`The temperature high will be ${ Math.round((temperatureLow - 32)*5/9)}C and it will feel like ${Math.round((apparentTemperatureLow - 32)*5/9)}C.`);
              console.log(`The chance of ${precipType} will be ${Math.round(precipProbability*100)}% with a cloud cover of ${Math.round(cloudCover*100)}%`);
              console.log('-------------------------------------------------------------');
            } else {
              console.log(`In ${i} day(s):`);
              console.log(`It will be ${summary}`);
              console.log(`The temperature high will be ${ Math.round((temperatureHigh - 32)*5/9)}C and it will feel like ${Math.round((apparentTemperatureHigh - 32)*5/9)}C.`);
              console.log(`The temperature high low be ${ Math.round((temperatureLow - 32)*5/9)}C and it will feel like ${Math.round((apparentTemperatureLow - 32)*5/9)}C.`);
              console.log(`The chance of ${precipType} will be ${Math.round(precipProbability*100)}% with a cloud cover of ${Math.round(cloudCover*100)}%`);
              console.log('-------------------------------------------------------------');
              break;
            }
          }
       }
     })
     .catch((e) => {
       if (e.code === 'ENOTFOUND') {
         console.log(`Unable to connect to API servers.`);
       } else {
         console.log(e.message);
       }
     });
