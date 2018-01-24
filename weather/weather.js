const request = require('request');

var getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.darksky.net/forecast/c381a4c8ac2708de13909bcc3ec7987d/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback(`Unable to connect to Dark Sky API`);
    } else if (body.code === 400) {
      callback(body.error);
    } else if (response.statusCode === 403) {
      callback('Invalid Dark Sky API key');
    } else if (response.statusCode === 200) {
      callback(undefined, {
        time: body.currently.time,
        summary: body.currently.summary,
        temperature: Math.round((body.currently.temperature - 32)*5/9),
        feelsLike: Math.round((body.currently.apparentTemperature - 32)*5/9)
      });
    } else {
      callback('Something went wrong in the weather fetch, try again.');
    }
  });
};

module.exports.getWeather = getWeather;
