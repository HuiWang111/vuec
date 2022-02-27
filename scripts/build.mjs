/*
 * @Autor: hui.wang
 * @Date: 2022-02-27 12:42:16
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 13:59:51
 * @emial: hui.wang@bizfocus.cn
 */
import esbuild from 'esbuild';
import pkg from '../package.json' assert { type: 'json' };

function build() {
    esbuild.buildSync({
        entryPoints: ['src/index.ts'],
        bundle: true,
        platform: 'node',
        target: ['node16'],
        format: 'esm',
        external: [
            ...Object.keys(pkg.dependencies),
            '/package.json'
        ],
        outfile: 'bin/index.mjs',
        loader: {
            '.ts': 'ts'
        }
    });
}

build()
