'use babel';

export default class ToolBarSpacerView {
  constructor (options) {
    this.element = document.createElement('hr');
    this.priority = options && options.priority;
    this.element.classList.add('tool-bar-spacer');
    if (this.priority < 0) {
      this.element.classList.add('tool-bar-item-align-end');
    }
  }

  destroy () {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
