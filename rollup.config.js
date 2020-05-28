import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

let plugins = [

    // so Rollup can find externals
    resolve({extensions: ['.js'], preferBuiltins: true}),

    // so Rollup can convert externals to an ES module
    commonjs(),
];

// minify only in production mode
if (process.env.NODE_ENV === 'production') {
    plugins.push(
        // minify
        terser({
            ecma: 2018,
            warnings: true,
            compress: {
                drop_console: false,
            },
        })
    );
}

export default [
    {
        input: 'lib/tool-bar.js',
        output: [
            {
                dir: "dist",
                format: 'cjs',
                sourcemap: true,
            },
        ],
        // loaded externally
        external: [
            "atom",
            "electron",
            // node stuff
            "fs",
            "path",
        ],
        plugins: plugins,
    },
];
