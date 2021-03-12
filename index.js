const {
  fetchMyIP
} = require('./iss');

const {
  fetchCoordsByIP
} = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log('It worked! Returned IP:', ip);
});

fetchCoordsByIP('64.46.0.209', (error, coords) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log('It worked! Returned Coords:', {
    longitude: coords.longitude,
    latitude: coords.latitude
  });
});