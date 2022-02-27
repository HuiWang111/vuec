#!/usr/bin/env node
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
const path_1 = require("path");
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const utils_1 = require("./utils");
const scanDirs_1 = require("./scanDirs");
const constants_1 = require("./constants");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const args = (0, yargs_parser_1.default)(process.argv.slice(2));
            const [, options] = (0, utils_1.getCommandAndOptions)(args);
            const root = process.cwd();
            let config = undefined;
            if (!Object.keys(options).length) {
                config = (yield Promise.resolve().then(() => __importStar(require((0, path_1.join)(root, constants_1.DEFAULT_CONFIG_FILE))))).default;
            }
            else if (options.config) {
                config = (yield Promise.resolve().then(() => __importStar(require((0, path_1.join)(root, options.config))))).default;
            }
            else if (options.entry && options.outDir) {
                config = {
                    entry: (0, path_1.join)(root, options.entry),
                    outDir: (0, path_1.join)(root, options.outDir)
                };
            }
            if (!config || !config.entry || !config.outDir) {
                throw new Error('vuec must with entry and outDir in configuration');
            }
            yield (0, scanDirs_1.handleCompile)(config.entry, config.outDir);
        }
        catch (e) {
            (0, utils_1.error)(e);
        }
    });
})();
