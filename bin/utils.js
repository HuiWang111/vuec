"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandAndOptions = exports.error = exports.warning = exports.last = void 0;
const chalk_1 = __importDefault(require("chalk"));
function last(value) {
    if (Array.isArray(value)) {
        return value[value.length - 1];
    }
    return value;
}
exports.last = last;
function warning(message, ...optionalParams) {
    console.warn(chalk_1.default.yellow(`Warning: ${message}`), ...optionalParams);
}
exports.warning = warning;
function error(e) {
    if (typeof e === 'string') {
        console.error(chalk_1.default.red(`Error: ${e}`));
    }
    else {
        console.error(e);
    }
}
exports.error = error;
function getCommandAndOptions(args) {
    let command = undefined;
    const options = {};
    for (const key in args) {
        if (key === '_') {
            command = args[key];
        }
        else {
            options[key] = args[key];
        }
    }
    return [command, options];
}
exports.getCommandAndOptions = getCommandAndOptions;
