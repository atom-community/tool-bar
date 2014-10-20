{View} = require 'atom'

module.exports =
class ToolbarView extends View
  @content: ->
    @div id: 'toolbar'

  initialize: (serializeState) ->
    atom.workspaceView.command 'toolbar:toggle', => @toggle()

    atom.config.observe 'toolbar.position', =>
      @hide()
      @show()

    atom.config.observe 'toolbar.visible', (newValue) =>
      if newValue
        @hide()
        @show()
      else
        @hide()

    atom.config.observe 'toolbar.iconSize', (newValue) =>
      @updateSize newValue

    if atom.config.get 'toolbar.visible'
      @show()

  serialize: ->

  destroy: ->
    @detach()

  updateSize: (size) ->
    @removeClass 'icons16'

    if size == '16px'
      @addClass 'icons16'

  hide: ->
    @detach()

  show: ->
    @removeClass()
    position = atom.config.get 'toolbar.position'
    switch position
      when 'Top' then atom.workspaceView.prependToTop this
      when 'Right' then atom.workspaceView.appendToRight this
      when 'Bottom' then atom.workspaceView.appendToBottom this
      when 'Left' then atom.workspaceView.prependToLeft this

    @addClass position.toLowerCase()
    if (position == 'Top') || (position == 'Bottom')
      @addClass 'horizontal'
    else
      @addClass 'vertical'

    @updateSize atom.config.get('toolbar.iconSize')

  toggle: ->
    if @hasParent()
      @hide()
      atom.config.set 'toolbar.visible', false
    else
      @show()
      atom.config.set 'toolbar.visible', true
