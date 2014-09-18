/** @jsx React.DOM */

'use strict';
window.XForms.React.GridControl = React.createClass({

    render: function() {

        return (
            <div>GridControl: {JSON.stringify(this.props.model)}</div>
            );
    }
});