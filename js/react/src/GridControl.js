/** @jsx React.DOM */

'use strict';
window.XForms.React.GridControl = React.createClass({

    componentWillMount: function () {

        var control = this.props.model;

        if (control.values.length === 0 && control.startwithsinglerow) {
            control.values.push(control.template.map(function (x) { return _.clone(x); }));
        }
    },
    componentDidMount: function () {

        $(this.getDOMNode()).find('.datepicker').pickadate();
    },
    componentDidUpdate: function () {

        $(this.getDOMNode()).find('.datepicker').pickadate();
    },

    add: function () {

        var control = this.props.model;
        var values = control.values;
        values.push(control.template.map(function (x) { return _.clone(x); }));

        this.props.changeState({
            'values': values
        });
    },
    textbox: function (cell) {
        return (<input type="text" disabled={!cell.enabled} placeholder={cell.placeholder} />);
    },
    checkbox: function (cell) {
        return (<div><input type="checkbox" disabled={ !cell.enabled } /><label>{cell.value}</label></div>);
    },
    paragraph: function (cell) {
        return (<p dangerouslySetInnerHTML={{ __html: cell.value }}></p>);
    },
    textarea: function (cell) {
        return (<textarea disabled={!cell.enabled} placeholder={cell.placeholder}></textarea>);
    },
    dropdownlist: function (cell) {
        var options = cell.values.map(function (value) {
            return (<option>{value}</option>);
        });
        return ( <select disabled={!cell.enabled} placeholder={cell.placeholder}>{options}</select>);
    },
    date: function (cell) {
        return (<input type="datetime" className="datepicker" disabled={!cell.enabled} placeholder={cell.placeholder} />);
    },
    render: function() {

        var self = this;
        var control = this.props.model;
        var rowCount = control.values.length;

        var showRemoveButton = function (rowCount) {

            if (!control.showremovebuttons) {
                return false;
            }

            // if the control is required, don't show the remove button if there's only one row
            return !control.required || (control.required && rowCount > 1);
        }(rowCount);

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

        var removeButtonClasses = React.addons.classSet({
            'hide': !showRemoveButton
        });

        var rows = control.values.map(function (row, i) {

            var td = row.map(function (cell, j) {
                return (<td key={i+j}>{self[cell.type](cell)}</td>);
            });

            var remove = (<td className={removeButtonClasses}><button className="btn btn-danger">X</button></td>);
            return (<tr>{td}{remove}</tr>);
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