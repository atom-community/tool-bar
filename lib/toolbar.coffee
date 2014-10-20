ToolbarView = require './toolbar-view'

module.exports =
  toolbarView: null

  activate: (state) ->
    @toolbarView = new ToolbarView(state.toolbarViewState)

  deactivate: ->
    @toolbarView.destroy()

  serialize: ->
    toolbarViewState: @toolbarView.serialize()

  config:
    position:
      type: 'string'
      default: 'Top'
      enum: ['Top', 'Right', 'Bottom', 'Left']

    visible:
      type: 'boolean'
      default: true
