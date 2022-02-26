/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 13:25:09
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 21:12:54
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

export function error(message: any): void {
    console.error(
        chalk.red(`Error: ${message}`)
    )
}
