const {CompositeDisposable} = require('atom');
const { ToolBarItem, addTooltip } = require('./tool-bar-item');
class ToolBarButtonView extends ToolBarItem {
  constructor (options, group) {
    // first calling the super (ToolBarItem) constructor
    super({
      element: document.createElement('button'),
      priority: options.priority
    }, group);

    this.options = options;
    this.enabled = true;


    const classNames = ['btn', 'btn-default', 'tool-bar-btn'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    if (options.icon) {
      this.addIcon();
    }

    if (options.text) {
      if (options.html) {
        this.element.innerHTML = options.text;
      } else {
        this.element.textContent = options.text;
      }
    if (options.tooltip) {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(
        addTooltip(this.options.tooltip, this.options.callback)
      );
    }

    if (options.color) {
      this.element.style.color = options.color;
    }
    if (options.background) {
      this.element.style.background = options.background;
    }

    if (options.class) {
      if (Array.isArray(options.class)) {
        this.element.classList.add(...options.class);
  /** Add an icon for the button using built-in icons. */
  addIcon () {
    if (this.options.iconset) {
      if (this.options.iconset.startsWith('fa')) {
        this.classNames.push(this.options.iconset, `fa-${this.options.icon}`);
      } else {
        this.classNames.push(this.options.iconset, `${this.options.iconset}-${this.options.icon}`);
      }
    } else {
      this.classNames.push(`icon-${this.options.icon}`);
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
    if (this.subscriptions) {
      this.subscriptions.dispose();
      this.subscriptions = null;
    }
    this.element.removeEventListener('mousedown', this._onMouseDown);
    this.element.removeEventListener('click', this._onClick);
    super.destroy(); // call super.destroy() in the end
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

    if (!Array.isArray(callback)) {
      callback = [callback];
    }

    for (let i = 0; i < callback.length; i++) {
      if (typeof callback[i] === 'string') {
        atom.commands.dispatch(target, callback[i]);
      } else if (typeof callback[i] === 'function') {
        callback[i].call(this, data, target);
      }
    }
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

module.exports.ToolBarButtonView = ToolBarButtonView;
