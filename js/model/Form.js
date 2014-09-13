(function (XForms) {
    'use strict';

    var form = function (config) {

        if (!config) {
            return;
        }

        var self = this,
            defaults = { formdata: [], controldata: [], csbdata: [] },
            formdefaults = { requestid: 0 },
            formdata,
            prop;

        config = _.defaults(config, defaults);
        formdata = _.defaults(config.formdata, formdefaults);

        for (prop in config) {
            if (config.hasOwnProperty(prop)) {
                this[prop] = config[prop];
            }
        }

        for (prop in formdata) {
            if (formdata.hasOwnProperty(prop)) {
                this[prop] = formdata[prop];
            }
        }

        this.message = '';
        if (!this.teamslug || !this.formslug) {
            this.message = 'Invalid slugs.';
        }

        this.config = config;
        this.controls = [];
        this.enabled = true;
        this.submitenabled = true;

        // Public method to retrieve a control by name
        this.controls.get = function (controlname) {
            return _.findWhere(self.controls, { name : controlname });
        };

        // Build Control objects, and hook up handlers for their events
        _.each(config.controldata, function (item) {

            var Controltype = XForms.Controls[item.type],
                control;

            if (!Controltype) {
                return;
            }

            control = new Controltype(item);

            self.controls.push(control);
        });
    };

    form.prototype.onsubmit = function (value) {

        var result = this.OnFormSubmitted.execute();

        //give controls the opportunity to cancel the submit event
        return result.cancel !== true;
    };

    form.prototype.EnableSubmit = function (value) {

        value = value === true || _.isUndefined(value);
        this.submitenabled = value;
    };

    form.prototype.DisableSubmit = function () {

        this.EnableSubmit(false);
    };

    form.prototype.IsSubmitEnabled = function () {

        return this.submitenabled;
    };

    form.prototype.Enable = function (value) {

        value = value === true || _.isUndefined(value);
        this.enabled = value;
    };

    form.prototype.Disable = function () {

        this.Enable(false);
    };

    form.prototype.IsEnabled = function () {

        return this.enabled;
    };

    XForms.Form = form;

}(XForms || {}));