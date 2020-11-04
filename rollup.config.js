import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import execute from 'rollup-plugin-execute';
import babel from 'rollup-plugin-babel';

let plugins = [
    babel(),

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
                drop_console: true,
            },
        })
    );
}

export default [
    // Rollup src
    {
        input: 'src/tool-bar.js',
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
    // Rollup iconsets
    {
        input: 'iconsets/rollup-iconsets.js',
        output: {
            dir: "dist",
            format: 'cjs'
        },
        plugins: [
            css({ output: 'dist/iconsets.css' }),
            execute([
                'csso dist/iconsets.css --output dist/iconsets.css',
                'shx rm dist/rollup-iconsets.js'
            ]),
        ],
    },
];
