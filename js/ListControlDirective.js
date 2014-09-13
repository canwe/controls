(function (app) {
    'use strict';

    app.directive("listControl", function (Form, Watcher) {

        return {
            templateUrl: "partials/ListControl.html",
            restrict: "E",
            replace: true,
            scope: {
                control: '='
            },
            controller: function ($scope) {

                $scope.Add = function (value) {
                    if ($scope.control.add(value)) {
                        $scope.newvalue = "";
                    }
                };

                $scope.HandleBlur = function () {
                    Watcher.add($scope.control.name, 'blur', true);
                };
            }
        };
    });

}(ITForms.Angular));