var obj = {
  doSomething: function (){}
};

var beforeAdvice = obj.before('doSomething', beforeAdvice);
beforeAdvice(); // calls fn
beforeAdvice.once(); // calls once, then removes
beforeAdvice.when(beforeCondition); // calls on when condition is true
beforeAdvice.detach(); // removes advice
beforeAdvice.attach(); // restores advice

function beforeAdvice (arg, argN){
  this; // the object receiving advice
  arg; // arg, argN... sent to method
  return [1,2]; // optional array return value becomes arguments to method
  // if nothing is returned arguments remain unchanged
}



var afterAdvice = obj.after('doSomething', afterAdvice);
afterAdvice();
afterAdvice.once();
afterAdvice.when(condition);
afterAdvice.detach();
afterAdvice.attach();

function afterAdvice (ret, arg, argN){
  this; // the object
  ret; // the return of the method
  arg; // arg, argN... sent to method
}



function condition (arg, argN){
  this; // the object receiving advice
  arg; // arg, argN... sent to method
  return true; // return boolean, if true, advice will be executed
}



var advice = obj.advise('doSomething', advice);

function advice (old, arg, argN){
  this; // the object
  old; // the old method bound to the object, call it or not, up to you
  arg; // arg, argN... sent to method
}
