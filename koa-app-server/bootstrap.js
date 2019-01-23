/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";


  const MongooseDS = require('./server/database/mongoose/ds.mongoose');
  const dsGw = require('./server/database/ds.gw');
  const dsUser = require('./server/database/ds.user');
  const dsDevice = require('./server/database/ds.device');

  const DeviceType = require('./server/database/db.constants').DeviceType;

  const logger = require('./server/util/logger');

  const DefaultGWId = 'home-npc-2018';

  function bootstrap() {

    // Initialize mongoose db

    let mongooseDs = new MongooseDS();
    mongooseDs.initialize()
    // .then(removeDefaultData)
    .then(addDefaultUser)
    .then(installDefaultGw)
    .then(function() {
      logger.debug('[bootstrap] finished!');
    });

  }

  async function removeDefaultData() {
    let deletedUser = await dsUser.deleteBy({ username: 'admin' }, {});
    logger.debug(`[bootstrap] deleted a user: ${JSON.stringify(deletedUser)}`);
    let deletedGw = await dsGw.deleteBy({ id: DefaultGWId }, {});
    logger.debug(`[bootstrap] deleted a gw: ${JSON.stringify(deletedGw)}`);

    return Promise.resolve();
  }

  async function installDefaultGw(user) {

    logger.debug(`[bootstrap] Install default gw. > user : ${JSON.stringify(user)}`);

    let defaultGw = await findGwById(DefaultGWId);

    if(defaultGw) {
      logger.debug('[bootstrap] Default GW already installed. Next.');
      return Promise.resolve(defaultGw);
    }

    let createdGw = null;
    try {
      createdGw = await addDefaultGW(user);
      logger.debug('[bootstrap] Created default gw. Is OK ? ' + (createdGw !== null));

      await addDefaultDevices(createdGw);

    } catch(err) {
      logger.warn(err);
    }

    return Promise.resolve(createdGw);

  }

  async function addDefaultUser() {
    let defaultUsername = 'admin';
    let defaultPwd = '12345678';

    let existUser = await dsUser.find({
      username: defaultUsername
    });

    if(Array.isArray(existUser) && existUser.length > 0) {
      logger.debug('[bootstrap] Default user already created. Next.');
      return Promise.resolve(true);
    }

    let FnAdd = async function(onDone) {

      let user = {
        username: defaultUsername,
        password: defaultPwd,
        firstname: 'Nguyen',
        lastname: 'Van Loc'
      };

      let dbObj = await dsUser.create(user);

      logger.debug('[bootstrap] added default user ' +JSON.stringify(dbObj));

      onDone(dbObj);

    };

    return new Promise(FnAdd);
  }

  function addDefaultDevices(gw) {
    let light = {
      owner: gw.owner,
      gw: gw._id,
      devType: DeviceType.Switch,
      id: "switch-lamp",
      name: "Lamp"
    };

    let fan = {
      owner: gw.owner,
      gw: gw._id,
      devType: DeviceType.Switch,
      id: "switch-fan",
      name: "Fan"
    };

    let led = {
      owner: gw.owner,
      gw: gw._id,
      devType: DeviceType.LED,
      id: "led-1",
      name: "Sleep light"
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

  function addDefaultGW(owner) {

    let FnAdd = async function(onDone) {

      let gw = {
        id: DefaultGWId,
        owner: owner._id,
        name: 'Default'
      };

      let dbObj = await dsGw.create(gw);

      onDone(dbObj);

    };

    return new Promise(FnAdd);

  }

  function findGwById(gwId) {
    let FnFind = async function(onDone) {
      let found = null;
      let filter = { id: gwId };
      let gw = await dsGw.find(filter);
      if(Array.isArray(gw)) {
        found = gw[0];
      }

      onDone(found);
    };

    return new Promise(FnFind);

  }

  module.exports = new bootstrap;

})();