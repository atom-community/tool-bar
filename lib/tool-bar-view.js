'use babel';

import {CompositeDisposable, Emitter} from 'atom';
import {View} from 'space-pen';

const supportFullWidth = typeof atom.workspace.addHeaderPanel === 'function';

export default class ToolBarView extends View {

  static content () {
    return this.div({class: 'tool-bar'});
  }

  constructor () {
    super();

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
      atom.config.onDidChange('tool-bar.position', ({newValue, oldValue}) => {
        if (atom.config.get('tool-bar.visible')) {
          this.show();
        }
      }),
      atom.config.onDidChange('tool-bar.visible', ({newValue, oldValue}) => {
        if (newValue) {
          this.show();
        } else {
          this.hide();
        }
      })
    );

    if (supportFullWidth) {
      this.subscriptions.add(
        atom.config.onDidChange('tool-bar.fullWidth', ({newValue, oldValue}) => {
          if (atom.config.get('tool-bar.visible')) {
            this.show();
          }
        })
      );
    }

    if (atom.config.get('tool-bar.visible')) {
      this.show();
    }

    this.drawGutter = this.drawGutter.bind(this);

    this.on('scroll', this.drawGutter);
    window.addEventListener('resize', this.drawGutter);
  }

  addItem (newItem) {
    newItem.priority = this.calculatePriority(newItem);

    if (atom.devMode) {
      newItem.get(0).dataset.group = newItem.group;
      newItem.get(0).dataset.priority = newItem.priority;
    }

    let index = this.items.findIndex(existingItem =>
      (existingItem.priority > newItem.priority));
    if (index === -1) {
      index = this.items.length;
    }
    const nextItem = this.items[index];

    this.items.splice(index, 0, newItem);

    const newElement = atom.views.getView(newItem);
    const nextElement = atom.views.getView(nextItem);
    this.element.insertBefore(newElement, nextElement);

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
    this.remove();
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
    this.removeClass('tool-bar-12px tool-bar-16px tool-bar-24px tool-bar-32px');
    this.addClass(`tool-bar-${size}`);
  }

  updatePosition (position) {
    this.removeClass(
      'tool-bar-top tool-bar-right tool-bar-bottom tool-bar-left ' +
      'tool-bar-horizontal tool-bar-vertical'
    );

    const fullWidth = supportFullWidth && atom.config.get('tool-bar.fullWidth');

    switch (position) {
      case 'Top':
        this.panel = fullWidth
          ? atom.workspace.addHeaderPanel({item: this})
          : atom.workspace.addTopPanel({item: this});
        break;
      case 'Right':
        this.panel = atom.workspace.addRightPanel({item: this});
        break;
      case 'Bottom':
        this.panel = fullWidth
          ? atom.workspace.addFooterPanel({item: this})
          : atom.workspace.addBottomPanel({item: this});
        break;
      case 'Left':
        this.panel = atom.workspace.addLeftPanel({item: this, priority: 50});
        break;
    }

    this.addClass(`tool-bar-${position.toLowerCase()}`);

    if (position === 'Top' || position === 'Bottom') {
      this.addClass('tool-bar-horizontal');
    } else {
      this.addClass('tool-bar-vertical');
    }

    this.updateMenu(position);
    this.drawGutter();
  }

  updateMenu (position) {
    const packagesMenu = atom.menu.template.find(({label}) =>
      (label === 'Packages' || label === '&Packages'));

    const toolBarMenu = packagesMenu && packagesMenu.submenu.find(({label}) =>
      (label === 'Tool Bar' || label === '&Tool Bar'));

    const positionsMenu = toolBarMenu && toolBarMenu.submenu.find(({label}) =>
      (label === 'Position' || label === '&Position'));

    const positionMenu = positionMenu && positionsMenu.submenu.find(({label}) =>
      label === position);

    if (positionMenu) {
      positionMenu.checked = true;
    }
  }

  drawGutter () {
    this.removeClass('gutter-top gutter-bottom');

    const visibleHeight = this.height();
    const scrollHeight = this.element.scrollHeight;
    const hiddenHeight = scrollHeight - visibleHeight;

    if (visibleHeight < scrollHeight) {
      if (this.scrollTop() > 0) {
        this.addClass('gutter-top');
      }
      if (this.scrollTop() < hiddenHeight) {
        this.addClass('gutter-bottom');
      }
    }
  }

  hide () {
    if (this.panel != null) {
      this.detach();
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
    if (this.hasParent()) {
      this.hide();
      atom.config.set('tool-bar.visible', false);
    } else {
      this.show();
      atom.config.set('tool-bar.visible', true);
    }
  }
}
