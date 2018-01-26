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
    describe: 'Specifies to whether display the weather forecast, set to daily by default',
    boolean: true
  },
  m: {
    alias: 'minutely',
    describe: 'Specifies forecast to minutely',
    boolean: true
  },
  h: {
    alias: 'weekly',
    describe: 'Specifies forecast to hourly',
    boolean: true
  }
})
.help()
.alias('help', 'h')
.argv;

if (argv.address) {
  var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+
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
       console.log(`It is currently ${temperature} and it feels like ${apparentTemperature}.`);
       if (argv.forecast){
         console.log();
       }
     })
     .catch((e) => {
       if (e.code === 'ENOTFOUND') {
         console.log(`Unable to connect to API servers.`);
       } else {
         console.log(e.message);
       }
     });


     // load more info
