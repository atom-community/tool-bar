/**
 * A minimal class used to manage custom HTML elements in Toolbar.
 * This is supposed to be Super for other classes.
 * @property {HTMLElement} element
 * @property {number} priority
 * @property {string} group
 */
class ToolBarItem {
  /**
   * @param {ItemOptions} options
   * @param {string} group
   */
  constructor (options, group) {
    this.element = options.element;
    this.priority = options.priority;
    this.group = group;
  }

  destroy () {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
  }
}

module.exports.ToolBarItem = ToolBarItem;

/**
 * adds a Tooltip for your item.
 * @param {ButtonOptions.tooltip} tooltipOptions
 * @param {ButtonOptions.callback | null} callback
 * @returns {Disposable} a disposable tooltip
 */
function addTooltip (tooltipOptions, callback = null) {
  let tooltip;
  if (typeof tooltipOptions === 'string') {
    tooltip = {
      title: tooltipOptions
    };
  } else {
    tooltip = tooltipOptions;
  }

  if (!tooltip.hasOwnProperty('placement')) {
    tooltip.placement = getTooltipPlacement();
  }

  if (!tooltip.hasOwnProperty('keyBindingCommand') &&
      typeof callback === 'string'
  ) {
    tooltip.keyBindingCommand = callback;
  }

  return atom.tooltips.add(this.element, tooltip);
}

/** get the tooltip placement based on the toolbar position */
function getTooltipPlacement () {
  const toolbarPosition = atom.config.get('tool-bar.position');

  return toolbarPosition === 'Top' ? 'bottom'
    : toolbarPosition === 'Right' ? 'left'
      : toolbarPosition === 'Bottom' ? 'top'
        : toolbarPosition === 'Left' ? 'right'
          : null;
}

module.exports.addTooltip = addTooltip;
