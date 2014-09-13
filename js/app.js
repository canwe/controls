window.XForms = {};
window.XForms.Angular = (function () {
    'use strict';

    var app = angular.module("form", [ 'ngSanitize']);

    // Encapsulates the call to the static data method
    app.factory('FormData', function () {

        return window.XForms.FormData || {};
    });

    app.factory('CSB', function (FormData, Form, Watcher) {

        var actions = new XForms.Actions(FormData.csbdata, Form);

        Watcher.OnChange.addHandler(function (args) {
            actions.trigger(args.params);
        });

        actions.executeAll(function (action) {
            return action.executeonpageload;
        });

        return actions;
    });

    app.factory('Watcher', function ($rootScope, Form) {

        var watcher,
            Watcherservice,
            watchkeys = [ 'display', 'enabled', 'required', 'value()' ];

        Watcherservice = function () {

            // Stores a list of all changed values
            this.changes = [];

            // Event to allow subscribers to register for change notifications
            this.OnChange = new ITForms.Events.Event();

            // Add the value change to the collection and notify subscribers
            this.add = function (object, member, value) {
                var change = {
                    object: object,
                    member: member,
                    value: value
                };
                this.changes.push(change);
                this.OnChange.execute(change);
            };
        };

        watcher = new Watcherservice();

        // Add every control to the root scope, and set up watch for changes to their properties defined in watch keys above
        _.each(Form.controls, function (control) {

            // Put the control into scope
            var key = 'itforms_control_' + control.name;
            $rootScope[key] = control;

            _.each(_.without(watchkeys, 'name'), function (watchkey) {

                $rootScope.$watch(key + '.'  + watchkey, function (newval, b) {
                    watcher.add(control.name, watchkey.replace('()', ''), newval);
                }, true);
            });
        });

        return watcher;
    });

    app.factory('Form', function (FormData) {

        return new ITForms.Form(FormData);
    });

    app.controller("appcontroller", [ "$scope", "Form", "CSB", function ($scope, Form, CSB) {

        $scope.form = Form;
        var self = this;
        Form.controls.forEach(function (control) {

            $scope[control.name] = control;

        });


        $scope.submit = function () {
            $scope.values = Form.controls;
        };

    }]);

    app.makeControlDirective = function ($compile, templateUrl, linkfunc) {

        var linker = function(scope, element) {

            element.addClass('xcontrol');
            element.attr('ng-show', 'control.display');
            element.attr('ng-disabled', 'control.enabled');
            element.attr('ng-class', '{ highlightedcontrol:highlight }');
            $compile(element)( scope );

            scope.$root.$on('highlight', function (args, params) {
                scope.highlight = _.contains(params.names, scope.control.name);
            });

            if (linkfunc) {
                linkfunc.call(this, scope, element);
            }
        };

        return {
            templateUrl: templateUrl,
            restrict: "E",
            replace: true,
            terminal: true,
            priority: 1000,
            scope: {
                control: '='
            },
            link: linker
        };
    };

    return app;

}());

XForms.Diff = function (newobject, oldobject, keys) {
    'use strict';

    newobject = _.pick(newobject, keys);
    oldobject = _.pick(oldobject, keys);

    var o = { name: newobject.name};
    _.each(keys, function (key) {
        if (newobject[key] !== oldobject[key]) {
            o[key] = newobject[key];
        }
    });

    return o;
};