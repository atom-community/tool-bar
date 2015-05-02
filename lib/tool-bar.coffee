Grim = null
ToolBarManager = null

module.exports =
  toolBar: null

  activate: ->
    ToolBarView = require './tool-bar-view'
    @toolBar = new ToolBarView()
    ToolBarManager = require './tool-bar-manager'
    @toolBarManagerLegacy = new ToolBarManager 'legacy', @toolBar

  deactivate: ->
    @toolBar.destroy()

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
    (group) => new ToolBarManager group, @toolBar

  prependButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolBarManagerLegacy.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  prependSpacer: ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolBarManagerLegacy.addSpacer()
  appendButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolBarManagerLegacy.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  appendSpacer: ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolBarManagerLegacy.addSpacer()
