(function() {
  'use strict';

  /* global angular */
  /* global _global */
  angular.module(_global.AppName)
  .directive('modalShow', DirectiveImpl);

  DirectiveImpl.$inject = [ '$parse' ];
  function DirectiveImpl($parse) {

    return {
      restrict: "A",
      link: function (scope, element, attrs) {

        //Hide or show the modal
        scope.showModal = function (visible, elem) {
          if (!elem) {
            elem = element;
          }

          var modalParam = (visible ? 'show' : 'hide');
          $(elem).modal(modalParam);

        };

        //Watch for changes to the modal-visible attribute
        scope.$watch(attrs.modalShow, function (newValue, oldValue) {
          scope.showModal(newValue, attrs.$$element);
        });

        //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
        $(element).bind("hide.bs.modal", function () {

          $parse(attrs.modalShow).assign(scope, false);

          if (!scope.$$phase && !scope.$root.$$phase) {
            scope.$apply();
          }
        });
      },
      //templateUrl: './html/partial/add-card.html',
      controller: DirectiveCtrl,

    };
  }

  function DirectiveCtrl($scope) {

    /* Constants */

    /* Local variables */

    /* Scope variable */

    /* Scope functions */

    /* Entry */
    initialize();

    ///////////////////////////////
    //// Implementation
    ///////////////////////////////

    function initialize() { }

  }

})();
