import angular from 'angular';

import passData from './pass-data.js';
import teamList from './team-list.js';
import nbaGames from './nba-games.js';

export default angular.module('app.services', [])
	.service(passData.name, passData())
	.service(teamList.name, teamList())
	.service(nbaGames.name, nbaGames())
