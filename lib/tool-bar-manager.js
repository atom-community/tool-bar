'use babel';

import ToolBarButtonView from './tool-bar-button-view';
import {$$} from 'space-pen';

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
    const spacer = $$(function () {
      return this.hr({class: 'tool-bar-spacer'});
    });
    spacer.priority = options != null ? options.priority : void 0;
    if (spacer.priority < 0) {
      spacer.addClass('tool-bar-item-align-end');
    }
    spacer.group = this.group;
    spacer.destroy = () => { spacer.remove(); };
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
