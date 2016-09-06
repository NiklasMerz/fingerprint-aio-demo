angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform) {

$ionicPlatform.ready(function() {
  //###################### Fingerprint Plugin Test ###############################
  Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

  function successCallback(){
    alert("Authentication successfull");
  }

  function errorCallback(){
    alert("Authentication invalid");
  }

  function isAvailableSuccess(result) {
    $scope.available = "Fingerprint available";
    console.log("Is available callback triggered", result);
      Fingerprint.show({
        clientId: "Fingerprint-Demo",
        clientSecret: "password"
      }, successCallback, errorCallback);
  }

  function isAvailableError(message) {
    $scope.available = "isAvailableError(): " + JSON.stringify(message);
    console.error(message);
  }
  //##################### Fingerprint Plugin Test End#############################
});

});
