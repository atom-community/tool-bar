{CompositeDisposable} = require 'atom'
{View} = require 'space-pen'
_ = require 'underscore-plus'

module.exports = class ToolBarView extends View
  @content: ->
    @div class: 'tool-bar'

  items: []

  addItem: (newItem) ->
    newItem.priority ?= @items[@items.length - 1]?.priority ? 50
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
    index = @items.indexOf item
    @items.splice index, 1
    element = atom.views.getView item
    @.element.removeChild element
    @drawGutter()

  initialize: ->
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

    atom.config.observe 'tool-bar.iconSize', (newValue) =>
      @updateSize newValue

    atom.config.onDidChange 'tool-bar.position', ({newValue, oldValue}) =>
      @show() if atom.config.get 'tool-bar.visible'

    atom.config.onDidChange 'tool-bar.visible', ({newValue, oldValue}) =>
      if newValue then @show() else @hide()

    if atom.config.get 'tool-bar.visible'
      @show()

    @.element.addEventListener 'scroll', @drawGutter
    window.addEventListener 'resize', @drawGutter

  serialize: ->

  destroy: ->
    @subscriptions.dispose()
    @detach() if @panel?
    @panel.destroy() if @panel?
    window.removeEventListener 'resize', @drawGutter

  updateSize: (size) ->
    @removeClass 'tool-bar-16px tool-bar-24px tool-bar-32px'
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
