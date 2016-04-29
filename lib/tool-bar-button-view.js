'use babel';

import {CompositeDisposable} from 'atom';
import {View} from 'space-pen';

let prevFocusedElm = null;

export default class ToolBarButtonView extends View {
  static content () {
    return this.button({class: 'btn btn-default tool-bar-btn'});
  }

  constructor (options) {
    super(options);

    this.subscriptions = new CompositeDisposable();
    this.priority = options.priority;
    this.options = options;

    if (this.priority < 0) {
      this.addClass('tool-bar-item-align-end');
    }

    if (options.tooltip) {
      this.prop('title', options.tooltip);
      this.subscriptions.add(
        atom.tooltips.add(this, {
          title: options.tooltip,
          placement: getTooltipPlacement
        })
      );
    }

    if (options.iconset) {
      this.addClass(`${options.iconset} ${options.iconset}-${options.icon}`);
    } else {
      this.addClass(`icon-${options.icon}`);
    }

    this._onClick = this._onClick.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);

    this.on('click', this._onClick);
    this.on('mouseover', this._onMouseOver);
  }

  setEnabled (enabled) {
    if (enabled) {
      this.removeClass('disabled');
    } else {
      this.addClass('disabled');
    }
  }

  destroy () {
    this.subscriptions.dispose();
    this.subscriptions = null;
    this.remove();
  }

  _onClick (e) {
    getPrevFocusedElm().focus();
    if (!this.hasClass('disabled')) {
      executeCallback(this.options, e);
    }
    return false;
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
