/**
 * A minimal class used to manage custom HTML elements in Toolbar.
 * This is supposed to be Super for other classes.
 * @property {HTMLElement} element
 * @property {number} priority
 * @property {string} group
 */
export class ToolBarItem {
  /**
   * @param {ItemOptions} options
   * @param {string} group
   */
  constructor (options, group) {
    this.element = options.element;
    this.priority = options.priority;
    this.group = group;
  }

  destroy () {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
  }
}
