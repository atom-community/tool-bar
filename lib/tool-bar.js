'use babel';

import ToolBarManager from './tool-bar-manager';
import ToolBarView from './tool-bar-view';

let toolBarView = null;

export function activate () {
  toolBarView = new ToolBarView();
}

export function deactivate () {
  toolBarView.destroy();
  toolBarView = null;
}

export function provideToolBar () {
  return (group) => new ToolBarManager(group, toolBarView);
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
