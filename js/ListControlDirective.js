(function (app) {
    'use strict';

    app.directive("listControl", [ '$compile', 'Watcher', function ($compile, Watcher) {

        var templateUrl = "partials/ListControl.html",
            directive = app.makeControlDirective($compile, templateUrl);

        directive.controller = function ($scope) {

            $scope.Add = function (value) {
                if ($scope.control.add(value)) {
                    $scope.newvalue = "";
                }
            };

            $scope.HandleBlur = function () {
                Watcher.add($scope.control.name, 'blur', true);
            };
        }

        return directive;
    }]);

}(XForms.Angular));