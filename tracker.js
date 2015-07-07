var UriBeaconScanner = require('uri-beacon-scanner');
var PiStop = require('./pistop');

var Beacon = function(uri, red_pin, amber_pin, green_pin) {
    this.uri = uri;
    this.tx_power = 0;
    this.rssi_values = [];
    this.lights = new PiStop(red_pin, amber_pin, green_pin) ;
    this.timer = null;
    this.startTimer();
};

Beacon.prototype.startTimer = function() {
    var that = this;
    this.timer = setTimeout(function() {
        that.lights.led(0, 0, 0);
    }, 5000);
};

Beacon.prototype.resetTimer = function() {
    clearTimeout(this.timer);
    this.startTimer();
};

Beacon.prototype.newScan = function(rssi, tx_power) {
    this.rssi_values.push(rssi);
    this.rssi_values = check_length(this.rssi_values, 5);
    var calc_value =  calc_average(this.rssi_values);
    var range = calc_range(calc_value, tx_power);
    if (range < 2) {
        this.lights.led(1, 0, 0);
    } else if ( range > 10 ) {
        this.lights.led(0, 0, 1);
    } else if ( range < 10 && range > 2 ) {
        this.lights.led(0, 1, 0);
    }
    this.resetTimer();
};

function calc_range(rssi, tx_power) {
    var ratio_db = tx_power - rssi;
    var ratio_linear = Math.pow(10, ratio_db / 10);
    var r = Math.sqrt(ratio_linear);
    return Math.round(r);
}

function calc_average(rssi_values) {
    var result = 0;
    for (var i = 0; i < rssi_values.length; i++) {
        result += rssi_values[i];
    }
    return result / rssi_values.length;
}

function check_length(readings, subset_length) {
    if ( readings.length > subset_length ) {
        readings = readings.slice(-subset_length);
    }
    return readings;
}

UriBeaconScanner.on('discover', function(uriBeacon) {
   if(beacon1.test(uriBeacon.uri)) {
       beacon1_id.newScan(uriBeacon.rssi, uriBeacon.txPower);
   } else if (beacon2.test(uriBeacon.uri)) {
       beacon2_id.newScan(uriBeacon.rssi, uriBeacon.txPower);
   }
});

if(process.argv.length < 4) {
    console.log("Need to specify two beacons to track");
    process.exit(1);
}

var beacon1 = new RegExp(process.argv[2]);
var beacon2 = new RegExp(process.argv[3]);
var beacon1_id = new Beacon(process.argv[2], 21, 20, 16);
var beacon2_id = new Beacon(process.argv[3], 7, 8, 25);
UriBeaconScanner.startScanning(true);
