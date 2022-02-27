"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SFCCompiler = void 0;
const promises_1 = require("fs/promises");
const compiler_sfc_1 = require("@vue/compiler-sfc");
const uuid_1 = require("uuid");
const less_1 = __importDefault(require("less"));
const babel = __importStar(require("@babel/core"));
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const utils_1 = require("./utils");
class SFCCompiler {
    constructor(filePath, fileName) {
        this._filePath = filePath;
        this._id = (0, uuid_1.v4)();
        if (fileName) {
            this._fileName = fileName;
        }
        else {
            const separator = process.platform === 'win32'
                ? '\\'
                : '/';
            this._fileName = (0, utils_1.last)(filePath.split(separator));
        }
    }
    _getDescriptor() {
        return __awaiter(this, void 0, void 0, function* () {
            const sfcContent = yield (0, promises_1.readFile)(this._filePath);
            return (0, compiler_sfc_1.parse)(sfcContent.toString()).descriptor;
        });
    }
    _compileTemplate(descriptor) {
        var _a;
        const content = (_a = descriptor.template) === null || _a === void 0 ? void 0 : _a.content;
        if (!content) {
            (0, utils_1.warning)(`${this._fileName} is not include templete`);
        }
        const { code, errors } = (0, compiler_sfc_1.compileTemplate)({
            source: content || '',
            id: this._id,
            filename: this._fileName
        });
        if (errors.length) {
            const error = errors[0];
            if (error instanceof SyntaxError) {
                throw error;
            }
            throw new Error(error);
        }
        return code.replace('export ', '');
    }
    _compileScript(descriptor) {
        return (0, compiler_sfc_1.compileScript)(descriptor, {
            id: this._id
        }).content;
    }
    _compileStyle({ content, scoped, lang }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, errors } = (0, compiler_sfc_1.compileStyle)({
                source: content,
                id: this._id,
                filename: this._fileName,
                scoped
            });
            if (errors.length) {
                return Promise.reject(errors[0]);
            }
            return yield this._transformToCss(code, lang);
        });
    }
    _transformToCss(code, lang) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!lang || lang === 'css') {
                return code;
            }
            if (lang === 'less') {
                const { css } = yield less_1.default.render(code);
                return css;
            }
            return '';
        });
    }
    _getRenderNode(renderCode) {
        return new Promise((resolve, reject) => {
            const ast = (0, parser_1.parse)(renderCode, { sourceType: 'module' });
            if (ast.errors.length) {
                return reject(ast.errors[0]);
            }
            const dependencies = [];
            const variables = [];
            (0, traverse_1.default)(ast, {
                FunctionDeclaration(path) {
                    resolve([path.node, dependencies, variables]);
                },
                ImportDeclaration(path) {
                    dependencies.push(path.node);
                },
                VariableDeclaration(path) {
                    variables.push(path.node);
                }
            });
        });
    }
    _addRenderProperty(script, renderCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let did = false;
            const ast = (0, parser_1.parse)(script, { sourceType: 'module' });
            if (ast.errors.length) {
                return Promise.reject(ast.errors[0]);
            }
            const [{ id, params, body, generator, async }, dependencies, variables] = yield this._getRenderNode(renderCode);
            (0, traverse_1.default)(ast, {
                ObjectExpression(path) {
                    if (did) {
                        return;
                    }
                    const properties = path.node.properties;
                    properties.push(babel.types.objectProperty(babel.types.identifier('render'), babel.types.functionExpression(id, params, body, generator, async)));
                    did = true;
                },
                ImportDeclaration(path) {
                    dependencies.push(path.node);
                }
            });
            ast.program.body = [
                ...dependencies,
                ...variables,
                ...ast.program.body.filter(node => node.type !== 'ImportDeclaration')
            ];
            const res = yield babel.transformFromAstAsync(ast);
            return (res === null || res === void 0 ? void 0 : res.code) || '';
        });
    }
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = yield this._getDescriptor();
            const template = this._compileTemplate(descriptor);
            const script = this._compileScript(descriptor);
            let css = '';
            for (const style of descriptor.styles) {
                css += yield this._compileStyle(style);
            }
            const code = yield this._addRenderProperty(script, template);
            return [code, css];
        });
    }
}
exports.SFCCompiler = SFCCompiler;
