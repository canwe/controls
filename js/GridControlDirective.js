(function (app) {
    'use strict';

    app.directive('GridControl', function (Form, $sce) {

        return {
            restrict: 'M',
            replace: true,
            scope: {},
            templateUrl: "partials/GridControl.html",
            controller: function ($scope) {

                $scope.trust = function (txt) {
                    return $sce.trustAsHtml(txt);
                };

                $scope.showRemoveButtons = function () {

                    var control = $scope.control;

                    if (!control.showremovebuttons) {
                        return false;
                    }

                    // if the control is required, don't show the remove button if there's only one row
                    return !control.required || (control.required && control.values.length > 1);
                };
            },
            link: function (scope, element, attr) {
                scope.control = Form.controls.get(attr.GridControl);
            }
        };
    });

}(ITForms.Angular));
