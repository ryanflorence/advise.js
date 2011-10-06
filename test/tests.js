var test = require('tap').test,
    advise = require('../src/advise');

console.log('blah!')

function newObj () {
  return {
    arr: [],
    push: function (val) {
      this.arr.push(val);
    },
    add: function (x, y) {
      return x + y;
    },
    foo: function (foo) {
      return foo;
    }
  };
}

test('before should', function (t) {
  var obj = newObj(),
      context;

  var advice = advise(obj).before('push', function () {
    context = this;
    obj.arr.push('0');
  });

  obj.push('1');
  t.equal(obj.arr[0], '0', 'call advice before the method');
  t.equal(obj, context, 'set the context to the object');

  advice.detach();
  obj.push('2');
  t.equal(obj.arr[2], '2', 'detach: should detach the advice'); // arr[2] would be '0' if it wasn't detached

  advice.attach();
  obj.push('4');
  t.equal(obj.arr[3], '0', 'attach: should put the advice back'); // arr[3] isn't '4' because '0' is pushed

  t.end();
});


test('after should', function (t) {
  var obj = newObj(),
      x = false,
      context;

  var advice = advise(obj).after('push', function () {
    obj.arr.push('advice');
    context = this;
  });
  obj.push('0');

  t.equal(obj.arr[1], 'advice', 'after: should call advice after a method');
  t.equal(obj, context, 'set the context to the object');

  advice.detach();
  obj.push('2');
  t.equal(obj.arr[2], '2', 'detach: should detach the advice');

  advice.attach();
  obj.push('3');
  t.equal(obj.arr[4], 'advice', 'attach: should attach the advice');

  t.end();
});

test('before should', function (t) {
  var obj = newObj(),
      _x = 0;

  var setX = advise(obj).before('add', function (x, y) {
    _x = x;
  });
  result = obj.add(2,3);
  t.equal(_x, 2, 'pass in the arguments that were given to the method');
  t.equal(result, 5, 'not mutate the arguments if nothing is returned');

  var doubleArgs = advise(obj).before('add', function (x, y) {
    return [x * 2, y * 2];
  });
  result = obj.add(2, 3);
  t.equal(result, 10, 'apply the mutated arguments if there is a return value');

  t.end();
});

test('after should', function (t) {
  var obj = newObj(),
      result = 0;

  advise(obj).after('add', function (val) {
    result = val;
  });
  obj.add(1,2);
  t.equal(result, 3, 'send return value as first arguments');

  t.end();
});

test('once should', function (t) {
  var obj = newObj(),
      x = false,
      y = false,
      returns = false;
      advisor = advise(obj);

  advisor.before('foo', function () {
    x = true;
  }).once();

  advisor.after('foo', function () {
    y = true;
  }).once();

  returns = obj.foo(true);

  t.ok(returns);
  t.ok(x);
  t.ok(y);
  x = y = false;

  returns = obj.foo(true);
  t.ok(!x, 'not be called a second time with before');
  t.ok(!y, 'not be called a second time with after');
  t.ok(returns, 'not mess up the original method');

  t.end();
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
  t.ok(!x, 'not call the advice if condition is false for before');
  t.ok(!x, 'not call the advice if condition is false for after');

  a = b = true;
  obj.foo();
  t.ok(x, 'call the advice when condition is true for before');
  t.ok(y, 'call the advice when condition is true for after');

});
*/


