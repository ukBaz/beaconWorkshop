// Control GPIO
var Gpio = require('onoff').Gpio;
var debug = require('debug');

var pistop = function(red_pin, amber_pin, green_pin) {
    this.red_pin = red_pin;
    this.amber_pin = amber_pin;
    this.green_pin = green_pin;
    this.green_led = new Gpio(green_pin, 'out');
    this.amber_led = new Gpio(amber_pin, 'out');
    this.red_led = new Gpio(red_pin, 'out');
};


pistop.prototype.led = function(rstate, astate, gstate) {
    this.red_led.writeSync(rstate);
    this.amber_led.writeSync(astate);
    this.green_led.writeSync(gstate);
};


module.exports = pistop;
