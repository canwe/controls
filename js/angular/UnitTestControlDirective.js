(function (app) {
    'use strict';

    app.directive("UnitTestControl", function (Form) {

        return {
            templateUrl: "js/angular/partials/UnitTestControl.html",
            restrict: "E",
            replace: true,
            scope: {
                control: '='
            }
        };
    });

}(XForms.Angular));
