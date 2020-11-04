import { ToolBarItem } from './items/tool-bar-item';
import { ToolBarButtonView } from './items/tool-bar-button-view';
import { ToolBarSpacerView } from './items/tool-bar-spacer-view';

/**
 *
 * @property {string} group
 * @property {ToolBarView} toolBarView
 * @property {TouchBarManager} touchBarManager
 */
export class ToolBarManager {
  /**
   * @param {string} group
   * @param {ToolBarView} toolBarView
   * @param {TouchBarManager} touchBarManager
   */
  constructor (group, toolBarView, touchBarManager) {
    this.group = group;
    this.toolBarView = toolBarView;
    this.touchBarManager = touchBarManager;
  }

  /**
   * Adds a custom HTML Element to Toolbar. options: {element, priority}
   * @param {ItemOptions} options
   */
  addItem (options) {
    const item = new ToolBarItem(options, this.group);
    this.toolBarView.addItem(item);
    // this.touchBarManager?.addItem(item); // TODO
    return item;
  }

  /**
   * Adds a button. The input to this function is a `ButtonOptions` object
   * @param {ButtonOptions} options
   */
  addButton (options) {
    const button = new ToolBarButtonView(options, this.group);
    this.toolBarView.addItem(button);
    this.touchBarManager?.addButton(button);
    return button;
  }

  /**
   * Adds a spacer. Optionally, you can pass a `SpacerOptions` object
   * @param options
   * @return {ToolBarSpacerView}
   */
  addSpacer (options) {
    const spacer = new ToolBarSpacerView(options, this.group);
    this.toolBarView.addItem(spacer);
    return spacer;
  }

  /**
   * Use the method removeItems to remove the buttons added by your package. This is particular useful in your package deactivate method, but can be used at any time.
   */
  removeItems () {
    if (this.toolBarView.items) {
      this.toolBarView.items
        .filter(item => item.group === this.group)
        .forEach(item => this.toolBarView.removeItem(item));
      this.touchBarManager?.removeGroup(this.group);
    }
  }

  /**
   * The onDidDestroy method takes a function that will be called when the tool-bar package is destroyed. This is useful if your package needs to do cleanup when the tool-bar is deactivated but your package continues running.
   * @param {() => void} callback
   */
  onDidDestroy (callback) {
    this.toolBarView.emitter.on('did-destroy', callback);
  }
}
