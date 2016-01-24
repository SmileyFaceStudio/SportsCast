import angular from 'angular';

import FrameController from './frame-controller.js';

import HomeController from './home-controller.js';

import ViewController from './view-controller.js';

export default function() {
  var app = angular.module('app.controllers', []);

  app.controller(FrameController.name, FrameController());

  app.controller(HomeController.name, HomeController());
  
  app.controller(ViewController.name, ViewController());
  
}