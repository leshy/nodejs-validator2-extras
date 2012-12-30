(function() {
  var Backbone, Validated, colors, helpers, _;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
            throw "model init invalid: " + err;
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
  exports.Validated = Validated = function(validator, targetf) {
    return function() {
      var args, callback, self, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      self = this;
      if (args.length === 1) {
        arguments = _.first(args);
      }
      return new exports.Validator(validator).feed(args, function(err, data) {
        if (err) {
          return callback(err, data);
        } else {
          return targetf.apply(self, [].concat(args, callback));
        }
      });
    };
  };
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
  exports.MakeAccessors = function() {
    var accessormodel, accessors, definition;
    accessors = arguments[0], definition = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    accessormodel = {};
    _.map(accessors, function(validator, name) {
      return accessormodel[name] = function(value) {
        return exports.v(validator).feed(value, __bind(function(err, data) {
          if (err) {
            throw "accessor value invalid: " + err;
          } else {
            return this.set(name, data);
          }
        }, this));
      };
    });
    return accessormodel;
  };
}).call(this);
