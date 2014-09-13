(function (XForms) {
    'use strict';

    XForms.Events = {};

    var Event = function () {

        this.eventHandlers = [];
    };

    Event.prototype.addHandler = function (eventHandler) {

        this.eventHandlers.push(eventHandler);
    };

    Event.prototype.removeHandler = function (eventHandler) {

        var index = _.indexOf(this.eventHandlers, eventHandler);

        if (index > -1) {
            this.eventHandlers.splice(index, 1);
        }
    };

    Event.prototype.execute = function (params) {

        var i,
            length = this.eventHandlers.length,
            args = {
                args: false,
                params: params
            };

        for (i = 0; i < length; i += 1) {
            this.eventHandlers[i](args);
        }

        return args;
    };

    XForms.Events.Event = Event;

}(XForms || {}));
