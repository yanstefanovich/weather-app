const request = require('request');

request({
  url: 'https://maps.googleapis.com/maps/api/geocode/json?address=39%20richview%20road%20toronto',
  json: true
}, (error, response, body) => {
  console.log(`Address: ${body.results[0].formatted_address}`);
  console.log(`Lattitude: ${body.results[0].geometry.location.lat}`);
  console.log(`Longitude: ${body.results[0].geometry.location.lng}`);
});
