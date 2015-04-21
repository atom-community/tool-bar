# Atom Toolbar

This package provides extensible toolbar for Atom.

![Horizontal](http://cl.ly/image/2w0u3c1x1K3W/Screenshot-2015-04-21-16.46.49.png)

![Vertical](http://cl.ly/image/1t3U3F191p35/Screenshot-2015-04-21-16.45.46.png)

![Different Sizes](http://cl.ly/image/3v1N2F3e3I47/Screenshot-2015-04-21-16.45.46_2.png)

![Light Theme](http://cl.ly/image/0g043b1e0P1X/Screenshot-2015-04-21-16.46.02.png)

# Configuration

### Orientation

* Top
* Right
* Bottom
* Left

### Icon size

* Small *(16px)*
* Big *(24px)*
* Large *(32px)*

# Plugins

* [toolbar-main](https://atom.io/packages/toolbar-main)
* [flex-toolbar](https://atom.io/packages/flex-toolbar)

# Integrating toolbar with your package

By itself this package just shows empty bar. To add toolbar to your package use this code:

```coffeescript
atom.packages.activatePackage('toolbar')
  .then (pkg) =>
    @toolbar = pkg.mainModule

    @toolbar.appendButton 'octoface', 'application:about', 'About Atom'
    # Adding spacer
    @toolbar.appendSpacer()
    # Using custom icon set (Ionicons)
    @toolbar.appendButton 'gear-a', 'application:show-settings', 'Show Settings', 'ion'
    # Using custom icon set (FontAwesome)
    @toolbar.appendButton 'pied-piper-alt', 'application:open-license', 'Open License', 'fa'
    # Function as a callback
    @toolbar.appendButton 'alert', ->
      alert 'foo'
    , 'Show Alert'
```

You can also prepend buttons/spacers using `prependButton()` and `prependSpacer()` methods.

Both `prependButton()` and `appendButton` return `ToolbarButtonView` instance which has `setEnabled()` method:

```coffeescript
button = @toolbar.appendButton 'octoface', 'application:about', 'About Atom'
button.setEnabled false
```

# Supported icon sets

* [Octicons](https://octicons.github.com/) (Atom's flavour)
* [Ionicons](http://ionicons.com/)
* [FontAwesome](http://fortawesome.github.io/Font-Awesome/)

# Contibutors

Issues and pull requests are very welcome. Feel free to write your own packages using this one.
For all contributions credits are due:

* [Jeroen van Warmerdam](https://github.com/jerone)
* [Pascal Bihler](https://github.com/pbihler)
* [Ryo Narita](https://github.com/cakecatz)
* Carlos Santos
