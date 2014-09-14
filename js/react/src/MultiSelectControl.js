/** @jsx React.DOM */

'use strict';

window.XForms.React.MultiSelectControl = React.createClass({

    render: function() {

        var model = this.props.model;

        return (
            <div>MultiSelectControl: {JSON.stringify(this.props.model)}</div>
            );
    }
});

