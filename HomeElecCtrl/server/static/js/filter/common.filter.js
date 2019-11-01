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
    .filter('StatusImage', StatusImage);

  function StatusImage(AppConstants) {

    return function(sw) {
      let SwitchStatus = AppConstants.SwitchStatus;
      let rs = sw.imageUrl.Unknown;

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

      let SwitchStatus = AppConstants.SwitchStatus;

      let rs = '?';

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

})();
