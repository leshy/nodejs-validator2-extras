# things that didn't quite fit into validator2 but I still frequently need
_ = require 'underscore'
Backbone = require 'backbone4000'

# inherit validator module
_.map require('validator2'), (value,property) -> exports[property] = value

# backbone model that uses validator on its own attributes (for initialization)
# 
# feed call in this case should BLOCK. at least on the level of this object's init because we
# don't want other subclassed initialize functions to be called until verification is complete
exports.ValidatedModel = Backbone.Model.extend4000
    initialize: -> if @validator then new exports.Validator(@validator).feed @attributes, (err,data) -> console.log(err,data); if err? then throw err



