/** @jsx React.DOM */

'use strict';

window.XForms.React.MultiSelectControl = React.createClass({displayName: 'MultiSelectControl',

    render: function() {

        var control = this.props.model;
        var values = '';

        if (control.style === 'compact') {
            values = window.XForms.React.MultiSelectCompact({values: control.values});
        } else if (control.style === 'oneperline') {
            values = window.XForms.React.MultiSelectColumns({values: control.values, columncount: 1});

        } else if (control.style === 'columns') {
            values = window.XForms.React.MultiSelectColumns({values: control.values, columncount: control.columncount});

        }

        return (
            React.DOM.div(null, 
                React.DOM.h4(null, control.label, React.DOM.span({class: "required"}, "*")), 
                React.DOM.fieldset(null, values)
            )
            );
    }
});

window.XForms.React.MultiSelectCompact = React.createClass({displayName: 'MultiSelectCompact',

    render: function() {

        var values = this.props.values;

        var inputs = values.map(function(value){
            return (React.DOM.span(null, React.DOM.input({type: "checkbox", checked: value.checked}), value.value) );
        });

        return (React.DOM.div(null, inputs));
    }
});

window.XForms.React.MultiSelectColumns = React.createClass({displayName: 'MultiSelectColumns',

    render: function() {

        var count = this.props.columncount;
        var values = this.props.values;

        var columnClasses = React.addons.classSet({

            column1: count === 1,
            column2: count === 2,
            column3: count === 3,
            column4: count === 4,
            column5: count === 5,
            column6: count === 6 ,
            column7: count === 7,
            column8: count === 8,
            column9: count === 9,
            column10: count === 10
        });

        var inputs = values.map(function(value){
            return (React.DOM.div(null, React.DOM.input({type: "checkbox", checked: value.checked}), " ", value.value));
        });

        return (React.DOM.div({className: columnClasses}, inputs));
    }
});
