const ToolBarManager = require('./tool-bar-manager');
const ToolBarView = require('./tool-bar-view');

let toolBarView = null;

exports.activate = function () {
  toolBarView = new ToolBarView();
};

exports.deactivate = function () {
  toolBarView.destroy();
  toolBarView = null;
};

exports.provideToolBar = function provideToolBar () {
  return (group) => new ToolBarManager(group, toolBarView);
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
  }
};
