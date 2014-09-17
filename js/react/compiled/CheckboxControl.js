/** @jsx React.DOM */

'use strict';

window.XForms.React.CheckboxControl = React.createClass({displayName: 'CheckboxControl',

    render: function() {

        var changeState = this.props.changeState;
        var control = this.props.model;

        var checked = {
            value: control._value,
            requestChange: function (newValue) {
                    changeState({ '_value': newValue });
                }
        };

        return (
            React.DOM.div(null, control.name, React.DOM.input({type: "checkbox", checkedLink: checked}), 
            React.DOM.pre(null, JSON.stringify(control._value))
            )
            );
    }
});
