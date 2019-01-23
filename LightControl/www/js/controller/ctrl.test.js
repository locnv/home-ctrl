/**
 * Created by locnv on 1/21/18.
 *
 */

/* global angular */
/* global bluetoothle */
/* global _global */
/* global Promise */
/* global $ */
/* global Slider */
(function() {
  'use strict';

  angular
  .module(_global.AppName)
  .filter('SwitchStatusDisp', SwitchStatusDisp)
  .filter('StatusImage', StatusImage)
  .controller(_global.Controllers.Test, ControlerImpl);

  function StatusImage(AppConstants) {

    return function(sw) {
      var SwitchStatus = AppConstants.SwitchStatus;
      var rs = sw.imageUrl.Unknown;

      switch(sw.status) {
        case SwitchStatus.On:
          rs = sw.imageUrl.On;
          break;
        case SwitchStatus.Off:
          rs = sw.imageUrl.Off;
          break;
        default:
          break;
      }

      return rs;

    }

  }

  function SwitchStatusDisp(AppConstants) {
    return function(status) {

      var SwitchStatus = AppConstants.SwitchStatus;

      var rs = '?';

      switch(status) {
        case SwitchStatus.On:
          rs = 'on';
          break;
        case SwitchStatus.Off:
          rs = 'off';
          break;
        default:
          break;
      }

      return rs;
    }
  }

  /* Dependencies injection */
  ControlerImpl.$inject = ['$scope', '$controller', 'AppCsf', 'DevComm'];

  /* Controller declaration & impl */
  function ControlerImpl(vm, $controller, AppCsf, devComm) {

    var mConst = AppCsf.appConst;
    var logger = AppCsf.logger;
    var notifier = AppCsf.notifier;
    var CtrlName = _global.Controllers.Admin;
    var SelectedGW = AppCsf.appConst.GW;
    var LedModes = mConst.LedModes;

    var SwitchCommand = mConst.SwitchCommands;
    var SwitchStatus = mConst.SwitchStatus;

    /* Flag indicates if devices connected */
    var mConnectedToDev = false;

    var ledSlider = {
      r: null, g: null, b: null, interval: null
    };

    /* Scope variables */
    vm.CtrlName = CtrlName;
    vm.PageTitle = 'Chat Room!';
    vm.dontShowLoading = false; // Mean to show
    vm.showDialog = false;

    vm.SwitchCommand = SwitchCommand;
    vm.SwitchStatus = SwitchStatus;
    vm.LedModes = LedModes;

    vm.switches = devComm.getAllPreDefinedSwitches();
    vm.selectedSwitch = vm.switches[0];

    vm.leds = devComm.getAllPreDefinedLEDs();
    vm.selectedLed = vm.leds[0];

    /* Scope functions */

    vm.onEntering = onEntering;
    vm.onLeaving = onLeaving;
    vm.onResume = onResume;
    vm.onLanguageChanged = onLanguageChanged;
    vm.toggleFormSchedule = function(sw) {
      //console.log('toggle > ' + sw.id);
      vm.selectedSwitch = sw;
      vm.showDialog = !vm.showDialog;
    };

    vm.sendSwitchCommand = sendSwitchCommand;
    vm.removeSchedule = removeSchedule;
    //vm.RGBChange = RGBChange;
    vm.setLedMode = setLedMode;
    vm.selectLED = selectLED;


    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: vm });

    setTimeout(initUI, 1);
    // initUI();

    function initUI() {

      ledSlider.r = new Slider("#R", {}).on('slide', RGBChange);
      ledSlider.g = new Slider("#G", {}).on('slide', RGBChange);
      ledSlider.b = new Slider("#B", {}).on('slide', RGBChange);
      ledSlider.interval = new Slider("#IN", {}).on('slide', IntervalChange);

      $('.btnToggleOnOff').bootstrapToggle({
        on: 'ON',
        off: 'OFF'
      });

      $('.btnToggleOnOff').change(function(e) {
        var isOnReq = $(this).prop('checked');
        var isOffReq = !isOnReq;
        var switchId = $(this).attr('switchId');
        var sw = findSwitchById(switchId);

        if(isOnReq && sw.status === SwitchStatus.Off) {
          sendSwitchCommand(sw, SwitchCommand.TurnOn);
        } else if (isOffReq && sw.status === SwitchStatus.On) {
          sendSwitchCommand(sw, SwitchCommand.TurnOff);
        }

      });
    }

    /**
     * Entering
     *
     * @returns {Promise.<boolean>}
     */
    function onEntering() {

      initialize();

      var promise = new Promise(function(resolve) {
        waitForContactingDevices(resolve);
      });

      return promise;

    }

    var mWaitedTime = 0;
    function waitForContactingDevices(onFinish) {

      if(mConnectedToDev === true) {
        return onFinish(true);
      }

      mWaitedTime += 500;
      if(mWaitedTime >= 30*1000) {
        //logger.warn('[ctrl-test] Failed to contact devices.');
        notifier.error(
          'Sorry! it failed to contact devices, ' +
          'you will not able to command devices at the moment, ' +
          'please reload the page later!');

        return onFinish(false);
      }

      setTimeout(waitForContactingDevices.bind(null, onFinish), 500);
    }

    function onLeaving() {

      devComm.removeDevChangedListener(onDevStatusChanged);

      return Promise.resolve(true);
    }

    /* Initialization */
    function initialize() {
      requestDevStatus();
      devComm.addDevChangedListener(onDevStatusChanged);

    }

    var mNbReqStatusRetry = 0;

    /**
     * Send a status-report-req request until having the response from
     * targeted device (gw) or when a Timeout reach.
     *
     * If a timeout reaches, normally, the gw is not connected to server,
     * and the commands shall not work properly.
     */
    function requestDevStatus() {
      if(mConnectedToDev) {
        return;
      }

      mNbReqStatusRetry++;
      if(mNbReqStatusRetry >= 6) {
        logger.warn('[ctrl-test] Request device status without response. Stop!');
        return;
      }

      devComm.sendStatusReportReq(SelectedGW);

      setTimeout(requestDevStatus, 5*1000);

    }

    /**
     * Mark one (LED) as the selected one.
     * @param led
     */
    function selectLED(led) {
      vm.selectedLed = led;
    }

    var mThreadUpdateInterval = 0;

    /**
     * Handle LED Interval Slider event.
     * The Interval Slider is applied for selected LED and
     * should be available only if the selected LED not in
     * 'Solid' color mode.
     *
     * This handler computes the current level of the Slider
     * and then re-call the setLedMode with interval updated.
     *
     * @constructor
     */
    function IntervalChange() {
      var int = ledSlider.interval.getValue();

      var led = vm.selectedLed;
      if(led.mode === LedModes.None) {
        return;
      }

      logger.debug('[ctrl-test] Interval changed > ' + int);

      if(mThreadUpdateInterval) {
        clearTimeout(mThreadUpdateInterval);
      }

      mThreadUpdateInterval = setTimeout(setLedInterval.bind(null, led, led.mode, int), 100);
    }

    function setLedInterval(led, mode, interval) {
      if(mode === LedModes.Blink) {
        led.blinkInterval = interval;
      } else if(mode === LedModes.Chase) {
        led.chaseInterval = interval;
      } else if(mode === LedModes.Dim) {
        led.dimInterval = interval;
      }

      setLedMode(led, mode, interval);

    }

    /**
     * Handler for R, G, B Slider.
     *
     * The values are applied for current selected LED
     *
     * @constructor
     */
    function RGBChange() {

      var r = ledSlider.r.getValue(),
        g = ledSlider.g.getValue(),
        b = ledSlider.b.getValue();

      $('#RGB').css('background', 'rgb('+ r+','+ g+','+ b+')');

      setLEDColor(vm.selectedLed, r, g, b);

    }

    var mTaskSendLedColor = 0;

    function setLEDColor(led, r, g, b) {
      if(mTaskSendLedColor) {
        clearTimeout(mTaskSendLedColor);
      }

      mTaskSendLedColor = setTimeout(internal_setLedColor.bind(this, led, r, g, b), 500);
    }

    function internal_setLedColor(led, r, g, b) {

      mTaskSendLedColor = 0;
      var target = led.target;
      var ledId = led.id;
      devComm.sendSetLEDColor(target, ledId, r, g, b);

    }

    function setLedMode(led, mode, interval) {

      logger.debug('[ctrl-test] Set LED mode. Led: ' + led.id +'. M['+mode+']');

      led.mode = mode;

      var extParams = {};
      if(mode !== LedModes.None) {
        extParams.interval = interval ? interval : getLedInterval(led, mode);
      }

      devComm.sendSetLEDMode(led.target, led.id, mode, extParams);

    }

    function getLedInterval(led, mode) {

      var defInterval = 1000;
      var interval = 10000;

      if(mode === LedModes.Blink) {
        if(!led.blinkInterval) {
          led.blinkInterval = defInterval;
        }
        interval = led.blinkInterval;
      } else if(mode === LedModes.Chase) {
        if(!led.chaseInterval) {
          led.chaseInterval = defInterval;
        }
        interval = led.chaseInterval;
      } else if(mode === LedModes.Dim) {
        if(!led.dimInterval) {
          led.dimInterval = 100;
        }
        interval = led.dimInterval;
      }

      return interval;
    }

    /* On Resume */
    function onResume() {
      devComm.sendStatusReportReq(SelectedGW);
    }

    /* On Language changed. */
    function onLanguageChanged() { }

    function onDevStatusChanged(devices) {

      var DeviceType = mConst.DeviceType;

      for(var i = 0; i < devices.length; i++) {
        var dev = devices[i];

        if(dev.devType === DeviceType.Switch) {
          updateSwitch(dev);
        } else if(dev.devType === DeviceType.Led) {
          updateLed(dev);
        } else {
          logger.warn('[test-ctrl] Receive device status change with invalid devType: '+ dev.devType);
        }
      }

      if(!mConnectedToDev) {
        notifier.notify('Devices connected.');
      }
      mConnectedToDev = true;
    }

    function updateLed(ledInfo) {

      var uiLed = (ledInfo.id === vm.selectedLed.id) ? vm.selectedLed : null;
      if(!uiLed) {
        return;
      }

      vm.safeApply(function() {
        uiLed.r = ledInfo.r;
        uiLed.g = ledInfo.g;
        uiLed.b = ledInfo.b;
        uiLed.mode = ledInfo.mode;
        uiLed.plans = ledInfo.plans;
      });

      uiLed.blinkInterval = ledInfo.blinkInterval;
      uiLed.chaseInterval = ledInfo.chaseInterval;
      uiLed.dimInterval = ledInfo.dimInterval;

      ledSlider.r.setValue(ledInfo.r);
      ledSlider.g.setValue(ledInfo.g);
      ledSlider.b.setValue(ledInfo.b);

      var interval = getLedInterval(uiLed, uiLed.mode);
      ledSlider.interval.setValue(interval);

      $('#RGB').css('background', 'rgb('+ ledInfo.r+','+ ledInfo.g+','+ ledInfo.b+')');

    }

    function updateSwitch(swInfo) {

      var uiSW = findSwitchById(swInfo.id);
      if(!uiSW) {
        return;
      }

      vm.safeApply(function() {
        uiSW.status = swInfo.status;
        uiSW.plans = swInfo.plans;
      });

      var btnToggleOnOffId = '#btnToggleOnOff-' + swInfo.id;
      var val = (swInfo.status === SwitchStatus.On) ? 'on' : 'off';

      $(btnToggleOnOffId).bootstrapToggle(val);

    }

    function findSwitchById(switchId) {
      var nbSwitch = vm.switches.length;
      for(var i = 0; i < nbSwitch; i++) {
        var sw = vm.switches[i];
        if(sw.id === switchId) {
          break;
        }
      }

      return (i < nbSwitch) ? vm.switches[i] : null;
    }

    // target, switchId, status
    function sendSwitchCommand(light, command) {
      var target = light.target,
        id = light.id;
      logger.info(`[${target}] turn ${id} ${command}`);

      switch(command) {
        case SwitchCommand.TurnOn:
        case SwitchCommand.TurnOff:

          //light.isProcessing = true;

          if(command === SwitchCommand.TurnOn) {
            devComm.turnOn(target, id);
          } else {
            devComm.turnOff(target, id);
          }

          notifier.notify('The command '+ command +' is sent to ' + light.display);
          //enableLightButton(light);

          break;
        default:
          break;
      }
    }

    function removeSchedule(dev, planId) {
      if(!planId) {
        notifier.error('Failed. Sorry!.');
        return;
      }

      function OnConfirmFn(rs) {
        if(!rs) {
          return;
        }

        logger.debug('[ctrl-test] remove schedule. ScheduleId=' + planId +'. SwitchId: ' + dev.id);

        notifier.notify('The command is sent!');
        devComm.removeSchedule(dev.target, dev.id, planId);
      }

      OnConfirmFn.call(null, true);
      //notifier.confirm(
      //  'Are you sure you want to remove this schedule?',
      //  OnConfirmFn, 'Confirmation!', ['OK', 'No, cancel!']);

    }

  }
})();
