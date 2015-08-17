
//* distance < IMMEDIATE_RANGE, red light will go on.               *//
//* IMMEDIATE_RANGE <= distance <= NEAR_RANGE, amber light goes on. *//
//* distance > NEAR_RANGE, green light will go on.                  *//
var IMMEDIATE_RANGE = 2;
var NEAR_RANGE = 4;

//* Number of beacon readings used for distance calculations, average taken. *//
var ROLLING_AVERAGE_SIZE = 5;

//* Load Node packages *//
var UriBeaconScanner = require('uri-beacon-scanner');
var BeaconLights = require('beaconLights');

//* Function run when beacon discovered *//
UriBeaconScanner.on('discover', function(uriBeacon) {
   if(uriBeacon.uri.search(process.argv[2]) > 0) {
       console.log(
            'Beacon1: rssi = ' + uriBeacon.rssi +
            ' tx power = ' + uriBeacon.txPower
       )
       beacon1.discovered(
            uriBeacon.rssi,
            uriBeacon.txPower,
            IMMEDIATE_RANGE,
            NEAR_RANGE,
            ROLLING_AVERAGE_SIZE
       );
   } else if (uriBeacon.uri.search(process.argv[3]) > 0) {
       console.log(
            'Beacon2: rssi = ' + uriBeacon.rssi +
            ' tx power = ' + uriBeacon.txPower
       )
       beacon2.discovered(
            uriBeacon.rssi,
            uriBeacon.txPower,
            IMMEDIATE_RANGE,
            NEAR_RANGE,
            ROLLING_AVERAGE_SIZE
       );
   }
});

//* Main Code *//

//* If 2 beacon IDs not given give error message and exit.*//
if(process.argv.length < 4) {
    console.log("Need to specify two beacons to track");
    process.exit(1);
}

//* Prints progress messages to terminal.*//
console.log('Tracking Beacon1: ' + process.argv[2]);
console.log('Tracking Beacon2: ' + process.argv[3]);

//* Links beacon ID and pin numbers to display lights for each beacon.   *//
//* See appendix 1.                                                      *//
//* BeaconLights(BeaconID, immediateLightPin, nearLightPin, farLightPin) *//
var beacon1 = new BeaconLights(process.argv[2], 21, 20, 16);
var beacon2 = new BeaconLights(process.argv[3], 7, 8, 25);

//* Start scanning for beacons *//
UriBeaconScanner.startScanning(true);
