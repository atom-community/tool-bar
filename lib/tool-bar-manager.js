const ToolBarButtonView = require('./tool-bar-button-view');
const ToolBarSpacerView = require('./tool-bar-spacer-view');

module.exports = class ToolBarManager {
  constructor (group, toolBarView, touchBarManager) {
    this.group = group;
    this.toolBarView = toolBarView;
    this.touchBarManager = touchBarManager;
  }

  addButton (options) {
    const button = new ToolBarButtonView(options, this.group);
    this.toolBarView.addItem(button);
    this.touchBarManager.addButton(button);
    return button;
  }

  addSpacer (options) {
    const spacer = new ToolBarSpacerView(options, this.group);
    this.toolBarView.addItem(spacer);
    return spacer;
  }

  removeItems () {
    if (this.toolBarView.items) {
      this.toolBarView.items
        .filter(item => item.group === this.group)
        .forEach(item => this.toolBarView.removeItem(item));
      this.touchBarManager.removeGroup(this.group);
    }
  }

  onDidDestroy (callback) {
    this.toolBarView.emitter.on('did-destroy', callback);
  }
};
