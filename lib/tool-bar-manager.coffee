ToolBarButtonView = require './tool-bar-button-view'
{$$} = require 'space-pen'

module.exports = class ToolBarManager
  constructor: (@group, @toolBar) ->

  addButton: (options) ->
    button = new ToolBarButtonView options
    button.group = @group
    @toolBar.addItem button
    button

  addSpacer: (options) ->
    spacer = $$ -> @hr class: 'tool-bar-spacer'
    spacer.priority = options?.priority
    spacer.group = @group
    @toolBar.addItem spacer
    spacer

  removeItems: ->
    items = @toolBar.items.filter (item) =>
      item.group is @group
    items.forEach (item) =>
      @toolBar.removeItem item
