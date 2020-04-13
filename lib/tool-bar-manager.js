const { ToolBarItem } = require('./items/tool-bar-item');
const { ToolBarButtonView } = require('./items/tool-bar-button-view');
const { ToolBarSpacerView } = require('./items/tool-bar-spacer-view');

module.exports = class ToolBarManager {
  constructor (group, toolBarView, touchBarManager) {
    this.group = group;
    this.toolBarView = toolBarView;
    this.touchBarManager = touchBarManager;
  }

  /** Adds a custom HTML Element to Toolbar. options: {element, priority} */
  addItem (options) {
    const item = new ToolBarItem(options, this.group);
    this.toolBarView.addItem(item);
    // this.touchBarManager.addItem(item); // TODO
    return item;
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
