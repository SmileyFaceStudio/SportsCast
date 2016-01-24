import angular from 'angular';

import FrameController from './frame-controller.js';

import HomeController from './home-controller.js';

import ViewController from './view-controller.js';

export default angular.module('app.controllers', [])
	.controller(FrameController.name, FrameController())
	
	.controller(HomeController.name, HomeController())
  
	.controller(ViewController.name, ViewController())
  