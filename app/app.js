(function () {'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var electron = require('electron');
var jetpack = _interopDefault(require('fs-jetpack'));
var angular$1 = _interopDefault(require('angular'));
var angularUiRouter = require('angular-ui-router');
var angularAnimate = require('angular-animate');
var Xray = _interopDefault(require('x-ray'));
var getUrl = _interopDefault(require('get-urls'));

// Simple wrapper exposing environment variables to rest of the code.

// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');

var routeConfig = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('splash', {
        url: "/",
        templateUrl: "partials/splash.html"
    })
    .state('select', {
        url: "/select",
        templateUrl: "partials/select.html",
        controller: "SelectController"
    })
    .state('frame', {
        abstract: true,
        url: "",
        templateUrl: "partials/frame.html",
        controller: "FrameController"
    })
    .state('frame.home', {
        url: "/home",
        templateUrl: "partials/home.html",
        controller: "HomeController"
    })
    .state('view', {
        url: "/view",
        templateUrl: "partials/view.html",
        controller: "ViewController",
        params: {
            obj: null
        }
    });
    
    $urlRouterProvider.otherwise("/");

}];

function FrameController () {
  return ['$scope', function($scope) {
    $scope.items = 'FrameController';
    console.log($scope.items);
  }];
}

function HomeController () {
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
  });

  //add scores, status, logos to each game
  angular.forEach(filteredObj, function(value, key) {
    var splitSource = value.source.split(' ');
    value.scores = splitSource.filter(function(part) {
      return !isNaN(part);
    });

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
    });

    //if LA, make it LAC for LA Clippers
    if (value.teams.includes('LA')) {
      value.teams[value.teams.indexOf('LA')] = 'LAC';
    }

    value.teamNames = [teamList.abbreviations[value.teams[0]], teamList.abbreviations[value.teams[1]]];

    //get logos
    value.logo = ["https://neulionms-a.akamaihd.net/nba/player/v6/nba/site/images/teams/" + value.teams[0] + '.png', 
    "https://neulionms-a.akamaihd.net/nba/player/v6/nba/site/images/teams/" + value.teams[1] + '.png'];
  });

    	console.log(filteredObj);
      $scope.games = filteredObj;
      $scope.$apply();
	});

    $scope.action = function () {
    	$scope.view = 'Changed View';
    };

    $scope.viewStreams = function(teams) {
      $state.go('view', { obj: teams });
    };

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

function ViewController () {
  return ['$scope', '$http', '$stateParams', '$sce', function($scope, $http, $stateParams, $sce) {

    var x = Xray();

    console.log($stateParams);

    $scope.handleUrl = function(url) {
      $scope.streamUrl = $sce.trustAsResourceUrl(url);
      // x(url, 'iframe@src')(function(err, res) {
      //   if (res) {
      //     $scope.streamUrl = $sce.trustAsResourceUrl(res);
      //   } else {
      //     $scope.streamUrl = $sce.trustAsResourceUrl(url);
      //   }
      //   $scope.$apply();
      // });
    };

    $http.get('https://www.reddit.com/r/nbastreams/new.json').success(function(response) {
    	let redditData = response.data.children;
      var gameThread = [];
      var thread = '';
      angular.forEach(redditData, function(value, key) {
      	if (value.data.link_flair_text === 'Game Thread') {
      		return gameThread.push(value.data);
      	}
      });
      console.log(gameThread);
      angular.forEach(gameThread, function(value, key) {
        if (value.title.includes($stateParams.obj[0]) || value.title.includes($stateParams.obj[1]))
          thread = value.url;
      });

      console.log(thread);

      if (thread)
      	$http.get(thread + '.json').success(function(response) {
      		console.log('thread:', response);
          handleRedditAPI(response);
      	});
    });

    var handleRedditAPI = function(data) {
      var threadData = [];
      var threadLinks = [];

      //push each comment into an array and then flatten the array
      angular.forEach(data, function(value, key) {
        threadData.push(value.data.children);
      });
      console.log(threadData);
      threadData = threadData.reduce(function(a, b) { 
        return a.concat(b);
      }).filter(function (value) {
        return value.kind == 't1';
      });

      //create array with ups and links from the body of the reddit comment threads
      angular.forEach(threadData, function(value, key) {
        var upsAndLinks = {'ups': value.data.ups, 'urls': getUrl(value.data.body_html)};
        threadLinks.push(upsAndLinks);
      });

      //filter out elements without links and sort by descending upvote order
      threadLinks = threadLinks.filter(function(value) {
        return value.urls.length;
      });

      threadLinks = threadLinks.sort((a, b) => a.ups - b.ups).reverse();

      console.log(threadLinks);

      $scope.streams = threadLinks;

    };
  }];
}

function SelectController () {
  return ['$scope', '$http', function($scope, $http) {

  }];
}

