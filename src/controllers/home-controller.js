import Xray from 'x-ray';

export default function HomeController () {
  return ['$scope', '$http', '$state', 'teamList', function($scope, $http, $state, teamList) {
  	var xrayObject = []; 
    var x = Xray();
    $scope.view = 'Home View';
    $scope.games = [];
    
  //   $http.get('https://www.kimonolabs.com/api/ondemand/aweuktb4?apikey=c74bb2e2255732911973aae894592185')
  //   .then(function(response) {
  //   	$scope.games = response.data.results.boxScores;
  //   	$scope.scrape(response.data.count);
 	// }, function (response) {
  //   	console.log(response);
  //   });

  x('http://www.reddit.com/r/nba', 'blockquote li', [{
    	teams: ['strong'],
    	source: ''
	}])(function(err, obj) {

  //filters out the non-games info out of the list of games
  var filteredObj = obj.filter(function (value) {
    return value.teams.length !== 0;
  })

  //add scores, status, logos to each game
  angular.forEach(filteredObj, function(value, key) {
    var splitSource = value.source.split(' ');
    value.scores = splitSource.filter(function(part) {
      return !isNaN(part);
    })

    //return status of game and removes it from splitted string array
    if (!splitSource[splitSource.length - 1].includes('FINAL')) {
      value.status = splitSource.pop();
      value.status = splitSource.pop() + ' ' + value.status;
    } else {
      value.status = splitSource.pop();
    }

    //overwrites team array in case teams aren't found in scraper
    value.teams = splitSource.filter(function(part) {
      return isNaN(part);
    })

    //if LA, make it LAC for LA Clippers
    if (value.teams.includes('LA')) {
      value.teams[value.teams.indexOf('LA')] = 'LAC';
    }

    value.teamNames = [teamList.abbreviations[value.teams[0]], teamList.abbreviations[value.teams[1]]];

    //get logos
    value.logo = ["https://neulionms-a.akamaihd.net/nba/player/v6/nba/site/images/teams/" + value.teams[0] + '.png', 
    "https://neulionms-a.akamaihd.net/nba/player/v6/nba/site/images/teams/" + value.teams[1] + '.png'];
  })

    	console.log(filteredObj);
      $scope.games = filteredObj;
      $scope.$apply();
	})

    $scope.action = function () {
    	$scope.view = 'Changed View';
    }

    $scope.viewStreams = function(teams) {
      $state.go('view', { obj: teams });
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
