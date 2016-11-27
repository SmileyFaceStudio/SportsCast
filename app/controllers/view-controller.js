import getUrl from 'get-urls';

export default function ViewController () {
  return ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

    console.log($stateParams);

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
      })

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
      })
      console.log(threadData);
      threadData = threadData.reduce(function(a, b) { 
        return a.concat(b);
      }).filter(function (value) {
        return value.kind == 't1';
      });

      //create array with ups and links from the body of the reddit comment threads
      angular.forEach(threadData, function(value, key) {
        var upsAndLinks = {'ups': value.data.ups, 'urls': getUrl(value.data.body)};
        threadLinks.push(upsAndLinks);
      })

      console.log(threadLinks);

      //filter out elements without links and sort by descending upvote order
      threadLinks = threadLinks.filter(function(value) {
        return value.urls.length;
      })

      console.log(threadLinks);

      threadLinks = threadLinks.sort((a, b) => a.ups - b.ups).reverse();

      console.log(threadLinks);

    }
  }];
}