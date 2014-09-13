(function (app) {
    'use strict';

    app.directive("checkboxControl", function (Form, $compile) {

        return {
            templateUrl: "partials/CheckboxControl.html",
            restrict: "E",
            replace: true,
            terminal: true,
            priority: 1000,
            scope: {
                control: '='
            },
            link: function(scope, element) {

                element.addClass('xcontrol');
                element.attr('ng-show', 'control.display');
                element.attr('ng-disabled', 'control.enabled');
                element.attr('ng-class', '{ highlightedcontrol:highlight }');
                $compile(element)( scope );
                
                $scope.$root.$on('highlight', function (args, params) {
                    $scope.highlight = _.contains(params.names, $scope.control.name);
                });
            }
        };
    });

}(ITForms.Angular));
