export default function SelectController () {
  return ['$scope', '$http', '$filter', 'teamList', function($scope, $http, $filter, teamList) {
    var vm = this;
  
  vm.active = 0;
  vm.images = [];

  var x;
  for (x in teamList.abbreviations) {
    let defaultObj = {team: x, logo: "http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/" + $filter('lowercase')(x) + '.png'};
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