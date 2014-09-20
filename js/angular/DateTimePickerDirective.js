(function (app) {
    'use strict';

    app.directive('datetimepicker', function () {
        return {
            restrict: 'A',
            require : 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {

//                $(element).datepicker({
//                    inline: true,
//                    autoSize: true,
//                    dateFormat: "DD, MM d, yy",
//                    numberOfMonths: 2,
//                    beforeShowDay: $.datepicker.noWeekends,
//                    stepMonths: 2,
//                    showButtonPanel: true,
//                    buttonText: "Today",
//                    onClose: function (dateText) {
//                        ngModelCtrl.$setViewValue(dateText);
//                        scope.$apply();
//
//                    }
//                });
            }
        };
    });

}(XForms.Angular));