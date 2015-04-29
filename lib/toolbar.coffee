Grim = null

module.exports =
  toolbarView: null

  activate: (state) ->
    ToolbarView = require './toolbar-view'
    @toolbarView = new ToolbarView(state.toolbarViewState)

  deactivate: ->
    @toolbarView.destroy()

  serialize: ->
    toolbarViewState: @toolbarView.serialize()

  config:
    position:
      type: 'string'
      default: 'Top'
      enum: ['Top', 'Right', 'Bottom', 'Left']
    visible:
      type: 'boolean'
      default: true
    iconSize:
      type: 'string'
      default: '24px'
      enum: ['16px', '24px', '32px']

  provideStatusBar: ->
    (group) =>
      @toolbarView.group = group
      addButton: @toolbarView.addButton.bind(@toolbarView)
      addSpacer: @toolbarView.addSpacer.bind(@toolbarView)

  prependButton: (args...) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    return @toolbarView.addButton(args...)
  prependSpacer: (args...) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    return @toolbarView.addSpacer(args...)
  appendButton: (args...) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    return @toolbarView.addButton(args...)
  appendSpacer: (args...) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    return @toolbarView.addSpacer(args...)
