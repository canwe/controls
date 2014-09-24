/** @jsx React.DOM */

'use strict';

window.XForms.React.MultiSelectControl = React.createClass({

    onChecked: function (index, value) {

        var values = this.props.model.values;

        values[index].checked = !value.checked;

        this.props.changeState({
            'values': values
        });
    },
    render: function() {

        var control = this.props.model;
        var values = '';
        var columncount = (control.style === 'columns') ? control.columncount : 1;

        var requiredMarkerClasses = React.addons.classSet({
            'required': true,
            'hide': !control.required
        });

        if (control.style === 'compact') {
            values = <window.XForms.React.MultiSelectCompact values={control.values} onChecked={this.onChecked} />;
        } else  {
            values = <window.XForms.React.MultiSelectColumns  values={control.values} onChecked={this.onChecked} columncount={columncount} />;
        }

        return (
            <div>
                <h4>{control.label}<span className={requiredMarkerClasses}>*</span></h4>
                <fieldset>{values}</fieldset>
            </div>
            );
    }
});

window.XForms.React.MultiSelectCompact = React.createClass({

    onChecked: function (index, value) {
        this.props.onChecked(index, value);
    },
    render: function() {

        var self = this;
        var values = this.props.values;

        var inputs = values.map(function (value, i) {

            var handler = self.onChecked.bind(self, i, value);
            return (<span key={i}><input type="checkbox" checked={value.checked} onChange={handler} /> {value.value}</span> );
        });

        return (<div>{inputs}</div>);
    }
});

window.XForms.React.MultiSelectColumns = React.createClass({

    onChecked: function (index, value) {
        this.props.onChecked(index, value);
    },
    render: function() {

        var self = this;
        var values = this.props.values;

        var classes = {};
        classes['column' + (this.props.columncount)] = true
        var columnClasses = React.addons.classSet(classes);

        var inputs = values.map(function(value, i){

            var handler = self.onChecked.bind(self, i, value);
            return (<div key={i}><input type="checkbox" checked={value.checked} onChange={handler} /> {value.value}</div>);
        });

        return (<div className={columnClasses}>{inputs}</div>);
    }
});
