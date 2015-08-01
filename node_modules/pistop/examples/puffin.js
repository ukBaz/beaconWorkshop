var PiStop = require('../../pistop');

east = new PiStop(21, 20, 16) ;
west = new PiStop(7, 8, 25);

state = 1;

west.clear();

var myVar=setInterval(function () {counter()}, 2000);

function counter() {
    switch (state) {
        case 1:
            state1();
            state += 1;
            break;
        case 2:
            state2();
            state += 1;
            break;
        case 3:
            state3();
            state += 1;
            break;
        case 4:
            state4();
            state = 1;
            break;
        default:
            state = 1;
            break;
    }
};

function state1() {
    west.red();
    east.set(0, 0, 1);
};

function state2() {
    west.red_amber();
    east.set(0, 1, 0);
};

function state3() {
    west.green();
    east.set(1, 0, 0);
};

function state4() {
    west.amber();
    east.set(1, 1, 0);
};


function exitHandler(options, err) {
    if (options.cleanup) {
        console.log('clean');
        west.clear();
        east.clear();
    };
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));