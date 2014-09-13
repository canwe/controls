window.XForms = window.XForms || {};

XForms.Controls = {};

(function (Controls) {
    'use strict';

    var control = function (config) {

        if (!config) {
            return;
        }

        var defaults = { _value: '', display: true, enabled: true, required: false, label: 'Unlabelled control', group: 'form' },
            prop;

        config = _.defaults(config, defaults);

        for (prop in config)   {
            if (config.hasOwnProperty(prop)) {
                this[prop] = config[prop];
            }
        }

        if (!this.name) {
            throw new Error('Invalid name');
        }

        this.initialvalue = this._value;
        this.message = '';
        this.onvaluechanged = new XForms.Events.Event();
    };

    control.prototype.raisevaluechanged = function () {
        this.onvaluechanged.execute(this.name);
    };

    control.prototype.setvalue = function (val) {
        if (val !== this._value) {
            this._value = val;
            this.raisevaluechanged();
        }
    };

    control.prototype.clear = function () {
        if (this._value !== '') {
            this._value = '';
            this.raisevaluechanged();
        }
    };

    control.prototype.value = function () {
        return this._value;
    };

    control.prototype.show = function (value) {

        value = value === true || _.isUndefined(value);
        this.display = value;
    };

    control.prototype.hide = function () {

        this.show(false);
    };

    control.prototype.isvisible = function () {
        return this.display;
    };

    control.prototype.enable = function (value) {
        value = value === true || _.isUndefined(value);
        this.enabled = value;
    };

    control.prototype.disable = function () {

        this.enable(false);
    };

    control.prototype.isenabled = function () {

        return this.enabled;
    };

    control.prototype.setrequired = function (value) {

        value = value === true || _.isUndefined(value);
        this.required = value;
    };

    control.prototype.unsetrequired = function () {

        this.setrequired(false);
    };

    control.prototype.isrequired = function () {

        return this.required;
    };

    Controls.Control = control;

}(XForms.Controls || {}));
