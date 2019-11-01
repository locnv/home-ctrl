/**
 * Created by locnv on 10/14/19.
 */

(function() {
  "use strict";

  const switchManagement = require('../../switch').SwitchManagement;
  const DevTypes = require('../../app.constant').DeviceType;

  function DeviceApi() { }

  DeviceApi.prototype.getDevices = async function(ctx, next) {

    let _allDevs = switchManagement.getAllSwitches();
    let allDevs = _allDevs.map(dev => {
      return {
        id: dev.id,
        name: dev.name,
        devType: DevTypes.Switch,
        status: dev.status
      };
    });

    // await next();

    ctx.body = {
      status: 'ok',
      data: allDevs,
      serverTime: new Date()
    };
  };

  module.exports = new DeviceApi();

})();
