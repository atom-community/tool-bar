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
      @subscriptions.add atom.tooltips.add(this,
        title: options.tooltip
        placement: @getTooltipPlacement
      )

    if options.iconset
      @addClass "#{options.iconset} #{options.iconset}-#{options.icon}"
    else
      @addClass "icon-#{options.icon}"

    @on 'click', =>
      if not @hasClass 'disabled'
        if typeof options.callback is 'string'
          atom.commands.dispatch @getPreviouslyFocusedElement(), options.callback
        else
          options.callback(options.data, @getPreviouslyFocusedElement())

    @on 'mouseover', =>
      @storeFocusedElement()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()

  getPreviouslyFocusedElement: ->
    if @previouslyFocusedElement and @previouslyFocusedElement.nodeName isnt 'BODY'
      @eventElement = @previouslyFocusedElement
    else
      @eventElement = atom.views.getView(atom.workspace)

  storeFocusedElement: ->
    if not document.activeElement.classList.contains 'tool-bar-btn'
      @previouslyFocusedElement = document.activeElement

  getTooltipPlacement: ->
    toolbarPosition = atom.config.get 'tool-bar.position'
    return toolbarPosition is "Top"    and "bottom" or
           toolbarPosition is "Right"  and "left"   or
           toolbarPosition is "Bottom" and "top"    or
           toolbarPosition is "Left"   and "right"

