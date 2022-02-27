/*
 * @Autor: hui.wang
 * @Date: 2022-02-26 12:36:00
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 16:30:56
 * @emial: hui.wang@bizfocus.cn
 */
import { readFile } from 'fs/promises'
import { parse, compileTemplate, compileScript, compileStyle } from '@vue/compiler-sfc'
import type { SFCDescriptor, SFCStyleBlock } from '@vue/compiler-sfc'
import { v4 as uuid } from 'uuid'
import less from 'less'
import * as babel from '@babel/core'
import { parse as babelParse } from '@babel/parser'
import traverse from '@babel/traverse'
import { last, warning } from './utils'
import type { FunctionDeclaration, ImportDeclaration, VariableDeclaration } from '@babel/types'

export class SFCCompiler {
    private _filePath: string
    private _fileName: string
    private _id: string

    constructor(filePath: string, fileName?: string) {
        this._filePath = filePath
        this._id = uuid()
        
        if (fileName) {
            this._fileName = fileName
        } else {
            const separator = process.platform === 'win32'
                ? '\\'
                : '/'
            this._fileName = last(filePath.split(separator))
        }
    }

    private async _getDescriptor(): Promise<SFCDescriptor> {
        const sfcContent = await readFile(this._filePath)
        return parse(sfcContent.toString()).descriptor
    }

    /**
     * TODO: 目前暂不支持样式上加 scoped
     * compileTemplate函数可以加scoped属性
     * 但是暂时没搞懂当存在多个style标签，部分加了scoped部分未加scoped时，compileTemplate如何处理
     */
    private _compileTemplate(descriptor: SFCDescriptor): string {
        const content = descriptor.template?.content
        
        if (!content) {
            warning(`${this._fileName} is not include templete`)
        }

        const { code, errors } = compileTemplate({
            source: content || '',
            id: this._id,
            filename: this._fileName
        })

        if (errors.length) {
            const error = errors[0]
            if (error instanceof SyntaxError) {
                throw error
            }
            throw new Error(error)
        }
        
        return code.replace('export ', '')
    }

    private _compileScript(descriptor: SFCDescriptor): string {
        return compileScript(descriptor, {
            id: this._id
        }).content
    }

    private async _compileStyle({ content, scoped, lang }: SFCStyleBlock): Promise<string> {
        const { code, errors } = compileStyle({
            source: content,
            id: this._id,
            filename: this._fileName,
            scoped
        })

        if (errors.length) {
            return Promise.reject(errors[0])
        }

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
    private _getRenderNode(renderCode: string): Promise<[
        FunctionDeclaration,
        ImportDeclaration[],
        VariableDeclaration[]
    ]> {
        return new Promise((resolve, reject) => {
            const ast = babelParse(renderCode, { sourceType: 'module' })

            if (ast.errors.length) {
                return reject(ast.errors[0])
            }

            const dependencies: ImportDeclaration[] = []
            const variables: VariableDeclaration[] = []
            
            traverse(ast, {
                FunctionDeclaration(path) {
                    resolve([path.node, dependencies, variables])
                },
                ImportDeclaration(path) {
                    dependencies.push(path.node)
                },
                VariableDeclaration(path) {
                    variables.push(path.node)
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

        if (ast.errors.length) {
            return Promise.reject(ast.errors[0])
        }

        const [{ id, params, body, generator, async }, dependencies, variables] = await this._getRenderNode(renderCode)
        
        traverse(ast, {
            ObjectExpression(path) {
                if (did) {
                    return
                }

                const properties = path.node.properties;
                
                properties.push(babel.types.objectProperty(
                    babel.types.identifier('render'),
                    babel.types.functionExpression(id, params, body, generator, async)
                ));
                did = true
            },
            ImportDeclaration(path) {
                dependencies.push(path.node)
            }
        })
        ast.program.body = [
            ...dependencies,
            ...variables,
            ...ast.program.body.filter(node => node.type !== 'ImportDeclaration')
        ]
        
        const res = await babel.transformFromAstAsync(ast)

        return res?.code || ''
    }

    public async compile(): Promise<[string, string]> {
        const descriptor = await this._getDescriptor()
        const template = this._compileTemplate(descriptor)
        const script = this._compileScript(descriptor)

        let css = ''
        for (const style of descriptor.styles) {
            css += await this._compileStyle(style)
        }
        
        const code = await this._addRenderProperty(script, template)
        return [code, css]
    }
}
