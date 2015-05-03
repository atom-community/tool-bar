{CompositeDisposable} = require 'atom'
{View} = require 'space-pen'

module.exports = class ToolBarButtonView extends View
  @content: ->
    @button class: 'btn btn-default tool-bar-btn'

  initialize: (options) ->
    @subscriptions = new CompositeDisposable

    @priority = options.priority

    if options.tooltip
      @prop 'title', options.tooltip
      @subscriptions.add atom.tooltips.add(@, title: options.tooltip)

    if options.iconset
      @addClass "#{options.iconset} #{options.iconset}-#{options.icon}"
    else
      @addClass "icon-#{options.icon}"

    @on 'click', =>
      if not @hasClass 'disabled'
        if typeof options.callback is 'string'
          atom.commands.dispatch atom.views.getView(atom.workspace.getActiveTextEditor()), options.callback
        else
          options.callback(options.data)

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()
