export default function ViewController () {
  return ['$scope', '$http', function($scope, $http) {

    $http.get('https://www.reddit.com/r/nbastreams/new.json').success(function(response) {
    	let redditData = response.data.children;
      console.log('reddit api: ', redditData);
      var gameThread= [];
      angular.forEach(redditData, function(value, key) {
      	if (value.data.link_flair_text === 'Game Thread') {
      		return gameThread.push(value.data);
      	}
      });
      console.log(gameThread);

      if (gameThread.length !== 0)
      	$http.get(gameThread[0].url + '.json').success(function(response) {
      		console.log('thread:', response);
      	});
    });

    var handleRedditAPI = function(data) {

    }
  }];
}