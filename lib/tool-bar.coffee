ToolBarManager = null

module.exports =
  toolBar: null

  activate: ->
    ToolBarView = require './tool-bar-view'
    @toolBar = new ToolBarView()
    ToolBarManager = require './tool-bar-manager'

  deactivate: ->
    @toolBar.destroy()

  serialize: ->

  config:
    position:
      type: 'string'
      default: 'Top'
      enum: ['Top', 'Right', 'Bottom', 'Left']
    visible:
      type: 'boolean'
      default: true
    iconSize:
      type: 'string'
      default: '24px'
      enum: ['16px', '24px', '32px']

  provideToolBar: ->
    (group) => new ToolBarManager group, @toolBar
