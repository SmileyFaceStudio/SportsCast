export default function passData () {
  return function() {  

    var productList = [];

    var addProduct = function(newObj) {
      productList.push(newObj);
    };

    var getProducts = function(){
      return productList;
    };

    return {
      addData: addProduct,
      getData: getProducts
    }
  }
}

