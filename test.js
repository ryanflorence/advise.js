// global / reused vars
var aop = require('../src/aop.js'),
    test = '',
    handler,
    result;

// test method
var equal = (function (){
  var numberOfTests = 0;
  return function (a, b, msg){
    numberOfTests++;
    console.assert(a === b, msg + '\n==> Expected', b, 'got', a, "\n");
  };
});

// our object
var obj = {
  arr: [],
  push: function (val){
    this.arr.push(val);
  },
  add: function (x, y){
    return x + y;
  },
  noop: function (){}
};

// merge aop methods in
aop(obj);

var handler = obj.before('push', function (){ this.arr.push('0'); });
obj.push('1');
equal(obj.arr[0], '0', 'before: should call a function before the method');

handler.detach();
obj.add('2');
equal(obj.arr[2], '2', 'detach: should detach the method'); // arr[2] would be '1' if it wasn't detached

handler = obj.after('push', function (){ obj.arr.push('5'); });
obj.push('4');
handler.detach();
equal(obj.arr[5], '5', 'after: should call a function after a method'); // arr[2] would be 'one' if it wasn't detached

result = 0;
obj.after('add', function (val){ result = val; });
obj.add(1,2);
equal(result, 3, 'after: should send return value as first arguments');

var _x = 0;
handler = obj.before('add', function (x, y){
  _x = x;
});
result = obj.add(2,3);
handler.detach();
equal(_x, 2, 'before should pass in the arguments that were given to the method');
equal(result, 5, 'before: should not mutate the arguments if nothing is returned');

handler = obj.before('add', function (x, y){
  return [x * 2, y * 2];
});
result = obj.add(2, 3);
handler.detach();
equal(result, 10, 'before: should apply the mutated arguments if there is a return value');

var contextBefore, contextAfter;
obj.before('noop', function (){ contextBefore = this; });
obj.after('noop', function (){ contextAfter = this; });
equal(contextBefore, obj, 'before: should set the context to the object');
equal(contextAfter, obj, 'after: should set the context to the object');

