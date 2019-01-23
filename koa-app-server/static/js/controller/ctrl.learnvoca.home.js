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
    var CtrlName = _global.Controllers.Home;

    var ModalAddCardId = '#modelAddCard';

    /* Scope variables */
    $scope.CtrlName = CtrlName;
    $scope.PageTitle = 'Home';
    $scope.cards = [];
    $scope.formCreateCard = {
      show: false,
      model: {
        name: 'untitled',
        description: '',
      }
    };

    $scope.onEntering = onEntering;
    $scope.onLeaving = onLeaving;
    $scope.onResume = onResume;
    $scope.onLanguageChanged = onLanguageChanged;
    $scope.toggleFormCreateCard = toggleFormCreateCard;

    // Test
    //setTimeout(testSendRequest, 500);
    //setTimeout(testSendRequest2, 500);
    function testSendRequest() {
      AppCsf.http.getAllCards()
      .then(function(resp) {
        log.info('getAllCards response > ' + JSON.stringify(resp));
      });
      AppCsf.http.getAllWords()
      .then(function(resp) {
        log.info('getAllWords response > ' + JSON.stringify(resp));
      });
    }
    function testSendRequest1() {
      AppCsf.http.addNewCards('Eugene', 'A special card!')
      .then(function(resp) {
        log.info('addNewCards response > ' + JSON.stringify(resp));
      });
    }
    function testSendRequest2() {
      AppCsf.http.addNewWord('Eugene', 'Eugene J Rautenbach!')
      .then(function(resp) {
        log.info('addNewCWord response > ' + JSON.stringify(resp));
      });
    }

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
      $scope.cards = dic.getAllCards();
    }

    /* global Base */
    /* global console */
    function test() {
      var Animal = Base.extend({
        constructor: function(name) {
          this.name = name;
        },

        name: "",

        eat: function() {
          this.say("Yum!");
        },

        say: function(message) {
          console.log(this.name + ": " + message);
        }
      });

      var Cat = Animal.extend({
        eat: function(food) {
          if (food instanceof Mouse) {
            this.base();
          } else {
            this.say("Yuk! I only eat mice.");
          }
        }
      });

      var Mouse = Animal.extend();

      var jerry = new Mouse('Jerry');
      var tom = new Cat('Tom');

      jerry.say('Meo');
      tom.say('Wow');

      var eugene = {
        name: 'Eugene',
        age: 60,
      };
      tom.eat(jerry);
      tom.eat(eugene);
    }

    function onLanguageChanged() {
      //btnFooterLeft.caption = getBtnStartStopText();
      //btnFooterRight.caption = i18n.translate('static.FILTER');
    }

    function toggleFormCreateCard() {
      $scope.formCreateCard.show = !$scope.formCreateCard.show;
      $(ModalAddCardId).modal({});
    }
  }
})();