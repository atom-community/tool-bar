{View, $} = require 'atom-space-pen-views'

module.exports =
class ToolbarButtonView extends View
  @content: ->
    @div class: 'icon'

  initialize: (icon, callback, tooltip=null, iconset=null) ->
    iconClass = if !iconset then 'icon-' + icon else iconset + '-' + icon

    @addClass 'icon ' + iconClass
    @prop 'title', tooltip
    if iconset
      @addClass iconset

    @on 'click', =>

      @previouslyFocusedElement = $(document.activeElement);

      if @previouslyFocusedElement[0] and @previouslyFocusedElement[0] isnt document.body
        @eventElement = @previouslyFocusedElement[0]
      else
        @eventElement = atom.views.getView(atom.workspace)

      if !@hasClass('disabled')
        if typeof(callback) == 'string'
          atom.commands.dispatch @eventElement, callback
        else
          callback()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'
