(function (app) {
    'use strict';

    app.directive("CheckboxControl", function (Form) {

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
            templateUrl: "partials/CheckboxControl.html",
            link: function (scope, element, attr) {

                scope.control = Form.controls.get(attr.CheckboxControl);
            }
        };
    });

}(ITForms.Angular));
