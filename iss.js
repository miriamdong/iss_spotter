/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = callback => {
  request('https://api.ipify.org', (e, response, IP) => {
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (e) return callback(e, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response.body}`;
      callback(Error(msg), null);
      return;
    }
    // const ip = JSON.parse(body).ip;
    callback(null, IP);
  });
};
// console.log(typeof fetchMyIP);
// const options = {
//   "method": "GET",
//   "hostname": "freegeoip.app",
//   "port": null,
//   "path": "/json/",
//   "headers": {
//     "accept": "application/json",
//     "content-type": "application/json"
//   }
// };

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (e, response, body) => {
    if (e) return callback(e, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    const coords = JSON.parse(body);
    callback(null, coords);
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${ coords.latitude }&lon=${ coords.longitude }`;
  request(url, (e, response, body) => {
    if (e) return callback(e, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const ISS = JSON.parse(body).response;
    callback(null, ISS);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = callback => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) return callback(error, null);
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) return callback(error, null);

        callback(null, nextPasses);
      });
    });
  });
};


// let http = require('http');

// module.exports = {
//   fetchMyIP,
//   fetchCoordsByIP,
//   fetchISSFlyOverTimes,
//   nextISSTimesForMyLocation
// };

module.exports = {
  nextISSTimesForMyLocation
};

// http.get({
//   'host': 'api.ipify.org',
//   'port': 80,
//   'path': '/'
// }, function(resp) {
//   resp.on('data', function(ip) {
//     console.log("My public IP address is: " + ip);
//   });
// })