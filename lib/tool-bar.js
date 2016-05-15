'use babel';

import ToolBarManager from './tool-bar-manager';
import ToolBarView from './tool-bar-view';

let toolBar = null;

export function activate () {
  toolBar = new ToolBarView();
}

export function deactivate () {
  toolBar.destroy();
  toolBar = null;
}

export function provideToolBar () {
  return (group) => new ToolBarManager(group, toolBar);
}

export function provideToolBarLegacy () {
  return (group) => {
    const Grim = require('grim');
    Grim.deprecate('Please update to the latest tool-bar provider service.');
    return new ToolBarManager(group, toolBar, true);
  };
}

export const config = {
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
  }
};

if (typeof atom.workspace.addHeaderPanel !== 'function') {
  delete config.fullWidth;
}
