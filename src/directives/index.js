import angular from 'angular';
import mAppLoading from './mLoading.js';

export default angular.module('app.directives', [])
	.directive(mAppLoading.name, mAppLoading())
