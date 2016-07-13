'use babel';

import ToolBarButtonView from './tool-bar-button-view';
import ToolBarSpacerView from './tool-bar-spacer-view';

export default class ToolBarManager {
  constructor (group, toolBar) {
    this.group = group;
    this.toolBar = toolBar;
  }

  addButton (options) {
    const button = new ToolBarButtonView(options);
    button.group = this.group;
    this.toolBar.addItem(button);
    return button;
  }

  addSpacer (options) {
    const spacer = new ToolBarSpacerView(options);
    spacer.group = this.group;
    this.toolBar.addItem(spacer);
    return spacer;
  }

  removeItems () {
    if (this.toolBar.items) {
      this.toolBar.items
        .filter(item => item.group === this.group)
        .forEach(item => this.toolBar.removeItem(item));
    }
  }

  onDidDestroy (callback) {
    this.toolBar.emitter.on('did-destroy', callback);
  }
}
