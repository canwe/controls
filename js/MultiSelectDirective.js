(function (app) {
    'use strict';

    app.directive('multiSelectControl', [ '$compile', function ($compile) {

            var templateUrl = "partials/MultiSelectControl.html";

            return app.makeControlDirective($compile, templateUrl);
    }]);

}(XForms.Angular));
