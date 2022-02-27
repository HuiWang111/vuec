/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 13:25:09
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 14:11:10
 * @emial: hui.wang@bizfocus.cn
 */
import chalk from 'chalk'

export function last<T>(value: T | T[]): T {
    if (Array.isArray(value)) {
        return value[value.length - 1]
    }
    return value
}

export function warning(message: any, ...optionalParams: any[]): void {
    console.warn(
        chalk.yellow(`Warning: ${message}`),
        ...optionalParams
    )
}

export function error(e: any): void {
    if (typeof e === 'string') {
        console.error(
            chalk.red(`Error: ${e}`)
        )
    } else {
        console.error(e)
    }
}

export function getCommandAndOptions(
    args: Record<string, any> & { _?: Array<string>, }
): [string[] | undefined, Record<string, any>] {
    let command: string[] | undefined = undefined
    const options: Record<string, any> = {}

    for (const key in args) {
        if (key === '_') {
            command = args[key]
        } else {
            options[key] = args[key]
        }
    }

    return [command, options]
}
