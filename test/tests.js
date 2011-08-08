// global / reused vars
var aop = (typeof window != 'undefined' ? aop : require('./aop.js'));

function newObj (){
  return aop({
    arr: [],
    push: function (val){
      this.arr.push(val);
    },
    add: function (x, y){
      return x + y;
    },
    noop: function (){}
  });
}

module('basics');
test('before should', function (){
  var obj = newObj(),
      context;

  var advice = obj.before('push', function (){
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

  var advice = obj.after('push', function (){
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

  var setX = obj.before('add', function (x, y){
    _x = x;
  });
  result = obj.add(2,3);
  equal(_x, 2, 'pass in the arguments that were given to the method');
  equal(result, 5, 'not mutate the arguments if nothing is returned');

  var doubleArgs = obj.before('add', function (x, y){
    return [x * 2, y * 2];
  });
  result = obj.add(2, 3);
  equal(result, 10, 'apply the mutated arguments if there is a return value');
});

test('after should', function (){
  var obj = newObj(),
      result = 0;

  obj.after('add', function (val){
    result = val;
  });
  obj.add(1,2);
  equal(result, 3, 'send return value as first arguments');

});
