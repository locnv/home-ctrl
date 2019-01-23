(function () {
  "use strict";

  var piIO = require('./build/Release/PiIO');

  setTimeout(start, 1);

  function start() {
    console.log('Done.');
    var on = piIO.turnOn();
    console.log(on);

    var off = piIO.turnOff();
    console.log(off);
  }

})();
