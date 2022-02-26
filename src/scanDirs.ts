/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 21:29:49
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 22:15:56
 * @emial: hui.wang@bizfocus.cn
 */
import { join } from 'path'
import { readdir, stat, mkdir, readFile, writeFile } from 'fs/promises'
import { SFCCompiler } from './sfcCompiler'

const sfcReg = /.vue$/

export async function sacnDirs(entry: string, output: string): Promise<void> {
    const children = await readdir(entry)

    for (const c of children) {
        const newEntry = join(entry, c)
        const status = await stat(newEntry)

        if (status.isDirectory()) {
            const newOutput = join(output, c)
            await mkdir(newOutput)
            sacnDirs(newEntry, newOutput)
        } else if (status.isFile()) {
            await handleFile(newEntry, output, c)
        } else {
            // do nothing
        }
    }
}

async function handleFile(file: string, output: string, fileName: string) {
    if (sfcReg.test(file)) {
        const sfcCompiler = new SFCCompiler(file)
        const [code, css] = await sfcCompiler.compile()
        await writeFile(
            join(output, fileName.replace(sfcReg, '.js')),
            code
        )
        const styleDir = join(output, 'style')
        // TODO: 合并css
        await mkdir(styleDir)
        await writeFile(
            join(styleDir, 'index.css'),
            css
        )
        await writeFile(
            join(styleDir, 'index.js'),
            `import './index.css'`
        )
    } else {
        const content = await readFile(file)
        await writeFile(
            join(output, fileName),
            content
        )
    }
}