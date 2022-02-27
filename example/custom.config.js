/*
 * @Autor: hui.wang
 * @Date: 2022-02-27 12:35:21
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 14:29:21
 * @emial: hui.wang@bizfocus.cn
 */
const { join } = require('path')

module.exports = {
    entry: join(process.cwd(), 'src'),
    outDir: join(process.cwd(), 'output')
}
