
/** @jsx React.DOM */

'use strict';

window.XForms = window.XForms || {};

window.XForms.React = {};

window.XForms.ControlWrapper = function (obj) {

    this.obj = obj;

    this.setState = function (newState) {

        this.obj.changeState(newState);
    };

    // actions

    this.show = function () {
        this.setState({ display: true });
    };
    this.hide = function () {

        this.setState({ display: false });
    };
    this.enable = function () {

        this.setState({ enabled: true });
    };
    this.disable = function () {

        this.setState({ enabled: false });
    };

    // properties
    this.enabled = function () {
        return this.obj.state.enabled;
    };

    this.display = function () {
        return this.obj.state.display;
    };

    this.value = function () {

        var i,
            valueProperties = [ 'value', 'values', '_value' ];

        for(i = 0; i < valueProperties.length; i++) {

            if (!_.isUndefined(this.obj.state[valueProperties[i]])) {
                return this.obj.state[valueProperties[i]];
            }
        }
    };
};

window.XForms.Form = function () {

    var self = this;
    this.ctrls = [];

    this.controls =  {

        get: function (name) {

            var obj = self.ctrls.find(function (control) { return control.state.name === name; });
            return new window.XForms.ControlWrapper(obj);
        }
    };
};

window.XForms.Form.prototype.add = function (control) {

    this.ctrls.push(control);
};

window.XForms.Form.Current = new window.XForms.Form();
window.XForms.Actions.Current = new XForms.Actions(window.XForms.FormData.csbdata, window.XForms.Form.Current);

var eventsMixin = {

    changeState: function (newState) {

        var self = this;

        this.setState(newState, function () {

            Object.keys(newState).forEach(function (property) {

                if (property === 'values') {
                    property = 'value';
                }

                if (property === '_value') {
                    property = 'value';
                }

                window.XForms.Actions.Current.trigger({ object: self.state.name, member: property});
            });
        });
    },

    componentWillMount: function () {

        window.XForms.Form.Current.add(this);
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

        var button = '';
        if (model.message) {
           button =
               (<div>
                <button className={messageClasses}>{model.message}</button>
                <br />
            </div>);
        }

        return (
            <div className={wrapperClasses}>{button} { child }
                <div className={debugClasses}><h4>Debug</h4><pre>{JSON.stringify(model)}</pre></div>
            </div>
            );
    }
});

