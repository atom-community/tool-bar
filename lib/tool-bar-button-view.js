const {CompositeDisposable} = require('atom');

module.exports = class ToolBarButtonView {

  constructor (options, group) {
    this.element = document.createElement('button');
    this.subscriptions = new CompositeDisposable();

    this.priority = options.priority;
    this.options = options;
    this.group = group;
    this.enabled = true;

    if (options.tooltip) {
      const callback = this.options.callback;

      let tooltip = {};
      if (typeof options.tooltip === 'string') {
        tooltip = {
          title: options.tooltip
        };
      } else {
        tooltip = options.tooltip;
      }

      if (!tooltip.hasOwnProperty('placement')) {
        tooltip.placement = getTooltipPlacement;
      }

      if (!tooltip.hasOwnProperty('keyBindingCommand')) {
        tooltip.keyBindingCommand = typeof callback === 'string' ? callback : null;
      }

      this.subscriptions.add(
        atom.tooltips.add(this.element, tooltip)
      );
    }

    const classNames = ['btn', 'btn-default', 'tool-bar-btn'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    if (options.icon) {
      if (options.iconset) {
        classNames.push(options.iconset, `${options.iconset}-${options.icon}`);
      } else {
        classNames.push(`icon-${options.icon}`);
      }
    }

    if (options.text) {
      if (options.html) {
        this.element.innerHTML = options.text;
      } else {
        this.element.textContent = options.text;
      }
    }

    this.element.classList.add(...classNames);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onClick = this._onClick.bind(this);

    this.element.addEventListener('mousedown', this._onMouseDown);
    this.element.addEventListener('click', this._onClick);
  }

  setEnabled (enabled) {
    if (enabled) {
      this.element.classList.remove('disabled');
    } else {
      this.element.classList.add('disabled');
    }
    this.enabled = enabled;
  }

  setSelected (selected) {
    if (selected) {
      this.element.classList.add('selected');
    } else {
      this.element.classList.remove('selected');
    }
  }

  getSelected () {
    return this.element.classList.contains('selected');
  }

  destroy () {
    this.subscriptions.dispose();
    this.subscriptions = null;

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element.removeEventListener('mousedown', this._onMouseDown);
    this.element.removeEventListener('click', this._onClick);
    this.element = null;
  }

  _onMouseDown (e) {
    // Avoid taking focus so we can dispatch Atom commands with the correct target.
    e.preventDefault();
  }

  _onClick (e) {
    if (this.element && !this.element.classList.contains('disabled')) {
      this.executeCallback(e);
    }
    if (e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  executeCallback (e) {
    let {callback, data} = this.options;
    if (typeof callback === 'object' && !Array.isArray(callback) && callback) {
      callback = getCallbackModifier(callback, e);
    }
    const workspaceView = atom.views.getView(atom.workspace);

    // Ensure we don't try to dispatch on any target above `atom-workspace`.
    const target = workspaceView.contains(document.activeElement)
      ? document.activeElement
      : workspaceView;

    if (typeof callback === 'string') {
      atom.commands.dispatch(target, callback);
    } else if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        atom.commands.dispatch(target, callback[i]);
      }
    } else if (typeof callback === 'function') {
      callback.call(this, data, target);
    }
  }
};

function getTooltipPlacement () {
  const toolbarPosition = atom.config.get('tool-bar.position');
  return toolbarPosition === 'Top' ? 'bottom'
       : toolbarPosition === 'Right' ? 'left'
       : toolbarPosition === 'Bottom' ? 'top'
       : toolbarPosition === 'Left' ? 'right'
       : null;
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
