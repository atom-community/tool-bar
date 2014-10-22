{View} = require 'atom'

module.exports =
class ToolbarButtonView extends View
  @content: ->
    @div class: 'icon'

  initialize: (icon, callback, tooltip=null, iconset=null) ->
    iconClass = if !iconset then 'icon-' + icon else iconset + '-' + icon

    @addClass 'icon ' + iconClass, title: tooltip
    if iconset
      @addClass iconset

    @on 'click', =>
      if !@hasClass('disabled')
        if typeof(callback) == 'string'
          atom.workspaceView.trigger callback
        else
          callback()

  setEnabled: (enabled) ->
    if enabled
      @removeClass 'disabled'
    else
      @addClass 'disabled'
