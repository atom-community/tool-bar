let presets = [
    ["@babel/preset-env", {
        targets: {
            "electron": 5
        }
    }]
];

let plugins = [];

if (process.env.BABEL_ENV === "development") {
    plugins.push("@babel/plugin-transform-modules-commonjs");
}

module.exports = {
    presets: presets,
    plugins: plugins,
    exclude: "node_modules/**",
    sourceMaps: "inline"
}
