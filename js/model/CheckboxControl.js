(function (Controls) {
    'use strict';

    var CheckboxControl = function (config) {
        Controls.Control.apply(this, arguments);
    };

    CheckboxControl.prototype = new Controls.Control();
    CheckboxControl.prototype.constructor = CheckboxControl;

    Controls.CheckboxControl = CheckboxControl;

}(XForms.Controls || {}));