ToolBarManager = null

module.exports =
  toolBar: null

  activate: ->
    ToolBarView = require './tool-bar-view'
    @toolBar = new ToolBarView()
    ToolBarManager = require './tool-bar-manager'

  deactivate: ->
    @toolBar.destroy()
    @toolBar = null

  serialize: ->

  config:
    (->
      config =
        visible:
          type: 'boolean'
          default: true
          order: 1
        iconSize:
          type: 'string'
          default: '24px'
          enum: ['12px', '16px', '24px', '32px']
          order: 2
        position:
          type: 'string'
          default: 'Top'
          enum: ['Top', 'Right', 'Bottom', 'Left']
          order: 3

      if typeof atom.workspace.addHeaderPanel is 'function'
        config.fullWidth =
          type: 'boolean'
          default: true
          order: 4

      config
    )()

  provideToolBar: ->
    (group) => new ToolBarManager group, @toolBar
