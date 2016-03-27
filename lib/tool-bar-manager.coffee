ToolBarButtonView = require './tool-bar-button-view'
{$$} = require 'space-pen'

module.exports = class ToolBarManager
  constructor: (@group, @toolBar) ->
    @visible = true

  addButton: (options) ->
    button = new ToolBarButtonView options
    button.group = @group
    @toolBar.addItem button
    @toolBar.hideItem(button) unless @visible
    button

  addSpacer: (options) ->
    spacer = $$ -> @hr class: 'tool-bar-spacer'
    spacer.priority = options?.priority
    spacer.addClass 'tool-bar-item-align-end' if spacer.priority < 0
    spacer.group = @group
    spacer.destroy = -> spacer.remove()
    @toolBar.addItem spacer
    @toolBar.hideItem(spacer) unless @visible
    spacer

  removeItems: ->
    @toolBar.items?.filter (item) =>
      item.group is @group
    .forEach (item) =>
      @toolBar.removeItem item

  hideItems: ->
    @visible = false
    @toolBar.items?.filter (item) =>
      item.group is @group
    .forEach (item) =>
      @toolBar.hideItem item

  restoreItems: ->
    @visible = true
    @toolBar.items?.filter (item) =>
      item.group is @group
    .forEach (item) =>
      @toolBar.restoreItem item

  onDidDestroy: (callback) ->
    @toolBar.emitter.on 'did-destroy', callback
