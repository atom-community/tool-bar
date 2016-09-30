'use babel';

export default class ToolBarSpacerView {
  constructor (options, group) {
    this.element = document.createElement('hr');
    this.priority = options && options.priority;
    this.group = group;
    const classNames = ['tool-bar-spacer'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    this.element.classList.add(...classNames);
  }

  destroy () {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
