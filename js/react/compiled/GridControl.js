/** @jsx React.DOM */

'use strict';

window.XForms.React.GridControl = React.createClass({displayName: 'GridControl',

    render: function() {

        return (
            React.DOM.div(null, "GridControl: ", JSON.stringify(this.props.model))
            );
    }
});