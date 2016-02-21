{CompositeDisposable, Emitter} = require 'atom'
{View} = require 'space-pen'
_ = require 'underscore-plus'

module.exports = class ToolBarView extends View
  @content: ->
    @div class: 'tool-bar'

  addItem: (newItem) ->
    lastItem = @items.filter((item) -> item.group isnt newItem.group)?.pop()
    newItem.priority ?= lastItem?.priority + 1 ? 50
    newItem.get(0).dataset.group = newItem.group if atom.devMode
    newItem.get(0).dataset.priority = newItem.priority if atom.devMode
    nextItem = null
    for existingItem, index in @items
      if existingItem.priority > newItem.priority
        nextItem = existingItem
        break
    @items.splice index, 0, newItem
    newElement = atom.views.getView newItem
    nextElement = atom.views.getView nextItem
    @.element.insertBefore newElement, nextElement
    @drawGutter()
    nextItem

  removeItem: (item) ->
    item.destroy()
    @items.splice (@items.indexOf item), 1
    @drawGutter()

  initialize: ->
    @items = []
    @emitter = new Emitter
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace', 'tool-bar:toggle', =>
      @toggle()
    @subscriptions.add atom.commands.add 'atom-workspace', 'tool-bar:position-top', =>
      @updatePosition 'Top'
      atom.config.set 'tool-bar.position', 'Top'
    @subscriptions.add atom.commands.add 'atom-workspace', 'tool-bar:position-right', =>
      @updatePosition 'Right'
      atom.config.set 'tool-bar.position', 'Right'
    @subscriptions.add atom.commands.add 'atom-workspace', 'tool-bar:position-bottom', =>
      @updatePosition 'Bottom'
      atom.config.set 'tool-bar.position', 'Bottom'
    @subscriptions.add atom.commands.add 'atom-workspace', 'tool-bar:position-left', =>
      @updatePosition 'Left'
      atom.config.set 'tool-bar.position', 'Left'

    @subscriptions.add atom.config.observe 'tool-bar.iconSize', (newValue) =>
      @updateSize newValue

    @subscriptions.add atom.config.onDidChange 'tool-bar.position', ({newValue, oldValue}) =>
      @show() if atom.config.get 'tool-bar.visible'

    @subscriptions.add atom.config.onDidChange 'tool-bar.visible', ({newValue, oldValue}) =>
      if newValue then @show() else @hide()

    if atom.config.get 'tool-bar.visible'
      @show()

    @on 'scroll', @drawGutter
    window.addEventListener 'resize', @drawGutter

  serialize: ->

  destroy: ->
    item.destroy() for item in @items
    @items = null

    @subscriptions.dispose()
    @subscriptions = null

    @hide()
    @remove()
    window.removeEventListener 'resize', @drawGutter

    @emitter.emit 'did-destroy'
    @emitter.dispose()
    @emitter = null

  updateSize: (size) ->
    @removeClass 'tool-bar-12px tool-bar-16px tool-bar-24px tool-bar-32px'
    @addClass "tool-bar-#{size}"

  updatePosition: (position) ->
    @removeClass 'tool-bar-top tool-bar-right tool-bar-bottom tool-bar-left tool-bar-horizontal tool-bar-vertical'

    switch position
      when 'Top' then @panel = atom.workspace.addTopPanel item: this
      when 'Right' then @panel = atom.workspace.addRightPanel item: this
      when 'Bottom' then @panel = atom.workspace.addBottomPanel item: this
      when 'Left' then @panel = atom.workspace.addLeftPanel item: this, priority: 50
    @addClass "tool-bar-#{position.toLowerCase()}"

    if position is 'Top' or position is 'Bottom'
      @addClass 'tool-bar-horizontal'
    else
      @addClass 'tool-bar-vertical'

    @updateMenu position

    @drawGutter()

  updateMenu: (position) ->
    packagesMenu = _.find(atom.menu.template, ({label}) -> label is 'Packages' or label is '&Packages')
    toolBarMenu = _.find(packagesMenu.submenu, ({label}) -> label is 'Tool Bar' or label is '&Tool Bar') if packagesMenu
    positionsMenu = _.find(toolBarMenu.submenu, ({label}) -> label is 'Position' or label is '&Position') if toolBarMenu
    positionMenu = _.find(positionsMenu.submenu, ({label}) -> label is position) if positionsMenu
    positionMenu?.checked = true

  drawGutter: =>
    @removeClass 'gutter-top gutter-bottom'
    visibleHeight = @height()
    scrollHeight = @.element.scrollHeight
    hiddenHeight = scrollHeight - visibleHeight
    if visibleHeight < scrollHeight
      if @scrollTop() > 0
        @addClass 'gutter-top'
      if @scrollTop() < hiddenHeight
        @addClass 'gutter-bottom'

  hide: ->
    @detach() if @panel?
    @panel.destroy() if @panel?
    @panel = null

  show: ->
    @hide()
    @updatePosition atom.config.get 'tool-bar.position'
    @updateSize atom.config.get 'tool-bar.iconSize'

  toggle: ->
    if @hasParent()
      @hide()
      atom.config.set 'tool-bar.visible', false
    else
      @show()
      atom.config.set 'tool-bar.visible', true
