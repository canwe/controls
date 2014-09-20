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

        return (
            <div><h4>{control.name}</h4><input type="checkbox" checkedLink={checked} />
            </div>
            );
    }
});
