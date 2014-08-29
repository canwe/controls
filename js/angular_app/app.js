(function (ITForms) {
    'use strict';

    ITForms.Angular = angular.module("itforms", [ 'ngSanitize']);

    // Encapsulates the call to the static data method
    ITForms.Angular.factory('FormData', function () {

        return ITForms.FormData || {};
    });

    ITForms.Angular.factory('CSB', function (FormData, Form, Watcher) {

        var csb = new ITForms.CSB2(FormData.csbdata, Form);

        Watcher.OnChange.addHandler(function (args) {
            csb.trigger(args.params);
        });

        csb.executeAll(function (csb) {
            return csb.executeonpageload;
        });

        return csb;
    });

    ITForms.Angular.factory('Watcher', function ($rootScope, Form) {

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

    ITForms.Angular.factory('Form', function (FormData) {

        return new ITForms.Form(FormData);
    });

    ITForms.Angular.controller("appcontroller", [ "$scope", "Form", "CSB", function ($scope, Form, CSB) {
        $scope.form = Form;

        $scope.submit = function () {
            $scope.values = Form.controls;
        };

    }]);
}(ITForms || {}));


ITForms.Diff = function (newobject, oldobject, keys) {
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