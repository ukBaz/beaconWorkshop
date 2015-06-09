// npm version of uri-beacon-scanner
var UriBeaconScanner = require('uri-beacon-scanner');
// Control GPIO
var Gpio = require('onoff').Gpio;
var debug = require('debug');

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

Beacon.prototype.startTimer = function() {
    var that = this;
    this.timer = setTimeout(function() {
        that.red_led.writeSync(0);
        that.amber_led.writeSync(0);
        that.green_led.writeSync(0);
        debug('LEDs Cleared')
    }, 5000);
};

Beacon.prototype.resetTimer = function() {
    debug('Reset Timer')
    clearTimeout(this.timer);
    this.startTimer();
};


Beacon.prototype.newScan = function(rssi, tx_power) {
    var raw_range = calc_range(rssi, tx_power);
    this.rssi_values.push(raw_range);
    if (this.rssi_values.length > 5) {
        this.rssi_values = this.rssi_values.slice(1);
    }
    // console.log(this.rssi_values)
    var range = Math.max.apply(null, this.rssi_values);
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

// Work out distance
function calc_range(rssi, tx_power) {
    // debug('rssi: ' + rssi + ' tx power: ' + tx_power)
    var ratio_db = tx_power - rssi;
    var ratio_linear = Math.pow(10, ratio_db / 10);
    var r = Math.sqrt(ratio_linear);
    // debug('Range: ' + r);
    return Math.round(r);
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

var beacon1_arg = process.argv[2];
var beacon2_arg = process.argv[3];
var beacon1 = new RegExp(beacon1_arg);
var beacon2 = new RegExp(beacon2_arg);
console.log('Tracking Beacon1: ' + beacon1_arg);
console.log('Tracking Beacon2: ' + beacon2_arg);
var beacon1_id = new Beacon(beacon1_arg, 7, 8, 25);
var beacon2_id = new Beacon(beacon2_arg, 18, 15, 14);
var allowDuplicates = true;
UriBeaconScanner.startScanning(allowDuplicates);