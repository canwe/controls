(function (app) {
    'use strict';

    app.directive('gridControl', function (Form, $sce) {

        return {
            templateUrl: "partials/GridControl.html",
            restrict: 'M',
            replace: true,
            scope: { control: '='},
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
            }
        };
    });

}(ITForms.Angular));
