import Xray from 'x-ray';

export default function HomeController () {
  return ['$scope', '$http', function($scope, $http) {
  	var xrayObject = [];
    $scope.view = 'Home View';
	var x = Xray();
    
  //   $http.get('https://www.kimonolabs.com/api/ondemand/aweuktb4?apikey=c74bb2e2255732911973aae894592185')
  //   .then(function(response) {
  //   	$scope.games = response.data.results.boxScores;
  //   	$scope.scrape(response.data.count);
 	// }, function (response) {
  //   	console.log(response);
  //   });
	x('http://www.reddit.com/r/nba', 'blockquote li', [{
    	teams: ['strong'],
    	source: '',
    	score: 'a'
	}])(function(err, obj) {
    	
    	obj.forEach(function(element, index, object) {
        	if (element.teams.length === 0) {
            	object.splice(index, 1);
        	}
    	})
    	obj.splice(0, 2); //forEach loop not working as expected
    	
    	// angular.forEach(obj, function(value, key) {
    	// 	if (value.teams.length === 0) {
    	// 		obj.splice(key, 1);
    	// 	} else if (!value.source) {
    	// 		obj.splice(key, 1);
    	// 	}
    	// })
    	console.log(obj);
	});

    $scope.action = function () {
    	$scope.view = 'Changed View';
    }

    function scrape (count) { 
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
				if (x.title.includes(element.homeTeam)) {
					element.link = x.link;
				}
			})
		})
		console.log($scope.games);
	})
	}



  }];
}
