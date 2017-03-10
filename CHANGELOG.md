# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and
tries to follow the [Keep a CHANGELOG](http://keepachangelog.com) convention.

## [vNext](https://github.com/suda/tool-bar/compare/v1.1.0...master) - Unreleased

*   ...

## [v1.1.0](https://github.com/suda/tool-bar/compare/v1.0.1...v1.1.0) - 2017-03-10

*   Removed API v0.1.0. [PR #153](https://github.com/suda/tool-bar/pull/153) (by [@zertosh](https://github.com/zertosh))
*   Moved menu from Packages to View. [PR #161](https://github.com/suda/tool-bar/pull/161) (by [@jerone](https://github.com/jerone))
*   Perf improvements by debouncing `drawGutter`. [PR #164](https://github.com/suda/tool-bar/pull/164) (by [@zertosh](https://github.com/zertosh))
*   Allow multiple commands in an array. [PR #171](https://github.com/suda/tool-bar/pull/171) (by [@UziTech](https://github.com/UziTech))
*   Update One themes. The One themes now handle the borders/padding of panels, so tool-bar doesn't have to worry about it. [PR #160](https://github.com/suda/tool-bar/pull/160) (by [@simurai](https://github.com/simurai))

## [v1.0.1](https://github.com/suda/tool-bar/compare/v1.0.0...v1.0.1) - 2016-08-07

*   :art: Full-width is the new standard for the status-bar This restores bottom
    border for vertical tool-bars with the One theme. Closes [#157](https://github.com/suda/tool-bar/issues/157)
*   :bug: Fixed wrong calculation for gutter shadow. Fixes [#156](https://github.com/suda/tool-bar/issues/156)

## [v1.0.0](https://github.com/suda/tool-bar/compare/v0.4.0...v1.0.0) - 2016-07-03

*   Convert to ES6 (by [@zertosh](https://github.com/zertosh))
*   :fire: Removed space-pen dependency. Closes [#135](https://github.com/suda/tool-bar/issues/135) (by [@zertosh](https://github.com/zertosh))
*   :bug:  Fixed priority calculation
*   :art: Add transparency fadeout to spacers (by [@phoenixenero](https://github.com/phoenixenero))
*   Update Material Design Icons (by [@unluisco](https://github.com/unluisco))
*   :art: Some theme fixes.
*   :fire: Removed deprecated code. Fixes [#133](https://github.com/suda/tool-bar/issues/133)

## [v0.4.0](https://github.com/suda/tool-bar/compare/v0.3.0...v0.4.0) - 2016-03-18

*   :sparkles: Full width header & footer tool bar. Closes [#91](https://github.com/suda/tool-bar/issues/91)

## [v0.3.0](https://github.com/suda/tool-bar/compare/v0.2.1...v0.3.0) - 2016-03-05

*   :shirt: Added lint script to package.json
*   :package: Update dependencies
*   :green_heart: Run beta specs on [Travis](https://travis-ci.org/suda/tool-bar)
*   :green_heart: Run specs also on [AppVeyor](https://ci.appveyor.com/project/suda/tool-bar)
*   :green_heart: Run specs also on [CircleCI](https://circleci.com/gh/suda/tool-bar)
*   :sparkles: Align items to the end. Closes [#93](https://github.com/suda/tool-bar/issues/93)
*   :bug: Increment priority by group
*   :memo: Follow the [Keep a CHANGELOG](http://keepachangelog.com) convention

## [v0.2.1](https://github.com/suda/tool-bar/compare/v0.2.0...v0.2.1) - 2016-02-17

*   Fix scrolling for new Atom top/bottom bars (by [@simurai](https://github.com/simurai))
*   Stop event bubbling when click tool-bar button. Fixes [#112](https://github.com/suda/tool-bar/issues/112)
*   Added MarkDown linter

## [v0.2.0](https://github.com/suda/tool-bar/compare/v0.1.11...v0.2.0) - 2016-02-02

*   Fix memory leaks and add `onDidDestroy`. Fixes [#96](https://github.com/suda/tool-bar/issues/96) (by [@zertosh](https://github.com/zertosh))
*   Fixed `command-palette:toggle` not working. Fixes [#105](https://github.com/suda/tool-bar/issues/105)
*   Added support for Material Design Icons. Closes [#92](https://github.com/suda/tool-bar/issues/92) (by [@JamesCoyle](https://github.com/JamesCoyle))
*   Added support for callback modifiers. Closes [#44](https://github.com/suda/tool-bar/issues/44)
*   Updated Font Awesome 4.5.0
*   Updated IcoMoon
*   Refactored code

## [v0.1.11](https://github.com/suda/tool-bar/compare/v0.1.10...v0.1.11) - 2016-01-18

*   Added 12px icon size (dedicated to [@pongstr](https://github.com/pongstr))
*   Fixed [#87](https://github.com/suda/tool-bar/issues/87) (by [@cakecatz](https://github.com/cakecatz))

## [v0.1.10](https://github.com/suda/tool-bar/compare/v0.1.9...v0.1.10) - 2016-01-04

*   Updated Devicon to 2.0 (by [@afterdesign](https://github.com/afterdesign))

## [v0.1.9](https://github.com/suda/tool-bar/compare/v0.1.8...v0.1.9) - 2015-09-07

*   Updated FontAwesome to 4.4.0

## [v0.1.8](https://github.com/suda/tool-bar/compare/v0.1.7...v0.1.8) - 2015-06-22

*   Better support for Isotope UI theme (by [@k2b6s9j](https://github.com/k2b6s9j) and [@jerone](https://github.com/jerone)) ([#75](https://github.com/suda/tool-bar/issues/75))

## [v0.1.7](https://github.com/suda/tool-bar/compare/v0.1.6...v0.1.7) - 2015-06-09

*   Fixed LESS warnings

## [v0.1.6](https://github.com/suda/tool-bar/compare/v0.1.5...v0.1.6) - 2015-06-08

*   Added specs (by [@jerone](https://github.com/jerone))
    ([#63](https://github.com/suda/tool-bar/pull/63))
*   Change tooltip placement based on toolbar position
    (by [@kankaristo](https://github.com/kankaristo))
    ([#68](https://github.com/suda/tool-bar/issues/68))
*   Remove deprecated API (by [@jerone](https://github.com/jerone))
    ([#64](https://github.com/suda/tool-bar/pull/64))

## [v0.1.5](https://github.com/suda/tool-bar/compare/v0.1.4...v0.1.5) - 2015-05-31

*   Fixed Devicon path (by [@lexcast](https://github.com/lexcast)) ([#58](https://github.com/suda/tool-bar/issues/58))

## [v0.1.4](https://github.com/suda/tool-bar/compare/v0.1.3...v0.1.4) - 2015-05-31

*   Added Devicon set (by [@lexcast](https://github.com/lexcast)) ([#58](https://github.com/suda/tool-bar/issues/58))

## [v0.1.3](https://github.com/suda/tool-bar/compare/v0.1.2...v0.1.3) - 2015-05-27

*   Fixed toolbar wrap/overflow (by [@jerone](https://github.com/jerone) &
    [@simurai](https://github.com/simurai)) ([#38](https://github.com/suda/tool-bar/issues/38))
*   Renamed commands (by [@jerone](https://github.com/jerone)) ([#40](https://github.com/suda/tool-bar/issues/40))
*   Added new iconsets (by [@jerone](https://github.com/jerone)) ([#39](https://github.com/suda/tool-bar/issues/39))
*   Updated Ionicons (by [@jerone](https://github.com/jerone)) ([#50](https://github.com/suda/tool-bar/issues/50))

## [v0.1.2](https://github.com/suda/tool-bar/compare/v0.1.1...v0.1.2) - 2015-05-24

*   Fixed buttons outline on OS X (by Nikita Gusakov)
*   Fixed callback target (by [@cakecatz](https://github.com/cakecatz))

## [v0.1.1](https://github.com/suda/tool-bar/compare/v0.1.0...v0.1.1) - 2015-05-08

*   Fixed margin in One themes (by [@simurai](https://github.com/simurai))

## [v0.1.0](https://github.com/suda/tool-bar/compare/v0.0.16...v0.1.0) - 2015-05-02

*   Added support for [Services API](https://atom.io/docs/latest/behind-atom-interacting-with-packages-via-services) (by [@jerone](https://github.com/jerone))
*   Renamed to `tool-bar`

## [v0.0.16](https://github.com/suda/tool-bar/compare/v0.0.15...v0.0.16) - 2015-04-27

*   Added toolbar position to Atom menu & toolbar context menu (by [@jerone](https://github.com/jerone))
*   Added data attribute to button callback (by [@cakecatz](https://github.com/cakecatz))

## [v0.0.15](https://github.com/suda/tool-bar/compare/v0.0.14...v0.0.15) - 2015-04-21

*   Toolbar theme (by [@jerone](https://github.com/jerone))
*   Fixed [#8](https://github.com/suda/tool-bar/issues/8) and [#18](https://github.com/suda/tool-bar/issues/18) (by [@jerone](https://github.com/jerone))
*   Fixed [#22](https://github.com/suda/tool-bar/issues/22) (by [@jerone](https://github.com/jerone))
*   Fixed [#20](https://github.com/suda/tool-bar/issues/20) (by [@jerone](https://github.com/jerone))
*   Fixed [#11](https://github.com/suda/tool-bar/issues/11) (by [@cakecatz](https://github.com/cakecatz))

## [v0.0.14](https://github.com/suda/tool-bar/compare/v0.0.13...v0.0.14) - 2015-04-18

*   Added 32px icon size (by [@jerone](https://github.com/jerone))
*   Added real tooltip (by [@jerone](https://github.com/jerone))

## [v0.0.13](https://github.com/suda/tool-bar/compare/v0.0.12...v0.0.13) - 2015-04-17

*   Rename stylesheets to styles (by [@jerone](https://github.com/jerone))
*   Show pointer cursor on buttons (by [@jerone](https://github.com/jerone))

## [v0.0.12](https://github.com/suda/tool-bar/compare/v0.0.11...v0.0.12) - 2015-02-27

*   Atom 1.0 compatibility

## [v0.0.11](https://github.com/suda/tool-bar/compare/v0.0.10...v0.0.11) - 2015-01-30

*   Removed deprecated workspaceView call (by Pascal Bihler)
*   Fixed return value of append/prependSpacer (by Pascal Bihler)

## [v0.0.10](https://github.com/suda/tool-bar/compare/v0.0.9...v0.0.10) - 2015-01-16

*   Fixed deprecation warning (by Carlos Santos)

## [v0.0.9](https://github.com/suda/tool-bar/compare/v0.0.8...v0.0.9) - 2014-10-30

*   Fixed setting button title

## [v0.0.8](https://github.com/suda/tool-bar/compare/v0.0.7...v0.0.8) - 2014-10-28

*   Fixed deprecation warnings

## [v0.0.7](https://github.com/suda/tool-bar/compare/v0.0.6...v0.0.7) - 2014-10-28

*   Fixed deprecation warnings

## [v0.0.6](https://github.com/suda/tool-bar/compare/v0.0.5...v0.0.6) - 2014-10-28

*   Fixed missing imports

## [v0.0.5](https://github.com/suda/tool-bar/compare/v0.0.4...v0.0.5) - 2014-10-28

*   Fixed missing imports

## [v0.0.4](https://github.com/suda/tool-bar/compare/v0.0.3...v0.0.4) - 2014-10-22

*   Added FontAwesome

## [v0.0.3](https://github.com/suda/tool-bar/compare/v0.0.2...v0.0.3) - 2014-10-20

*   Hiding first spacer
*   Added ability to enable/disable buttons

## [v0.0.2](https://github.com/suda/tool-bar/compare/v0.0.1...v0.0.2) - 2014-10-20

*   Icon size adjustable from config
*   Fixed icon positions
*   Fixed Ionicons warnings

## v0.0.1 - 2014-10-20

*   First Release
