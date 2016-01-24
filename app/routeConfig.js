export default ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('frame', {
        abstract: true,
        url: "",
        templateUrl: "partials/frame.html",
        controller: "FrameController"
    })
    .state('frame.home', {
        url: "/",
        templateUrl: "partials/home.html",
        controller: "HomeController"
    })
    .state('view', {
        url: "/view",
        templateUrl: "partials/view.html",
        controller: "ViewController"
    })
    
    $urlRouterProvider.otherwise("/");

}];