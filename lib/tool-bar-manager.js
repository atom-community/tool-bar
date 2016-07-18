'use babel';

import ToolBarButtonView from './tool-bar-button-view';
import ToolBarSpacerView from './tool-bar-spacer-view';

export default class ToolBarManager {
  constructor (group, toolBar, legacy) {
    this.group = group;
    this.toolBar = toolBar;
    this._legacy = legacy;
    this.active = true;
  }

  addButton (options) {
    const button = new ToolBarButtonView(options);
    button.group = this.group;
    this.toolBar.addItem(button);
    if (!this.isActive()) {
      this.toolBar.hideItem(button);
    }
    if (this._legacy) {
      return legacyWrap(button);
    }
    return button;
  }

  addSpacer (options) {
    const spacer = new ToolBarSpacerView(options);
    spacer.group = this.group;
    this.toolBar.addItem(spacer);
    if (!this.isActive()) {
      this.toolBar.hideItem(spacer);
    }
    if (this._legacy) {
      return legacyWrap(spacer);
    }
    return spacer;
  }

  isActive () {
    return this.active;
  }

  activate () {
    console.log('ToolBarManager::activate', this.toolBar.items);
    if(!this.active) {
      this.active = true;
      if (this.toolBar.items) {
        this.toolBar.items
          .filter(item => item.group === this.group)
          .forEach(item => this.toolBar.restoreItem(item));
      }
    }
  }

  deactivate () {
    console.log('ToolBarManager::deactivate', this.toolBar.items);
    if(this.active){
      this.active = false;
      if (this.toolBar.items) {
        this.toolBar.items
          .filter(item => item.group === this.group)
          .forEach(item => this.toolBar.hideItem(item));
      }
    }
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

function legacyWrap (view) {
  const $ = require('jquery');
  const wrapped = $(view.element);
  ['setEnabled', 'destroy'].forEach(name => {
    if (typeof view[name] === 'function') {
      wrapped[name] = (...args) => view[name](...args);
    }
  });
  wrapped.element = view.element;
  return wrapped;
}
