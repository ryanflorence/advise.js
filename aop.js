var aop = function (obj){

  var register = { before: {}, after: {} }, wrap = {};

  wrap.before = function (method){
    var originalMethod = obj[method];
    obj[method] = function (){
      for (var i = 0, l = register.before[method].length; i < l; i++) {
        register.before[method][i].apply(obj, arguments);
      }
      var r = originalMethod.apply(obj, arguments);
      return r;
    };
  };

  wrap.after = function (method){
    var originalMethod = obj[method];
    obj[method] = function (){
      var args = [].slice.call(arguments, 0),
          returns = originalMethod.apply(obj, args);
      args.unshift(returns);
      for (var i = 0, l = register.after[method].length; i < l; i++) {
        register.after[method][i].apply(obj, args);
      }
    };
  };

  function setFirst (type, method){
    register[type][method] = [];
    wrap[type](method);
  }

  obj.before = function (method, fn){
    var length;
    if (!register.before[method]) setFirst('before', method);
    length = register.before[method].push(fn);

    return (function (){
      var l = length;
      return {
        detach: function (){
          var r = register.before[method].splice(l - 1, 1);
          l = register.before[method].length;
        },

        attach: function (){},

        fire: function (){}
      };
    }());
  };

  obj.after = function (method, fn){
    var length;
    if (!register.after[method]) setFirst('after', method);
    length = register.after[method].push(fn);

    return (function (){
      var l = length;
      return {
        detach: function (){
          var r = register.after[method].splice(l - 1, 1);
          l = register.after[method].length;
        },

        attach: function (){},

        fire: function (){}
      };
    }());
  };
};

if (typeof module != 'undefined') module.exports = aop;


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