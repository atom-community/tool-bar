'use babel';

import ToolBarView from './tool-bar-view';
import PluginManager from './tool-bar-plugin-manager';

let toolBar = null;
let plugins = null;

export function activate () {
  toolBar = new ToolBarView();
  plugins = new PluginManager(config);
}

export function deactivate () {
  toolBar.destroy();
  toolBar = null;
  plugins.destroy();
  plugins = null;
}

export function provideToolBar () {
  return (group) => plugins.register(group, toolBar);
}

export function provideToolBarLegacy () {
  return (group) => {
    const Grim = require('grim');
    Grim.deprecate('Please update to the latest tool-bar provider service.');
    return plugins.register(group, toolBar, true);
  };
}

export let config = {
  visible: {
    type: 'boolean',
    default: true,
    order: 1
  },
  iconSize: {
    type: 'string',
    default: '24px',
    enum: ['12px', '16px', '24px', '32px'],
    order: 2
  },
  position: {
    type: 'string',
    default: 'Top',
    enum: ['Top', 'Right', 'Bottom', 'Left'],
    order: 3
  },
  fullWidth: {
    type: 'boolean',
    default: true,
    order: 4
  },
  plugins: {
    type: 'object',
    default: {},
    order: 5
  }
};

if (typeof atom.workspace.addHeaderPanel !== 'function') {
  delete config.fullWidth;
}
