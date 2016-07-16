'use babel';

import ToolBarView from './tool-bar-view';
import PluginManager from './tool-bar-plugin-manager';

let toolBarView = null;
let plugins = null;

export function activate () {
  toolBarView = new ToolBarView();
  plugins = new PluginManager(config);
}

export function deactivate () {
  toolBarView.destroy();
  toolBarView = null;
  plugins.destroy();
  plugins = null;
}

export function provideToolBar () {
  return (group) => plugins.register(group, toolBarView);
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
    description: 'The Tool Bar package by itself adds an empty toolbar. To propagate it with icons you can [install plugins](https://github.com/suda/tool-bar#plugins). The following plugins are allowed to add items to the Tool Bar.', // Not yet supported
    type: 'object',
    default: {},
    properties: {},
    order: 5
  }
};
