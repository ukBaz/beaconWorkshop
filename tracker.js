
var CLOSE_RANGE = 2; //* distance < CLOSE_RANGE, red light will go on.*//
                     //* CLOSE_RANGE <= distance <= FAR_RANGE, amber light goes on.*//
var FAR_RANGE = 10;  //* distance > FAR_RANGE, green light will go on.*//

var UriBeaconScanner = require('uri-beacon-scanner');
var BeaconLights = require('beaconLights');

UriBeaconScanner.on('discover', function(uriBeacon) {
   if(beacon1RegExp.test(uriBeacon.uri)) {
       beacon1_id.newScan(uriBeacon.rssi, uriBeacon.txPower, CLOSE_RANGE, FAR_RANGE);
       console.log('Beacon1: rssi = ' + uriBeacon.rssi + ' [' + uriBeacon.txPower + ']')
   } else if (beacon2RegExp.test(uriBeacon.uri)) {
       beacon2_id.newScan(uriBeacon.rssi, uriBeacon.txPower, CLOSE_RANGE, FAR_RANGE);
       console.log('Beacon2: rssi = ' + uriBeacon.rssi + ' [' + uriBeacon.txPower + ']')
   }
});

//* Main Code *//

//* If 2 beacon IDs not given give error message and exit.*//
if(process.argv.length < 4) {
    console.log("Need to specify two beacons to track");
    process.exit(1);
}

var beacon1RegExp = new RegExp(process.argv[2]);
var beacon2RegExp = new RegExp(process.argv[3]);

//* Links beacon id and pin numbers to display red/amber/green to for each beacon.*//
//* See appendix 1.*//
var beacon1_id = new BeaconLights(process.argv[2], 21, 20, 16);
var beacon2_id = new BeaconLights(process.argv[3], 7, 8, 25);

//* Prints progress messages to terminal.*//
console.log('Tracking Beacon1: ' + process.argv[2]);
console.log('Tracking Beacon2: ' + process.argv[3]);

UriBeaconScanner.startScanning(true);
