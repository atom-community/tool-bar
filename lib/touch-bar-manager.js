const {TouchBar, nativeImage} = require('electron').remote;
const {TouchBarButton} = TouchBar;

module.exports = class TouchBarManager {
  constructor () {
    this.buttons = [];
  }

  destroy () {
    this.buttons = [];
    this.update();
  }

  addButton (button) {
    if (!this._useTouchBar()) return;
    if (this.buttons.length >= 7) return;

    this._renderButton(button).then(icon => {
      const touchButton = new TouchBarButton({
        icon: icon,
        click: button._onClick.bind(button, {})
      });

      this.buttons.push({
        priority: button.priority ? button.priority : 0,
        touchButton,
        group: button.group
      });

      this.update();
    });
  }

  update () {
    if (!this._useTouchBar()) return;

    if (this._updateDebounce) clearTimeout(this._updateDebounce);
    this._updateDebounce = setTimeout(() => this._setTouchBar(), 100);
  }

  removeGroup (group) {
    this.buttons = this.buttons.filter(button => button.group !== group);
    this.update();
  }

  _useTouchBar () {
    return process.platform === 'darwin' && atom.config.get('tool-bar.useTouchBar');
  }

  _renderButton (button) {
    return document.fonts.ready.then(() => {
      if (!(button.element instanceof HTMLElement)) return;

      const iconSize = 44 * 2;
      const iconStyle = window.getComputedStyle(button.element, ':before');
      const iconText = iconStyle.content.replace(/["']/g, '');

      let canvas = document.createElement('canvas');
      canvas.width = 60 * 2;
      canvas.height = 60 * 2;
      let context = canvas.getContext('2d');
      context.textAlign = 'center';
      context.textBaseline = 'top';

      context.fillStyle = button.enabled ? '#fff' : '#aaa';
      context.font = `${iconSize}px ${iconStyle.fontFamily}`;
      context.fillText(iconText, canvas.width / 2, (canvas.height - iconSize) / 2);

      const image = nativeImage.createEmpty();
      image.addRepresentation({
        dataURL: canvas.toDataURL(),
        scaleFactor: 2.0,
        width: 44,
        height: 44
      });

      return image;
    });
  }

  _setTouchBar () {
    const items = this.buttons
      .sort((a, b) => a.priority - b.priority)
      .map(button => button.touchButton);
    let touchBar = new TouchBar(items);
    atom.getCurrentWindow().setTouchBar(touchBar);
    this._updateDebounce = null;
  }
};
