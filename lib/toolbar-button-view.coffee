{CompositeDisposable} = require 'atom'
{View} = require 'space-pen'

module.exports = class ToolbarButtonView extends View
  @content: ->
    @button class: 'btn btn-default tool-bar-btn'

  initialize: (icon, callback, tooltip = null, iconset = null, data = null) ->
    @subscriptions = new CompositeDisposable

    @addClass if !iconset then 'icon-' + icon else iconset + '-' + icon

    if tooltip
      @prop 'title', tooltip
      @subscriptions.add atom.tooltips.add(@, title: tooltip)

    if iconset
      @addClass iconset

    @on 'click', =>
      if !@hasClass 'disabled'
        if typeof(callback) == 'string'
          atom.commands.dispatch document.activeElement, callback
        else
          callback(data)

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()
