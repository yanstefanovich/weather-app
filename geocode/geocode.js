const request = require('request');

var geocodeAddress = (address, callback) => {
  request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address),
    json: true
  }, (error, response, body) => {
    if (error){
      callback('Unable to connect to Google servers.');
    } else if (body.status === 'ZERO_RESULTS'){
      callback('Unable to find the provided address.');
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address,
        lattitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      });
    } else {
      callback('Something went wrong in the geocode fetch, try again');
    }
  });
};
module.exports = {
  geocodeAddress
};
