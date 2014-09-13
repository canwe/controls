(function (Controls) {
    'use strict';

    var ListControl = function (config) {

        config = _.defaults(config, { values: [], allowduplicates: true });
        Controls.Control.call(this, config);
    };

    ListControl.prototype = new Controls.Control();
    ListControl.prototype.constructor = ListControl;

    ListControl.prototype.value = function () {
        return this.values;
    };

    ListControl.prototype.add = function (txt) {

        if (!_.contains(this.values, txt)) {
            this.values.push(txt);
            this.message = "";
           // this.raisevaluechanged();
            return true;
        }

        this.message = 'The list already contains "' + txt + '"';
        return false;
    };

    ListControl.prototype.remove = function (txt) {
        var index = _.indexOf(this.values, txt);

        if (index !== -1) {
            this.values.splice(index, 1);
           // this.raisevaluechanged();
            this.message = '';
        }
    };

    Controls.ListControl = ListControl;

}(XForms.Controls || {}));