
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


/** @jsx React.DOM */

'use strict';

window.XForms.React.CheckboxControl = React.createClass({displayName: 'CheckboxControl',

    render: function() {

        var changeState = this.props.changeState;
        var control = this.props.model;

        var checked = {
            value: control._value,
            requestChange: function (newValue) {
                    changeState({ '_value': newValue });
                }
        };

        return (
            React.DOM.div(null, control.name, React.DOM.input({type: "checkbox", checkedLink: checked}), 
            React.DOM.pre(null, JSON.stringify(control._value))
            )
            );
    }
});

/** @jsx React.DOM */

'use strict';

window.XForms.React.GridControl = React.createClass({displayName: 'GridControl',

    render: function() {
        
        return (
            React.DOM.div(null, "GridControl: ", JSON.stringify(this.props.model))
            );
    }
});

/** @jsx React.DOM */


window.XForms.React.ListControl = React.createClass({displayName: 'ListControl',

    getInitialState: function () {

      return {

            addButtonDisabled: true
      };
    },
    remove: function (item) {

        var values = this.props.model.values;
        var index = values.indexOf(item);

        if (index !== -1) {
            values.splice(index, 1);
        }

        this.props.changeState({
            'values': values,
            'message': ''
        });
        this.refs.addText.getDOMNode().focus();
    },
    add: function () {

        var addTextBox = this.refs.addText.getDOMNode();
        var txt = addTextBox.value.trim();

        if (!txt) {
            this.props.changeState({ enabled: false});
            addTextBox.focus();
            return;
        }

        var values = this.props.model.values;
        var alreadyInTheList = values.some(function(item) { return item === txt; });

        if (alreadyInTheList) {

            this.props.changeState({
                'message': "'" + txt + "'' is already in the list"
            });
            addTextBox.focus();
            return;
        }

        values.push(txt);

        this.props.changeState({
            'values': values,
            'message': ''
        });
        addTextBox.value = '';
        addTextBox.focus();
        this.enableAddButton();
    },
    enableAddButton: function () {

        var textBoxValue = this.refs.addText.getDOMNode().value;
        var addButtonDisabled = textBoxValue ? false: true;
        this.setState({ 'addButtonDisabled': addButtonDisabled });
    },
    render: function() {

        var self = this;
        var control = this.props.model;

        var requiredMarkerClasses = React.addons.classSet({
            'required': true,
            'hide': control.required
        });

        var addButtonClasses = React.addons.classSet({
            'btn btn-info': true,
            'hide': !control.enabled && !control.readonly
        });

        var listItemClasses = React.addons.classSet({
            'btn btn-mini': true,
            'hide': !control.enabled
        });

        var listItems = control.values.map(function (item, i) {

            var removeHandler = self.remove.bind(self, item);
            return (React.DOM.li({key: i}, item, React.DOM.button({className: listItemClasses, onClick: removeHandler}, "X")));
        });

         return (
            React.DOM.div(null, 
                React.DOM.h4(null, control.name, " ", React.DOM.span({className: requiredMarkerClasses}, "*")), 

                React.DOM.div({className: "input-append"}, 
                    React.DOM.input({type: "text", disabled: !control.enabled, onKeyUp: this.enableAddButton, ref: "addText"}), 
                    React.DOM.button({onClick: this.add, disabled: this.state.addButtonDisabled, className: addButtonClasses}, "Add")
                ), 

                React.DOM.ul(null, listItems), 


                React.DOM.pre(null,  JSON.stringify(control.values) )
            )
            );
    }
});


/** @jsx React.DOM */

'use strict';

window.XForms.React.MultiSelectControl = React.createClass({displayName: 'MultiSelectControl',

    onChecked: function (index, value) {

        var values = this.props.model.values;

        values[index].checked = !value.checked;

        this.props.changeState({
            'values': values,
            'message': ''
        });
    },
    render: function() {

        var control = this.props.model;
        var values = '';
        var columncount = (control.style === 'columns') ? control.columncount : 1;

        if (control.style === 'compact') {
            values = window.XForms.React.MultiSelectCompact({values: control.values, oncheck: this.onChecked});
        } else  {
            values = window.XForms.React.MultiSelectColumns({values: control.values, oncheck: this.onChecked, columncount: columncount});
        }

        return (
            React.DOM.div(null, 
                React.DOM.h4(null, control.label, React.DOM.span({class: "required"}, "*")), 
                React.DOM.fieldset(null, values), 
                React.DOM.pre(null,  JSON.stringify(control.values) )
            )
            );
    }
});

window.XForms.React.MultiSelectCompact = React.createClass({displayName: 'MultiSelectCompact',

    oncheck: function (index, value) {
        this.props.oncheck(index, value);
    },
    render: function() {

        var self = this;
        var values = this.props.values;

        var inputs = values.map(function(value, i){

            var handler = self.oncheck.bind(self, i, value);
            return (React.DOM.span({key: i}, React.DOM.input({type: "checkbox", checked: value.checked, onChange: handler}), value.value) );
        });

        return (React.DOM.div(null, inputs));
    }
});

window.XForms.React.MultiSelectColumns = React.createClass({displayName: 'MultiSelectColumns',

    oncheck: function (index, value) {
        this.props.oncheck(index, value);
    },
    render: function() {

        var self = this;
        var values = this.props.values;

        var count = this.props.columncount;
        var columnClasses = React.addons.classSet({

            column1: count === 1,
            column2: count === 2,
            column3: count === 3,
            column4: count === 4,
            column5: count === 5,
            column6: count === 6,
            column7: count === 7,
            column8: count === 8,
            column9: count === 9,
            column10: count === 10
        });

        var inputs = values.map(function(value, i){

            var handler = self.oncheck.bind(self, i, value);
            return (React.DOM.div({key: i}, React.DOM.input({type: "checkbox", checked: value.checked, onChange: handler}), " ", value.value));
        });

        return (React.DOM.div({className: columnClasses}, inputs));
    }
});


/** @jsx React.DOM */

'use strict';

window.XForms.React.Application = React.createClass({displayName: 'Application',

    render: function() {

        console.log(this.props);

        var models = this.props.data.controldata.map(function (item, i) {

            var controltype = window.XForms.React[item.type];

            if (controltype) {
                return window.XForms.React.Control({ key: i, model: item }, controltype(null));
            }
        });

        return (
            React.DOM.div(null, models)
            );
    }
});

React.renderComponent(
    XForms.React.Application({data: window.XForms.FormData}), document.getElementById('app')
    // later we can wrap the reference to window.FormData in a factory object, and eventually have the object fetch the data from the server
);
