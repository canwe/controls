(function (Controls) {
    'use strict';

    var GridControl = function (config) {

        config = _.defaults(config, { values: [], startwithsinglerow: true, showaddbuttons: true, showremovebuttons: true, showgridlineshorizontal: true });
        Controls.Control.call(this, config);

        if (this.values.length === 0 && this.startwithsinglerow) {
            this.add();
        }
    };

    GridControl.prototype = new Controls.Control();
    GridControl.prototype.constructor = GridControl;

    GridControl.prototype.value = function () {
        return this.values;
    };

    GridControl.prototype.add = function () {

        this.values.push(_.map(this.template, function (x) { return _.clone(x); }));
    };

    GridControl.prototype.remove = function (object) {
        var index = _.indexOf(this.values, object);

        if (index !== -1) {
            this.values.splice(index, 1);
        }
    };

    Controls.GridControl = GridControl;

}(XForms.Controls || {}));


