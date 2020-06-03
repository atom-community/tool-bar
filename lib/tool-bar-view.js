import {CompositeDisposable, Emitter} from 'atom';
import {rafDebounce} from './raf-debounce';
import {useGutter} from './tool-bar.js'

export class ToolBarView {
  constructor () {
    this.element = document.createElement('div');
    this.element.classList.add('tool-bar');
    this.items = [];
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        'tool-bar:toggle': () => this.toggle(),
        'tool-bar:position-top': () => this.updatePosition('Top'),
        'tool-bar:position-right': () => this.updatePosition('Right'),
        'tool-bar:position-bottom': () => this.updatePosition('Bottom'),
        'tool-bar:position-left': () => this.updatePosition('Left'),
      }),
      atom.config.observe('tool-bar.iconSize', newValue => {
        this.updateSize(newValue);
      }),
      atom.config.onDidChange('tool-bar.position', () => {
        this.refresh();
      }),
      atom.config.onDidChange('tool-bar.visible', ({newValue}) => {
        if (newValue) {
          this.show();
        } else {
          this.hide();
        }
      }),
      atom.config.onDidChange('tool-bar.fullWidth', () => {
        this.refresh();
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
      'tool-bar-14px',
      'tool-bar-16px',
      'tool-bar-18px',
      'tool-bar-21px',
      'tool-bar-24px',
      'tool-bar-28px',
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

    this.panel = this.createPanel(position);

    this.element.classList.add(`tool-bar-${position.toLowerCase()}`);
    if (position === 'Top' || position === 'Bottom') {
      this.element.classList.add('tool-bar-horizontal');
    } else {
      this.element.classList.add('tool-bar-vertical');
    }

    this.drawGutter();
    atom.config.set('tool-bar.position', position);
  }

  createPanel (position) {
    const fullWidth = atom.config.get('tool-bar.fullWidth');
    switch (position) {
      case 'Top':
        return fullWidth
          ? atom.workspace.addHeaderPanel({item: this.element})
          : atom.workspace.addTopPanel({item: this.element});
      case 'Right':
        return atom.workspace.addRightPanel({item: this.element});
      case 'Bottom':
        return fullWidth
          ? atom.workspace.addFooterPanel({item: this.element})
          : atom.workspace.addBottomPanel({item: this.element});
      case 'Left':
        return atom.workspace.addLeftPanel({item: this.element, priority: 50});
    }
  }

  drawGutter () {
    if (!useGutter) {return;}

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

  refresh () {
    if (atom.config.get('tool-bar.visible')) {
      this.show();
    }
  }

  toggle () {
    atom.config.set('tool-bar.visible', !atom.config.get('tool-bar.visible'));
  }
}
