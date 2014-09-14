
/** @jsx React.DOM */

'use strict';

window.XForms = window.XForms || {};

window.XForms.React = {};

window.XForms.React.Control = React.createClass({displayName: 'Control',

    getInitialState: function () {

        return this.props.model;
    },

    changeState: function (newState) {




        this.setState(newState);
    },

    componentWillMount: function() {

        var self = this;

        var o = {
            name: self.state.name,
            func: function (state) {
                self.setState(state);
            }
        };

      //  window.eventStub.register(o);
    },

    render: function () {

        var model = this.state;
        var self = this;

        var wrapperClasses = React.addons.classSet({
            'xcontrol': true,
            'hide': !model.display,
            'highlightedcontrol': model.highlight,
            'disable': !model.enabled
        });

        var messageClasses = React.addons.classSet({
            'hide': !model.message,
            'btn btn-danger': true
        });

        var debugClasses = React.addons.classSet({
            'hide': !model.debug
        });

        var child = React.addons.cloneWithProps(React.Children.only(this.props.children), {
            model: this.state,
            changeState: this.changeState,
            display: {
                value: model.visible,
                requestChange: function(newValue){ self.changeState('visible', newValue); }
            }
        });

        return (
            React.DOM.div({className: wrapperClasses}, 
                React.DOM.button({className: messageClasses}, model.message), React.DOM.br(null), 
                child, 
                React.DOM.div({className: debugClasses}, React.DOM.h4(null, "Debug"), React.DOM.pre(null, JSON.stringify(model)))
            )
            );
    }
});

