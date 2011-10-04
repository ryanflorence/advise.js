var advise = function (obj) {
  var wrapped = {},
      wrap,
      add;

  wrap = function (method) {
    var original = obj[method];

    wrapped[method] = {
      before: new advise.Arr(),
      after: new advise.Arr()
    };

    obj[method] = function () {
      var args = [].slice.call(arguments, 0),
          returns;

      wrapped[method].before.each(function (advice) {
        var adviceReturns = advice.apply(obj, args);
        if (adviceReturns !== undefined) args = adviceReturns;
      });

      returns = original.apply(obj, args);
      args.unshift(returns);

      wrapped[method].after.each(function (advice) {
        advice.apply(obj, args);
      });

      return returns;
    };
  };

  add = function (when, method, advice) {
    var index;

    if (!wrapped[method]) wrap(method);

    index = wrapped[method][when].push(advice);

    return {
      detach: function () {
        delete wrapped[method][when][index];
      },

      attach: function () {
        wrapped[method][when][index] = advice;
      },

      once: when === 'before' ? function () {
        add('before', method, this.detach);
      } : function () {
        add('after', method, this.detach);
      }
    };
  };

  return {
    before: function (method, advice) {
      return add('before', method, advice);
    },

    after: function (method, advice) {
      return add('after', method, advice);
    }
  };
};

advise.Arr = function () {
  this.length = 0;
};

advise.Arr.prototype.push = function (item) {
  this.length++;
  this[this.length - 1] = item;
  return this.length - 1;
};

advise.Arr.prototype.each = function (fn) {
  for (var i = 0, l = this.length; i < l; i++)
    if (i in this) fn.call(this, this[i], i, this);
};

if (typeof module !== 'undefined') module.exports = advise;
