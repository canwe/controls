(function (Controls) {
    'use strict';

    var MultiSelectControl = function (config) {

        config = _.defaults(config, { values: [], style: 'compact', columncount: 1 });
        Controls.Control.call(this, config);
    };

    MultiSelectControl.prototype = new Controls.Control();
    MultiSelectControl.prototype.constructor = MultiSelectControl;

    MultiSelectControl.prototype.value = function () {
        return _.pluck(_.where(this.values, { checked: true}), 'value');
    };

    Controls.MultiSelectControl = MultiSelectControl;

}(ITForms.Controls || {}));


