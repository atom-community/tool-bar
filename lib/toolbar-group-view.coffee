ToolbarButtonView = require './toolbar-button-view'
{$$} = require 'space-pen'

module.exports = class ToolbarGroup
  constructor: (group, toolbar) ->
    @group = group
    @toolbar = toolbar

  addButton: (options) ->
    button = new ToolbarButtonView @group, options
    @toolbar.append button
    button

  addSpacer: ->
    spacer = $$ -> @hr class: 'tool-bar-spacer'
    spacer.attr 'data-group', @group
    @toolbar.append spacer
    spacer

  removeItems: ->
    @toolbar.find("[data-group='#{@group}']").remove()
