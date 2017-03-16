import getUrl from 'get-urls';
import Xray from 'x-ray';

export default function ViewController () {
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
    }

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
      })
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
      })

      //filter out elements without links and sort by descending upvote order
      threadLinks = threadLinks.filter(function(value) {
        return value.urls.length;
      })

      threadLinks = threadLinks.sort((a, b) => a.ups - b.ups).reverse();

      console.log(threadLinks);

      $scope.streams = threadLinks;
      $scope.$apply();

    }
  }];
}