Grim = null
ToolbarGroupView = null

module.exports =
  toolbar: null

  activate: ->
    ToolbarView = require './toolbar-view'
    @toolbar = new ToolbarView()

    ToolbarGroupView = require './toolbar-group-view'
    @toolbarGroupLegacy = new ToolbarGroupView 'legacy', @toolbar

  deactivate: ->
    @toolbar.destroy()

  serialize: ->
    toolbarState: @toolbar.serialize()

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
    (group) => new ToolbarGroupView group, @toolbar

  prependButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarGroupLegacy.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  prependSpacer: ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarGroupLegacy.addSpacer()
  appendButton: (icon, callback, tooltip, iconset, data) ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarGroupLegacy.addButton
      icon: icon
      callback: callback
      tooltip: tooltip
      iconset: iconset
      data: data
  appendSpacer: ->
    Grim ?= require 'grim'
    Grim.deprecate 'Use version ^0.1.0 of the tool-bar Service API.'
    @toolbarGroupLegacy.addSpacer()
