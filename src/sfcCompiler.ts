/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 12:36:00
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-26 17:04:15
 * @emial: hui.wang@bizfocus.cn
 */
import { readFile } from 'fs/promises'
import { parse, compileTemplate, compileScript, compileStyle } from '@vue/compiler-sfc'
import type { SFCDescriptor, SFCStyleBlock } from '@vue/compiler-sfc'
import { v4 as uuid } from 'uuid'
import less from 'less'
import { types, transformFromAstAsync } from '@babel/core'
import { parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
import { last, warning } from './utils'
import { FunctionDeclaration, ImportDeclaration } from '@babel/types'

export class SFCCompiler {
    private _filePath: string
    private _fileName: string
    private _id: string

    constructor(filePath: string) {
        this._filePath = filePath
        const separator = process.platform === 'win32'
            ? '\\'
            : '/'
        this._fileName = last(filePath.split(separator))
        this._id = uuid()
    }

    private async _getDescriptor(): Promise<SFCDescriptor> {
        const sfcContent = await readFile(this._filePath)
        return parse(sfcContent.toString()).descriptor
    }

    private _compileTemplate(descriptor: SFCDescriptor): string {
        const content = descriptor.template?.content
        
        if (!content) {
            warning(`${this._fileName} is not include templete`)
        }
        
        return compileTemplate({
            source: content || '',
            id: this._id,
            filename: this._fileName
        }).code.replace('export ', '')
    }

    private _compileScript(descriptor: SFCDescriptor): string {
        return compileScript(descriptor, {
            id: this._id
        }).content
    }

    private async _compileStyle({ content, scoped, lang }: SFCStyleBlock): Promise<string> {
        const { code } = compileStyle({
            source: content,
            id: this._id,
            filename: this._fileName,
            scoped
        })

        return await this._transformToCss(code, lang)
    }

    // only support less
    private async _transformToCss(code: string, lang?: string | undefined): Promise<string> {
        if (!lang || lang === 'css') {
            return code
        }

        if (lang === 'less') {
            const { css } = await less.render(code)
            return css
        }

        return ''
    }

    /**
     * @description: 将由templete转换来的render函数转成AST Node，同时将render函数的依赖收集
     * @param {string} renderCode
     * @return {*}
     */
    private _getRenderNode(renderCode: string): Promise<[FunctionDeclaration, ImportDeclaration[]]> {
        return new Promise((resolve) => {
            const ast = babelParse(renderCode, { sourceType: 'module' })
            const dependencies: ImportDeclaration[] = []
            
            traverse(ast, {
                FunctionDeclaration(path) {
                    resolve([path.node, dependencies])
                },
                ImportDeclaration(path) {
                    dependencies.push(path.node)
                }
            })
        })
    }

    /**
     * @description: 将render函数及其依赖的Node合并到script的AST上，再转成代码
     * @param {string} script
     * @param {string} renderCode
     * @return {*}
     */
    private async _addRenderProperty(script: string, renderCode: string): Promise<string> {
        let did = false
        const ast = babelParse(script, { sourceType: 'module' })
        const [{ id, params, body, generator, async }, dependencies] = await this._getRenderNode(renderCode)
        
        traverse(ast, {
            ObjectExpression(path) {
                if (did) {
                    return
                }

                const properties = path.node.properties;
                
                
                properties.push(types.objectProperty(
                    types.identifier('render'),
                    types.functionExpression(id, params, body, generator, async)
                ));
                did = true
            }
        })

        ast.program.body = [...dependencies, ...ast.program.body]
        const res = await transformFromAstAsync(ast, undefined, { presets: ['@babel/preset-env'] })

        return res?.code || ''
    }

    public async compile(): Promise<void> {
        const descriptor = await this._getDescriptor()
        const template = this._compileTemplate(descriptor)
        const script = this._compileScript(descriptor)

        let css = ''
        for (const style of descriptor.styles) {
            css += await this._compileStyle(style)
        }
        
        await this._addRenderProperty(script, template)
    }
}
