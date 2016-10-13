'use babel';

import {CompositeDisposable} from 'atom';

let prevFocusedElm = null;

export default class ToolBarButtonView {

  constructor (options, group) {
    this.element = document.createElement('button');
    this.subscriptions = new CompositeDisposable();

    this.priority = options.priority;
    this.options = options;
    this.group = group;

    if (options.tooltip) {
      this.element.title = options.tooltip;
      this.subscriptions.add(
        atom.tooltips.add(this.element, {
          title: options.tooltip,
          placement: getTooltipPlacement
        })
      );
    }

    const classNames = ['btn', 'btn-default', 'tool-bar-btn'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    if (options.iconset) {
      classNames.push(options.iconset, `${options.iconset}-${options.icon}`);
    } else {
      classNames.push(`icon-${options.icon}`);
    }

    this.element.classList.add(...classNames);

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
  if (typeof callback === 'object' && !Array.isArray(callback) && callback) {
    callback = getCallbackModifier(callback, e);
  }
  if (typeof callback === 'string') {
    atom.commands.dispatch(getPrevFocusedElm(), callback);
  } else if (Array.isArray(callback)) {
    for (let i = 0; i < callback.length; i++) {
      atom.commands.dispatch(getPrevFocusedElm(), callback[i]);
    }
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
