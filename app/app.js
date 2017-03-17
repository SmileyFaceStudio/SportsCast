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
    .state('rep', {
        url: "/rep",
        templateUrl: "partials/rep.html",
        controller: "RepController"
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
  return ['$scope', '$http', '$stateParams', '$sce', 'teamList', function($scope, $http, $stateParams, $sce, teamList) {

    var x = Xray();

    const subreddit = 'nbastreams';

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

    reddit.hot(subreddit).limit(5).fetch(function(res) {
    // res contains JSON parsed response from Reddit
    console.log(res);
    var redditData = res.data.children;
    var gameThread = [];
    var threadId = '';
    angular.forEach(redditData, function(value, key) {
      if (value.data.link_flair_text === 'Game Thread') {
         return gameThread.push(value.data);
       }
    });

    console.log(gameThread);

    angular.forEach(gameThread, function(value, key) {
        if (value.title.includes($stateParams.obj[0]) || value.title.includes($stateParams.obj[1]))
          threadId = value.id;
    });

    console.log(threadId);

    // if (threadId) uncomment this out when game is ready
      reddit.comments(threadId, subreddit).sort("hot").fetch(function(res) {
      handleRedditAPI(res);
      });

    });

    // $http.get('https://www.reddit.com/r/nbastreams/new.json').then(function(response) {
    // 	let redditData = response.data.data.children;
    //   var gameThread = [];
    //   var thread = '';
    //   angular.forEach(redditData, function(value, key) {
    //   	if (value.data.link_flair_text === 'Game Thread') {
    //   		return gameThread.push(value.data);
    //   	}
    //   });
    //   console.log(gameThread);
    //   angular.forEach(gameThread, function(value, key) {
    //     if (value.title.includes($stateParams.obj[0]) || value.title.includes($stateParams.obj[1]))
    //       thread = value.url;
    //   })

    //   console.log(thread);

    //   if (thread)
    //   	$http.get(thread + '.json').then(function(response) {
    //   		console.log('thread:', response);
    //       handleRedditAPI(response);
    //   	});
    // }, function(err) {
    //   return alert("Error getting stream links");
    // });

    var handleRedditAPI = function(data) {
      var threadData = [];
      var threadLinks = [];

      console.log(teamList.thread[1]);

      //push each comment into an array and then flatten the array
      // CHANGE TEAMLIST.THREAD to data once game is ready
      angular.forEach(teamList.thread[1].data.children, function(value, key) {
        threadData.push(value.data);
      });
      console.log(threadData);
      // threadData = threadData.reduce(function(a, b) { 
      //   return a.concat(b);
      // }).filter(function (value) {
      //   return value.kind == 't1';
      // });

      //create array with ups and links from the body of the reddit comment threads
      angular.forEach(threadData, function(value, key) {
        var upsAndLinks = {'ups': value.ups, 'urls': getUrl(value.body_html)};
        threadLinks.push(upsAndLinks);
      });

      //filter out elements without links and sort by descending upvote order
      threadLinks = threadLinks.filter(function(value) {
        return value.urls.length;
      });

      threadLinks = threadLinks.sort((a, b) => a.ups - b.ups).reverse();

      console.log(threadLinks);

      $scope.streams = threadLinks;
      $scope.$apply();

    };
  }];
}

function SelectController () {
  return ['$scope', '$http', '$filter', 'teamList', function($scope, $http, $filter, teamList) {
    var vm = this;
  
  vm.active = 0;
  vm.images = [];

  var x;
  for (x in teamList.abbreviations) {
    let defaultObj = {team: x, logo: "http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/" + $filter('lowercase')(x) + '.png'};
    console.log(defaultObj);
    vm.images.push(defaultObj);
  }

  vm.position = position;
  vm.next = next;
  vm.prev = prev;

  var pLen = vm.images.length;
  
  function position(key) {
    return {
      left: key < vm.active,
      right: key > vm.active,
      hide: Math.abs(vm.active-key) > 1
    }
  }
  
  function next() {
    if (vm.active < pLen-1) {
      vm.active += 1;
    }
  }
  
  function prev() {
    if (vm.active > 0) {
      vm.active -= 1;
    }
  }
  }];
}

function RepController () {
  return ['$scope', 'teamList', function($scope, teamList) {
    var colorObj = teamList.colors;
    $scope.teams = [];
    for(var key in colorObj) {
    	if(colorObj.hasOwnProperty(key)) {
        	let teamObj = {'abbreviation': key, 'backgroundColor': colorObj[key]};
        	$scope.teams.push(teamObj);
    	}
	}

	$scope.selectedTeam = $scope.teams[0];

	$scope.selectTeam = function(team) {
		$scope.selectedTeam = team;
	};
  }];
}

angular$1.module('app.controllers', [])
	.controller(FrameController.name, FrameController())
	
	.controller(HomeController.name, HomeController())
  
	.controller(ViewController.name, ViewController())

	.controller(SelectController.name, SelectController())

	.controller(RepController.name, RepController())

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

      "ATL": "Atlanta Hawks",
      "BOS": "Boston Celtics",
      "BKN": "Brooklyn Nets",
      "CHA": "Charlotte Hornets",
      "CHI": "Chicago Bulls",
      "CLE": "Cleveland Cavaliers",
      "DAL": "Dallas Mavericks",
      "DEN": "Denver Nuggets",
      "DET": "Detroit Pistons",
      "GSW": "Golden State Warriors",
      "HOU": "Houston Rockets",
      "IND": "Indiana Pacers",
      "LAC": "Los Angeles Clippers",
      "LAL": "Los Angeles Lakers",
      "MEM": "Memphis Grizzlies",
      "MIA": "Miami Heat",
      "MIL": "Milwaukee Bucks",
      "MIN": "Minnesota Timberwolves",
      "NOP": "New Orleans Pelicans",
      "NYK": "New York Knicks",
      "OKC": "Oklahoma City Thunder",
      "ORL": "Orlando Magic",
      "PHI": "Philadelphia 76ers",
      "PHX": "Phoenix Suns",
      "POR": "Portland Trailblazers",
      "SAC": "Sacramento Kings",
      "SAS": "San Antonio Spurs",
      "UTA": "Utah Jazz",
      "TOR": "Toronto Raptors",
      "WAS": "Washington Wizards"
      
    };

    var colors = {

      "ATL": "#FFFFFF",
      "BOS": "#4E7F5D",
      "BKN": "#FFFFFF",
      "CHA": "#008EA6",
      "CHI": "#000000",
      "CLE": "#880037",
      "DAL": "#1061AC",
      "DEN": "#4DA3D5",
      "DET": "#ED174C",
      "GSW": "#096EDB",
      "HOU": "#FFFFFF",
      "IND": "#FFC526",
      "LAC": "#0042AF",
      "LAL": "#FDB827",
      "MEM": "#FDB927",
      "MIA": "#FFFFFF",
      "MIL": "#EEE1C6",
      "MIN": "#000000",
      "NOP": "#B5985A",
      "NYK": "#F78429",
      "OKC": "#0A7EC2",
      "ORL": "#000000",
      "PHI": "#FFFFFF",
      "PHX": "#E56020",
      "POR": "#000000",
      "SAC": "#5A2B81",
      "SAS": "#C4CED4",
      "UTA": "#00471B",
      "TOR": "#000000",
      "WAS": "#E51837"
    };

    var thread = [{"kind": "Listing", "data": {"modhash": "", "children": [{"kind": "t3", "data": {"contest_mode": false, "banned_by": null, "media_embed": {}, "subreddit": "nbastreams", "selftext_html": "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;Rules:  &lt;/p&gt;\n\n&lt;ul&gt;\n&lt;li&gt;&lt;p&gt;Please only post links inside the appropriate thread, so as to keep things organized.  &lt;/p&gt;&lt;/li&gt;\n&lt;li&gt;&lt;p&gt;Always specify if your stream is HD, SD, etc. &lt;/p&gt;&lt;/li&gt;\n&lt;li&gt;&lt;p&gt;Please do not ask for certain links to be removed. &lt;/p&gt;&lt;/li&gt;\n&lt;li&gt;&lt;p&gt;Do not ask for any links to be privately messaged&lt;/p&gt;&lt;/li&gt;\n&lt;/ul&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;", "selftext": "Rules:  \n\n* Please only post links inside the appropriate thread, so as to keep things organized.  \n\n* Always specify if your stream is HD, SD, etc. \n \n* Please do not ask for certain links to be removed. \n\n* Do not ask for any links to be privately messaged", "likes": null, "suggested_sort": "top", "user_reports": [], "secure_media": null, "saved": false, "id": "5z1vgz", "gilded": 0, "secure_media_embed": {}, "clicked": false, "score": 4, "report_reasons": null, "author": "NBAstreamsbotv2", "link_flair_text": "Game Thread", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "over_18": false, "domain": "self.nbastreams", "hidden": false, "num_comments": 12, "thumbnail": "", "subreddit_id": "t5_340mn", "edited": false, "link_flair_css_class": "gamethread", "author_flair_css_class": null, "downs": 0, "brand_safe": false, "archived": false, "removal_reason": null, "stickied": false, "is_self": true, "hide_score": true, "spoiler": false, "permalink": "/r/nbastreams/comments/5z1vgz/game_thread_portland_trail_blazers_phoenix_suns/", "subreddit_type": "public", "locked": false, "name": "t3_5z1vgz", "created": 1489392006.0, "url": "https://www.reddit.com/r/nbastreams/comments/5z1vgz/game_thread_portland_trail_blazers_phoenix_suns/", "author_flair_text": null, "quarantine": false, "title": "Game Thread: Portland Trail Blazers @ Phoenix Suns (21:00:00 ET)", "created_utc": 1489363206.0, "ups": 4, "media": null, "upvote_ratio": 1.0, "mod_reports": [], "visited": false, "num_reports": null, "distinguished": null}}], "after": null, "before": null}}, {"kind": "Listing", "data": {"modhash": "", "children": [{"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum7vo", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "nbanicks", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "**Verified Streamers**\n\nUsername | Link | Ad Overlays\n--|--|--\n/u/YourSportsInHD2 | HD [HOME and AWAY feeds FULL 60 FPS/6000KBPS 720p English](http://yoursportsinhd.com/game/0021600988/)  | **0**\n/u/velocityraps | HD [EN 720p 6000kbps 60fps Suns Feed](http://nbastreams.pw/fox.php?title=0bd7c48a7d058f9fbfb0a6e3f216d1f5) | **2**\n/u/velocityraps | HD [EN 720p 6000kbps 60fps Blazers Feed](http://nbastreams.pw/na.php?id=0021600988&amp;feed=4) | **2**\n\n", "edited": 1489366737.0, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;&lt;strong&gt;Verified Streamers&lt;/strong&gt;&lt;/p&gt;\n\n&lt;table&gt;&lt;thead&gt;\n&lt;tr&gt;\n&lt;th&gt;Username&lt;/th&gt;\n&lt;th&gt;Link&lt;/th&gt;\n&lt;th&gt;Ad Overlays&lt;/th&gt;\n&lt;/tr&gt;\n&lt;/thead&gt;&lt;tbody&gt;\n&lt;tr&gt;\n&lt;td&gt;&lt;a href=\"/u/YourSportsInHD2\"&gt;/u/YourSportsInHD2&lt;/a&gt;&lt;/td&gt;\n&lt;td&gt;HD &lt;a href=\"http://yoursportsinhd.com/game/0021600988/\"&gt;HOME and AWAY feeds FULL 60 FPS/6000KBPS 720p English&lt;/a&gt;&lt;/td&gt;\n&lt;td&gt;&lt;strong&gt;0&lt;/strong&gt;&lt;/td&gt;\n&lt;/tr&gt;\n&lt;tr&gt;\n&lt;td&gt;&lt;a href=\"/u/velocityraps\"&gt;/u/velocityraps&lt;/a&gt;&lt;/td&gt;\n&lt;td&gt;HD &lt;a href=\"http://nbastreams.pw/fox.php?title=0bd7c48a7d058f9fbfb0a6e3f216d1f5\"&gt;EN 720p 6000kbps 60fps Suns Feed&lt;/a&gt;&lt;/td&gt;\n&lt;td&gt;&lt;strong&gt;2&lt;/strong&gt;&lt;/td&gt;\n&lt;/tr&gt;\n&lt;tr&gt;\n&lt;td&gt;&lt;a href=\"/u/velocityraps\"&gt;/u/velocityraps&lt;/a&gt;&lt;/td&gt;\n&lt;td&gt;HD &lt;a href=\"http://nbastreams.pw/na.php?id=0021600988&amp;amp;feed=4\"&gt;EN 720p 6000kbps 60fps Blazers Feed&lt;/a&gt;&lt;/td&gt;\n&lt;td&gt;&lt;strong&gt;2&lt;/strong&gt;&lt;/td&gt;\n&lt;/tr&gt;\n&lt;/tbody&gt;&lt;/table&gt;\n&lt;/div&gt;", "stickied": true, "subreddit": "nbastreams", "score_hidden": true, "subreddit_type": "public", "name": "t1_deum7vo", "created": 1489392169.0, "author_flair_text": null, "created_utc": 1489363369.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": "moderator"}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum4mw", "gilded": 0, "archived": false, "score": 3, "report_reasons": null, "author": "YourSportsInHD2", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "**HD** HOME and AWAY feeds [FULL 60 FPS/6000KBPS 720p English](http://yoursportsinhd.com/game/0021600988/) Ad Overlays : 0 Mobile-Friendly\n", "edited": false, "author_flair_css_class": "verified", "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;&lt;strong&gt;HD&lt;/strong&gt; HOME and AWAY feeds &lt;a href=\"http://yoursportsinhd.com/game/0021600988/\"&gt;FULL 60 FPS/6000KBPS 720p English&lt;/a&gt; Ad Overlays : 0 Mobile-Friendly&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deum4mw", "created": 1489392042.0, "author_flair_text": "", "created_utc": 1489363242.0, "ups": 3, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum5eq", "gilded": 0, "archived": false, "score": 2, "report_reasons": null, "author": "elgilife", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "**HD** | [[HOME 6000kbps 720p Feed]] (http://www.vipboxtv.me/basketball/427181/4/phoenix-suns-vs-portland-trail-blazers-stream.html) | [[AWAY 6000kbps 720p Feed]] (http://www.vipboxtv.me/basketball/427181/5/phoenix-suns-vs-portland-trail-blazers-stream.html) | Ad Overlays: 2 | Mobile friendly : yes\n\nSTREAM LIVE 5 - 10 BEFORE", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;&lt;strong&gt;HD&lt;/strong&gt; | &lt;a href=\"http://www.vipboxtv.me/basketball/427181/4/phoenix-suns-vs-portland-trail-blazers-stream.html\"&gt;[HOME 6000kbps 720p Feed]&lt;/a&gt; | &lt;a href=\"http://www.vipboxtv.me/basketball/427181/5/phoenix-suns-vs-portland-trail-blazers-stream.html\"&gt;[AWAY 6000kbps 720p Feed]&lt;/a&gt; | Ad Overlays: 2 | Mobile friendly : yes&lt;/p&gt;\n\n&lt;p&gt;STREAM LIVE 5 - 10 BEFORE&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deum5eq", "created": 1489392071.0, "author_flair_text": null, "created_utc": 1489363271.0, "ups": 2, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum60j", "gilded": 0, "archived": false, "score": 2, "report_reasons": null, "author": "logfeed", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "SD | [HOME] (http://www.vipbox.bz/basketball/427181/1/phoenix-suns-vs-portland-trail-blazers.html)  | [AWAY] (http://www.vipbox.bz/basketball/427181/2/phoenix-suns-vs-portland-trail-blazers.html) | Ad Overlays: 2 | Mobile Compatible - Yes\n\nSD | [Mobile Stream] (http://www.vipbox.mobi/basketball/427181/3/phoenix-suns-vs-portland-trail-blazers.html) |", "edited": false, "author_flair_css_class": "notverified", "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;SD | &lt;a href=\"http://www.vipbox.bz/basketball/427181/1/phoenix-suns-vs-portland-trail-blazers.html\"&gt;HOME&lt;/a&gt;  | &lt;a href=\"http://www.vipbox.bz/basketball/427181/2/phoenix-suns-vs-portland-trail-blazers.html\"&gt;AWAY&lt;/a&gt; | Ad Overlays: 2 | Mobile Compatible - Yes&lt;/p&gt;\n\n&lt;p&gt;SD | &lt;a href=\"http://www.vipbox.mobi/basketball/427181/3/phoenix-suns-vs-portland-trail-blazers.html\"&gt;Mobile Stream&lt;/a&gt; |&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deum60j", "created": 1489392094.0, "author_flair_text": null, "created_utc": 1489363294.0, "ups": 2, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deumyic", "gilded": 0, "archived": false, "score": 2, "report_reasons": null, "author": "wtfplus", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "SD Streams Portland Trail Blazers vs Phoenix Suns - [English Stream 1](http://wtfstreamlive.in/live-soccer-wiz-stream-32/) | [English Stream 2](http://wtfstreamlive.in/live-soccer-wiz-stream-108/) | [English Stream 3](http://wtfstreamlive.in/live-soccer-stream-57/) | [English Stream 4](http://wtfstreamlive.in/live-soccer-soccerjumbo-stream-8/) | Mobile Compatible : NO | Ad Overlays: 3", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;SD Streams Portland Trail Blazers vs Phoenix Suns - &lt;a href=\"http://wtfstreamlive.in/live-soccer-wiz-stream-32/\"&gt;English Stream 1&lt;/a&gt; | &lt;a href=\"http://wtfstreamlive.in/live-soccer-wiz-stream-108/\"&gt;English Stream 2&lt;/a&gt; | &lt;a href=\"http://wtfstreamlive.in/live-soccer-stream-57/\"&gt;English Stream 3&lt;/a&gt; | &lt;a href=\"http://wtfstreamlive.in/live-soccer-soccerjumbo-stream-8/\"&gt;English Stream 4&lt;/a&gt; | Mobile Compatible : NO | Ad Overlays: 3&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deumyic", "created": 1489393205.0, "author_flair_text": null, "created_utc": 1489364405.0, "ups": 2, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum3qq", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "AutoModerator", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "#Safety Warning:\n\n**Sites below can potentially have multiple ads, and/or popups, and/or misleading download links.**\n\n* Always remember to never download anything from the websites posted here.\n\n* Use an **AdBlocker** - I recommend using uBlock Origin.\n\n* Report any other suspicious links to the moderators and be sure to include a reason why.\n\n* Use these sites with your own discretion.\n\n*****\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/nbastreams) if you have any questions or concerns.*", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;h1&gt;Safety Warning:&lt;/h1&gt;\n\n&lt;p&gt;&lt;strong&gt;Sites below can potentially have multiple ads, and/or popups, and/or misleading download links.&lt;/strong&gt;&lt;/p&gt;\n\n&lt;ul&gt;\n&lt;li&gt;&lt;p&gt;Always remember to never download anything from the websites posted here.&lt;/p&gt;&lt;/li&gt;\n&lt;li&gt;&lt;p&gt;Use an &lt;strong&gt;AdBlocker&lt;/strong&gt; - I recommend using uBlock Origin.&lt;/p&gt;&lt;/li&gt;\n&lt;li&gt;&lt;p&gt;Report any other suspicious links to the moderators and be sure to include a reason why.&lt;/p&gt;&lt;/li&gt;\n&lt;li&gt;&lt;p&gt;Use these sites with your own discretion.&lt;/p&gt;&lt;/li&gt;\n&lt;/ul&gt;\n\n&lt;hr/&gt;\n\n&lt;p&gt;&lt;em&gt;I am a bot, and this action was performed automatically. Please &lt;a href=\"/message/compose/?to=/r/nbastreams\"&gt;contact the moderators of this subreddit&lt;/a&gt; if you have any questions or concerns.&lt;/em&gt;&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deum3qq", "created": 1489392006.0, "author_flair_text": null, "created_utc": 1489363206.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": "moderator"}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum3u0", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "theblackmambas", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "SD Stream | [Portland Trail Blazers vs Phoenix Suns](http://kobestreams.com/nba4) | Ad Overlay: 2 | Mobile: Yes", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;SD Stream | &lt;a href=\"http://kobestreams.com/nba4\"&gt;Portland Trail Blazers vs Phoenix Suns&lt;/a&gt; | Ad Overlay: 2 | Mobile: Yes&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deum3u0", "created": 1489392010.0, "author_flair_text": null, "created_utc": 1489363210.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deum43b", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "napaxsport", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "**HD** GooD Quality [Portland Trail Blazers vs Phoenix Suns](http://www.sport365.life/portland-trail-blazers-vs-phoenix-suns/) Ad-Overlays : 3 Mobile : Yes \n", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;&lt;strong&gt;HD&lt;/strong&gt; GooD Quality &lt;a href=\"http://www.sport365.life/portland-trail-blazers-vs-phoenix-suns/\"&gt;Portland Trail Blazers vs Phoenix Suns&lt;/a&gt; Ad-Overlays : 3 Mobile : Yes &lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deum43b", "created": 1489392021.0, "author_flair_text": null, "created_utc": 1489363221.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deuoeuo", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "sportsnight17", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "SD Streams: [English Stream 1](http://sports-night.eu/32.html) | Ad Overlays 4 | Mobile - no\n\nstream goes live 5 mins before game starts    ", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;SD Streams: &lt;a href=\"http://sports-night.eu/32.html\"&gt;English Stream 1&lt;/a&gt; | Ad Overlays 4 | Mobile - no&lt;/p&gt;\n\n&lt;p&gt;stream goes live 5 mins before game starts    &lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deuoeuo", "created": 1489395318.0, "author_flair_text": null, "created_utc": 1489366518.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deuohdo", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "velocityraps", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "VelocityStreams . Upvote if you like the Stream\n\n**HD** [EN 720p 6000kbps 60fps Suns Feed](http://nbastreams.pw/fox.php?title=0bd7c48a7d058f9fbfb0a6e3f216d1f5) | **HD** [EN 720p 6000kbps 60fps Blazers Feed](http://nbastreams.pw/na.php?id=0021600988&amp;feed=4) | Ad Overlay : 2 | Works on Xbox/PS4/iOS/Android/PC/MAC", "edited": false, "author_flair_css_class": "verified", "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;VelocityStreams . Upvote if you like the Stream&lt;/p&gt;\n\n&lt;p&gt;&lt;strong&gt;HD&lt;/strong&gt; &lt;a href=\"http://nbastreams.pw/fox.php?title=0bd7c48a7d058f9fbfb0a6e3f216d1f5\"&gt;EN 720p 6000kbps 60fps Suns Feed&lt;/a&gt; | &lt;strong&gt;HD&lt;/strong&gt; &lt;a href=\"http://nbastreams.pw/na.php?id=0021600988&amp;amp;feed=4\"&gt;EN 720p 6000kbps 60fps Blazers Feed&lt;/a&gt; | Ad Overlay : 2 | Works on Xbox/PS4/iOS/Android/PC/MAC&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deuohdo", "created": 1489395424.0, "author_flair_text": "Verified Streamer", "created_utc": 1489366624.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}, {"kind": "t1", "data": {"subreddit_id": "t5_340mn", "banned_by": null, "removal_reason": null, "link_id": "t3_5z1vgz", "likes": null, "replies": "", "user_reports": [], "saved": false, "id": "deuolfs", "gilded": 0, "archived": false, "score": 1, "report_reasons": null, "author": "fstream23", "parent_id": "t3_5z1vgz", "subreddit_name_prefixed": "r/nbastreams", "approved_by": null, "controversiality": 0, "body": "[Portland Trail Blazers SD Stream](http://10nba.shop/portland-trail-blazers-live-stream) | [Phoenix Suns SD Stream](http://10nba.shop/phoenix-suns-live-stream) | 1200 kbps!!! 540p Great Quality | Mobile No | Ad Overlays 3", "edited": false, "author_flair_css_class": null, "downs": 0, "body_html": "&lt;div class=\"md\"&gt;&lt;p&gt;&lt;a href=\"http://10nba.shop/portland-trail-blazers-live-stream\"&gt;Portland Trail Blazers SD Stream&lt;/a&gt; | &lt;a href=\"http://10nba.shop/phoenix-suns-live-stream\"&gt;Phoenix Suns SD Stream&lt;/a&gt; | 1200 kbps!!! 540p Great Quality | Mobile No | Ad Overlays 3&lt;/p&gt;\n&lt;/div&gt;", "stickied": false, "subreddit": "nbastreams", "score_hidden": false, "subreddit_type": "public", "name": "t1_deuolfs", "created": 1489395592.0, "author_flair_text": null, "created_utc": 1489366792.0, "ups": 1, "depth": 0, "mod_reports": [], "num_reports": null, "distinguished": null}}], "after": null, "before": null}}];

    // var productList = [];

    // var addProduct = function(newObj) {
    //   productList.push(newObj);
    // };

    // var getProducts = function(){
    //   return productList;
    // };

    return {
      colors: colors,
      thread: thread,
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

angular$1.module('app').run(['$window', '$rootScope', 
function ($window ,  $rootScope) {
  $rootScope.goBack = function(){
    $window.history.back();
  };
}]);

}());
//# sourceMappingURL=app.js.map