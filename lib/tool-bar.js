const ToolBarManager = require('./tool-bar-manager');
const ToolBarView = require('./tool-bar-view');
const TouchBarManager = require('./touch-bar-manager');

let toolBarView = null;
let touchBarManager = null;

exports.activate = function () {
  toolBarView = new ToolBarView();
  touchBarManager = new TouchBarManager();
};

exports.deactivate = function () {
  toolBarView.destroy();
  toolBarView = null;
  touchBarManager.destroy();
  touchBarManager = null;
};

exports.provideToolBar = function provideToolBar () {
  return (group) => new ToolBarManager(group, toolBarView, touchBarManager);
};

exports.config = {
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
  useTouchBar: {
    title: 'Use TouchBar',
    description: 'Show seven first tool bar buttons in the TouchBar',
    type: 'boolean',
    default: true,
    order: 5
  }
};
