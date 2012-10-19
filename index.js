(function() {
  var Backbone, colors, helpers, mongodict, _;
  _ = require('underscore');
  Backbone = require('backbone4000');
  helpers = require('helpers');
  colors = require('colors');
  _.map(require('validator2'), function(value, property) {
    return exports[property] = value;
  });
  exports.ValidatedModel = Backbone.Model.extend4000({
    initialize: function() {
      if (this.validator) {
        return new exports.Validator(this.validator).feed(this.attributes, function(err, data) {
          if (err != null) {
            throw "model init invalid";
          }
        });
      }
    }
  });
  mongodict = {
    string: {
      $type: 2
    },
    boolean: {
      $type: 8
    },
    number: {
      $type: 1
    },
    exists: {
      $exists: true
    }
  };
  exports.Validator.prototype.mongo = function() {
    var expression, name;
    name = this.name();
    switch (name) {
      case 'children':
        return helpers.hashmap(this.args[0], function(value, key) {
          var x;
          x = new exports.Validator(value);
          return x.mongo();
        });
      case 'is':
        return this.args[0];
      default:
        if (expression = mongodict[name]) {
          return expression;
        } else {
          return "dunno (" + name + ")";
        }
    }
  };
}).call(this);
