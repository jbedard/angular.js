var app = angular.module('jsBenchmark', []);

app.controller('DataController', ['$compile', function($compile) {
  var COPY_BASIC = {
    i: 123,
    str: "foo",
    date: new Date(),
    sub: {event: "foo"}
  };
  var COPY_ARRAY_BASIC = [123, "foo", new Date(), {event: "foo"}];
  var COPY_ARRAY_SIMPLE = [123, "foo", new Date(), /foo/];

  var BIG_ARRAY_OBJECTS = new Array(50).join(" ").split(" ").map(function(s, i) {
    return {
      i: i,
      s: s + i,
      o: {foo: "bar", date: new Date()},
      a: [/foo/, new Int32Array()]
    };
  });

  var BIG_COMPLICATED_ARRAY_OBJECTS = new Array(50).join(" ").split(" ").reduce(function(a, s, i) {
    var o = {};

    o.i = i;
    o.s = s + i;
    o.d = (i % 5 === 1) ? a[i-1].d : new Date();
    o.re = (i % 5 === 2) ? a[i-2].re : /foobar/i;
    o.a = (i % 5 === 3) ? a[i-3].a : ['foo', 123];

    if (i % 5 === 0) {
      o.o = o;
    }
    if (i % 4 === 1) {
      o.p = a[i-1];
    }

    a.push(o);
    if (i % 20 === 0) {
      a.push(o);
    }

    return a;
  }, []);

  function copy(what) {
    for (var i=0; i<1000; i++) {
      angular.copy(what);
    }
  }

  benchmarkSteps.push({
    name: 'large array of objects',
    fn: copy.bind(null, BIG_ARRAY_OBJECTS)
  });
  benchmarkSteps.push({
    name: 'large array of over complicated objects',
    fn: copy.bind(null, BIG_COMPLICATED_ARRAY_OBJECTS)
  });
  benchmarkSteps.push({
    name: 'basic + date + 1 recurse',
    fn: copy.bind(null, COPY_BASIC)
  });
  benchmarkSteps.push({
    name: 'basic array + date + 1 recurse',
    fn: copy.bind(null, COPY_ARRAY_BASIC)
  });
  benchmarkSteps.push({
    name: 'simple',
    fn: copy.bind(null, COPY_ARRAY_SIMPLE)
  });
}]);



angular.bootstrap(document.querySelector("[ng-app-foo]"), ["jsBenchmark"]);