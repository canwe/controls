
/** @jsx React.DOM */

'use strict';


var outer = React.createClass({displayName: 'outer',

    render: function() {

        return (
            <pre>{JSON.stringify(this.props.model)}</pre>
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
            <div>{models}</div>
            );
    }
});

React.renderComponent(
    <app data={window.XForms.FormData} />, document.getElementById('app')
    // later we can wrap the reference to window.FormData in a factory object, and eventually have the object fetch the data from the server
);
