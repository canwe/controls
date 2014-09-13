(function (app) {
    'use strict';

    app.directive('multiSelectControl', function (Form) {

        return {
            templateUrl: "partials/MultiSelectControl.html",
            restrict: 'E',
            replace: true,
            scope: {
                control: '='
            }

        };
    });

}(ITForms.Angular));
