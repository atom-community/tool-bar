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

  prependButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarView.group = 'legacy'
    @toolbarView.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  prependSpacer: () ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarView.group = 'legacy'
    @toolbarView.addSpacer()
  appendButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarView.group = 'legacy'
    @toolbarView.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  appendSpacer: () ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarView.group = 'legacy'
    @toolbarView.addSpacer()
