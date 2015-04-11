'use strict';

/**
 * @ngdoc function
 * @name myAmericaApp.controller:ResultsCtrl
 * @description
 * # ResultsCtrl
 * Controller of the myAmericaApp
 */
angular.module('myAmericaApp')
  .controller('ResultsCtrl', function ($scope, $rootScope, RecAreas, RIDB_API_KEY) {
    $scope.$on('questionsAnswered', function(event, args) {
      console.log('caught broadcast');
	  console.log($scope);
      $scope.age = args["answer1"];
      $scope.lengthOfStay = args["answer2"];
      $scope.lat = args["lat"];
      $scope.lng = args["lng"];
      $scope.interests = args["interests"];

      RecAreas.get({"apikey": RIDB_API_KEY, "latitude": $scope.lat, "longitude": $scope.lng, "activity": activities}, function(results) {
        $scope.results = results;
      });
      // do what you want to do
    });


 	RecAreas.get({"apikey": RIDB_API_KEY, "latitude": $rootScope.lat, "longitude": $rootScope.lng, "activity" : $rootScope.activitiesSelected.toString()}, function(results) {
    	console.log(results);
		console.log(results['RECDATA']);

		var map = L.map('mapResults').setView([$scope.lat, $scope.lng], 10);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		$(results['RECDATA']).each(function(i, v){
			console.log(v);
			var title = v.RecAreaName;
			var contactEmail = v.RecAreaEmail;
			var contactPhone = v.RecAreaPhone;

			var popUpText = "<strong>" + title + "</strong>";

			if (contactEmail != ""){
				popUpText = popUpText + "<p>" + contactEmail + "</p>";
			}

			if (contactPhone != ""){
				popUpText = popUpText + "<p>" + contactPhone + "</p>";
			}

			L.marker([v.RecAreaLatitude, v.RecAreaLongitude]).addTo(map)
				.bindPopup(popUpText)
				.openPopup();
		});

      $scope.results = results;
    });
  });
