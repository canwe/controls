
/** @jsx React.DOM */

'use strict';

window.XForms = window.XForms || {};

window.XForms.React = {};

window.XForms.Form = {

    ctrls: [],

    controls: {

        get: function (name) {
            return this.ctrls.find(function (control) { return control.name === name; });
        }
    },

    add: function (control) {
        this.ctrls.push(control);
    }
};


window.XForms.Actions.Current = new XForms.Actions(window.XForms.FormData.csbdata, window.XForms.Form);


var eventsMixin = {

    changeState: function (newState) {

        var self = this;

        this.setState(newState, function () {

            Object.keys(newState).forEach(function (property) {

                window.XForms.Actions.Current.trigger({ object: self.name, member: property});
            });
        });
    },

    componentWillMount: function () {

        window.XForms.Form.add({
           name: this.state.name
        });
    }
};

window.XForms.React.Control = React.createClass({

    mixins: [ eventsMixin ], // Use the mixin

    getInitialState: function () {

        return this.props.model;
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
            <div className={wrapperClasses}>
                <button className={messageClasses}>{model.message}</button><br />
                {child}
                <div className={debugClasses}><h4>Debug</h4><pre>{JSON.stringify(model)}</pre></div>
            </div>
            );
    }
});

