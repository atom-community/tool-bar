ToolbarView = null
ToolbarButtonView = null
$$ = null

module.exports =
  toolbarView: null

  activate: (state) ->
    ToolbarView ?= require './toolbar-view'
    @toolbarView = new ToolbarView(state.toolbarViewState)

    ToolbarButtonView ?= require './toolbar-button-view'

    {$$} = require 'atom'

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
      enum: ['16px', '24px']

  prependButton: (icon, callback, tooltip=null, iconset=null) ->
    button = new ToolbarButtonView icon, callback, tooltip, iconset
    @toolbarView.prepend button
    button

  prependSpacer: (view) ->
    @toolbarView.prepend $$ ->
      @div class: 'spacer'

  appendButton: (icon, callback, tooltip=null, iconset=null) ->
    button = new ToolbarButtonView icon, callback, tooltip, iconset
    @toolbarView.append button
    button

  appendSpacer: (view) ->
    @toolbarView.append $$ ->
      @div class: 'spacer'
