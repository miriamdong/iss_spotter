const request = require('request-promise-native');
const {
  printPassTimes
} = require('./index');
/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = () => request('https://api.ipify.org?format=json');

const fetchCoordsByIP = body => {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ ip }`);
};

const fetchISSFlyOverTimes = body => {
  // console.log(JSON.parse(body));
  const longitude = JSON.parse(body).longitude;
  const latitude = JSON.parse(body).latitude;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

const nextISSTimesForMyLocation = body => {
  //   const passTimes = JSON.parse(body).response;
  //   for (const pass of passTimes) {
  //     const datetime = new Date(0);
  //     datetime.setUTCSeconds(pass.risetime);
  //     const duration = pass.duration;
  //     console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  //   }

  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const {
        response
      } = JSON.parse(data);
      return response;
    });
};



module.exports = {
  // fetchMyIP,
  // fetchCoordsByIP,
  // fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};