import angular from 'angular';

import passData from './passData.js';

export default angular.module('app.services', [])
	.service(passData.name, passData())
