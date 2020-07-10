import {CompositeDisposable} from 'atom';
import { ToolBarItem } from './tool-bar-item';

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
export class ToolBarButtonView extends ToolBarItem {
  /**
   * @param {ButtonOptions} options
   * @param {string} group
   */
  constructor (options, group) {
    // first calling the super (ToolBarItem) constructor
    super({
      element: document.createElement('button'),
      priority: options.priority
    }, group);

    this.subscriptions = new CompositeDisposable();
    this.options = options;
    this.enabled = true;

    // default classes
    this.classNames = ['btn', 'btn-default', 'tool-bar-btn'];

    if (this.priority < 0) {
      this.putAtEnd();
    }

    this.addIcon();
    this.addText();
    this.addTooltip();
    this.setStyle('color', options.color);
    this.setStyle('background', options.background);
    this.addClasses();
    this.addOnMouseDown();
    this.addOnClick();
  }

  destroy () {
    this.subscriptions.dispose();
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
    if (!this.options.icon) {
      return;
    }

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
    if (!this.options.text) {
      return;
    }

    if (this.options.html) {
      this.element.innerHTML = this.options.text;
    } else {
      this.element.textContent = this.options.text;
    }
  }

  /**
   * adds a Tooltip for your item.
   * @param {ButtonOptions.tooltip} tooltipOptions
   * @param {ButtonOptions.callback | null} callback
   * @returns {Disposable} a disposable tooltip
   */
  addTooltip () {
    if (!this.options.tooltip) {
      return;
    }

    let tooltip;
    if (typeof this.options.tooltip === 'string') {
      tooltip = {
        title: this.options.tooltip
      };
    } else {
      tooltip = this.options.tooltip;
    }

    if (!tooltip.hasOwnProperty('placement')) {
      tooltip.placement = getTooltipPlacement();
    }

    if (!tooltip.hasOwnProperty('keyBindingCommand') &&
      typeof this.options.callback === 'string'
    ) {
      tooltip.keyBindingCommand = this.options.callback;
    }

    this.subscriptions.add(atom.tooltips.add(this.element, tooltip));
  }

  /** Set a style on the button */
  setStyle (style, value) {
    if (value) {
      this.element.style[style] = value;
    }
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
    this.element.classList.toggle('disabled', !enabled);
    this.enabled = enabled;
  }

  setSelected (selected) {
    this.element.classList.toggle('selected', selected);
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
      return checkKeyModifier(item.indexOf('alt'), altKey)
          && checkKeyModifier(item.indexOf('ctrl'), ctrlKey)
          && checkKeyModifier(item.indexOf('shift'), shiftKey);
    });
  return callback[modifier] || callback[''];
}

function checkKeyModifier (keyIndex, key) {
  return !((~keyIndex && !key) || (key && !~keyIndex));
}

/** get the tooltip placement based on the toolbar position */
function getTooltipPlacement () {
  const tooltipPlacement = {
    Top: 'bottom',
    Right: 'left',
    Bottom: 'top',
    Left: 'right'
  };

  const toolbarPosition = atom.config.get('tool-bar.position');
  return tooltipPlacement[toolbarPosition] || null;
}
