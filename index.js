(function() {
  var Backbone, _;
  _ = require('underscore');
  Backbone = require('backbone4000');
  _.map(require('validator2'), function(value, property) {
    return exports[property] = value;
  });
  exports.ValidatedModel = Backbone.Model.extend4000({
    initialize: function() {
      if (this.validator) {
        return new exports.Validator(this.validator).feed(this.attributes, function(err, data) {
          console.log(err, data);
          if (err != null) {
            throw err;
          }
        });
      }
    }
  });
}).call(this);
