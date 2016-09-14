angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicPlatform, $cordovaFingerprint) {

  $ionicPlatform.ready(function() {
    //Is available
    $cordovaFingerprint.isAvailable().then(
      isAvailableSuccess, isAvailableError
    );
    $scope.available = "Not checked";

    function isAvailableSuccess(result) {
      $scope.available = "Fingerprint available";
    }

    function isAvailableError(message) {
      $scope.available = "isAvailableError(): " + JSON.stringify(message);
      console.error(message);
    }
  });

  $scope.showAuth = function(){
    //Authenticate
    $cordovaFingerprint.show({
      clientId: "Fingerprint-Demo",
      clientSecret: "password"
    }).then(successCallback, errorCallback);

    function successCallback(){
      alert("Authentication successfull");
    }

    function errorCallback(err){
      alert("Authentication invalid " + err);
    }

  };

});
