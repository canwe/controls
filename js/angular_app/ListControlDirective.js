(function (app) {
    'use strict';

    app.directive("ListControl", function (Form, Watcher) {

        return {
            restrict: "M",
            replace: true,
            scope: {
            },
            controller: function ($scope) {

                $scope.$root.$on('highlight', function (args, params) {
                    $scope.highlight = _.contains(params.names, $scope.control.name);
                });

                $scope.highlight = false;

                $scope.Add = function (value) {
                    if ($scope.control.add(value)) {
                        $scope.newvalue = "";
                    }
                };

                $scope.HandleBlur = function () {
                    Watcher.add($scope.control.name, 'blur', true);
                };
            },
            templateUrl: "partials/ListControl.html",
            link: function (scope, element, attr) {
                scope.control = Form.controls.get(attr.ListControl);
            }
        };
    });

}(ITForms.Angular));