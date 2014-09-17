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
            <div>{control.name}<input type="checkbox" checkedLink={checked} />
            <pre>{JSON.stringify(control._value)}</pre>
            </div>
            );
    }
});
