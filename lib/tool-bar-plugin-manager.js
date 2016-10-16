'use babel';

import ToolBarManager from './tool-bar-manager';
import { CompositeDisposable } from 'atom';

export default class ToolBarPluginManager {
  plugins = {};
  subscriptions = {};

  constructor (config) {
    this.config = config;

    // Register all previously registered plugins just in case the user
    // disabled/uninstalled a plugin.
    process.nextTick(() => {
      const plugins = atom.config.get('tool-bar.plugins');
      if (plugins) {
        for (let name of Object.keys(plugins)) {
          this.registerPluginConfigSchema(name);
        }
      }
    });
  }

  register (name, toolBarView) {
    let settingsKey = `tool-bar.plugins.${name}`;

    const plugin = this.plugins[name] = new ToolBarManager(name, toolBarView);
    this.subscriptions[name] = new CompositeDisposable();

    this.registerPluginConfigSchema(name);

    // Config defaults are not merged with user defaults until activate. At
    // this point `atom.config.get` returns the user set value. If it's
    // `undefined`, then the user has not set it.
    if (atom.config.get(settingsKey) === undefined) {
      atom.config.set(settingsKey, this.config.plugins.properties[name].default);
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

  registerPluginConfigSchema (name) {
    if (this.config.plugins.properties[name] === undefined) {
      this.config.plugins.properties[name] = {
        type: 'boolean',
        title: name,
        description: `Whether the "${name}" plugin is allowed to add items to the Tool Bar.`,
        default: true
      };
    }
  }
};
