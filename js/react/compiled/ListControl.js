
/** @jsx React.DOM */

'use strict';

window.XForms.React.ListControl = React.createClass({displayName: 'ListControl',

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

        var listItems = control.values.map(function (item) {

            var removeHandler = self.remove.bind(self, item);
            return (React.DOM.li(null, item, React.DOM.button({className: listItemClasses, onClick: removeHandler}, "X")));
        });

         return (
            React.DOM.div(null, 
                React.DOM.h4(null, control.name, " ", React.DOM.span({className: requiredMarkerClasses}, "*")), 

                React.DOM.div({className: "input-append"}, 
                    React.DOM.input({type: "text", disabled: !control.enabled, 'ng-blur': "HandleBlur()", ref: "addText"}), 
                    React.DOM.button({onClick: this.add, 'ng-disabled': "!newvalue", 'ng-show': "control.enabled", className: addButtonClasses}, "Add")
                ), 

                React.DOM.ul(null, listItems)
            )
            );
    }
});

