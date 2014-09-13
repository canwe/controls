(function (app) {
    'use strict';

    app.directive('multiSelectControl', [ '$compile', function ($compile) {

            var templateUrl = "js/angular/partials/MultiSelectControl.html";

            return app.makeControlDirective($compile, templateUrl);
    }]);

}(XForms.Angular));
