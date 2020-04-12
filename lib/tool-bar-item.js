/**
 * A minimal class used to manage custom HTML elements in Toolbar.
 * This is supposed to be Super for other classes.
 */
class ToolBarItem {
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

module.exports.ToolBarItem = ToolBarItem;
