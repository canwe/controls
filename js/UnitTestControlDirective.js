(function (app) {
    'use strict';

    app.directive("UnitTestControl", function (Form) {

        return {
            restrict: "M",
            replace: true,
            scope: {
            },
            controller: function ($scope) {
                $scope.$root.$on('highlight', function (args, params) {
                    $scope.highlight = _.contains(params.names, $scope.control.name);
                });
            },
            templateUrl: "partials/UnitTestControl.html",
            link: function (scope, element, attr) {
                scope.control = Form.controls.get(attr.UnitTestControl);
            }
        };
    });

}(ITForms.Angular));
