/**
 * Created by locnv on 10/14/19.
 */

(function() {
  "use strict";

  const switchManagement = require('../switch').SwitchManagement;
  const DevTypes = require('../app.constant').DeviceType;
  const RespStatus = require('../app.constant').Server.RespStatus;

  const logger = require('../util/logger');
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
      status: RespStatus.Ok,
      data: allDevs,
      serverTime: new Date()
    };
  };

  DeviceApi.prototype.setSwitchStatus = async function(ctx, next) {

    let devId = ctx.params['id'];
    let status = parseInt(ctx.params['status']);

    let rs = switchManagement.setSwitchStatus(devId, status);

    // await next();

    ctx.body = {
      status: rs ? RespStatus.Ok : RespStatus.Nok,
      data: {
        devId: devId,
        status: status
      },
      serverTime: new Date()
    };
  };

  DeviceApi.prototype.setSwitchesStatus = async function(ctx, next) {

    let devices = ctx.request.body;
    devices.forEach(dev => {
      // console.log(` --- --- >>> ${JSON.stringify(dev)}`);
      switchManagement.setSwitchStatus(dev.id, dev.status);
    });

    // await next();

    ctx.body = {
      status: RespStatus.Ok,
      data: ctx.request.body,
      serverTime: new Date()
    };
  };

  DeviceApi.prototype.addDevice = async function(ctx, next) {
    let respStatus = RespStatus.Ok;
    let errMessage = '';
    let device = ctx.request.body;

    let createdDev = null;
    try {
      createdDev = await switchManagement.addSwitch(device);
    } catch (e) {
      respStatus = RespStatus.Nok;
      errMessage = e.message;
    }


    ctx.body = {
      status: respStatus,
      message: errMessage,
      data: createdDev,
      serverTime: new Date()
    };
  };

  module.exports = new DeviceApi();

})();
