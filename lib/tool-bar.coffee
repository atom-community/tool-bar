ToolBarView = null
PluginManager = null

module.exports =
  toolBar: null
  plugins: null

  activate: ->
    ToolBarView ?= require './tool-bar-view'
    @toolBar = new ToolBarView()

    PluginManager ?= require './tool-bar-plugin-manager'
    @plugins = new PluginManager(@config)

  deactivate: ->
    @plugins.destroy()
    @plugins = null

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
        plugins:
          type: 'object'
          properties: {}
          order: 5

      if typeof atom.workspace.addHeaderPanel is 'function'
        config.fullWidth =
          type: 'boolean'
          default: true
          order: 4

      config
    )()

  provideToolBar: ->
    (group) => @plugins.register group, @toolBar
