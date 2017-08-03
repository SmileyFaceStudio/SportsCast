export default ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('splash', {
        url: "/",
        templateUrl: "partials/splash.html",
        controller: "ButtonController"
    })
    .state('select', {
        url: "/select",
        templateUrl: "partials/select.html",
        controller: "SelectController"
    })
    .state('home', {
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
    .state('rep-team', {
        url: "/rep-team",
        templateUrl: "partials/rep-team.html",
    })
    $urlRouterProvider.otherwise("/");

}];
