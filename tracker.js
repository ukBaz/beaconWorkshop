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
    console.log("Need to specify two beacons to track");        // If 2 beacon ids not given give error message and exit.
    process.exit(1);
}

var CLOSE_RANGE = 2;                                            // When beacon distance < CLOSE_RANGE away, red light will go on.
                                                                // When beacon distance is NEAR RANGE, between CLOSE and FAR, amber light goes on.
var FAR_RANGE = 10;                                             // When beacon distance > FAR_RANGE away, green light will go on.

var beacon1RegExp = new RegExp(process.argv[2]);
var beacon2RegExp = new RegExp(process.argv[3]);
var beacon1_id = new BeaconLights(process.argv[2], 21, 20, 16); // Function links beacon id and the pin numbers to display red/amber/green to. See appendix 1.
var beacon2_id = new BeaconLights(process.argv[3], 7, 8, 25);   // Function links beacon id and the pin numbers to display red/amber/green to. See appendix 1.
console.log('Tracking Beacon1: ' + process.argv[2]);            // Prints progress message to terminal.
console.log('Tracking Beacon2: ' + process.argv[3]);            // Prints progress message to terminal.
UriBeaconScanner.startScanning(true);
