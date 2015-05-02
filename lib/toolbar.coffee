Grim = null
ToolbarManager = null

module.exports =
  toolbar: null

  activate: ->
    ToolbarView = require './toolbar-view'
    @toolbar = new ToolbarView()
    ToolbarManager = require './toolbar-manager'
    @toolbarManagerLegacy = new ToolbarManager 'legacy', @toolbar

  deactivate: ->
    @toolbar.destroy()

  serialize: ->

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
    (group) => new ToolbarManager group, @toolbar

  prependButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarManagerLegacy.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  prependSpacer: ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarManagerLegacy.addSpacer()
  appendButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarManagerLegacy.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  appendSpacer: ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarManagerLegacy.addSpacer()
