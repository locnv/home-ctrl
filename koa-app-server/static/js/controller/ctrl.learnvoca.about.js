/**
 * Created by locnv on 1/21/18.
 *
 */

/* global angular */
/* global bluetoothle */
/* global _global */
/* global Promise */
(function() {
  'use strict';

  angular
    .module(_global.AppName)
    .controller(_global.Controllers.About, ControllerImpl);

  ControllerImpl.$inject = [ '$scope', '$controller', 'AppCsf' ];

  function ControllerImpl($scope, $controller, AppCsf) {

    /* Global variables */

    var mConst = AppCsf.appConst;

    /* Local variables */

    var CtrlName = _global.Controllers.Home;
    var btnFooterLeft = {
      caption: 'Back',
      active: true,
      enabled: true,
      onClickedHandle: onBtnBackClicked,
      context: $scope,
    };

    /* Scope variables */

    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'About';

    /* Scope functions */

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: $scope });


    /* Implementation */

    function onEntering() {
      $scope.setFooterButton(btnFooterLeft, mConst.Footer.Left);

      return Promise.resolve(true);
    }

    function onLeaving() {
      return Promise.resolve(true);
    }

    function onResume() { }

    /**
     * Navigate to previous page.
     */
    function onBtnBackClicked() {
      btnFooterLeft.enabled = false;
      AppCsf.navigator.gotoPreviousPage();
    }

  }
})();