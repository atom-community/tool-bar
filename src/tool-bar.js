import {ToolBarManager} from './tool-bar-manager';
import {ToolBarView} from './tool-bar-view';

let toolBarView = null;
let touchBarManager = null;

export let useGutter = false;

export function activate() {
  toolBarView = new ToolBarView();
  useTouchBar();
  useGutter = atom.config.get('tool-bar.useGutter');
}

async function useTouchBar() {
  if (atom.config.get('tool-bar.useTouchBar') && process.platform === 'darwin') {
    let {TouchBarManager} = await import('./touch-bar-manager');
    touchBarManager = new TouchBarManager();
  }
}

export function deactivate() {
  toolBarView?.destroy();
  toolBarView = null;
  touchBarManager?.destroy();
  touchBarManager = null;
}

export function provideToolBar () {
  return (group) => new ToolBarManager(group, toolBarView, touchBarManager);
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
    enum: ['12px', '14px', '16px', '18px', '21px', '24px', '28px', '32px'],
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
  useTouchBar: {
    title: 'Use TouchBar',
    description: 'Show seven first tool bar buttons in the TouchBar',
    type: 'boolean',
    default: true,
    order: 5
  },
  useGutter: {
    title: 'Use Gutter Shadow',
    description: 'The gutter shadow indicates that some icons are hidden and scrolling is needed. This is off by default (slows down the loading of Tool-bar).',
    type: 'boolean',
    default: false,
    order: 6
  }
};
