angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform) {

  $ionicPlatform.ready(function() {
    //Is available
    if (typeof Fingerprint != 'undefined') {
      Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
      $scope.available = "Not checked";

      function isAvailableSuccess(result) {
        $scope.available = "Fingerprint available";
      }

      function isAvailableError(message) {
        $scope.available = "isAvailableError(): " + JSON.stringify(message);
        console.error(message);
      }
    }
  });

  $scope.showAuth = function(){
    //Authenticate
    Fingerprint.show({
      clientId: "Fingerprint-Demo",
      clientSecret: "password"
    }, successCallback, errorCallback);

    function successCallback(){
      alert("Authentication successfull");
    }

    function errorCallback(err){
      alert("Authentication invalid " + err);
    }

  };

});
