import angular from 'angular';

import mAppLoading from './mLoading.js';


export default function() {
  var app = angular.module('app.directives', []);

  app.directive(mAppLoading.name, mAppLoading());
}

  
