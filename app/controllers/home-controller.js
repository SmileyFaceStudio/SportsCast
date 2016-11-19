import Xray from 'x-ray';

export default function HomeController () {
  return ['$scope', '$http', 'nbaGames', function($scope, $http, nbaGames) {
  	var xrayObject = []; 
    var x = Xray();
    $scope.view = 'Home View';
    $scope.games = [];

    // $scope.games = nbaGames.gameData;
    
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
    	status: 'a'
	}])(function(err, obj) {

  //filters out the non-games info out of the list of games
  var filteredObj = obj.filter(function (value) {
    return value.teams.length !== 0;
  })

  //add scores to each game
  angular.forEach(filteredObj, function(value, key) {
    var splitSource = value.source.split(' ');
    value.scores = splitSource.filter(function(part) {
      return !isNaN(part);
    })
  })

    	console.log(filteredObj);
      $scope.games = filteredObj;
      $scope.$apply();
	})

    $scope.action = function () {
    	$scope.view = 'Changed View';
    }

 //    function scrape (count) { 
 //    	x('http://nbastream.net', '#featured a', [{
	// 	title: '@title',
 //    	link: '@href'
	// }])(function(err, obj) {
	// 	xrayObject = obj.filter(function(el) {
	// 		return el.link !== 'http://nbastream.net/ads/index.html'
	// 	})
	// 	xrayObject = xrayObject.splice(0, count);
	// 	console.log(xrayObject);
	// 	angular.forEach($scope.games, function(element) {
	// 		angular.forEach(xrayObject, function(x) {
	// 			if (x.title.includes(element.homeTeam)) {
	// 				element.link = x.link;
	// 			}
	// 		})
	// 	})
	// 	console.log($scope.games);
	// })
	// }
  }];
}
