/*
 * @Autor: hui.wang
 * @Date: 2022-02-19 18:46:51
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-19 18:46:51
 * @emial: hui.wang@bizfocus.cn
 */
module.exports = {
    roots: [
        '<rootDir>/__tests__'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '(__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'json',
        'node'
    ],
    moduleNameMapper: {
        "\\.(s?css|less)$": "identity-obj-proxy"
    },
    moduleDirectories: ['node_modules', 'src']
};
