#!/usr/bin/env node

/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 09:50:11
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 16:31:48
 * @emial: hui.wang@bizfocus.cn
 */
import { join } from 'path'
import argsParser from 'yargs-parser'
import { error, getCommandAndOptions } from './utils'
import { handleCompile } from './scanDirs'
import { DEFAULT_CONFIG_FILE } from './constants'
import { CompileConfig } from './types'

(async function() {
    try {
        const args = argsParser(process.argv.slice(2))
        const [, options] = getCommandAndOptions(args)
        const root = process.cwd()
        let config: CompileConfig | undefined = undefined

        if (!Object.keys(options).length) {
            /**
             * run `vuec` without any options
             * reading ${root}/vuec.config.js as configuration
             * path in config file must be absolute
             */
            config = (await import(join(root, DEFAULT_CONFIG_FILE))).default
        } else if (options.config) {
            /**
             * run `vuec --config custom.config.js`
             * reading ${root}/custom.config.js as configuration
             * path in config file must be absolute
             */
            config = (await import(join(root, options.config))).default
        } else if (options.entry && options.outDir) {
            /**
             * run `vuec --entry src --outDir dist`
             * path in options must be relative
             */
            config = {
                entry: join(root, options.entry),
                outDir: join(root, options.outDir)
            }
        }

        if (!config || !config.entry || !config.outDir) {
            throw new Error('vuec must with entry and outDir in configuration')
        }

        await handleCompile(config.entry, config.outDir)
    } catch (e) {
        error(e)
    }
})()
