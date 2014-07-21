var app = angular.module('app', []);

app.directive('itformsGridControl', function (form) {

    return {
      restrict:'E',
      replace: true,
      scope: {
      },
      controller: function ($scope) {

          $scope.showRemoveButton = function ()  {

              return $scope.control.enable && (!$scope.control.required || ($scope.control.required && $scope.control.values.length > 1));
          };

      },
      templateUrl: 'partials/GridControl.html',
      link: function (scope, element, attr) {
            scope.control = form.controls.get(attr.name);
      }
    };
});

app.factory('form', function () {

    var form = { controls: [] };

    var data = window.ITFormsData.controls;

    _.each(data, function ( controldata ) {

        form.controls.push(new ITForms.Controls[controldata.type](controldata));
    });

    form.controls.get = function (controlname) {
        return _.find(form.controls, function(control){ return control.name === controlname; })
    } ;

    return form;

});

window.ITForms = {};
window.ITForms.Controls = {};

window.ITForms.Controls.GridControl = function(config) {

    this.values = [];

    for(prop in config) {
        this[prop] = config[prop];
    }

    this.add = function () {

        this.values.push(_.map(this.template, function (cell) { return _.clone(cell); }));
    };

    this.remove = function (row) {
        this.values.splice(this.values.indexOf(row), 1)
    };

    if (this.values.length === 0) {
        this.add();
    }
};
