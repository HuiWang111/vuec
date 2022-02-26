/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 13:25:09
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 15:01:43
 * @emial: hui.wang@bizfocus.cn
 */
import chalk from 'chalk'

export function last<T>(value: T | T[]): T {
    if (Array.isArray(value)) {
        return value[value.length - 1]
    }
    return value
}

export function warning(message: string, ...optionalParams: any[]): void {
    console.warn(
        chalk.yellow(message),
        ...optionalParams
    )
}