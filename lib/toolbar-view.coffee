{CompositeDisposable} = require 'atom'
{View} = require 'atom-space-pen-views'

module.exports =
class ToolbarView extends View
  @content: ->
    @div id: 'toolbar'

  initialize: (serializeState) ->
    @subscriptions = new CompositeDisposable

    @subscriptions.add atom.commands.add 'atom-workspace', 'toolbar:toggle', => @toggle()

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
    @subscriptions.dispose()
    @detach()

  updateSize: (size) ->
    @removeClass 'icons16px icons24px icons32px'
    @addClass 'icons' + size

  hide: ->
    @detach()

  show: ->
    @removeClass()
    position = atom.config.get 'toolbar.position'
    switch position
      when 'Top' then atom.workspace.addTopPanel { item: @ }
      when 'Right' then atom.workspace.addRightPanel { item: @ }
      when 'Bottom' then atom.workspace.addBottomPanel { item: @ }
      when 'Left' then atom.workspace.addLeftPanel { item: @, priority: 50 }

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
