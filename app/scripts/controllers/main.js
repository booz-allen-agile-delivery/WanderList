'use strict';

/**
 * @ngdoc function
 * @name myAmericaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myAmericaApp
 */
angular.module('myAmericaApp')
  .controller('MainCtrl', function ($scope, geolocation, $rootScope, $location, RecAreas, Activities, RIDB_API_KEY) {

    geolocation.getLocation().then(function(data){
      $scope.coords = {lat:data.coords.latitude, lng:data.coords.longitude};
		console.log($scope.coords.lat);
    });

    $scope.usStates = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY","AE","AA","AP"];


    $scope.firstOptions = ['Young','Young at heart'];
    $scope.secondOptions = ['Short (a few days)', 'Long (a week or more)'];
    $scope.lat = 37.431573;
    $scope.lng = -78.656894;
    $scope.interests = {
      "Camping" : false,
      "Driving/Biking": false,
      "Fishing/Hunting": false,
      "General Outdoor Activities": false,
      "Hiking": false,
      "Horseback Riding": false,
      "Photography": false,
      "Rock Climbing": false,
      "Visiting Cultural Sites": false,
      "Snow Activities": false,
      "Water Activities": false
    };

    $scope.interestsList = [
      "Camping" ,
      "Driving/Biking" ,
      "Fishing/Hunting" ,
      "General Outdoor Activities" ,
      "Hiking",
      "Photography" ,
      "Rock Climbing",
      "Visiting Cultural Sites",
      "Snow Activities",
      "Water Activities"
    ];

    $scope.interestsArray = {
      "Camping": [9, 30, 40, 42, 44],
      "Driving/Biking": [5, 4, 18, 23],
      "Fishing/Hunting": [11, 27, 16],
      "General Outdoor Activities": [32, 33, 38, 39, 41, 35, 36, 37, 20, 24, 26],
      "Hiking": [14, 28],
      "Photography": [104],
      "Rock Climbing": [7],
      "Visiting Cultural Sites": [8, 10],
      "Snow Activities": [22, 43],
      "Water Activities": [6, 25, 31, 105, 106, 107, 34, 103, 108]
    };
    $scope.fullInterestsEncoded=[];

    $scope.firstAnswered = function(answer) {
      $scope.showSecond = true;
      $scope.answer1 = answer;
      var firstAnswer = {"questionId": "1", "selectedOption": answer, "email": $('#email').val()};
      // totalQuery["answer1"] = answer;
    };

    $scope.secondAnswered = function(answer) {
      $scope.showThird = true;
      $scope.answer2 = answer;
      var firstAnswer = {"questionId": "1", "selectedOption": answer, "email": $('#email').val()};
    };

    $scope.goToResults = function goToResults(){

      for (var i = 0; i < $scope.interestsList.length; i++) {

        if($scope.interests[$scope.interestsList[i]]){
          $scope.fullInterestsEncoded = $scope.fullInterestsEncoded.concat($scope.interestsArray[$scope.interestsList[i]]);
        }
      }

      if(!$scope.elsewhere) {
        $rootScope.$broadcast('questionsAnswered', {
          "answer1": $scope.answer1,
          "answer2": $scope.answer2,
          "lat": $scope.coords.lat,
          "lng": $scope.coords.lng,
          "interests": $scope.interests
        });
      }
      else{
        $rootScope.state = $scope.whichState;
        $rootScope.$broadcast('questionsAnswered', {
          "answer1": $scope.answer1,
          "answer2": $scope.answer2,
          "state": $scope.whichState,
          "interests": $scope.interests
        });
      }

      $rootScope.lat = $scope.coords.lat;
      $rootScope.lng = $scope.coords.lng;
      $rootScope.activitiesSelected = $scope.fullInterestsEncoded;
      $location.path('/results');

      function logArrayElements(element, index, array) {
        console.log(element);

        $scope.fullInterestsEncoded = $scope.fullInterestsEncoded.concat(obj[element]);
        console.log($scope.fullInterestsEncoded);
      }
    };

    $scope.checkChange = function checkChange(status, interest){
      $scope.interests[interest] = status;
      console.log($scope.interests);
    };

    RecAreas.get({"apikey": RIDB_API_KEY}, function(activities) {
      console.log(activities);
      $scope.activities = activities;
    });

  });
