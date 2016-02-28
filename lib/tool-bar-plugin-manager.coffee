ToolBarManager = require './tool-bar-manager'
{CompositeDisposable} = require 'atom'

module.exports = class ToolBarPluginManager
  plugins: {}
  subscriptions: {}

  register: (name, toolBar) ->
    console.debug 'ToolBarPluginManager::register', arguments
    settingsKey = "tool-bar.plugins.#{name}"

    toolBarManager = new ToolBarManager name, toolBar

    @plugins[name] = toolBarManager
    @subscriptions[name] = new CompositeDisposable

    atom.config.set(settingsKey, true) unless atom.config.get(settingsKey)?

    @subscriptions[name].add atom.config.onDidChange settingsKey, ({newValue, oldValue}) ->
      console.debug "ToolBarPluginManager:#{settingsKey}:onDidChange", arguments
      if newValue
        toolBarManager.restoreItems()
      else
        toolBarManager.hideItems()

    return toolBarManager

  unregister: (name) ->
    console.debug 'ToolBarPluginManager::unregister', name
    delete @plugins[name]
    @subscriptions[name].destroy()
    delete @subscriptions[name]

  destroy: ->
    console.debug 'ToolBarPluginManager::destroy'
    @unregister(plugin) for plugin of @plugins
    @plugins = null
    @subscriptions = null
