var aop = function (obj){

  var register = { before: {}, after: {} };

  function setFirst (type, method){
    var originalMethod = obj[method];
    register[type][method] = [];
    obj[method] = function (){
      for (var i = 0, l = register[type][method].length; i < l; i++) {
        register[type][method][i].apply(this, arguments);
      }
      originalMethod.apply(this, arguments);
    }
  }

  obj.before = function (method, fn){
    if (!register.before[method]) setFirst('before', method);
    register.before[method].push(fn);
  };

  obj.after = function (method, fn){
    if (!register.after[method]) setFirst('before', method);
    register.after[method].push(fn);
  };
};

module.exports = aop;


/*
var indexOf: [].indexOf ? function(item, array){
    return indexOf.call(array, item)
  } : function (item, array){
  for (var i = 0, l = array.length; i < l; i++)
    if (array[i] === item)
      return i;

  return -1;
};
*/