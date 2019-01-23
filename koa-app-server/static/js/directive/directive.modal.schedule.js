(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
  .directive('swSchedule', DirectiveImpl);

  DirectiveImpl.$inject = [ ];
  function DirectiveImpl() {

    return {
      restrict: 'AE',

      scope: {
        switchId: '@'
      },

      compile: function(tElem, tAttrs) {
        return {
          pre: function(scope, iElem, iAttrs) {
          },
          post: function(scope, iElem, iAttrs) {
            scope.$watch('switchId', function(newValue, oldValue) {
              scope._switchId = newValue;
              scope.onSwitchSelected(newValue);
            });
          }
        };
      },
      templateUrl: './html/partial/sw-schedule.html',
      controller: DirectiveCtrl,
    };
  }

  DirectiveCtrl.$inject = [ '$scope', 'DevComm', 'AppCsf' ];

  function DirectiveCtrl($scope, devComm, AppCsf) {

    var vm = $scope;
    var mConst = AppCsf.appConst;
    var logger = AppCsf.logger;
    var notifier = AppCsf.notifier;

    var SwitchCommand = mConst.SwitchCommands;
    var SwitchStatus = mConst.SwitchStatus;

    /* Scope variables */

    vm.SwitchCommand = SwitchCommand;
    vm.SwitchStatus = SwitchStatus;

    vm.switches = devComm.getAllPreDefinedSwitches();
    vm.selectSw = null;

    vm.initialize = initialize;
    vm.destroy = destroy;
    vm.setSchedule = setSchedule;

    /* A switch is selected for making plan / schedule */
    vm.onSwitchSelected = onSwitchSelected;

    initialize();

    function destroy() {
      devComm.removeDevChangedListener(onDevStatusChanged);
    }

    /* Initialization */
    function initialize() {
      devComm.addDevChangedListener(onDevStatusChanged);

      $('#datetimepicker4').datetimepicker({
        ignoreReadonly: true
      });

      $("#datetimepicker4").on("dp.change", function (e) {

        var d = e.date._d;
        vm.sDateTime = d;
        safeApply();
      });

    }

    function onDevStatusChanged(dev) {
      safeApply();
    }

    function safeApply() {
      if (!vm.$$phase && !vm.$root.$$phase) {
        vm.$apply();
      }
    }

    function onSwitchSelected(swId) {
      var found = null;
      for(var i = 0; i < vm.switches.length; i++) {
        if(vm.switches[i].id === swId) {
          found = vm.switches[i];
          break;
        }
      }
      vm.selectSw = found;
    }

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
