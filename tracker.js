var UriBeaconScanner = require('uri-beacon-scanner');
var BeaconLights = require('beaconLights');

UriBeaconScanner.on('discover', function(uriBeacon) {
   if(beacon1RegExp.test(uriBeacon.uri)) {
       beacon1_id.newScan(uriBeacon.rssi, uriBeacon.txPower);
       console.log('Beacon1: rssi = ' + uriBeacon.rssi + ' [' + uriBeacon.txPower + ']')
   } else if (beacon2RegExp.test(uriBeacon.uri)) {
       beacon2_id.newScan(uriBeacon.rssi, uriBeacon.txPower);
       console.log('Beacon2: rssi = ' + uriBeacon.rssi + ' [' + uriBeacon.txPower + ']')
   }
});

/**
 * Main Code
 */
if(process.argv.length < 4) {
    console.log("Need to specify two beacons to track");
    process.exit(1);
}

var beacon1RegExp = new RegExp(process.argv[2]);
var beacon2RegExp = new RegExp(process.argv[3]);
var beacon1_id = new BeaconLights(process.argv[2], 21, 20, 16);
var beacon2_id = new BeaconLights(process.argv[3], 7, 8, 25);
console.log('Tracking Beacon1: ' + process.argv[2]);
console.log('Tracking Beacon2: ' + process.argv[3]);
UriBeaconScanner.startScanning(true);
