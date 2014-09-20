(function (XForms) {
    'use strict';

    /*

    Trigger:
     {
         object: 'list',
         member: 'Value',
         value: [ 'a', 'b' ]
     };

     Action:
     {
      triggers: [
        { object: '*', member: '*' }
      ],
      format: '{0} && {1}',
      conditions: [
         { evaluator: 'javascript', condition: 'true === true' },
         { evaluator: 'javascript', condition: '[list1].Value() === [ \'a\', \'b\' ]' },
         { evaluator: 'control', object: 'list1', member: 'Value', operator: 'equals', value: [ 'a', 'b' ], typecoercion: false, casesensitive: false },
      ],
      actions: [
        { target: 'isrequired2', whentrue: 'Show', whenfalse: 'Hide' }
      ],
     executeonpageload: true
     }

     */

    var actions = function (actionData, form) {

        this.debuglog = [];

        /* Validates that actionItem config data each have the right members */
        this.validate = function (actions) {
            return _.map(actions, function (actionItem) {
                var defaults = { triggers: [], conditions: [], actions: [], format: '', executeonpageload: true };
                actionItem = _.defaults(actionItem, defaults);
                if (actionItem.triggers.length === 0) {
                    actionItem.triggers = _.map(actionItem.conditions, function (condition) {
                        return {
                            object: condition.object || '*',
                            member: condition.member || '*'
                        };
                    });
                }
                return actionItem;
            });
        };

        this.form = form;
        this.actions = this.validate(actionData);
        this.OnDebug = new XForms.Events.Event();

        this.debug = function (message) {

         //   console.log(message);
            this.debuglog.push(message);
            this.OnDebug.execute(message);
        };

        var self = this;
        this.context = {
            get: function (name) {

                return self.form.controls.get(name);
            }
        };

        this.triggerIsMatch = function (trigger) {
            // { object: '*', member: '*' }
            // { object: '*', member: 'value' }
            // { object: 'control', member: '*' }
            // { object: 'control', member: 'value' }

            var all = '*',
                object = this.object || all,
                member = this.member || all,
                triggerobject = trigger.object || all,
                triggermember = trigger.member || all,
                sameobject = object === all || object === triggerobject,
                samemember = member === all || member === triggermember;

            return sameobject && samemember;
        };
    };

    actions.prototype.getactionsForTrigger = function (trigger) {

        var self = this;
        return _.filter(this.actions, function (actionItem) {
            return _.some(actionItem.triggers,
                function (actionItemtrigger) {
                    return self.triggerIsMatch.call(actionItemtrigger, trigger);
                });
        });
    };

    actions.prototype.executeAll = function (filter) {

        var actions = this.actions,
            self = this;

        if (typeof filter === 'function') {
            actions = _.filter(actions, filter);
        }

        this.debug({ message: 'Trigger. ExecuteAll. Found ' + actions.length + ' eligible' });

        _.each(actions, function (actionItem) {

            self.executeactionItem(actionItem);
        });
    };

    actions.prototype.trigger = function (trigger) {

        var objectname = trigger.object,
            member = trigger.member,
            applicableactions,
            self = this;

        applicableactions = this.getactionsForTrigger(trigger) || [];

        this.debug({ message: 'Trigger. Found ' + applicableactions.length + ' actions for ' + objectname + '.' + member, actions: applicableactions, trigger: trigger });

        if (applicableactions.length === 0) {
            return;
        }

        _.each(applicableactions, function (actionItem) {

            self.executeactionItem(actionItem);
        });
    };

    actions.prototype.executeactionItem = function (actionItem) {

        var self = this,
            ismatch = this.conditionsMatch(actionItem.format, actionItem.conditions);

        this.debug({ message: 'Matched = ' + ismatch, actionItem: actionItem, matched: ismatch });

        _.each(actionItem.actions, function (action) {
            self.executeAction(ismatch, action);
        });

    };

    actions.prototype.executeAction = function (ismatch, action) {

        var func = ismatch ? action.whentrue : action.whenfalse,
            target;

        if (func) {
            target = this.context.get(action.target);

            if (target && target[func]) {

                this.debug({ message: 'Calling ' + action.target + '.' + func + '()', action: action });
                target[func]();
            } else {
                this.evaluateExpression(func);
            }
        }
    };

    actions.prototype.conditionsMatch = function (format, conditions) {

        if (!_.isArray(conditions)) {
            return false;
        }

        if (conditions.length === 0) {
            return true;
        }

        format = this.createFormatIfNecessary(format, conditions.length);

        var truths = [],
            truth,
            self = this;

        _.each(conditions, function (condition) {
            truths.push(self.conditionIsMatch(condition));
        });

        truth = 'return ' + this.stringFormat(format, truths);

        return this.evaluateExpression(truth);
    };

    actions.prototype.createFormatIfNecessary = function (format, count) {

        if (!_.isString(format)) {
            format = '';
        }

        if (format === '') {
            format = this.createFormat(count);
        }

        return format;
    };

    /* Conditional - Creates a default format string eg. {0} && {1}  */
    actions.prototype.createFormat = function (count) {

        var str = '',
            i;

        for (i = 0; i < count; i += 1) {
            str += '{' + i + '} && ';
        }

        return str.substr(0, str.length - 4);
    };

    actions.prototype.conditionIsMatch = function (condition) {

        if (_.isUndefined(condition)) {
            return true;
        }

        if (_.isNull(condition)) {
            return false;
        }

        if (_.isBoolean(condition)) {
            return condition;
        }

        condition = _.defaults(condition, { evaluator: 'javascript' });

        var evaluator = condition.evaluator;

        if (evaluator === 'javascript') {
            return this.evaluateJavaScriptCondition(condition);
        }

        if (evaluator === 'control' || evaluator === 'form') {
            return this.evaluateControlCondition(condition);
        }

        return true;
    };

    actions.prototype.evaluateJavaScriptCondition = function (condition) {

        condition = _.defaults(condition, { condition: 'true === true' });

        var expression = 'return ' + condition.condition;

        return this.evaluateExpression(expression);
    };

    actions.prototype.interpolate = function (str) {
        var tmp = str,
            start = tmp.indexOf("[", 0),
            end,
            val;

        while (start !== -1) {

            end = tmp.indexOf("]", start + 1);

            if (end !== -1) {

                val = tmp.substring(start + 1, end);

                if (tmp.charAt(start + 1) === '[' && tmp.charAt(end + 1) === ']') {
                    tmp = tmp.replace("[" + val + "]", val);
                } else {
                    tmp = tmp.replace('[' + val + ']', 'this.get(\'' + val + '\')');
                }
            }

            start = tmp.indexOf("[", start + 1);
        }

        return tmp;
    };

    actions.prototype.evaluateControlCondition = function (condition) {

        var member,
            value,
            control = this.context.get(condition.object);

        if (!control) {
            return false;
        }

        member = control[condition.member];
        value = _.isFunction(member) ? member.call(control) : member;

        var result = this.evaluate(value, condition);

//        console.log(result + ' = ' + condition.object + '.' + condition.member + ' ' + condition.operator + ' ' + condition.value );
        return result;
    };

    actions.prototype.evaluate = function (value, condition) {

        condition = _.defaults(condition, { operator: 'doesnotequal', value: '*', typecoercion: false, casesensitive: false });

        if (_.isNull(value)) {
            return false;
        }

        if (_.isUndefined(value)) {
            return false;
        }

        if (condition.typecoercion) {
            return this.evaluateWithTypeCoercion(value, condition);
        }

        if (_.isString(value)) {
            return this.evaluateString(value, condition);
        }

        if (_.isBoolean(value)) {
            return this.evaluateBoolean(value, condition);
        }

        if (_.isNumber(value)) {
            return this.evaluateNumber(value, condition);
        }

        if (_.isArray(value)) {
            return this.evaluateArray(value, condition);
        }

        if (_.isDate(value)) {
            return this.evaluateDate(value, condition);
        }

        return false;
    };

    actions.prototype.evaluateWithTypeCoercion = function (value, condition) {
        return value === condition;
    };

    actions.prototype.evaluateExpression = function (expression) {

        expression = this.interpolate(expression);

        var func = new Function(expression),
            result = false;

        try {
            result = func.call(this.context);
        } catch (ex) {
            this.debug({ message: 'Syntax error in expression: ' + expression });
            result = false;
        }

        return result;
    };

    actions.prototype.evaluateString = function (value, condition) {

        var valuetomatch = String(condition.value);

        if (condition.casesensitive) {
            value = value.toLowerCase();
            valuetomatch.toLowerCase();
        }


        if (condition.operator === 'contains') {

            return value.indexOf(condition.value) !== -1;
        }

        return value === condition.value;
    };

    actions.prototype.evaluateBoolean = function (value, condition) {

        var result = false;

        if (condition.operator === 'equals') {
            result = value === condition.value;
        } else {
            result = value !== condition.value;
        }

        return result;
    };

    actions.prototype.evaluateNumber = function (value, condition) {

        if (_.isNaN(value)) {
            return false;
        }

        return _.isDate(condition);
    };

    actions.prototype.evaluateDate = function (value, condition) {

    };

    actions.prototype.evaluateArray = function (value, condition) {

        return _.some(value, function (val) { return val === condition.value; });
    };

    actions.prototype.stringFormat = function (format, args) {

        /*
         Copyright (c) 2009, CodePlex Foundation
         All rights reserved.

         Redistribution and use in source and binary forms, with or without modification, are permitted
         provided that the following conditions are met:

         *   Redistributions of source code must retain the above copyright notice, this list of conditions
         and the following disclaimer.

         *   Redistributions in binary form must reproduce the above copyright notice, this list of conditions
         and the following disclaimer in the documentation and/or other materials provided with the distribution.

         *   Neither the name of CodePlex Foundation nor the names of its contributors may be used to endorse or
         promote products derived from this software without specific prior written permission.

         THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY EXPRESS OR IMPLIED
         WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
         A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
         FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
         LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
         INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
         OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
         IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</textarea>
         */

        var result = '',
            i,
            useLocale = false;

        for (i = 0; ; ) {
            // Find the next opening or closing brace
            var open = format.indexOf('{', i);
            var close = format.indexOf('}', i);
            if ((open < 0) && (close < 0)) {
                // Not found: copy the end of the string and break
                result += format.slice(i);
                break;
            }
            if ((close > 0) && ((close < open) || (open < 0))) {

                if (format.charAt(close + 1) !== '}') {
                    throw new Error('format stringFormatBraceMismatch');
                }

                result += format.slice(i, close + 1);
                i = close + 2;
                continue;
            }

            // Copy the string before the brace
            result += format.slice(i, open);
            i = open + 1;

            // Check for double braces (which display as one and are not arguments)
            if (format.charAt(i) === '{') {
                result += '{';
                i++;
                continue;
            }

            if (close < 0) throw new Error('format stringFormatBraceMismatch');


            // Find the closing brace

            // Get the string between the braces, and split it around the ':' (if any)
            var brace = format.substring(i, close);
            var colonIndex = brace.indexOf(':');
            var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10);

            if (isNaN(argNumber)) throw new Error('format stringFormatInvalid');

            var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);

            var arg = args[argNumber];
            if (typeof (arg) === "undefined" || arg === null) {
                arg = '';
            }

            // If it has a toFormattedString method, call it.  Otherwise, call toString()
            if (arg.toFormattedString) {
                result += arg.toFormattedString(argFormat);
            }
            else if (useLocale && arg.localeFormat) {
                result += arg.localeFormat(argFormat);
            }
            else if (arg.format) {
                result += arg.format(argFormat);
            }
            else
                result += arg.toString();

            i = close + 1;
        }

        return result;

    };

    XForms.Actions = actions;

}(XForms || {}));


