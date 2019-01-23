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
    .controller(_global.Controllers.Setting, ControllerImpl);

  ControllerImpl.$inject = [ '$scope', '$controller', 'AppCsf' ];

  function ControllerImpl($scope, $controller, AppCsf) {

    /* Global variables */

    var mConst = AppCsf.appConst;
    var logger = AppCsf.logger;
    var i18n = AppCsf.i18n;

    /* Local variables */

    var CtrlName = _global.Controllers.Setting;
    var btnFooterLeft = {
      caption: i18n.translate('static.BACK'),
      active: true,
      enabled: true,
      onClickedHandle: onBtnBackClicked,
      context: $scope,
    };
    var mSaveConfigTimer = 0;

    /* Scope variables */

    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Setting';
    $scope.Languages = {};
    $scope.activeLanguage = {};

    var I18nRes = {
      ENGLISH: 'static.ENGLISH',
      FRENCH: 'static.FRENCH',
      VIETNAMESE: 'static.VIETNAMESE',
    };

    $scope.I18nRes = Object.keys(I18nRes).map(function(key) {
      return I18nRes[key];
    });

    /* Scope functions */

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onBtnLanguageClicked = onBtnLanguageClicked;
    $scope.onLanguageChanged = onLanguageChanged;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: $scope });


    /* Implementation */

    function onEntering() {
      $scope.setFooterButton(btnFooterLeft, mConst.Footer.Left);

      var currentLang = i18n.getCurrentLanguage();
      $scope.Languages = {
        English: {
          Flag: '../../img/flag/en_US.png',
          Display: i18n.translate(I18nRes.ENGLISH),
          Code: i18n.Languages.En,
          Active: (i18n.Languages.En === currentLang),
        },
        French: {
          Flag: '../../img/flag/fr_FR.png',
          Display: i18n.translate(I18nRes.FRENCH),
          Code: i18n.Languages.Fr,
          Active: (i18n.Languages.Fr === currentLang),
        },
        Vietnamese: {
          Flag: '../../img/flag/vn_VN.png',
          Display: i18n.translate(I18nRes.VIETNAMESE),
          Code: i18n.Languages.Vi,
          Active: (i18n.Languages.Vi === currentLang),
        }
      };

      if($scope.Languages.French.Active) {
        $scope.activeLanguage = $scope.Languages.French;
      } else if($scope.Languages.Vietnamese.Active) {
        $scope.activeLanguage = $scope.Languages.Vietnamese;
      } else {
        $scope.activeLanguage = $scope.Languages.English;
      }

      return Promise.resolve(true);
    }

    function onLeaving() {
      return Promise.resolve(true);
    }

    function onResume() { }

    function onBtnLanguageClicked(lang) {
      if(lang.Code === $scope.activeLanguage.Code) {
        return;
      }

      for (var key in $scope.Languages) {
        if(!$scope.Languages.hasOwnProperty(key)) {
          continue;
        }

        var l = $scope.Languages[key];
        l.Active = (l.Code === lang.Code);
      }

      $scope.activeLanguage = lang;
      i18n.setLanguage(lang.Code);
      scheduleSaveConfig(lang.Code);
    }

    function scheduleSaveConfig(langCode) {
      if(mSaveConfigTimer !== 0) {
        clearTimeout(mSaveConfigTimer);
      }

      var config = AppCsf.config;
      mSaveConfigTimer = setTimeout(function() {
        config.setConfig(config.Constants.Language, langCode);
        mSaveConfigTimer = 0;
      }, 1000);
    }

    function onLanguageChanged() {
      $scope.Languages.English.Display = i18n.translate(I18nRes.ENGLISH);
      $scope.Languages.French.Display = i18n.translate(I18nRes.FRENCH);
      $scope.Languages.Vietnamese.Display = i18n.translate(I18nRes.VIETNAMESE);
      btnFooterLeft.caption = i18n.translate('static.BACK');
    }

    /**
     * Navigate to previous page.
     */
    function onBtnBackClicked() {
      btnFooterLeft.enabled = false;
      AppCsf.navigator.gotoPreviousPage();
    }

  }
})();