/** @jsx React.DOM */

'use strict';

window.XForms.React.CheckboxControl = React.createClass({

    render: function() {

        return (
            <div>CheckboxControl: {JSON.stringify(this.props.model)}</div>
            );
    }
});
