var aop = function (obj){

  var register = { before: {}, after: {} }, wrap = {};

  function wrapBefore (method){
    var originalMethod = obj[method];

    obj[method] = function (){
      var args = [].slice.call(arguments, 0);

      for (var i = 0, l = register.before[method].length, returned; i < l; i++){
        returned = register.before[method][i].apply(obj, args);

        // changes arguments if advice returns array
        if (returned !== undefined && returned.length){ // loose check for array
          args = returned;
        }
      }

      return originalMethod.apply(obj, args);
    };
  }

  function wrapAfter (method){
    var originalMethod = obj[method];

    obj[method] = function (){
      var args = [].slice.call(arguments, 0),
          returned = originalMethod.apply(obj, args);

      args.unshift(returned);

      for (var i = 0, l = register.after[method].length; i < l; i++) {
        register.after[method][i].apply(obj, args);
      }

      return returned;
    };
  }

  obj.before = function (method, fn){
    var length;

    if (!register.before[method]){
      register.before[method] = [];
      wrapBefore(method);
    }

    length = register.before[method].push(fn);

    return (function (){
      var l = length;

      return {
        detach: function (){
          var r = register.before[method].splice(l - 1, 1);
          l = register.before[method].length;
        },
        attach: function (){},
        when: function (){},
        once: function (){}
      };
    }());
  };

  obj.after = function (method, fn){
    var length;

    if (!register.after[method]){
      register.after[method] = [];
      wrapAfter(method);
    }

    length = register.after[method].push(fn);

    return (function (){
      var l = length;

      return {
        detach: function (){
          var r = register.after[method].splice(l - 1, 1);
          l = register.after[method].length;
        },
        attach: function (){},
        when: function (){},
        once: function (){}
      };
    }());
  };
};

/*
// considering generics
aop.before = function (obj, method, fn){};
aop.after = function (obj, method, fn){};
aop.advise = function (obj, method, fn){};
*/

if (typeof module != 'undefined') module.exports = aop;
