import angular from 'angular';

import HomeController from './home-controller.js';
import ViewController from './view-controller.js';
import SelectController from './select-controller.js';
import ButtonController from './button-controller.js'
import TitleBarController from './title-bar-controller.js'

export default angular.module('app.controllers', [])
	.controller(HomeController.name, HomeController())
	.controller(ViewController.name, ViewController())
	.controller(SelectController.name, SelectController())
	.controller(ButtonController.name, ButtonController())
	.controller(TitleBarController.name, TitleBarController())
