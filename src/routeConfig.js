export default ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('splash', {
        url: "/",
        templateUrl: "partials/splash.html"
    })
    .state('select', {
        url: "/select",
        templateUrl: "partials/select.html",
        controller: "SelectController"
    })
    .state('rep', {
        url: "/rep",
        templateUrl: "partials/rep.html",
        controller: "RepController"
    })
    .state('frame', {
        abstract: true,
        url: "",
        templateUrl: "partials/frame.html",
        controller: "FrameController"
    })
    .state('frame.home', {
        url: "/home",
        templateUrl: "partials/home.html",
        controller: "HomeController"
    })
    .state('view', {
        url: "/view",
        templateUrl: "partials/view.html",
        controller: "ViewController",
        params: {
            obj: null
        }
    })
    
    $urlRouterProvider.otherwise("/");

}];