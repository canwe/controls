/** @jsx React.DOM */

'use strict';
window.XForms.React.GridControl = React.createClass({

    componentWillMount: function () {

        var control = this.props.model;

        if (control.values.length === 0 && control.startwithsinglerow) {
            control.values.push(control.template.map(function (x) { return _.clone(x); }));
        }
    },
    add: function () {

        var control = this.props.model;
        var values = control.values;
        values.push(control.template.map(function (x) { return _.clone(x); }));

        this.props.changeState({
            'values': values
        });
    },
    render: function() {

        var self = this;
        var control = this.props.model;

        var showRemoveButton = function () {
            return true;
        };

        var requiredMarkerClasses = React.addons.classSet({
            'required': true,
            'hide': !control.required
        });

        var addButtonClasses = React.addons.classSet({
            'hide': !control.showaddbutton
        });

        var headers = control.template.map(function (column, i) {
            var headerClasses = React.addons.classSet(
                {'required': true,
                'hide': !column.required
            });
            return (<td key={i}>{column.title} <span className={headerClasses}>*</span></td>);
        });

        var rows = control.values.map(function (row, i) {

            var td =  row.map(function (cell, j) {
                return (<td key={i+j}>{JSON.stringify(cell)}</td>);
            });

            return (<tr>{td}</tr>);
        });

        return (
            <div className="itforms-control">

                <h4>{control.label} <span className={requiredMarkerClasses}>*</span></h4>
                <fieldset>
                    <button className={addButtonClasses} onClick={self.add}>Add</button>
                    <table className="gridcontrol">
                        <thead><tr>{headers}</tr></thead>
                        <tbody>{rows}</tbody>
                     </table>
                </fieldset>
                <pre>{JSON.stringify(control)}</pre>
            </div>
            );
    }
});