angular.module('appModule').controller('FormControllers', function ($scope) {
  $scope.isFormCollapsed = false;
  $scope.formCollapsed = function () {
      $scope.isFormCollapsed = !$scope.isFormCollapsed;
  };

});