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
