// npm version of uri-beacon-scanner
var UriBeaconScanner = require('uri-beacon-scanner');
// Control GPIO
var Gpio = require('onoff').Gpio;
// Help with debug
var debug = require('debug')('tracker');

// Beacon Constructor
var Beacon = function(uri, red_pin, amber_pin, green_pin) {
    this.uri = uri;
    this.tx_power = 0;
    this.rssi_values = [];
    this.red_pin = red_pin;
    this.amber_pin = amber_pin;
    this.green_pin = green_pin;
    this.green_led = new Gpio(green_pin, 'out');
    this.amber_led = new Gpio(amber_pin, 'out');
    this.red_led = new Gpio(red_pin, 'out');
    this.timer = null;
    this.startTimer();
};

// Beacon Timer Start method
Beacon.prototype.startTimer = function() {
    var that = this;
    this.timer = setTimeout(function() {
        that.red_led.writeSync(0);
        that.amber_led.writeSync(0);
        that.green_led.writeSync(0);
        debug('LEDs Cleared')
    }, 5000);
};

// Beacon restart timer method
Beacon.prototype.resetTimer = function() {
    debug('Reset Timer')
    clearTimeout(this.timer);
    this.startTimer();
};

// Beacon method for when new advert received
Beacon.prototype.newScan = function(rssi, tx_power) {
    // var raw_range = calc_range(rssi, tx_power);
    console.log('RSSI value = ' + rssi);
    console.log('RSSI values = ' +this.rssi_values);
    this.rssi_values.push(rssi);
    this.rssi_values = check_length(this.rssi_values, 5);
    debug('rssi_values = ' + this.rssi_values);
    var calc_value =  calc_average(this.rssi_values);
    // var range = Math.max.apply(null, this.rssi_values);
    var range = calc_range(calc_value, tx_power);
    console.log('range = ' + range + ' for ' + this.uri);
    if (range < 2) {
        this.red_led.writeSync(1);
        this.amber_led.writeSync(0);
        this.green_led.writeSync(0);
    } else if ( range > 10 ) {
        this.red_led.writeSync(0);
        this.amber_led.writeSync(0);
        this.green_led.writeSync(1);
    } else if ( range < 10 && range > 2 ) {
        this.red_led.writeSync(0);
        this.amber_led.writeSync(1);
        this.green_led.writeSync(0);
    }
    this.resetTimer();
};

// Estimate distance using rssi and tx_power
function calc_range(rssi, tx_power) {
    // debug('rssi: ' + rssi + ' tx power: ' + tx_power)
    var ratio_db = tx_power - rssi;
    var ratio_linear = Math.pow(10, ratio_db / 10);
    var r = Math.sqrt(ratio_linear);
    // debug('Range: ' + r);
    return Math.round(r);
}

// Average of readings stored
function calc_average(rssi_values) {
    var result = 0;
    for (var i = 0; i < rssi_values.length; i++) {
        result += rssi_values[i];
    }
    return result / rssi_values.length;
}

// Only store the required number of readings
function check_length(readings, subset_length) {
    if ( readings.length > subset_length ) {
        readings = readings.slice(-subset_length);
    }
    return readings;
}

// What to do when a new advert is received
UriBeaconScanner.on('discover', function(uriBeacon) {
   if(beacon1.test(uriBeacon.uri)) {
       beacon1_id.newScan(uriBeacon.rssi, uriBeacon.txPower);
   } else if (beacon2.test(uriBeacon.uri)) {
       beacon2_id.newScan(uriBeacon.rssi, uriBeacon.txPower);
   }
});

// Check number of command line parameters
if(process.argv.length < 4) {
    console.log("Need to specify two beacons to track");
    process.exit(1);
}

// Get beacon ID's to look for from command line
var beacon1_arg = process.argv[2];
var beacon2_arg = process.argv[3];
var beacon1 = new RegExp(beacon1_arg);
var beacon2 = new RegExp(beacon2_arg);
console.log('Tracking Beacon1: ' + beacon1_arg);
console.log('Tracking Beacon2: ' + beacon2_arg);

// Create beacon instances
var beacon1_id = new Beacon(beacon1_arg, 21, 20, 16);
var beacon2_id = new Beacon(beacon2_arg, 7, 8, 25);

// Start looking for beacons
var allowDuplicates = true;
UriBeaconScanner.startScanning(allowDuplicates);
