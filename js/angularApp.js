(function () {
    'use strict';

    var app = angular.module("demo", []);

    app.factory('FormData', [function () {

        var data = window.FormData;

        return {
          get:  function (name) {
              return _.findWhere(data, { name: name });
          }
        };
    }]);

    app.directive('outer', function () {
        return {
            restrict: 'E',
            scope: {},
            transclude: true,
            controller: ['$scope', function ($scope) {

                this.scope = $scope;

            }],
            template: '<div ng-show="inner.control.visible" class="xcontrol"><h4>Wrapper</h4><div>name: {{inner.control.name}}</div><div ng-transclude></div></div>'
        };
    });

    app.directive('inner', [ 'FormData', function (data) {
        return {
            restrict: 'E',
            scope: {},
            require: '?^outer',
            template: '<div><h4>Control</h4><div>name: {{control.message}}</div></div>',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, element, attrs) {

                        scope.control = data.get(attrs.name);
                    },

                    post: function postLink(scope, element, attrs, parent) {

                        if (parent && parent.scope) {
                            parent.scope.inner = scope;
                        }
                    }
                }
            }
        };
    }]);

}());