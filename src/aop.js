var aop = function (obj){

  var register = { before: {}, after: {} }, wrap = {};

  function fakeArray (){
    return {
      length: 0,

      push: function (item){
        this.length++;
        this[this.length - 1] = item;
        return this.length;
      },

      each: function (fn, bind){
        for (var i = 0, l = this.length; i < l; i++){
          if (i in this) fn.call(bind || this, this[i], i, this);
        }
      }
    };
  }

  function wrapBefore (method){
    var originalMethod = obj[method];
    obj[method] = function (){
      var args = [].slice.call(arguments, 0);
      register.before[method].each(function (advice, index){
        returned = advice.apply(obj, args);
        if (returned !== undefined) args = returned;
      });
      return originalMethod.apply(obj, args);
    };
  }

  function wrapAfter (method){
    var originalMethod = obj[method];
    obj[method] = function (){
      var args = [].slice.call(arguments, 0),
          returned = originalMethod.apply(obj, args);
      args.unshift(returned);
      register.after[method].each(function (advice, index){
        advice.apply(obj, args);
      });
      return returned;
    };
  }

  obj.before = function (method, advice){
    var length;
    if (!register.before[method]){
      register.before[method] = fakeArray();
      wrapBefore(method);
    }
    length = register.before[method].push(advice);
    return (function (){
      var index = length - 1;
      return {
        detach: function (){
          delete register.before[method][index];
        },

        attach: function (){
          register.before[method][index] = advice;
        },

        when: function (){},

        once: function (){}
      };
    }());
  };

  obj.after = function (method, advice){
    var index;

    if (!register.after[method]){
      register.after[method] = fakeArray();
      wrapAfter(method);
    }

    index = register.after[method].push(advice) - 1;

    return {
      detach: function (){
        delete register.after[method][index];
      },

      attach: function (){
        register.after[method][index] = advice;
      },

      when: function (){},

      once: function (){}
    };
  };

  return obj;
};

/*
// considering generics
aop.before = function (obj, method, fn){};
aop.after = function (obj, method, fn){};
aop.advise = function (obj, method, fn){};
*/

if (typeof module != 'undefined') module.exports = aop;
