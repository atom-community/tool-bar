'use babel';

import {Emitter} from 'atom';

import ToolBarButtonView from './tool-bar-button-view';
import ToolBarSpacerView from './tool-bar-spacer-view';

export default class ToolBarManager {
  constructor (group, toolBarView) {
    this.group = group;
    this.toolBarView = toolBarView;
    this.active = true;
    this.emitter = new Emitter();
  }

  addButton (options) {
    if (this._destroyed) throw new Error("It's not allowed to add buttons after it's being destroyed");
    const button = new ToolBarButtonView(options, this.group);
    this.toolBarView.addItem(button);
    if (!this.active) {
      this.toolBarView.hideItem(button);
    }
    return button;
  }

  addSpacer (options) {
    if (this._destroyed) throw new Error("It's not allowed to add spacers after it's being destroyed");
    const spacer = new ToolBarSpacerView(options, this.group);
    this.toolBarView.addItem(spacer);
    if (!this.active) {
      this.toolBarView.hideItem(spacer);
    }
    return spacer;
  }

  activate () {
    if (!this.active) {
      this.active = true;
      if (this.toolBarView.items) {
        this.toolBarView.items
          .filter(item => item.group === this.group)
          .forEach(item => this.toolBarView.restoreItem(item));
      }
    }
  }

  deactivate () {
    if (this.active) {
      this.active = false;
      if (this.toolBarView.items) {
        this.toolBarView.items
          .filter(item => item.group === this.group)
          .forEach(item => this.toolBarView.hideItem(item));
      }
    }
  }

  removeItems () {
    if (this.toolBarView.items) {
      this.toolBarView.items
        .filter(item => item.group === this.group)
        .forEach(item => this.toolBarView.removeItem(item));
    }
  }

  onDidDestroy (callback) {
    this.emitter.on('did-destroy', callback);
  }

  destroy () {
    this.removeItems();

    this._destroyed = true;

    this.emitter.emit('did-destroy');
    this.emitter.dispose();
    this.emitter = null;
  }
}
