{CompositeDisposable} = require 'atom'
{View} = require 'space-pen'

module.exports = class ToolbarButtonView extends View
  @content: ->
    @button class: 'btn btn-default tool-bar-btn'

  initialize: (group, options) ->
    @subscriptions = new CompositeDisposable

    @attr 'data-group', group

    if options.tooltip
      @prop 'title', options.tooltip
      @subscriptions.add atom.tooltips.add(@, title: options.tooltip)

    if options.iconset
      @addClass "#{options.iconset} #{options.iconset}-#{options.icon}"
    else
      @addClass "icon-#{options.icon}"

    @on 'click', =>
      if !@hasClass 'disabled'
        if typeof(options.callback) == 'string'
          atom.commands.dispatch document.activeElement, options.callback
        else
          options.callback(options.data)

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()
