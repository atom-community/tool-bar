const { ToolBarItem } = require('./tool-bar-item');

class ToolBarSpacerView extends ToolBarItem {
  constructor (options, group) {
    // first calling the super (ToolBarItem) constructor
    super({
      element: document.createElement('hr'),
      priority: options && options.priority
    }, group);

    const classNames = ['tool-bar-spacer'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    this.element.classList.add(...classNames);
  }
};

module.exports.ToolBarSpacerView = ToolBarSpacerView;
