'use babel';

import {CompositeDisposable} from 'atom';

let prevFocusedElm = null;

export default class ToolBarButtonView {

  constructor (options) {
    this.element = document.createElement('button');
    this.subscriptions = new CompositeDisposable();

    this.priority = options.priority;
    this.options = options;

    if (options.tooltip) {
      this.element.title = options.tooltip;
      this.subscriptions.add(
        atom.tooltips.add(this.element, {
          title: options.tooltip,
          placement: getTooltipPlacement
        })
      );
    }

    const classNames = ['btn', 'tool-bar-btn'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    if (options.iconset) {
      classNames.push(options.iconset, `${options.iconset}-${options.icon}`);
    } else {
      classNames.push(`icon-${options.icon}`);
    }

    this.element.classList.add(...classNames);

    this.setColour(options.colour || 'default');

    this._onClick = this._onClick.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);

    this.element.addEventListener('click', this._onClick);
    this.element.addEventListener('mouseover', this._onMouseOver);
  }

  setEnabled (enabled) {
    if (enabled) {
      this.element.classList.remove('disabled');
    } else {
      this.element.classList.add('disabled');
    }
  }

  isEnabled () {
    return !this.element.classList.contains('disabled');
  }

  setSelected (selected) {
    if (selected) {
      this.element.classList.add('selected');
    } else {
      this.element.classList.remove('selected');
    }
  }

  isSelected () {
    return this.element.classList.contains('selected');
  }

  setColour (colour) {
    this.element.classList.remove(`btn-${this.colour}`);
    this.colour = colour
    this.element.classList.add(`btn-${this.colour}`);
  }

  destroy () {
    this.subscriptions.dispose();
    this.subscriptions = null;

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element.removeEventListener('click', this._onClick);
    this.element.removeEventListener('mouseover', this._onMouseOver);
    this.element = null;
  }

  _onClick (e) {
    getPrevFocusedElm().focus();
    if (!this.element.classList.contains('disabled')) {
      executeCallback(this.options, e);
    }
    e.preventDefault();
    e.stopPropagation();
  }

  _onMouseOver (e) {
    if (!document.activeElement.classList.contains('tool-bar-btn')) {
      prevFocusedElm = document.activeElement;
    }
  }
}

function getPrevFocusedElm () {
  const workspaceView = atom.views.getView(atom.workspace);
  if (workspaceView.contains(prevFocusedElm)) {
    return prevFocusedElm;
  } else {
    return workspaceView;
  }
}

function getTooltipPlacement () {
  const toolbarPosition = atom.config.get('tool-bar.position');
  return toolbarPosition === 'Top' ? 'bottom'
       : toolbarPosition === 'Right' ? 'left'
       : toolbarPosition === 'Bottom' ? 'top'
       : toolbarPosition === 'Left' ? 'right'
       : null;
}

function executeCallback ({callback, data}, e) {
  if (typeof callback === 'object' && callback) {
    callback = getCallbackModifier(callback, e);
  }
  if (typeof callback === 'string') {
    atom.commands.dispatch(getPrevFocusedElm(), callback);
  } else if (typeof callback === 'function') {
    callback(data, getPrevFocusedElm());
  }
}

function getCallbackModifier (callback, {altKey, ctrlKey, shiftKey}) {
  if (!(ctrlKey || altKey || shiftKey)) {
    return callback[''];
  }
  const modifier = Object.keys(callback)
    .filter(Boolean)
    .map(modifiers => modifiers.toLowerCase())
    .reverse()
    .find(item => {
      if ((~item.indexOf('alt') && !altKey) || (altKey && !~item.indexOf('alt'))) {
        return false;
      }
      if ((~item.indexOf('ctrl') && !ctrlKey) || (ctrlKey && !~item.indexOf('ctrl'))) {
        return false;
      }
      if ((~item.indexOf('shift') && !shiftKey) || (shiftKey && !~item.indexOf('shift'))) {
        return false;
      }
      return true;
    });
  return callback[modifier] || callback[''];
}
