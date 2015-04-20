{CompositeDisposable} = require 'atom'
{View} = require 'atom-space-pen-views'

module.exports =
class ToolbarButtonView extends View
  @content: ->
    @div class: 'icon'

  initialize: (icon, callback, tooltip = null, iconset = null) ->
    @subscriptions = new CompositeDisposable

    iconClass = if !iconset then 'icon-' + icon else iconset + '-' + icon

    @addClass 'icon ' + iconClass

    if tooltip
      @prop 'title', tooltip
      @subscriptions.add atom.tooltips.add(@, title: tooltip)

    if iconset
      @addClass iconset

    @on 'click', =>
      if !@hasClass('disabled')
        if typeof(callback) == 'string'
          atom.commands.dispatch document.activeElement, callback
        else
          callback()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()
