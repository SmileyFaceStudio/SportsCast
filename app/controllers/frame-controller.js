export default function FrameController () {
  return ['$scope', function($scope) {
    $scope.items = 'FrameController';
    console.log($scope.items);
  }];
}