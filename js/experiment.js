

(function (app) {
    'use strict';

    app.directive('outer', function () {
        return {
            restrict: 'E',
            scope: {},
            transclude: true,
            controller: function () {

            },
            template: '<div><h2>Outer</h2><div>name: {{control.name}}</div><div ng-transclude></div></div>',
            link: function (scope, element, attrs) {
                scope.control = { name: attrs.name};

            }
        };
    });

    app.directive('inner', function () {
        return {
            restrict: 'E',
            scope: {
                control: '='
            },
            template: '<div><h2>Inner</h2><div>name: {{control.name}}</div></div>',
            link: function (scope, element, attrs) {

                          var x = 0;
            }
        };
    });


}(ITForms.Angular));