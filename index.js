(function() {
  var Backbone, colors, helpers, _;
  var __slice = Array.prototype.slice;
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
        new exports.Validator(this.validator).feed(this.attributes, function(err, data) {
          if (err != null) {
            throw "model init invalid";
          }
        });
      }
      if (this.superValidator) {
        return new exports.Validator(this.superValidator).feed(this.constructor.__super__, function(err, data) {
          if (err != null) {
            throw "Mixin super validator failed";
          }
        });
      }
    }
  });
  exports.Validator.prototype.mongo = function() {
    switch (this.name().toLowerCase()) {
      case 'children':
        return helpers.hashmap(this.args[0], function(value, key) {
          var x;
          x = new exports.Validator(value);
          return x.mongo();
        });
      case 'number':
        return {
          '$type': 1
        };
      case 'string':
        return {
          '$type': 2
        };
      case 'boolean':
        return {
          '$type': 8
        };
      case 'exists':
        return {
          '$exists': true
        };
      case 'is':
        return this.args[0];
      default:
        return "dunno (" + name + ")";
    }
  };
  exports.Select = function() {
    var args, chew, target;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length < 3 || !args.length % 2) {
      throw "wrong number of arguments";
    }
    target = args.shift();
    chew = function() {
      var callback, pattern;
      if (args.length) {
        pattern = exports.v(args.shift());
        callback = args.shift();
        return pattern.feed(target, function(err, data) {
          if (!err) {
            return callback(data, chew);
          } else {
            return chew();
          }
        });
      }
    };
    return chew();
  };
}).call(this);
