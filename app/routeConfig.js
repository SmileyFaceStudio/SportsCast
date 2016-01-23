export default ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
            url: "/",
            templateUrl: "partials/home.html"
    })
    .state('view', {
            url: "/view",
            templateUrl: "partials/view.html"
    })
    
    $urlRouterProvider.otherwise("/");

}];