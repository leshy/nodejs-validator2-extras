(function() {
  var Backbone, v, _;
  _ = require('underscore');
  Backbone = require('backbone4000');
  v = require('./index');
  exports.validatedmodel = function(test) {
    var testclass, x;
    testclass = v.ValidatedModel.extend4000({
      validator: {
        bla: 'string',
        blu: 'number'
      }
    });
    try {
      x = new testclass({
        bla: 'bla',
        blu: 3
      });
    } catch (err) {
      test.fail(err);
    }
    try {
      return x = new testclass({
        bla: 'bla',
        blu: 'lala'
      });
    } catch (err) {
      return test.done();
    }
  };
  exports.mongo = function(test) {
    var mongo;
    mongo = new v.Validator({
      bla: 'string',
      k: 'number',
      a: 3
    }).mongo();
    test.deepEqual({
      bla: {
        '$type': 2
      },
      k: {
        '$type': 1
      },
      a: 3
    }, mongo);
    console.log(mongo);
    return test.done();
  };
  exports.AccessorModel = function(test) {
    var testmodel, x;
    testmodel = Backbone.Model.extend4000(v.MakeAccessors({
      bla: v.v().boolean(),
      blu: v.v().number()
    }), {
      initialize: function() {
        return 3 + 3;
      }
    });
    x = new testmodel();
    x.bla(true);
    test.equals(x.get('bla'), true);
    x.bla(false).blu(666);
    test.equals(x.get('bla'), false);
    test.equals(x.get('blu'), 666);
    try {
      return x.bla(33);
    } catch (err) {
      return test.done();
    }
  };
  exports.ValidatedFunction = function(test) {
    var X, cnt, x;
    cnt = 0;
    X = Backbone.Model.extend4000({
      testf: v.Validated({
        0: 'Number',
        1: 'String'
      }, function(n, str, callback) {
        cnt++;
        return callback(void 0, [n, str]);
      })
    });
    x = new X();
    x.testf(3, 'teststring', function(err, data) {
      if (err) {
        test.fail();
      }
      if (!data) {
        test.fail();
      }
      if (cnt !== 1) {
        return test.fail();
      }
    });
    return x.testf(4, 6, function(err, data) {
      if (!err) {
        test.fail();
      }
      if (cnt !== 1) {
        test.fail();
      }
      return test.done();
    });
  };
}).call(this);
