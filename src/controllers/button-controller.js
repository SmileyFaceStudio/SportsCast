export default function ButtonController () {
  return ["$scope", function($scope) {
      this.destination = "home";
      this.message = "WATCH";
      this.style = "splsh--watch-bttn";

      this.setDestination = function(dst) {
        this.destination = dst;
      }

      this.setMessage = function(msg) {
        this.destination = msg;
      }

      this.setStyle = function(dst) {
        this.style = dst;
      }
  }];
}
