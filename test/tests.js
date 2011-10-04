var advise = (typeof window != 'undefined' ? advise : require('./advise.js'));

function newObj (){
  return {
    arr: [],
    push: function (val){
      this.arr.push(val);
    },
    add: function (x, y){
      return x + y;
    },
    foo: function (foo){
      return foo;
    }
  };
}

module('basics');
test('before should', function (){
  var obj = newObj(),
      context;

  var advice = advise(obj).before('push', function (){
    context = this;
    obj.arr.push('0');
  });

  obj.push('1');
  equal(obj.arr[0], '0', 'call advice before the method');
  equal(obj, context, 'set the context to the object');

  advice.detach();
  obj.push('2');
  equal(obj.arr[2], '2', 'detach: should detach the advice'); // arr[2] would be '0' if it wasn't detached

  advice.attach();
  obj.push('4');
  equal(obj.arr[3], '0', 'attach: should put the advice back'); // arr[3] isn't '4' because '0' is pushed
});


test('after should', function (){
  var obj = newObj(),
      x = false,
      context;

  var advice = advise(obj).after('push', function (){
    obj.arr.push('advice');
    context = this;
  });
  obj.push('0');

  equal(obj.arr[1], 'advice', 'after: should call advice after a method');
  equal(obj, context, 'set the context to the object');

  advice.detach();
  obj.push('2');
  equal(obj.arr[2], '2', 'detach: should detach the advice');

  advice.attach();
  obj.push('3');
  equal(obj.arr[4], 'advice', 'attach: should attach the advice');
});



module('arguments');
test('before should', function (){
  var obj = newObj(),
      _x = 0;

  var setX = advise(obj).before('add', function (x, y){
    _x = x;
  });
  result = obj.add(2,3);
  equal(_x, 2, 'pass in the arguments that were given to the method');
  equal(result, 5, 'not mutate the arguments if nothing is returned');

  var doubleArgs = advise(obj).before('add', function (x, y){
    return [x * 2, y * 2];
  });
  result = obj.add(2, 3);
  equal(result, 10, 'apply the mutated arguments if there is a return value');
});

test('after should', function (){
  var obj = newObj(),
      result = 0;

  advise(obj).after('add', function (val){
    result = val;
  });
  obj.add(1,2);
  equal(result, 3, 'send return value as first arguments');
});

module('advice methods');
test('once should', function (){
  var obj = newObj(),
      x = false,
      y = false,
      returns = false;
      advisor = advise(obj);

  advisor.before('foo', function (){
    x = true;
  }).once();

  advisor.after('foo', function (){
    y = true;
  }).once();

  returns = obj.foo(true);

  ok(returns);
  ok(x);
  ok(y);
  x = y = false;

  returns = obj.foo(true);
  ok(!x, 'not be called a second time with before');
  ok(!y, 'not be called a second time with after');
  ok(returns, 'not mess up the original method');
});

/*
test('when should', function (){
  var obj = newObj(),
      a = false,
      b = false,
      x = false,
      y = false,
      advisor = advise(obj);

  advisor.before('foo', function (){
    x = !x
  }).when(function (){
    return a;
  });

  advisor.after('foo', function (){
    y = !y
  }).when(function (){
    return b;
  });

  obj.foo();
  ok(!x, 'not call the advice if condition is false for before');
  ok(!x, 'not call the advice if condition is false for after');

  a = b = true;
  obj.foo();
  ok(x, 'call the advice when condition is true for before');
  ok(y, 'call the advice when condition is true for after');

});
*/


