(function (app) {
    'use strict';

    app.directive("debugControl", function (Form, Watcher, CSB) {

        return {
            restrict: "E",
            replace: true,
            scope: {},
            templateUrl: "partials/DebugControl.html",
            link: function (scope) {

                scope.gettime = function () {
                    var date = new Date();
                    return date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
                };

                scope.formatchange = function (args) {
                    return scope.gettime() + ' ' + args.object + '.' + args.member + ' changed to ' + angular.toJson(args.value);
                };

                scope.Values = _.map(Watcher.changes, scope.formatchange);

                scope.CSBValues = [];

                scope.Watcher = Watcher;
                scope.CSB = CSB;

                scope.ShowCSBData = false;

                scope.ToggleCSBData = function () {
                    scope.ShowCSBData = !scope.ShowCSBData;
                };

                scope.HighlightControls = function (csb) {
                    var names = _.union(_.pluck(csb.conditions, 'object'), _.pluck(csb.actions, 'target'));
                    scope.$root.$broadcast('highlight', { names: names });
                };

                scope.UnHighlightControls = function (csb) {
                    scope.$root.$broadcast('highlight', { names: [ ] });
                };

                scope.controls = Form.controls;

                scope.Clear = function () {
                    scope.Values = [];
                    scope.CSBValues = [];
                    scope.$root.$broadcast('highlight', { names: [] });
                };

                CSB.OnDebug.addHandler(function (args) {

                    args.params.date = scope.gettime();
                    scope.CSBValues.push(angular.copy(args.params));
                });

                Watcher.OnChange.addHandler(function (args) {
                    scope.Values.push(scope.formatchange(args.params));
                });
            }
        };
    });

    app.filter('clean', function () {
        return function (txt) {

            txt = angular.toJson(txt, true);

            return txt.replace('{', '').replace('[', '');
        };
    });

    app.filter('csbformat', function () {

        return function (params) {

            var gettime = function () {

                var date = new Date();
                return date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
            };

            var formattrigger = function (trigger) {

                if (trigger && trigger.object && trigger.member && _.has(trigger, 'value')) {
                    return trigger.object + '.' + trigger.member + ' changed to ' + angular.toJson(trigger.value);
                }

                return 'Unknown trigger';
            };

            var formatconditions = function (csb) {

                var count = csb.conditions.length,
                    str = ' [' + count + ' condition' + ((count  === 1) ? '' : 's') + ': ';

                _.each(csb.conditions, function (condition) {
                    if (_.isNull(condition)) { str += '(condition is null)'; return; }
                    if (condition.evaluator === 'javascript') {
                        str += condition.condition;
                    } else {
                        str += ' (' + condition.object + ' ' + condition.member + ' ' + condition.operator + ' ' + condition.value + ') ';
                    }
                });

                if (count > 0) {
                    str += ' Format: ' + csb.format;
                }


                return str + ']';
            };

            var message = params.date + ' ' + params.message;

            if (params.trigger) {
                message += ' (triggered by ' + formattrigger(params.trigger) + ')';
            }

            if (params.csb) {
                message += formatconditions(params.csb);
            }

            return message;
        };

    });

}(XForms.Angular));