angular$1.module('app.controllers', [])
	.controller(FrameController.name, FrameController())
	
	.controller(HomeController.name, HomeController())
  
	.controller(ViewController.name, ViewController())

	.controller(SelectController.name, SelectController())

function passData () {
  return function() {  

    var productList = [];

    var addProduct = function(newObj) {
      productList.push(newObj);
    };

    var getProducts = function(){
      return productList;
    };

    return {
      addData: addProduct,
      getData: getProducts
    }
  }
}

function teamList () {
  return function() {  

    var abbreviations = {
      "GSW": "Golden State Warriors",
      "LAC": "Los Angeles Clippers",
      "LAL": "Los Angeles Lakers",
      "SAC": "Sacramento Kings",
      "PHX": "Phoenix Suns",
      "SAS": "San Antonio Spurs",
      "HOU": "Houston Rockets",
      "MEM": "Memphis Grizzlies",
      "DAL": "Dallas Mavericks",
      "NOP": "New Orleans Pelicans",
      "OKC": "Oklahoma City Thunder",
      "POR": "Portland Trailblazers",
      "UTA": "Utah Jazz",
      "DEN": "Denver Nuggets",
      "MIN": "Minnesota Timberwolves",
      "TOR": "Toronto Raptors",
      "BOS": "Boston Celtics",
      "NYK": "New York Knicks",
      "BKN": "Brooklyn Nets",
      "PHI": "Philadelphia 76ers",
      "CLE": "Cleveland Cavaliers",
      "CHI": "Chicago Bulls",
      "DET": "Detroit Pistons",
      "IND": "Indiana Pacers",
      "MIL": "Milwaukee Bucks",
      "ATL": "Atlanta Hawks",
      "CHA": "Charlotte Hornets",
      "ORL": "Orlando Magic",
      "WAS": "Washington Wizards",
      "MIA": "Miami Heat"

    };

    // var productList = [];

    // var addProduct = function(newObj) {
    //   productList.push(newObj);
    // };

    // var getProducts = function(){
    //   return productList;
    // };

    return {
      abbreviations: abbreviations
    }
  }
}

function nbaGames () {
  return function() {  
    var gameData = [];
    var x = Xray();

  x('http://www.reddit.com/r/nba', 'blockquote li', [{
      teams: ['strong'],
      source: '',
      status: 'a'
  }])(function(err, obj) {

  //filters out the non-games info out of the list of games
  var filteredObj = obj.filter(function (value) {
    return value.teams.length !== 0;
  });

  //add scores to each game
  angular.forEach(filteredObj, function(value, key) {
    var splitSource = value.source.split(' ');
    value.scores = splitSource.filter(function(part) {
      return !isNaN(part);
    });
  });

      console.log(filteredObj);
      gameData = filteredObj;

  });

console.log(gameData);

    return {
      gameData: gameData
    }
  }
}

angular$1.module('app.services', [])
	.service(passData.name, passData())
	.service(teamList.name, teamList())
	.service(nbaGames.name, nbaGames())

function mAppLoading () {
  return ['version', function(version) {
    return function(scope, elm) {
      elm.text(version.code);
    };
  }];
}


        // app.directive(
        //     "mAppLoading",
        //     function( $animate ) {
        //         // Return the directive configuration.
        //         return({
        //             link: link,
        //             restrict: "C"
        //         });
        //         // I bind the JavaScript events to the scope.
        //         function link( scope, element, attributes ) {
        //             // Due to the way AngularJS prevents animation during the bootstrap
        //             // of the application, we can't animate the top-level container; but,
        //             // since we added "ngAnimateChildren", we can animated the inner
        //             // container during this phase.
        //             // --
        //             // NOTE: Am using .eq(1) so that we don't animate the Style block.
        //             $animate.leave( element.children().eq( 1 ) ).then(
        //                 function cleanupAfterAnimation() {
        //                     // Remove the root directive element.
        //                     element.remove();
        //                     // Clear the closed-over variable references.
        //                     scope = element = attributes = null;
        //                 }
        //             );
        //         }
        //     }
        // );

angular$1.module('app.directives', [])

	.directive(mAppLoading.name, mAppLoading())

// Here is the starting point for the application

// Use new ES6 modules syntax for everything.
// console.log('Loaded environment variables:', env);

// var app = remote.app;
// var appDir = jetpack.cwd(app.getAppPath());

// // Holy crap! This is browser window with HTML and stuff, but I can read
// // here files like it is node.js! Welcome to Electron world :)
// console.log('The author of this app is:', appDir.read('package.json', 'json').author);
// console.log('This is angular object ' + angular);

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('greet').innerHTML = greet();
//     document.getElementById('platform-info').innerHTML = os.platform();
//     document.getElementById('env-name').innerHTML = env.name;
// });

angular$1
    .module('app', [
        'ui.router',
        'ngAnimate',
        'app.controllers',
        'app.services',
        'app.directives'
    ]);

angular$1.module('app').config(routeConfig);

}());
//# sourceMappingURL=app.js.map