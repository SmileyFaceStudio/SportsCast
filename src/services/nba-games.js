import Xray from 'x-ray';

export default function nbaGames () {
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
  })

  //add scores to each game
  angular.forEach(filteredObj, function(value, key) {
    var splitSource = value.source.split(' ');
    value.scores = splitSource.filter(function(part) {
      return !isNaN(part);
    })
  })

      console.log(filteredObj);
      gameData = filteredObj;

  })

console.log(gameData);

    return {
      gameData: gameData
    }
  }
}