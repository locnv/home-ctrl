(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
    .directive('toJson', SimpleJsonFormatDirective);

  SimpleJsonFormatDirective.$inject = [ 'LogService', 'RecursionHelper' ];
  function SimpleJsonFormatDirective(LogService, RecursionHelper) {

    let log = LogService;

    return {
      restrict: 'AE',

      scope: {
        jsonObject: '='
      },

      compile: function(tElem) {
        return RecursionHelper.compile(tElem, function (scope, iElement, iAttrs, controller, transcludeFn, physicalConfigController) {

        });
      },

      template: '{<br>' +
        '<ul class="btx-jsonobj">' +
          '<li ng-repeat="(key, value) in jsonObject track by $index">' +
            '<span ng-if="!isObject(value)"><b>{{key}}:</b> {{value}}</span>'+
            '<span ng-if="isObject(value)"><b>{{key}}:</b> <to-json json-object="value"></to-json></span>'+
        '</ul>' +
      '}',

      controller: SimpleJsonFormatCtrl,
    };
  }

  function SimpleJsonFormatCtrl($scope, $element, $attrs) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

    /* Scope functions */
    $scope.tempPause = tempPause;
    $scope.isObject = function(thing) {
      return (typeof thing === 'object');
    };

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() {
      //console.log('SimpleJsonFormat>Initialize.');
    }

    function tempPause() {
      //console.log('>Temporary stop here>' +JSON.stringify($scope.jsonObject));
    }

  }

})();
