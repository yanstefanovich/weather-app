const request = require('request');
const yargs = require('yargs');

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

request({
  url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(argv.address),
  json: true
}, (error, response, body) => {
  console.log(`Address: ${body.results[0].formatted_address}`);
  console.log(`Lattitude: ${body.results[0].geometry.location.lat}`);
  console.log(`Longitude: ${body.results[0].geometry.location.lng}`);
});
