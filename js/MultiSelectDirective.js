(function (app) {
    'use strict';

    app.directive('MultiSelectControl', function (Form) {

        return {
            restrict: 'M',
            replace: true,
            scope: {},
            templateUrl: "partials/MultiSelectControl.html",
            controller: function () {
            },
            link: function (scope, element, attr) {
                scope.control = Form.controls.get(attr.MultiSelectControl);
            }
        };
    });

}(ITForms.Angular));
