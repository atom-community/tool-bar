{CompositeDisposable} = require 'atom'
{View} = require 'atom-space-pen-views'

module.exports = class ToolbarView extends View
  @content: ->
    @div class: 'tool-bar'

  initialize: (serializeState) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace', 'toolbar:toggle', => @toggle()

    atom.config.observe 'toolbar.iconSize', (newValue) =>
      @updateSize newValue

    atom.config.observe 'toolbar.position', =>
      @show() if atom.config.get 'toolbar.visible'

    atom.config.observe 'toolbar.visible', (newValue) =>
      if newValue then @show() else @hide()

    if atom.config.get 'toolbar.visible'
      @show()

  serialize: ->

  destroy: ->
    @subscriptions.dispose()
    @detach() if @panel?
    @panel.destroy() if @panel?

  updateSize: (size) ->
    @removeClass 'tool-bar-16px tool-bar-24px tool-bar-32px'
    @addClass 'tool-bar-' + size

  updatePosition: (position) ->
    @removeClass 'tool-bar-top tool-bar-right tool-bar-bottom tool-bar-left tool-bar-horizontal tool-bar-vertical'

    switch position
      when 'Top' then @panel = atom.workspace.addTopPanel { item: @ }
      when 'Right' then @panel = atom.workspace.addRightPanel { item: @ }
      when 'Bottom' then @panel = atom.workspace.addBottomPanel { item: @ }
      when 'Left' then @panel = atom.workspace.addLeftPanel { item: @, priority: 50 }
    @addClass 'tool-bar-' + position.toLowerCase()

    if position is 'Top' or position is 'Bottom'
      @addClass 'tool-bar-horizontal'
    else
      @addClass 'tool-bar-vertical'

  hide: ->
    @detach() if @panel?
    @panel.destroy() if @panel?

  show: ->
    @hide()
    @updatePosition atom.config.get 'toolbar.position'
    @updateSize atom.config.get 'toolbar.iconSize'

  toggle: ->
    if @hasParent()
      @hide()
      atom.config.set 'toolbar.visible', false
    else
      @show()
      atom.config.set 'toolbar.visible', true
