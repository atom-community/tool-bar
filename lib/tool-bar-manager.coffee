ToolBarButtonView = require './tool-bar-button-view'
{$$} = require 'space-pen'

module.exports = class ToolBarManager
  constructor: (@group, @toolBar) ->

  addButton: (options) ->
    button = new ToolBarButtonView options
    button.group = @group
    @toolBar.addItem button
    button
    
  addCustomButton: (buttonView) ->
    buttonView.group = @group
    @toolBar.addItem buttonView
    buttonView

  addSpacer: (options) ->
    spacer = $$ -> @hr class: 'tool-bar-spacer'
    spacer.priority = options?.priority
    spacer.group = @group
    spacer.destroy = -> spacer.remove()
    @toolBar.addItem spacer
    spacer

  removeItems: ->
    @toolBar.items?.filter (item) =>
      item.group is @group
    .forEach (item) =>
      @toolBar.removeItem item

  onDidDestroy: (callback) ->
    @toolBar.emitter.on 'did-destroy', callback
