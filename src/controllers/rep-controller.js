export default function RepController () {
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
	}
  }];
}