/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 09:50:11
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 22:03:02
 * @emial: hui.wang@bizfocus.cn
 */
import { join } from 'path'
import { error } from './utils'
import { sacnDirs } from './scanDirs'

(async function() {
    try {
        await sacnDirs(
            join(__dirname, '../example/src'),
            join(__dirname, '../example/output'),
        )
    } catch (e) {
        error(e)
    }
})()
