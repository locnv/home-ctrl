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
  .controller(_global.Controllers.Home, ControlerImpl);

  ControlerImpl.$inject = ['$scope', '$controller', 'DIC', 'AppCsf'];

  function ControlerImpl($scope, $controller, dic, AppCsf) {
    var mConst = AppCsf.appConst;
    var log = AppCsf.logger;
    var util = AppCsf.util;
    var fileStorage = AppCsf.fileStorage;
    var i18n = AppCsf.i18n;
    var http = AppCsf.http;
    var CtrlName = _global.Controllers.Home;

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Home';
    $scope.allTopics = [];

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: $scope });

    /**
     * Entering
     *
     * @returns {Promise.<boolean>}
     */
    function onEntering() {
      initialize();

      return Promise.resolve(true);
    }

    function onLeaving() {

      return Promise.resolve(true);
    }

    function onResume() {

    }

    /**
     * Page initialization
     */
    function initialize() {
      http.getAllTopics()
      .then(function(resp) {
        if(!resp || !resp.data) return;

        var respData = resp.data;
        if(Array.isArray(respData) && respData.length > 0) {
          $scope.allTopics = angular.copy(respData);
          $scope.$digest();
        }
      });
    }

    function onLanguageChanged() {
      //btnFooterLeft.caption = getBtnStartStopText();
      //btnFooterRight.caption = i18n.translate('static.FILTER');
    }

  }

})();
