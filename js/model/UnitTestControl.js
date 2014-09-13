(function (controls) {
    'use strict';

    var UnitTestControl = function (config) {
        controls.Control.apply(this, arguments);

        this._pass = false;
    };

    UnitTestControl.prototype = new controls.Control();

    UnitTestControl.prototype.constructor = UnitTestControl;

    UnitTestControl.prototype.pass = function () {
        this._pass = true;
    };

    UnitTestControl.prototype.fail = function () {
        this._pass = false;
    };

    controls.UnitTestControl = UnitTestControl;

}(XForms.Controls || {}));
