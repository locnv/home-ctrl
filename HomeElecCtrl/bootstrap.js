/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";


  const MongooseDS = require('./database/mongoose/ds.mongoose');
  const dsDevice = require('./database/ds.device');

  const DeviceType = require('./database/db.constants').DeviceType;

  const logger = require('./util/logger');

  // const DefaultGWId = 'home-npc-2018';

  function Bootstrap() {

    // Initialize mongoose db

    let mongooseDs = new MongooseDS();
    mongooseDs.initialize()
    // .then(addDefaultDevices)
    .then(() => logger.debug('[bootstrap] finished!'));

  }

  function addDefaultDevices() {
    let light = {
      id: "switch-lamp",
      name: "Lamp",
      devType: DeviceType.Switch
    };

    let fan = {
      id: "switch-fan",
      name: "Fan",
      devType: DeviceType.Switch
    };

    let led = {
      id: "led-1",
      name: "Sleep light",
      devType: DeviceType.LED
    };

    let FnAdd = async function(onDone) {

      let dbObj = await dsDevice.create(light);
      logger.debug(`[bootstrap] added light: ${JSON.stringify(dbObj)}.`);
      dbObj = await dsDevice.create(fan);
      logger.debug(`[bootstrap] added fan: ${JSON.stringify(dbObj)}.`);
      dbObj = await dsDevice.create(led);
      logger.debug(`[bootstrap] added led: ${JSON.stringify(dbObj)}.`);

      onDone(true);

    };

    return new Promise(FnAdd);
  }

  module.exports = new Bootstrap();

})();
