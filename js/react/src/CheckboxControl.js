/** @jsx React.DOM */

'use strict';

window.XForms.React.CheckboxControl = React.createClass({

    render: function() {

        var changeState = this.props.changeState;
        var control = this.props.model;

        var checked = {
            value: control._value,
            requestChange: function (newValue) {
                    changeState({ '_value': newValue });
                }
        };

        var requiredMarkerClasses = React.addons.classSet({
            'required': true,
            'hide': !control.required
        });

        return (
            <div><h4>{control.name} <span className={requiredMarkerClasses}>*</span></h4><input type="checkbox" checkedLink={checked} />
            </div>
            );
    }
});
