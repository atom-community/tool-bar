'use babel';

import ToolBarButtonView from './tool-bar-button-view';
import ToolBarSpacerView from './tool-bar-spacer-view';

export default class ToolBarManager {
  constructor (group, toolBarView) {
    this.group = group;
    this.toolBarView = toolBarView;
  }

  addButton (options) {
    const button = new ToolBarButtonView(options, this.group);
    this.toolBarView.addItem(button);
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
    }
  }

  onDidDestroy (callback) {
    this.toolBarView.emitter.on('did-destroy', callback);
  }
}
