(function() {
  var Backbone, _;
  _ = require('underscore');
  Backbone = require('backbone4000');
  _.map(require('validator'), function(value, property) {
    return exports[property] = value;
  });
  exports.ValidatedModel = Backbone.Model.extend4000({
    initialize: function() {
      var validator;
      if (validator = this.get('validator')) {
        return new exports.Validator(validator).feed(this.attributes, function(err, data) {
          if (err != null) {
            throw err;
          }
        });
      }
    }
  });
}).call(this);
