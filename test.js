// global / reused vars
var aop = (typeof window != 'undefined' ? aop : require('./aop.js')),
    test = '',
    advice,
    result;


// test method
var test = (function (){
  var numberOfTests = 0,
      passedTests = 0;
  var test = function (a, b, msg){
    numberOfTests++;
    if (a === b) passedTests++;
    console.assert(a === b, msg + '\n==> Expected', b, 'got', a, "\n");
  };
  test.report = function (){
    console.log('Passed ', passedTests, 'of', numberOfTests, 'tests');
  };
  return test;
}());

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

// enable aop on the object
aop(obj);

var advice = obj.before('push', function (){
  obj.arr.push('0');
});
obj.push('1');
test(obj.arr[0], '0', 'before: should call a function before the method');


advice.detach();
obj.push('2');
test(obj.arr[2], '2', 'detach: should detach the method'); // arr[2] would be '2' if it wasn't detached


advice = obj.after('push', function (){
  obj.arr.push('4');
});
obj.push('3');
advice.detach();
test(obj.arr[4], '4', 'after: should call a function after a method'); // arr[2] would be 'one' if it wasn't detached


var _x = 0;
advice = obj.before('add', function (x, y){
  _x = x;
});
result = obj.add(2,3);
advice.detach();
test(_x, 2, 'before should pass in the arguments that were given to the method');
test(result, 5, 'before: should not mutate the arguments if nothing is returned');


advice = obj.before('add', function (x, y){
  return [x * 2, y * 2];
});
result = obj.add(2, 3);
advice.detach();
test(result, 10, 'before: should apply the mutated arguments if there is a return value');


result = 0;
obj.after('add', function (val){
  result = val;
});
obj.add(1,2);
test(result, 3, 'after: should send return value as first arguments');


var contextBefore, contextAfter;
obj.before('noop', function (){
  contextBefore = this;
});
obj.after('noop', function (){
  contextAfter = this;
});
obj.noop();
test(contextBefore, obj, 'before: should set the context to the object');
test(contextAfter, obj, 'after: should set the context to the object');

test.report();
