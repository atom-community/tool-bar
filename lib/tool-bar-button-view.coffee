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
      @subscriptions.add atom.tooltips.add(this,
        title: options.tooltip
        placement: @getTooltipPlacement
      )

    if options.iconset
      @addClass "#{options.iconset} #{options.iconset}-#{options.icon}"
    else
      @addClass "icon-#{options.icon}"

    @on 'click', (e) =>
      if not @hasClass 'disabled'
        cb = options.callback
        if Object::toString.call(cb) is '[object Object]'
          modifier = @getCallbackModifier(options, e) if e.ctrlKey or e.altKey or e.shiftKey
          cb = options.callback[modifier] or options.callback['']
        switch typeof cb
          when 'string'
            atom.commands.dispatch @getPreviouslyFocusedElement(), cb
          when 'function'
            cb options.data, @getPreviouslyFocusedElement()
        @restoreFocus()

    @on 'mouseover', =>
      @storeFocusedElement()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()
    @subscriptions = null
    @remove()

  getPreviouslyFocusedElement: ->
    if @previouslyFocusedElement and @previouslyFocusedElement.nodeName isnt 'BODY'
      @eventElement = @previouslyFocusedElement
    else
      @eventElement = atom.views.getView(atom.workspace)

  restoreFocus: ->
    previouslyFocusedElement = $(@previouslyFocusedElement)
    if previouslyFocusedElement?.isOnDom()?
      previouslyFocusedElement.focus()
    else
      atom.workspace.focus()

  storeFocusedElement: ->
    if not document.activeElement.classList.contains 'tool-bar-btn'
      @previouslyFocusedElement = document.activeElement

  getTooltipPlacement: ->
    toolbarPosition = atom.config.get 'tool-bar.position'
    return toolbarPosition is 'Top'    and 'bottom' or
           toolbarPosition is 'Right'  and 'left'   or
           toolbarPosition is 'Bottom' and 'top'    or
           toolbarPosition is 'Left'   and 'right'

  getCallbackModifier: ({callback}, {altKey, ctrlKey, shiftKey}) ->
    Object.keys callback
      .filter Boolean
      .map (modifier) -> modifier.toLowerCase()
      .reverse()
      .find (item) ->
        return false if (~item.indexOf('alt')   and not altKey  ) or (altKey   and not ~item.indexOf('alt'))
        return false if (~item.indexOf('ctrl')  and not ctrlKey ) or (ctrlKey  and not ~item.indexOf('ctrl'))
        return false if (~item.indexOf('shift') and not shiftKey) or (shiftKey and not ~item.indexOf('shift'))
        return true
