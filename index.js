(function() {
  var Backbone, colors, helpers, _;
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
  exports.Validator.prototype.mongo = function() {
    switch (this.name()) {
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
}).call(this);
