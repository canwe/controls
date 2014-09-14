/** @jsx React.DOM */

'use strict';

window.XForms.React.CheckboxControl = React.createClass({displayName: 'CheckboxControl',

    render: function() {

        return (
            React.DOM.div(null, "CheckboxControl: ", JSON.stringify(this.props.model))
            );
    }
});
