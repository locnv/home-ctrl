/**
 * Created by locnv on 1/21/18.
 *
 */

/* global angular */
/* global bluetoothle */
/* global _global */
/* global Promise */
/* global $ */
/* global LoadingCtrl */
(function() {
  'use strict';

  angular
  .module(_global.AppName)
  .controller(_global.Controllers.VoiceCtrl, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'AppCsf', 'DevComm' ];

  function ControlerImpl(vm, $controller, AppCsf, devComm) {

    var mConst = AppCsf.appConst;
    var logger = AppCsf.logger;
    var notifier = AppCsf.notifier;
    var speech = AppCsf.speech;

    var CtrlName = _global.Controllers.VoiceCtrl;
    var SelectedGW = AppCsf.appConst.GW;

    var SwitchCommand = mConst.SwitchCommands;
    var SwitchStatus = mConst.SwitchStatus;

    var allSwitches = devComm.getAllPreDefinedSwitches();

    var light = allSwitches[0];
    var fan = allSwitches[1];

    var allSpeech = [];
    var mPostSpeechTimer = null;

    /* Flag indicates if devices connected */
    var mConnectedToDev = false;

    /* Scope variables */
    vm.CtrlName = CtrlName;
    vm.PageTitle = 'Voice Control!';

    vm.switches = allSwitches;
    vm.voiceCtrl = {
      enable: false,
    };
    vm.hasMicAccessMic = true;

    vm.onEntering = onEntering;
    vm.onLeaving = onLeaving;
    vm.onResume = onResume;
    vm.onLanguageChanged = onLanguageChanged;

    vm.toggleVoiceCtrl = toggleVoiceCtrl;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: vm });

    /**
     * Entering
     *
     * @returns {Promise<boolean>}
     */
    function onEntering() {
      requestDevStatus();

      devComm.addDevChangedListener(onDevStatusChanged);
      speech.addSpeechRecognized(onSpeechResult);

      vm.voiceCtrl.enable = true;

      testAudioPermission()
      .then(function(ok) {
        vm.hasMicAccessMic = ok;

        if(ok) {
          speech.setEnable(true);
        }

        var msg = 'Has audio permission > ' + ok;
        devComm.sendTextMessage(msg);
        logger.info(msg);

        /*if(!ok) {
          navigator.permissions.query({name: 'microphone'})
          .then((permissionObj) => {
            console.log(permissionObj.state);
          })
          .catch((error) => {
            console.log('Got error :', error);
          })
        }*/
      });

      var promise = new Promise(function(resolve) {
        waitForContactingDevices(resolve);
      });

      return promise;
    }

    function testAudioPermission() {

      if(!navigator || !navigator.mediaDevices) {
        return Promise.resolve(true);
      }

      var promise = new Promise(function(resolve) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          resolve(true);
        })
        .catch(resolve.bind(null, false));

        // navigator.permissions.query({name: 'microphone'})
        // .then((permissionObj) => {
        //   console.log('    ====  audio permission state > ' +permissionObj.state);
        //   resolve(false);
        // })
        // .catch(resolve.bind(null, false));
      });

      return promise;
    }

    //region
    // Test
    //

    var errorElement = document.querySelector('#errorMsg');

    function testCamera() {
      // Put variables in global scope to make them available to the browser console.
      var video = document.querySelector('video');
      var constraints = window.constraints = {
        audio: false,
        video: true
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          var videoTracks = stream.getVideoTracks();
          console.log('Got stream with constraints:', constraints);
          console.log('Using video device: ' + videoTracks[0].label);
          stream.onremovetrack = function() {
            console.log('Stream ended');
          };
          window.stream = stream; // make variable available to browser console
          video.srcObject = stream;
        })
        .catch(function(error) {
          if (error.name === 'ConstraintNotSatisfiedError') {
            errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
              constraints.video.width.exact + ' px is not supported by your device.');
          } else if (error.name === 'PermissionDeniedError') {
            errorMsg('Permissions have not been granted to use your camera and ' +
              'microphone, you need to allow the page access to your devices in ' +
              'order for the demo to work.');
          }
          errorMsg('getUserMedia error: ' + error.name, error);
        });
    }

    function errorMsg(msg, error) {
      errorElement.innerHTML += '<p>' + msg + '</p>';
      if (typeof error !== 'undefined') {
        console.error(error);
      }
    }

    //
    // End test
    //endregion


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

    function onLeaving() {

      devComm.removeDevChangedListener(onDevStatusChanged);
      speech.removeSpeechRecognized(onSpeechResult);

      vm.voiceCtrl.enable = false;
      speech.setEnable(false);

      return Promise.resolve(true);
    }

    function toggleVoiceCtrl() {
      var enable = !vm.voiceCtrl.enable;
      vm.voiceCtrl.enable = enable;

      speech.setEnable(enable);
    }

    function onSpeechResult(rs) {
      if(!rs || rs.length <= 0) {
        return;
      }

      allSpeech.push(rs);
      schedulePostSpeech();
      logger.info(rs.trim());

      var command = getCommand(rs);
      if(command === null) {
        return;
      }

      logger.info(command);

      sendSwitchCommand(command.target, command.cmd);

    }

    function schedulePostSpeech() {

      if(mPostSpeechTimer !== null) {
        clearTimeout(mPostSpeechTimer);
        mPostSpeechTimer = null;
      }

      if(allSpeech.length >= 10) {
        doPostSpeech();
        return;
      }

      mPostSpeechTimer = setTimeout(doPostSpeech, 10000);
    }

    function doPostSpeech() {

      if(allSpeech.length === 0) {
        mPostSpeechTimer = null;
        return;
      }

      allSpeech.push(getUserAgent());
      var msg = allSpeech.join('\n');
      //logger.info('Going to post speech > ' + msg);
      devComm.sendTextMessage(msg);


      allSpeech = [];
      mPostSpeechTimer = null;
    }

    function getUserAgent() {
      if(navigator) {
        return navigator.userAgent;
      }
      return '';
    }

    // target, switchId, status
    function sendSwitchCommand(light, command) {
      var target = SelectedGW,
        id = light.id;

      logger.info(`[${target}] turn ${id} ${command}`);

      switch(command) {
        case SwitchCommand.TurnOn:
        case SwitchCommand.TurnOff:

          if(command === SwitchCommand.TurnOn) {
            devComm.turnOn(target, id);
          } else {
            devComm.turnOff(target, id);
          }

          notifier.notify('The command '+ command +' is sent to ' + light.display);

          break;
        default:
          break;
      }
    }

    function onDevStatusChanged(devices) {

      var DeviceType = mConst.DeviceType;

      for(var i = 0; i < devices.length; i++) {
        var dev = devices[i];

        if(dev.devType === DeviceType.Switch) {
          updateSwitch(dev);
        }
        //else if(dev.devType === DeviceType.Led) {
        //  updateLed(dev);
        //} else {
        //  logger.warn('[test-ctrl] Receive device status change with invalid devType: '+ dev.devType);
        //}
      }

      if(!mConnectedToDev) {
        notifier.notify('Devices connected.');
      }
      mConnectedToDev = true;
    }

    function updateSwitch(swInfo) {

      var uiSW = findSwitchById(swInfo.id);
      if(!uiSW) {
        return;
      }

      vm.safeApply(function() {
        uiSW.status = swInfo.status;
      });

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

    /* On Resume */
    function onResume() { }

    /* On Language changed. */
    function onLanguageChanged() { }

    var CmdTurnOnTheLight = 'turnonthelight';
    var CmdTurnOffTheLight = 'turnoffthelight';
    var CmdTurnOnTheFan = 'turnonthefan';
    var CmdTurnOffTheFan = 'turnoffthefan';

    var CmdTurnTheLightOn = 'turnthelighton';
    var CmdTurnTheLightOff = 'turnthelightoff';
    var CmdTurnTheFanOn = 'turnthefanon';
    var CmdTurnTheFanOff = 'turnthefanoff';

    function getCommand(text) {
      var cmd = null;
      var target = null;

      var nText = text.replace(/\s/g, '');

      if(nText.indexOf(CmdTurnOnTheLight) !== -1 || nText.indexOf(CmdTurnTheLightOn) !== -1) {
        cmd = SwitchCommand.TurnOn;
        target = light;
      } else if(nText.indexOf(CmdTurnOffTheLight) !== -1 || nText.indexOf(CmdTurnTheLightOff) !== -1) {
        cmd = SwitchCommand.TurnOff;
        target = light;
      } else if(nText.indexOf(CmdTurnOnTheFan) !== -1 || nText.indexOf(CmdTurnTheFanOn) !== -1) {
        cmd = SwitchCommand.TurnOn;
        target = fan;
      } else if(nText.indexOf(CmdTurnOffTheFan) !== -1 || nText.indexOf(CmdTurnTheFanOff) !== -1) {
        cmd = SwitchCommand.TurnOff;
        target = fan;
      } else {
        logger.info(text);
        notifier.error('Not recognize command. Please try again!')
      }

      /*switch(nText) {
        case 'turnonthelight':
          cmd = SwitchCommand.TurnOn;
          target = light;
          break;
        case 'turnoffthelight':
          cmd = SwitchCommand.TurnOff;
          target = light;
          break;

        case 'turnonthefan':
          cmd = SwitchCommand.TurnOn;
          target = fan;
          break;
        case 'turnoffthefan':
          cmd = SwitchCommand.TurnOff;
          target = fan;
          break;

        default:
          break;
      }*/

      if(!cmd || !target) {
        return null;
      }

      return {
        cmd: cmd,
        target: target
      }
    }

  }
})();
