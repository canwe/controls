
/** @jsx React.DOM */

'use strict';


var outer = React.createClass({displayName: 'outer',

    render: function() {

        return (
            React.DOM.pre(null, JSON.stringify(this.props.model))
            );
    }
});

var app = React.createClass({displayName: 'app',

    render: function() {

        console.log(this.props);

        var models = this.props.data.controldata.map(function(item, i){

            return outer({key: i, model: item});
        });

        return (
            React.DOM.div(null, models)
            );
    }
});

React.renderComponent(
    app({data: window.XForms.FormData}), document.getElementById('app')
    // later we can wrap the reference to window.FormData in a factory object, and eventually have the object fetch the data from the server
);
