const {CompositeDisposable} = require('atom');
const { ToolBarItem, addTooltip } = require('./tool-bar-item');

/**
 * A button class with many options
 *
 * @property {HTMLElement} element
 * @property {number} priority
 * @property {string} group
 *
 * @property {ButtonOptions} options
 * @property {boolean} enabled
 * @property {CompositeDisposable} subscriptions
 */
class ToolBarButtonView extends ToolBarItem {
  /**
   *
   * @param {ButtonOptions} options
   * @param {string} group
   */
  constructor (options, group) {
    // first calling the super (ToolBarItem) constructor
    super({
      element: document.createElement('button'),
      priority: options.priority
    }, group);

    this.options = options;
    this.enabled = true;

    // default classes
    this.classNames = ['btn', 'btn-default', 'tool-bar-btn'];

    if (this.priority < 0) {
      this.putAtEnd();
    }

    if (options.icon) {
      this.addIcon();
    }

    if (options.text) {
      this.addText();
    }

    if (options.tooltip) {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(
        addTooltip(this.options.tooltip, this.options.callback)
      );
    }

    if (options.color) {
      this.addColor();
    }
    if (options.background) {
      this.addBackgroundColor();
    }

    this.addClasses();
    this.addOnMouseDown();
    this.addOnClick();
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

  /** Put the button at the end of the toolbar using 'tool-bar-item-align-end' class. */
  putAtEnd () {
    this.classNames.push('tool-bar-item-align-end');
  }

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

  /** Adds a text/html to the button */
  addText () {
    if (this.options.html) {
      this.element.innerHTML = this.options.text;
    } else {
      this.element.textContent = this.options.text;
    }
  }

  /** Add color to the button */
  addColor () {
    this.element.style.color = this.options.color;
  }

  /** Add background color to the button */
  addBackgroundColor () {
    this.element.style.background = this.options.background;
  }

  /** Add all the classes (custom and others) to the button */
  addClasses () {
    // add custom classes to the button
    if (this.options.class) {
      if (Array.isArray(this.options.class)) {
        this.classNames.push(...this.options.class);
      } else {
        this.element.classList.add(this.options.class);
      }
    }
    // add other classes
    this.element.classList.add(...this.classNames);
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

  addOnMouseDown () {
    this._onMouseDown = this._onMouseDown.bind(this);
    this.element.addEventListener('mousedown', this._onMouseDown);
  }

  _onMouseDown (e) {
    // Avoid taking focus so we can dispatch Atom commands with the correct target.
    e.preventDefault();
  }

  addOnClick () {
    this._onClick = this._onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
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
