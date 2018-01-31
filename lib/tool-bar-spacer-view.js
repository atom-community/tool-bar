module.exports = class ToolBarSpacerView {
  constructor (options, group) {
    this.element = document.createElement('hr');
    this.priority = options && options.priority;
    this.group = group;
    const classNames = ['tool-bar-spacer'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    this.element.classList.add(...classNames);
    /* NB : ADD COLORS OPTIONS / NO-GRADIENT ... */
    this.element.classList.add('no-gradient');
    this.element.style.borderColor = 'transparent';
    this.element.style.backgroundColor = 'transparent';
    if(typeof options === 'object')
    {
      this.options = options;
      if(typeof options.size === 'string')
      {
        var sszW = '0.01%';
        if(options.size === 'normal')   { sszW='0.01%'; }
        if(options.size === 'large')    { sszW='0.25%'; }
        if(options.size === 'huge')     { sszW='0.75%'; }
        if(options.size === 'massive')  { sszW='1.50%'; }
        this.element.style.width = sszW;
      }
      if(typeof options.color === 'string')
      {
        var sszC = options.color;
        this.element.style.color = sszC;
        this.element.style.backgroundColor = sszC;
        this.element.style.borderColor = sszC;
      }
      if(typeof options.style === 'string')
      {
        if(options.size === 'flat')      { this.element.classList.add('no-gradient'); }
        if(options.size === 'gradient')  { this.element.classList.remove('no-gradient'); }
      }
    }
    /* NB : END */
  }

  destroy () {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
};
