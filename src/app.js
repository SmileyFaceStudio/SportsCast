// Here is the starting point for the application

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_world'; // code authored by you in this project
import env from './env';

import angular from 'angular';
import 'angular-ui-router';
import 'angular-animate';
import routeConfig from './routeConfig.js';
import './controllers/index';
import './services/index';
import './directives/index';

// console.log('Loaded environment variables:', env);

// var app = remote.app;
// var appDir = jetpack.cwd(app.getAppPath());

// // Holy crap! This is browser window with HTML and stuff, but I can read
// // here files like it is node.js! Welcome to Electron world :)
// console.log('The author of this app is:', appDir.read('package.json', 'json').author);
// console.log('This is angular object ' + angular);

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('greet').innerHTML = greet();
//     document.getElementById('platform-info').innerHTML = os.platform();
//     document.getElementById('env-name').innerHTML = env.name;
// });

angular
    .module('app', [
        'ui.router',
        'ngAnimate',
        'app.controllers',
        'app.services',
        'app.directives'
    ]);

angular.module('app').config(routeConfig);

angular.module('app').run(['$window', '$rootScope', 
function ($window ,  $rootScope) {
  $rootScope.goBack = function(){
    $window.history.back();
  }
}]);
