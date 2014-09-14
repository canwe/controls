/** @jsx React.DOM */

'use strict';

window.XForms.React.MultiSelectControl = React.createClass({displayName: 'MultiSelectControl',

    render: function() {

        var model = this.props.model;

        return (
            React.DOM.div(null, "MultiSelectControl: ", JSON.stringify(this.props.model))
            );
    }
});

