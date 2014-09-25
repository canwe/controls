(function (app) {
    'use strict';

    app.directive('datetimepicker', function () {
        return {
            restrict: 'A',
            require : 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {

                $(element).pickadate();
            }
        };
    });

}(XForms.Angular));