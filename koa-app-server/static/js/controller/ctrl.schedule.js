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
  .filter('delayToTime', DelayToTime)
  .controller(_global.Controllers.Schedule, ControlerImpl);

  function DelayToTime($filter) {
    return function(delay) {

      var n = new Date().getTime();

      return $filter('date')(n+ delay*60*1000, 'short');

    }
  }

  ControlerImpl.$inject = ['$scope', '$controller', 'AppCsf', 'DevComm' ];

  function ControlerImpl(vm, $controller, AppCsf, devComm) {

    var mConst = AppCsf.appConst;
    var logger = AppCsf.logger;
    //var util = AppCsf.util;
    var notifier = AppCsf.notifier;
    var CtrlName = _global.Controllers.Schedule;
    var SelectedGW = AppCsf.appConst.GW;

    var SwitchCommand = mConst.SwitchCommands;
    var SwitchStatus = mConst.SwitchStatus;

    /* Scope variables */
    vm.CtrlName = CtrlName;
    vm.PageTitle = 'Schedule!';

    vm.SwitchCommand = SwitchCommand;
    vm.SwitchStatus = SwitchStatus;

    vm.switches = devComm.getAllPreDefinedSwitches();
    vm.leds = devComm.getAllPreDefinedLEDs();

    vm.selectSw = null;

    //vm.fanPlans = [];

    vm.onEntering = onEntering;
    vm.onLeaving = onLeaving;
    vm.onResume = onResume;
    vm.onLanguageChanged = onLanguageChanged;

    vm.setSchedule = setSchedule;
    vm.applyFanPlans = applyFanPlans;
    vm.removeFanPlansFromConfig = removeFanPlansFromConfig;

    /* A switch is selected for making plan / schedule */
    vm.onSwitchSelected = onSwitchSelected;



    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: vm });

    /**
     * Entering
     *
     * @returns {Promise<boolean>}
     */
    function onEntering() {
      initialize();

      return Promise.resolve(true);
    }

    function onLeaving() {

      devComm.removeDevChangedListener(onDevStatusChanged);

      return Promise.resolve(true);
    }

    /* Initialization */
    function initialize() {
      devComm.addDevChangedListener(onDevStatusChanged);
      //initBaseFanPlans();

      $('#datetimepicker4').datetimepicker({
        ignoreReadonly: true
      });

      $("#datetimepicker4").on("dp.change", function (e) {

        var d = e.date._d;
        vm.safeApply(function() {
          vm.sDateTime = d;
        });

      });

    }

    function onDevStatusChanged(dev) {
      vm.safeApply();
    }

    /*function initBaseFanPlans() {
      var n = new Date();

      var baseDate = n.getDate(),
        baseMonth = n.getMonth(),
        baseYear = n.getFullYear();
      var from = new Date(baseYear, baseMonth, baseDate, 0, 0, 0);
      var baseTime = from.getTime() + 21*60*60*1000;

      var d = 60*60*1000,
      cmd = SwitchCommand.TurnOff;
      var nbPlans = 5;

      for(var i = 0; i < nbPlans; i++) {
        var p = {
          cmd: cmd,
          time: new Date(baseTime+d)
        };
        vm.fanPlans.push(p);

        baseTime += d;
        cmd = (cmd === SwitchCommand.TurnOff) ? SwitchCommand.TurnOn : SwitchCommand.TurnOff;
      }

    }*/

    function applyFanPlans() {
      internal_setFanPlans(0);
    }

    function internal_setFanPlans(pIdx) {
      if(pIdx >= vm.fanPlans.length) {
        logger.info('[ctrl-schedule] Set fan plans done.');
        return;
      }

      var n = new Date();
      var sw = vm.switches[1];
      var p = vm.fanPlans[pIdx];
      var cmd = p.cmd;
      //var delayInMs = p.time.getTime() - n.getTime();

      setSchedule(sw, cmd, p.time);

      setTimeout(internal_setFanPlans.bind(null, pIdx + 1), 100);

    }

    function removeFanPlansFromConfig(p) {
      var idx = vm.fanPlans.indexOf(p);
      if(idx !== -1) {
        vm.fanPlans.splice(idx, 1);
      }
    }

    function onSwitchSelected(sw) {
      vm.selectSw = sw;
    }

    /* On Resume */
    function onResume() { }

    /* On Language changed. */
    function onLanguageChanged() { }

    function setSchedule(sw, cmd, time) {
      if(!sw) {
        notifier.error('Please select a target.');
        return;
      }

      if(!cmd) {
        notifier.error('Please select a command.');
        return;
      }

      if(!time) {
        notifier.error('Please select a time (at least 1 minute from now).');
        return;
      }

      var n = new Date();
      var delay = time.getTime() - n.getTime();
      if(delay < 60*1000) {
        notifier.error('Please select a delay value (min = 1 minute)');
        return;
      }
      //target, switchId, command, delay
      notifier.notify('The command '+ cmd +' is sent to ' + sw.display + ' for schedule.');

      devComm.schedule(sw.target, sw.id, cmd, delay);

    }

  }
})();
