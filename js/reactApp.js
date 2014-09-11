/** @jsx React.DOM */

var outer = React.createClass({
    getInitialState: function () {
        return {
            inner: {
                control: {
                    name: "test",
                    visible: true
                }
            }
        };
    },
    render: function() {
        return (
            <div class="xcontrol"><h4>Wrapper</h4><div>name:xx</div><inner name="controlA" /></div>
            );
    }
});

var inner = React.createClass({
    render: function() {
        return (
            <div class="xcontrol"><h4>Wrapper</h4><div>name:this.props.name</div><inner /></div>
            );
    }
});

React.renderComponent(
    <outer />,
    document.getElementById('react')
);
