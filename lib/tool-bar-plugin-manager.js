'use babel';

import ToolBarManager from './tool-bar-manager';
import { CompositeDisposable } from 'atom';

export default class ToolBarPluginManager {
  plugins = {};
  subscriptions = {};

  constructor(config) {
    this.config = config;
    console.log('ToolBarPluginManager::constructor', this.config);
  }

  register(name, toolBar, legacy) {
    console.debug('ToolBarPluginManager::register', arguments);
    let settingsKey = `tool-bar.plugins.${name}`;

    this.plugins[name] = new ToolBarManager(name, toolBar, legacy);
    this.subscriptions[name] = new CompositeDisposable();

    this.config.plugins[name] = {
      type: 'boolean',
      title: name,
      description: `Whether the ${name} plugin is allowed to add items to the Tool Bar.`,
      default: true
    };

    if (atom.config.get(settingsKey) == null) {
      atom.config.set(settingsKey, true);
    }

    this.subscriptions[name].add(atom.config.observe(settingsKey, (value) => {
      console.debug(`ToolBarPluginManager:${settingsKey}:observe`, arguments);
      if (value) {
        this.plugins[name].activate();
      } else {
        this.plugins[name].deactivate();
      }
    }));

    return this.plugins[name];
  }

  unregister(name) {
    console.debug('ToolBarPluginManager::unregister', name);
    delete this.plugins[name];
    this.subscriptions[name].destroy();
    delete this.subscriptions[name];
    delete this.config.plugins[name];
  }

  destroy() {
    console.debug('ToolBarPluginManager::destroy');
    for (let plugin in this.plugins) {
      this.unregister(plugin);
    }
    this.plugins = null;
    this.subscriptions = null;
  }
};
