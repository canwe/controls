
/** @jsx React.DOM */


window.XForms.React.ListControl = React.createClass({

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
            return (<li key={i}>{item}<button className={listItemClasses} onClick={removeHandler}>X</button></li>);
        });

         return (
            <div>
                <h4>{control.name} <span className={requiredMarkerClasses}>*</span></h4>

                <div className="input-append">
                    <input type="text" disabled={!control.enabled} onKeyUp={this.enableAddButton} ref="addText" />
                    <button onClick={this.add} disabled={this.state.addButtonDisabled} className={addButtonClasses}>Add</button>
                </div>

                <ul>{listItems}</ul>


                <pre>{ JSON.stringify(control.values) }</pre>
            </div>
            );
    }
});

