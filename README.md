advise.js
=========

More docs to come...

Advise Math
-----------

```javascript
var advisor = advise(Math);
advisor.before('pow', function (x, y) {
  // return an array, gets used as the arguments to the function
  return [x * 2, y * 2];
});

advisor.after('pow', function (result) {
  // do something with the return value of the operation.
  console.log(result)
})
```

Advise jQuery
-------------

```javascript
advise(jQuery).before('ajax', function (settings) {
  if (!settings.token) settings.token = getToken();
});
```
