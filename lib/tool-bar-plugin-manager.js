'use babel';

import ToolBarManager from './tool-bar-manager';
import { CompositeDisposable } from 'atom';

export default class ToolBarPluginManager {
  plugins = {};
  subscriptions = {};

  constructor (config) {
    this.config = config;

    const plugins = atom.config.get('tool-bar.plugins');
    if (plugins) {
      for (let plugin of Object.keys(plugins)) {
        this.config.plugins.properties[plugin] = {
          type: 'boolean',
          title: plugin,
          description: `Whether the "${plugin}" plugin is allowed to add items to the Tool Bar.`,
          default: true
        };
      }
    }
  }

  register (name, toolBarView) {
    let settingsKey = `tool-bar.plugins.${name}`;

    const plugin = this.plugins[name] = new ToolBarManager(name, toolBarView);
    this.subscriptions[name] = new CompositeDisposable();

    if (this.config.plugins.properties[name] === undefined) {
      this.config.plugins.properties[name] = {
        type: 'boolean',
        title: name,
        description: `Whether the "${name}" plugin is allowed to add items to the Tool Bar.`,
        default: true
      };
    }

    if (atom.config.get(settingsKey) == null) {
      atom.config.set(settingsKey, true);
    }

    this.subscriptions[name].add(atom.config.observe(settingsKey, (value) => {
      if (value !== false) {
        plugin.activate();
      } else {
        plugin.deactivate();
      }
    }));

    plugin.onDidDestroy(() => {
      this.unregister(name);
    });

    return plugin;
  }

  unregister (name) {
    delete this.plugins[name];
    this.subscriptions[name].dispose();
    delete this.subscriptions[name];
    delete this.config.plugins.properties[name];
    atom.config.unset(`tool-bar.plugins.${name}`);
  }

  destroy () {
    for (let plugin in this.plugins) {
      this.plugins[plugin].destroy();
    }
    this.plugins = null;
    this.subscriptions = null;
  }
};
