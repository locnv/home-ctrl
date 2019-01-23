//@LOCN
/* global angular */
/* global _global */
/* global Promise */
/* global LoadingCtrl */
(function() {
  'use strict';

  angular
    .module(_global.AppName)
    .controller(_global.Controllers.Test, ControllerImpl);

  ControllerImpl.$inject = [ '$scope', '$controller', 'AppCsf' ];
  function ControllerImpl($scope, $controller, AppCsf) {

    /* Scope variables */
    var fileStorage = AppCsf.fileStorage;
    var util = AppCsf.util;
    var notifier = AppCsf.notifier;
    var mConst = AppCsf.appConst;
    var CtrlName = _global.Controllers.Test;

    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Test';
    $scope.I18nRes = [];
    $scope.Eugene = {
      name: 'Eugene',
      age: 60,
    };
    var btnFooterLeft = {
      caption: AppCsf.i18n.translate('static.BACK'),
      active: true,
      enabled: true,
      onClickedHandle: AppCsf.navigator.gotoPreviousPage,
      context: $scope,
    };

    $scope.lastRead = null;

    /* Scope functions */
    $scope.onLeaving = onLeaving;
    $scope.onEntering = onEntering;

    $scope.deleteFile = deleteFile;
    $scope.readFromFile = readFromFile;

    $scope.showNotification = showNotification;
    $scope.setLang = setLang;
    $scope.onLanguageChanged = onLanguageChanged;

    $scope.isBrowser = false;

    /* Var internal variables */
    var log = AppCsf.logger;

    /* Extend from base controller */
    $controller('BaseCtrl', { $scope: $scope });


    /* Implementation - Public */

    //////////////////////////////////////////////////////
    ////// ++ Test File Storage api
    //////////////////////////////////////////////////////


    //////////////////////////////////////////////////////
    ////// -- Test File Storage api
    //////////////////////////////////////////////////////


    /* Implementation - Local */
    function initialize() {
      $scope.isBrowser = true; //util.isBrowser();
      loadAllAppFiles();

      var div = document.getElementById('cc.base1');
      var ccBase = new LoadingCtrl(div);
      ccBase.initialize();
      ccBase.invalid();

      var divPartical = document.getElementById('cc.base2');
      var ccPartical = new ParticalCtrl(divPartical);
      ccPartical.initialize();
      ccPartical.invalid();

      var I18nRes = {
        "HELLO": 'HELLO',
        "template.WELCOME": {
          Key: 'template.WELCOME',
          Params: { name: $scope.Eugene.name },
        },
      };

      $scope.I18nRes = Object.keys(I18nRes).map(function(key) {
        return I18nRes[key];
      });

      testOOP();
    }

    function testOOP() {
      function Person(name) {
        this.name = name;
      }

      Person.prototype.getName = function() {
        return this.name;
      };

      function User(name, pwd) {
        //this.name = name;
        this.uber('constructor', name);
        this.pwd = pwd;
      }

      User.inherits(Person);

      User.prototype.getPwd = function() {
        return this.pwd;
      };

      User.prototype.getName = function() {
        return 'Username is ' + this.uber('getName');
      };


      var locnv = new Person('LocN');
      console.log(locnv.getName());

      var eugene = new User('Eugene', 'secret');
      console.log(eugene.getName());
    }

    function setLang(langKey) {
      AppCsf.i18n.setLanguage(langKey);
    }

    function onLanguageChanged() {
      var i18n = AppCsf.i18n;
      var key = 'template.WELCOME';
      $scope.instantMessages[key] = i18n.translate(key, { name: $scope.Eugene.name });
      notifier.notify($scope.instantMessages['template.WELCOME']);
    }

    function loadAllAppFiles() {
      fileStorage.getAllFiles()
        .then(function(files) {
          $scope.safeApply(function() {
            $scope.files = files;
          });
        })
        .catch(function(err) {
          log.error(CtrlName, 'Fail to get all app files', err);
        });
    }

    function onLeaving() {
      var promise = new Promise(function(resolve, reject) {
        doDestroy(resolve);
      });

      return promise;
    }

    function onEntering() {
      $scope.setFooterButton(btnFooterLeft, mConst.Footer.Left);

      initialize();
    }

    function showNotification() {
      AppCsf.notifier.notify('This is a notification!');
    }

    function deleteFile(fileName) {
      notifier.confirm('Do you want to delete file ' + fileName + '?', function(resp) {
        if(resp === 1) { /* 1: Yes; 2: Cancel */
          log.debug('Delete file confirmation: ' + resp);
          inlineDeleteFile(fileName);
        } else {
          log.debug('Canceled delete file');
        }
      }, 'Delete file!', ['Yes', 'Cancel']);

      function inlineDeleteFile(name) {
        fileStorage.deleteFile(name)
          .then(function(wasDeleted) {
            notifier.notify('Deleted file ' + name);
            log.info(CtrlName + ' deleted file ' + name);
            loadAllAppFiles();
          })
          .catch(function(err) {
            notifier.error('Fail to delete ' + name +'. See log for detail!');
            log.error(CtrlName + ' - Failed to delete ' + name +'. Error: ' +JSON.stringify(err));
          });
      }
    }

    function readFromFile(fileName) {
      log.debug('Going to read from ' + fileName);
      fileStorage.readFromFile(fileName)
      .then(function(objData) {
        $scope.safeApply(function() {
          $scope.lastRead = objData;
        });
      })
      .catch(function(err) {
        notifier.error('Fail to read ' + name +'. See log for detail!');
        log.error(CtrlName + ' - Failed to read ' + name +'. Error: ' +JSON.stringify(err));
      });

    }


    var waitCounter = 5;
    function doDestroy(onFinish) {
      if(waitCounter <= 0) {
        if(onFinish && typeof onFinish === 'function') {
          onFinish();
        }
        return;
      }

      waitCounter--;

      setTimeout(function() {
        doDestroy(onFinish);
      }, 100);
    }
  }
})();