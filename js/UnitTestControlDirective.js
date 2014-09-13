(function (app) {
    'use strict';

    app.directive("UnitTestControl", function (Form) {

        return {
            templateUrl: "partials/UnitTestControl.html",
            restrict: "E",
            replace: true,
            scope: {
                control: '='
            }
        };
    });

}(ITForms.Angular));
