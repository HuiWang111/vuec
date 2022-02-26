/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 09:50:11
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 15:09:42
 * @emial: hui.wang@bizfocus.cn
 */
import { SFCCompiler } from './sfcCompiler'
import { join } from 'path'

(async function() {
    const sfcCompiler = new SFCCompiler(join(__dirname, '../__tests__/test.vue'))
    await sfcCompiler.compile()
})()
