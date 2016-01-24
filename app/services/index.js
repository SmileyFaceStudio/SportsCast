import angular from 'angular';

import passData from './passData.js';

export default function() {
  var app = angular.module('app.services', []);
  app.service(passData.name, passData());

}
  
 