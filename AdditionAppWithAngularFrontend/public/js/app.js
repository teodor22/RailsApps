'use strict';

var app = angular.module('AngularAdditionApp', []);

app.controller('AngularAdditionController', ['$scope', '$http', function($scope, $http) {
  // begin

  $scope.currentlyViewing = 'inputPage';
  $scope.currentlyTalkingToTheServer = false;
  $scope.firstNumber  = '';
  $scope.secondNumber = '';
  $scope.result = 0;

  function performAddition() {
    $scope.currentlyTalkingToTheServer = true;
    $http.post('/performaddition', {'firstnumber': $scope.firstNumber, 'secondnumber': $scope.secondNumber})
      .success(function(data, status, headers, config) {
        $scope.result = data['result'];
        $scope.currentlyTalkingToTheServer = false;
        $scope.firstNumber  = '';
        $scope.secondNumber = '';
        $scope.currentlyViewing = 'resultPage';
      })
      .error(function(data, status, headers, config) {
        console.log('Error when requesting addition result.');
      });
  }
  $scope.performAddition = performAddition;

  function backToInputPage() {
    $scope.currentlyViewing = 'inputPage';
  }
  $scope.backToInputPage = backToInputPage;

  // end

  window.sc = $scope;

}]);

