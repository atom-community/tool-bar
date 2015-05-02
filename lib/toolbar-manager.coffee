ToolbarButtonView = require './toolbar-button-view'
{$$} = require 'space-pen'

module.exports = class ToolbarManager
  constructor: (@group, @toolbar) ->

  addButton: (options) ->
    button = new ToolbarButtonView options
    button.group = @group
    @toolbar.addItem button
    button

  addSpacer: (options) ->
    spacer = $$ -> @hr class: 'tool-bar-spacer'
    spacer.priority = options?.priority
    spacer.group = @group
    @toolbar.addItem spacer
    spacer

  removeItems: ->
    items = @toolbar.items.filter (item) =>
      item.group is @group
    items.forEach (item) =>
      @toolbar.removeItem item
