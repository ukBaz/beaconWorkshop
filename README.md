# beaconWorkshop
## Overview
Workshop intended for use in STEM activity.
Does simple proximity tracking of two [uriBeacon](https://github.com/google/uribeacon) with a Raspberry Pi and displays status using a simple traffic light system.

There are a couple of videos with background information:
- Short demo (https://youtu.be/1Y7YITl1CVw)
- Background talk (https://youtu.be/IiIx1xnXw0M)

## Hardware
- Raspberry Pi (Any model)
- Bluetooth 4.0 Dongle (e.g. http://www.adafruit.com/products/1327)
- uriBeacons (https://github.com/google/uribeacon)
- 2x PiStops Traffic Lights (http://4tronix.co.uk/store/index.php?rt=product/product&product_id=390)

## Setup new Raspberry Pi
### Install Bluez
```
sudo apt-get install bluetooth bluez-utils libbluetooth-dev
```
### Install node.js
```
sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```
### Install node.js packages
```
npm install uri-beacon-scanner
npm install onoff
```

## Task list
- [ ] Add workshop manual
- [ ] Add code
- [ ] Write introduction presentation

