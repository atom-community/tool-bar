export declare interface ButtonOptions {
    /** (optional)
     *  icon name
     * ## Example:
     * ```js
     * icon: 'octoface',
     * ```
     */
    icon?: string

    /** (optional)
     * icon set name.
     * It can be chosen among these:
     *    - not given : if `iconset` is not given Octicons (default Atom's flavour) is chosen
     *    - `ion` with `ios-` and `md- `prefixes for the icon names (Ionicons)
     *    - `fa` and fab for brands (FontAwesome)
     *    - `fi` (Foundation)
     *    - `icomoon` (IcoMoon)
     *    - `devicon` (Devicon)
     *    - `mdi` (MaterialDesignIcons)
     *
     * ## Example:
     * ```js
     *     icon: 'ios-gear-a',
     *     iconset: 'ion'
     * ```
     */
    iconset?:
        | undefined
        | "ion"
        | "fa"
        | "fab"
        | "fi"
        | "icomoon"
        | "devicon"
        | "mdi"

    /** (optional)
     * You can use `text` to:
     * - add text as a button, or
     *
     * ## Example:
     * ```js
     * text: 'hello',
     * ```
     * - use HTML for a button. Needs `html` to be set to `true`
     *
     * ## Example:
     * ```
     * text: '<b>BIG</b> button',
     * html: true,
     * ```
     */
    text?: string

    /** (optional)
     * if set to `true`, `text` will be rendered as HTML
     * ## Example:
     * ```js
     * text: '<b>BIG</b> button',
     * html: true,
     * ```
     */
    html?: boolean

    /** (mandatory)

     * The callback must be either:
     * - Atom command: a string or array of  strings,
     * - a custom callback function,
     * - or an object where the keys are key modifiers (alt, ctrl or shift) and the values are commands or custom functions
     *
     * ## Example:
     * ```js
     * callback: 'application:about',
     * ```
     *
     *
     * ## Example - Callback with modifiers
     * ```js
     * callback: {
     *    '': 'application:cmd-1',      // Without modifiers is default action
     *    'alt': 'application:cmd-2',
     *    'ctrl': 'application:cmd-3',  // With function callback
     *    'shift'(data) {
     *      console.log(data);
     *    },
     *    'alt+shift': 'application:cmd-5',       // Multiple modifiers
     *    'alt+ctrl+shift': 'application:cmd-6'   // All modifiers
     *  },
     * data: 'foo'
     * ```
     */
    callback:
        | string
        | Array<string>
        | ((data?: any) => void)
        | { [modifier: string]: string }
        | { [modifier: string]: (data?: any) => void }

    /** `data` can be passed as the input argument of callback,  If callback is of type
     * - `(data: any) => void)` or
     * - `{ [modifier: string]: ((data: any) => void) }`,
     *
     */
    data?: any

    /** (optional) defaults to `50` */
    priority?: number

    /** (optional)
     * The tooltip option may be a string or an object that is passed to Atom's TooltipManager
     */
    tooltip?: string | object

    /** (optional) Color of the button */
    color?: string

    /** (optional) Color of the button's background */
    background?: string

    /** Buttons can be styled with arbitrary CSS through classes.
     * An example of how the class can be used is show below.
     *
     * ## Example:
     * ```js
     * class: 'my-awesome-class'
     * ```
     *
     * ## Example:
     * ```js
     * class: ['multiple', 'classes', 'also', 'works']
     * ```
     */
    class?: string | Array<string>
}
