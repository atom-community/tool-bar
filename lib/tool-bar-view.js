'use babel';

import {CompositeDisposable, Emitter} from 'atom';
import rafDebounce from './raf-debounce';

export default class ToolBarView {

  constructor () {
    this.element = document.createElement('div');
    this.element.classList.add('tool-bar');
    this.items = [];
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'tool-bar:toggle', () => {
        this.toggle();
      }),
      atom.commands.add('atom-workspace', 'tool-bar:position-top', () => {
        this.updatePosition('Top');
        atom.config.set('tool-bar.position', 'Top');
      }),
      atom.commands.add('atom-workspace', 'tool-bar:position-right', () => {
        this.updatePosition('Right');
        atom.config.set('tool-bar.position', 'Right');
      }),
      atom.commands.add('atom-workspace', 'tool-bar:position-bottom', () => {
        this.updatePosition('Bottom');
        atom.config.set('tool-bar.position', 'Bottom');
      }),
      atom.commands.add('atom-workspace', 'tool-bar:position-left', () => {
        this.updatePosition('Left');
        atom.config.set('tool-bar.position', 'Left');
      }),
      atom.config.observe('tool-bar.iconSize', newValue => {
        this.updateSize(newValue);
      }),
      atom.config.onDidChange('tool-bar.position', () => {
        if (atom.config.get('tool-bar.visible')) {
          this.show();
        }
      }),
      atom.config.onDidChange('tool-bar.visible', ({newValue}) => {
        if (newValue) {
          this.show();
        } else {
          this.hide();
        }
      }),
      atom.config.onDidChange('tool-bar.fullWidth', () => {
        if (atom.config.get('tool-bar.visible')) {
          this.show();
        }
      })
    );

    if (atom.config.get('tool-bar.visible')) {
      this.show();
    }

    this.drawGutter = rafDebounce(this.drawGutter.bind(this));
    this.subscriptions.add(this.drawGutter);

    this.element.addEventListener('scroll', this.drawGutter);
    window.addEventListener('resize', this.drawGutter);
  }

  addItem (newItem) {
    newItem.priority = this.calculatePriority(newItem);

    if (atom.inDevMode()) {
      newItem.element.dataset.group = newItem.group;
      newItem.element.dataset.priority = newItem.priority;
    }

    let index = this.items.findIndex(existingItem =>
      (existingItem.priority > newItem.priority));
    if (index === -1) {
      index = this.items.length;
    }
    const nextItem = this.items[index];

    this.items.splice(index, 0, newItem);

    this.element.insertBefore(
      newItem.element,
      nextItem ? nextItem.element : null
    );

    this.drawGutter();

    return nextItem;
  }

  removeItem (item) {
    item.destroy();
    this.items.splice(this.items.indexOf(item), 1);
    this.drawGutter();
  }

  destroy () {
    this.items.forEach(item => item.destroy());
    this.items = null;

    this.subscriptions.dispose();
    this.subscriptions = null;

    this.hide();
    this.element.removeEventListener('scroll', this.drawGutter);
    this.element = null;

    window.removeEventListener('resize', this.drawGutter);

    this.emitter.emit('did-destroy');
    this.emitter.dispose();
    this.emitter = null;
  }

  calculatePriority (item) {
    if (!isNaN(item.priority)) {
      return item.priority;
    }
    const lastItem = this.items.filter(i => i.group !== item.group).pop();
    return lastItem && !isNaN(lastItem.priority)
      ? lastItem.priority + 1
      : 50;
  }

  updateSize (size) {
    this.element.classList.remove(
      'tool-bar-12px',
      'tool-bar-16px',
      'tool-bar-24px',
      'tool-bar-32px'
    );
    this.element.classList.add(`tool-bar-${size}`);
  }

  updatePosition (position) {
    this.element.classList.remove(
      'tool-bar-top',
      'tool-bar-right',
      'tool-bar-bottom',
      'tool-bar-left',
      'tool-bar-horizontal',
      'tool-bar-vertical'
    );

    const fullWidth = atom.config.get('tool-bar.fullWidth');

    switch (position) {
      case 'Top':
        this.panel = fullWidth
          ? atom.workspace.addHeaderPanel({item: this.element})
          : atom.workspace.addTopPanel({item: this.element});
        break;
      case 'Right':
        this.panel = atom.workspace.addRightPanel({item: this.element});
        break;
      case 'Bottom':
        this.panel = fullWidth
          ? atom.workspace.addFooterPanel({item: this.element})
          : atom.workspace.addBottomPanel({item: this.element});
        break;
      case 'Left':
        this.panel = atom.workspace.addLeftPanel({item: this.element, priority: 50});
        break;
    }

    const classNames = [`tool-bar-${position.toLowerCase()}`];
    if (position === 'Top' || position === 'Bottom') {
      classNames.push('tool-bar-horizontal');
    } else {
      classNames.push('tool-bar-vertical');
    }
    this.element.classList.add(...classNames);

    this.drawGutter();
  }

  drawGutter () {
    this.element.classList.remove('gutter-top', 'gutter-bottom');

    const visibleHeight = this.element.offsetHeight;
    const scrollHeight = this.element.scrollHeight;
    const hiddenHeight = scrollHeight - visibleHeight;

    if (visibleHeight < scrollHeight) {
      if (this.element.scrollTop > 0) {
        this.element.classList.add('gutter-top');
      }
      if (this.element.scrollTop < hiddenHeight) {
        this.element.classList.add('gutter-bottom');
      }
    }
  }

  hide () {
    if (this.panel != null) {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.panel.destroy();
      this.panel = null;
    }
  }

  show () {
    this.hide();
    this.updatePosition(atom.config.get('tool-bar.position'));
    this.updateSize(atom.config.get('tool-bar.iconSize'));
  }

  toggle () {
    atom.config.set('tool-bar.visible', !atom.config.get('tool-bar.visible'));
  }
}
