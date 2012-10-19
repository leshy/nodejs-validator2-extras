# things that didn't quite fit into validator2 but I still frequently need
_ = require 'underscore'
Backbone = require 'backbone4000'
helpers = require 'helpers'
colors = require 'colors'

# inherit validator module
_.map require('validator2'), (value,property) -> exports[property] = value

# backbone model that uses validator on its own attributes (for initialization)
#
# feed call in this case should BLOCK. at least on the level of this object's init because we
# don't want other subclassed initialize functions to be called until verification is complete
exports.ValidatedModel = Backbone.Model.extend4000
    initialize: -> if @validator then new exports.Validator(@validator).feed @attributes, (err,data) -> if err? then throw "model init invalid"




mongodict =
    string: { $type: 2 }
    boolean: { $type: 8 }
    number: { $type : 1 }
    exists: { $exists: true }
    
    
exports.Validator::mongo = ->
    name = @name()

    switch name
        when 'children' then helpers.hashmap @args[0], (value, key) -> x = new exports.Validator(value);x.mongo()
        when 'is' then @args[0]
        else
            if expression = mongodict[name] then expression else "dunno (#{ name })"
    

