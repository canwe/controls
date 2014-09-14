(function (app) {
    'use strict';

    app.directive("gridControl", [ '$compile', '$sce', function ($compile, $sce) {

        var templateUrl = "js/angular/partials/GridControl.html",
            directive = app.makeControlDirective($compile, templateUrl);

        directive.controller = function ($scope) {

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
        };

        return directive;
    }]);
}(XForms.Angular));
