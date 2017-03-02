export default function SelectController () {
  return ['$scope', '$http', 'teamList', function($scope, $http, teamList) {
    var vm = this;
  
  vm.active = 0;
  vm.images = [];

  var x;
  for (x in teamList.abbreviations) {
    let defaultObj = {team: x, logo: "https://neulionms-a.akamaihd.net/nba/player/v6/nba/site/images/teams/" + x + '.png'};
    console.log(defaultObj);
    vm.images.push(defaultObj);
  }

  vm.position = position;
  vm.next = next;
  vm.prev = prev;

  var pLen = vm.images.length;
  
  function position(key) {
    return {
      left: key < vm.active,
      right: key > vm.active,
      hide: Math.abs(vm.active-key) > 1
    }
  }
  
  function next() {
    if (vm.active < pLen-1) {
      vm.active += 1;
    }
  }
  
  function prev() {
    if (vm.active > 0) {
      vm.active -= 1;
    }
  }
  }];
}