
(function (app) {
    'use strict';

    app.directive("checkboxControl", [ '$compile', function ($compile) {

        var templateUrl = "js/angular/partials/CheckboxControl.html";

        return app.makeControlDirective($compile, templateUrl);
    }]);

}(XForms.Angular));
