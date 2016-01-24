import Xray from 'x-ray';

export default function HomeController () {
  return ['$scope', '$http', function($scope, $http) {
  	var xrayObject = [];
    $scope.view = 'Home View';
	var x = Xray();
    
    $http.get('https://www.kimonolabs.com/api/ondemand/aweuktb4?apikey=c74bb2e2255732911973aae894592185')
    .then(function(response) {
    	$scope.games = response.data.results.boxScores;
    	$scope.scrape(response.data.count);
 	}, function (response) {
    	console.log(response);
    });

    $scope.action = function () {
    	$scope.view = 'Changed View';
    }

    $scope.scrape = function (count) { 
    	x('http://nbastream.net', '#featured a', [{
		title: '@title',
    	link: '@href'
	}])(function(err, obj) {
		xrayObject = obj.filter(function(el) {
			return el.link !== 'http://nbastream.net/ads/index.html'
		})
		xrayObject = xrayObject.splice(0, count);
		console.log(xrayObject);
		angular.forEach($scope.games, function(element) {
			angular.forEach(xrayObject, function(x) {
				if (x.title.indexOf(element.homeTeam) > -1) {
					element.link = x.link;
				}
			})
		})
		console.log($scope.games);
	})
	}



  }];
}
