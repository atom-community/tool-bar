# Atom Tool Bar

![CI](https://github.com/suda/tool-bar/workflows/CI/badge.svg)
[![apm](https://img.shields.io/apm/dm/tool-bar.svg)]()
[![Chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/suda/tool-bar?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This package provides extensible tool bar for Atom.

**Note:** this package by itself adds an empty toolbar. To propagate it with
icons you can [install plugins](#plugins).

![Horizontal](http://cl.ly/image/2w0u3c1x1K3W/Screenshot-2015-04-21-16.46.49.png)

![Vertical](http://cl.ly/image/1t3U3F191p35/Screenshot-2015-04-21-16.45.46.png)

![Different Sizes](http://cl.ly/image/3v1N2F3e3I47/Screenshot-2015-04-21-16.45.46_2.png)

![Light Theme](http://cl.ly/image/0g043b1e0P1X/Screenshot-2015-04-21-16.46.02.png)

## Configuration

### Position

On which edge of the editor should the tool bar appear. Possible options:

*   Top
*   Right
*   Bottom
*   Left

### Icon size

*   Infinitesimal *(12px)*
*   Tiny *(14px)*
*   Very Small *(16px)*
*   Small: *(18px)*
*   Medium: *(21px)*
*   Big *(24px)*
*   Very Big *(28px)*
*   Huge *(32px)*

### Visibility

*   Visible
*   Hidden

### Full Width (available in Atom >= 1.7)

When on top/bottom, expand to full window width.

### Use TouchBar

If your computer is equipped with a TouchBar (only Apple MacBook Pro series
currently) it can display up to seven tool bar buttons there.

## Plugins

*   [Flex Tool Bar](https://atom.io/packages/flex-tool-bar)
*   [Tool Bar Main](https://atom.io/packages/tool-bar-main)
*   [Toolbar for Atom](https://atom.io/packages/tool-bar-atom)
*   [Juno Plus](https://atom.io/packages/juno-plus) in TypeScript
*   And [more](https://atom.io/packages/search?utf8=%E2%9C%93&q=keyword%3Atool-bar)...

## Packages using tool-bar

*   [Particle Dev](https://atom.io/packages/spark-dev)
*   [PlatformIO IDE](https://atom.io/packages/platformio-ide)
*   [Organized](https://atom.io/packages/organized)

## Integrating instructions

By itself this package shows an empty tool bar. To add buttons and spacers to
the tool bar, follow the instructions below.

### Package.json

Make sure the following properties are part of your `package.json`.

```json
"consumedServices": {
  "tool-bar": {
    "versions": {
      "^0 || ^1": "consumeToolBar"
    }
  }
}
```

We recommend using [Atom-Package-Deps](https://github.com/steelbrain/package-deps)
in your package for installing dependency packages like this package.

### Main package file

In your main package file, add the following methods and replace
`your-package-name` with your package name.

```js
let toolBar;

export function consumeToolBar(getToolBar) {
  toolBar = getToolBar('your-package-name');
  // Add buttons and spacers here...
}

export function deactivate() {
  if (toolBar) {
    toolBar.removeItems();
    toolBar = null;
  }
}
```

### Example

```js
let toolBar;

export function consumeToolBar(getToolBar) {
  toolBar = getToolBar('your-package-name');

  // Adding button
  toolBar.addButton({
    icon: 'octoface',
    callback: 'application:about',
    tooltip: 'About Atom'
  });

  // Adding spacer
  toolBar.addSpacer();

  // Using custom icon set (Ionicons)
  const button = toolBar.addButton({
    // For Material style icons, use md- prefix instead
    icon: 'ios-gear-a',
    callback: 'application:show-settings',
    tooltip: 'Show Settings',
    iconset: 'ion'
  });

  // Disable button
  button.setEnabled(false);

  // Function with data in callback
  toolBar.addButton({
    icon: 'alert',
    callback(data) {
      alert(data);
    },
    tooltip: 'Show Alert',
    data: 'foo'
  });

  // Callback with modifiers
  toolBar.addButton({
    icon: 'octoface',
    callback: {
      '': 'application:cmd-1',      // Without modifiers is default action
      'alt': 'application:cmd-2',
      'ctrl': 'application:cmd-3',  // With function callback
      'shift'(data) {
        console.log(data);
      },
      'alt+shift': 'application:cmd-5',       // Multiple modifiers
      'alt+ctrl+shift': 'application:cmd-6'   // All modifiers
    },
    data: 'foo'
  });

  // Calling multiple callbacks at once
  toolBar.addButton({
    icon: 'octoface',
    callback: ['application:cmd-1', 'application:cmd-2']
  });  

  // Adding spacer and button at the beginning of the tool bar
  toolBar.addSpacer({priority: 10});
  toolBar.addButton({
    icon: 'octoface',
    callback: 'application:about',
    priority: 10
  });

  // Adding text button
  toolBar.addButton({
    text: 'hello',
    callback: 'application:about'
  });

  // Text buttons can also have an icon
  toolBar.addButton({
    icon: 'octoface',
    text: 'hello',
    callback: 'application:about'
  });

  // Text buttons can be html
  toolBar.addButton({
    icon: 'octoface',
    text: '<b>BIG</b> button',
    html: true,
    callback: 'application:about'
  });

  // Text buttons can be colored
  toolBar.addButton({
    icon: 'octoface',
    callback: 'application:about',
    tooltip: 'About Atom',
    color: 'red' // color of the text or icon
    background: 'black' // color of the background
  });

  // Buttons can be styled with arbitrary CSS through classes.
  // An example of how the class can be used is show below.
  toolBar.addButton({
    icon: 'octoface',
    callback: 'application:about',
    class: 'my-awesome-class'
  });
  toolBar.addButton({
    icon: 'octoface',
    callback: 'application:about',
    class: ['multiple', 'classes', 'also', 'works']
  });

  // Cleaning up when tool bar is deactivated
  toolBar.onDidDestroy(() => {
    this.toolBar = null;
    // Teardown any stateful code that depends on tool bar ...
  });
}
```

```css
/*
Follow the instructions at:
https://flight-manual.atom.io/using-atom/sections/basic-customization/#style-tweaks
to define your classes.
*/
.my-awesome-class {
  background-image: url(data:image/svg+xml;base64,...);
  background-repeat: no-repeat;
  background-position: center;
}
```

## Methods

### `.addButton({icon, iconset, text, html, callback, priority, tooltip, data, color, background})`

The method `addButton` requires an object with at least the property `callback`. The
`callback` must be an Atom command string, a custom callback function or an
object where the keys are key modifiers (`alt`, `ctrl` or `shift`) and the
values are commands or custom functions (see [example](#example)).

The remaining properties
`tooltip` (default there is no tooltip),
`text` (default there is no text),
`html` (default `false`),
`icon` (default there is no icon),
`iconset` (defaults to `Octicons`),
`data`,
`priority` (defaults `50`),
`color`,
`background`, and
`class`
are optional.

The `tooltip` option may be a `string` or an `object` that is passed to Atom's
[TooltipManager](https://atom.io/docs/api/latest/TooltipManager#instance-add)

The return value of this method shares another method called
`setEnabled(enabled)` to enable or disable the button.

### `.addSpacer({priority})`

The method `addSpacer` has only one optional property `priority` (defaults
`50`).

### `.addItem({element, priority})`

Adds a custom HTML element as an item to the tool-bar. Arguments are:
- `element`: pass your HTML element.
- `priority`: optional field specifying the position of the item.

### `.removeItems()`

Use the method `removeItems` to remove the buttons added by your package. This
is particular useful in your package `deactivate` method, but can be used at
any time.

### `.onDidDestroy(callback)`

The `onDidDestroy` method takes a function that will be called when the
`tool-bar` package is destroyed. This is useful if your package needs to do
cleanup when the `tool-bar` is deactivated but your package continues running.

## Supported icon sets

*   [Octicons](https://octicons.github.com) (Atom's flavour)
*   [Ionicons](http://ionicons.com) (`ion` with `ios-` and `md-` prefixes for the icon names)
*   [FontAwesome](https://fontawesome.com/) (`fa` and `fab` for brands)
*   [Foundation](http://zurb.com/playground/foundation-icon-fonts-3) (`fi`)
*   [IcoMoon](https://icomoon.io) (`icomoon`)
*   [Devicon](http://konpa.github.io/devicon/) (`devicon`)
*   [MaterialDesignIcons](https://materialdesignicons.com/) (`mdi`)

## Supported commands

*   `tool-bar:toggle`
*   `tool-bar:position-top`
*   `tool-bar:position-right`
*   `tool-bar:position-bottom`
*   `tool-bar:position-left`

## Authors

*   [Wojtek Siudzinski](http://suda.pl) <sup>(owner)</sup>
*   [Jeroen van Warmerdam](https://github.com/jerone)
*   [Ryo Narita](https://github.com/cakecatz)

## Contributors

Issues and pull requests are very welcome. Feel free to write your own packages
using this one. For all contributions credits are due:

*   [Pascal Bihler](https://github.com/pbihler)
*   [Nikita Gusakov](https://github.com/nkt)
*   [Simon AKA simurai](https://github.com/simurai)
*   Carlos Santos
*   [Daniel Alejandro Cast](https://github.com/lexcast)
*   [James Coyle](https://github.com/JamesCoyle)
*   [Andres Suarez](https://github.com/zertosh)
*   [Tony Brix](https://github.com/UziTech)
*   [Gareth McMullin](https://github.com/gsmcmullin)
*   [Christopher Chedeau](https://github.com/vjeux)
*   [Paul Brown](https://github.com/PaulBrownMagic)
*   [Raphael Fetzer](https://github.com/pheraph)
*   [Sven Lohrmann](https://github.com/malnvenshorn)
*   [Amin Yahyaabadi](https://github.com/aminya)
*   [Eric Cornelissen](https://github.com/ericcornelissen)
*   [Jan T. Sott](https://github.com/idleberg)
*   [Luis Romero](https://github.com/luiscobits)
*   [Jordan Eldredge](https://github.com/captbaritone)
*   [Juan Rial](https://github.com/jrial)
*   [Vadim Kotov](https://github.com/vkotovv)
*   [Michael Bolin](https://github.com/bolinfest)

