angular.module('appModule').directive('autoResize', function() {
  return function(scope, element, attr){
    var resize = function() {
      element[0].style.height = 'auto';
      element[0].style.height = element[0].scrollHeight+'px';
    }
    element.bind("keyup cut paste keydown keypress change", resize);
  }
});