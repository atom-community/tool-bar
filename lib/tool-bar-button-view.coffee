{CompositeDisposable} = require 'atom'
{View} = require 'space-pen'

isObject = (obj) -> Object::toString.call(obj) is '[object Object]'

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
        placement: _getTooltipPlacement
      )

    if options.iconset
      @addClass "#{options.iconset} #{options.iconset}-#{options.icon}"
    else
      @addClass "icon-#{options.icon}"

    @on 'click', (e) =>
      _restoreFocus()
      _executeCallback(options, e) unless @hasClass 'disabled'
      return false

    @on 'mouseover', -> _storeFocusedElement()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'

  destroy: ->
    @subscriptions.dispose()
    @subscriptions = null
    @remove()

  _prevFocusedElm = null

  _getPrevFocusedElm = ->
    prevFocusedElm = atom.views.getView(atom.workspace)
    prevFocusedElm = _prevFocusedElm if prevFocusedElm.contains(_prevFocusedElm)
    prevFocusedElm

  _restoreFocus = ->
    _getPrevFocusedElm().focus()

  _storeFocusedElement = ->
    unless document.activeElement.classList.contains 'tool-bar-btn'
      _prevFocusedElm = document.activeElement

  _getTooltipPlacement = ->
    toolbarPosition = atom.config.get 'tool-bar.position'
    return toolbarPosition is 'Top'    and 'bottom' or
           toolbarPosition is 'Right'  and 'left'   or
           toolbarPosition is 'Bottom' and 'top'    or
           toolbarPosition is 'Left'   and 'right'

  _executeCallback = ({callback, data}, e) ->
    callback = _getCallbackModifier(callback, e) if isObject(callback)
    switch typeof callback
      when 'string'
        atom.commands.dispatch _getPrevFocusedElm(), callback
      when 'function'
        callback data, _getPrevFocusedElm()

  _getCallbackModifier = (callback, {altKey, ctrlKey, shiftKey}) ->
    return callback[''] unless ctrlKey or altKey or shiftKey
    modifier = Object.keys callback
      .filter Boolean
      .map (modifiers) -> modifiers.toLowerCase()
      .reverse()
      .find (item) ->
        return false if (~item.indexOf('alt')   and not   altKey) or (altKey   and not   ~item.indexOf('alt'))
        return false if (~item.indexOf('ctrl')  and not  ctrlKey) or (ctrlKey  and not  ~item.indexOf('ctrl'))
        return false if (~item.indexOf('shift') and not shiftKey) or (shiftKey and not ~item.indexOf('shift'))
        return true
    callback[modifier] or callback['']
