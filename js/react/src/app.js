
/** @jsx React.DOM */

'use strict';

window.XForms.React.Application = React.createClass({

    render: function() {

        console.log(this.props);

        var data = this.props.data.controldata.sort(function(a, b ){ return a.order > b.order; });

        var models = data.map(function (item, i) {

            var controltype = window.XForms.React[item.type];

            if (controltype) {
                return window.XForms.React.Control({ key: i, model: item }, controltype(null));
            }
        });

        return (
            <div>{models}</div>
            );
    }
});

React.renderComponent(
    <XForms.React.Application data={window.XForms.FormData} />, document.getElementById('app')
    // later we can wrap the reference to window.FormData in a factory object, and eventually have the object fetch the data from the server
);

window.XForms.Actions.Current.executeAll(function (action) {
        return action.executeonpageload;
});
