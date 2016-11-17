import angular from 'angular';

import passData from './pass-data.js';

import teamList from './team-list.js';

export default angular.module('app.services', [])
	.service(passData.name, passData())
	.service(teamList.name, teamList())
