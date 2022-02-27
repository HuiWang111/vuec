"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCompile = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
const sfcCompiler_1 = require("./sfcCompiler");
const utils_1 = require("./utils");
const sfcReg = /.vue$/;
function handleCompile(entry, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = yield (0, promises_1.stat)(entry);
        if (status.isFile()) {
            const separator = process.platform === 'win32'
                ? '\\'
                : '/';
            const fileName = (0, utils_1.last)(entry.split(separator));
            const css = yield handleFile(entry, outDir, fileName);
            if (css) {
                generateStyle((0, path_1.join)(outDir, 'style'), css);
            }
        }
        else if (status.isDirectory()) {
            yield handleSacnDirs(entry, outDir);
        }
        else {
        }
    });
}
exports.handleCompile = handleCompile;
function handleSacnDirs(entry, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const children = yield (0, promises_1.readdir)(entry);
        let style = '';
        for (const c of children) {
            const newEntry = (0, path_1.join)(entry, c);
            const status = yield (0, promises_1.stat)(newEntry);
            if (status.isDirectory()) {
                const newOutDir = (0, path_1.join)(outDir, c);
                yield (0, promises_1.mkdir)(newOutDir);
                handleSacnDirs(newEntry, newOutDir);
            }
            else if (status.isFile()) {
                const css = yield handleFile(newEntry, outDir, c);
                if (css) {
                    style += css;
                }
            }
            else {
            }
        }
        if (style) {
            generateStyle((0, path_1.join)(outDir, 'style'), style);
        }
    });
}
function handleFile(file, outDir, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (sfcReg.test(file)) {
            const sfcCompiler = new sfcCompiler_1.SFCCompiler(file, fileName);
            const [code, css] = yield sfcCompiler.compile();
            yield (0, promises_1.writeFile)((0, path_1.join)(outDir, fileName.replace(sfcReg, '.js')), code);
            return css;
        }
        const content = yield (0, promises_1.readFile)(file);
        yield (0, promises_1.writeFile)((0, path_1.join)(outDir, fileName), content);
    });
}
function generateStyle(styleDir, styleContent) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, promises_1.mkdir)(styleDir);
        yield (0, promises_1.writeFile)((0, path_1.join)(styleDir, 'index.css'), styleContent);
        yield (0, promises_1.writeFile)((0, path_1.join)(styleDir, 'index.js'), `import './index.css'`);
    });
}
