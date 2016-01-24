export default function ViewController () {
  return ['$scope', function($scope) {
    $scope.items = 'ViewController';
    console.log($scope.items);
  }];
}