angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  //###################### Fingerprint Plugin Test ###############################
  var Fingerprint = window.Fingerprint;


  Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

  function successCallback(){
    alert("Authentication successfull");
  }

  function errorCallback(){
    alert("Authentication invalid");
  }

  function isAvailableSuccess(result) {
    $scope.available = "Fingerprint available";
    if (result.isAvailable) {
      console.log("Show...");
      Fingerprint.show({
        clientId: "Fingerprint-Demo",
        clientSecret: "password"
      }, successCallback, errorCallback);
    }
  }

  function isAvailableError(message) {
    $scope.available = "isAvailableError(): " + JSON.stringify(message);
  }


  //##################### Fingerprint Plugin Test End#############################

});
