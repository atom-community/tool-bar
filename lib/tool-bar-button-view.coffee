{CompositeDisposable} = require 'atom'
{$, View} = require 'space-pen'

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
          atom.commands.dispatch @getPreviouslyFocusedElement(), options.callback
        else
          options.callback(options.data)

    @on 'mouseover', =>
      @storeFocusedElement()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()

  getPreviouslyFocusedElement: () ->
    if @previouslyFocusedElement[0] and @previouslyFocusedElement[0] isnt document.body
      @eventElement = @previouslyFocusedElement[0]
    else
      @eventElement = atom.views.getView(atom.workspace)

  storeFocusedElement: ->
    @previouslyFocusedElement = $(document.activeElement)
