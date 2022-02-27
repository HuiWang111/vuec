/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 21:29:49
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 14:29:36
 * @emial: hui.wang@bizfocus.cn
 */
import { join } from 'path'
import { readdir, stat, mkdir, readFile, writeFile } from 'fs/promises'
import { SFCCompiler } from './sfcCompiler'
import { last } from './utils'

const sfcReg = /.vue$/

export async function handleCompile(entry: string, outDir: string): Promise<void> {
    const status = await stat(entry)

    if (status.isFile()) {
        const separator = process.platform === 'win32'
            ? '\\'
            : '/'
        const fileName = last(entry.split(separator))
        const css = await handleFile(entry, outDir, fileName)

        if (css) {
            generateStyle(join(outDir, 'style'), css)
        }
    } else if (status.isDirectory()) {
        await handleSacnDirs(entry, outDir)
    } else {
        // do nothing
    }
}

async function handleSacnDirs(entry: string, outDir: string): Promise<void> {
    const children = await readdir(entry)
    let style = ''

    for (const c of children) {
        const newEntry = join(entry, c)
        const status = await stat(newEntry)

        if (status.isDirectory()) {
            const newOutDir = join(outDir, c)
            await mkdir(newOutDir)
            handleSacnDirs(newEntry, newOutDir)
        } else if (status.isFile()) {
            const css = await handleFile(newEntry, outDir, c)
            if (css) {
                style += css
            }
        } else {
            // do nothing
        }
    }

    if (style) {
        generateStyle(join(outDir, 'style'), style)
    }
}

async function handleFile(file: string, outDir: string, fileName: string): Promise<string | void> {
    if (sfcReg.test(file)) {
        const sfcCompiler = new SFCCompiler(file, fileName)
        const [code, css] = await sfcCompiler.compile()
        await writeFile(
            join(outDir, fileName.replace(sfcReg, '.js')),
            code
        )
        return css
    }

    const content = await readFile(file)
    await writeFile(
        join(outDir, fileName),
        content
    )
}

async function generateStyle(styleDir: string, styleContent: string) {
    await mkdir(styleDir)
    await writeFile(
        join(styleDir, 'index.css'),
        styleContent
    )
    await writeFile(
        join(styleDir, 'index.js'),
        `import './index.css'`
    )
}
