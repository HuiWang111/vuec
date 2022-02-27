<!--
 * @Autor: hui.wang
 * @Date: 2022-02-19 18:47:07
 * @LastEditors: hui.wang
 * @LastEditTime: 2022-02-27 14:54:00
 * @emial: hui.wang@bizfocus.cn
-->
# @petrichor/vuec
组件库因为要实现按需加载之类功能，所以是不能直接发布`.vue`文件。
`vuec`主要致力于让习惯`SFC`开发的同学可以使用`.vue`开发组件，最终发布js版本。
同时`vuec`也遵循了按需加载的逻辑，在组件对应的目录下生成了`style/index.css` `style/index.js`。

**注**：暂未发布到npm上

## Install
```bash
npm i @petrichor/vuec -g
```
```bash
yarn global add @petrichor/vuec
```

## Usage
1. only command line
```bash
vuec --entry ./example/src/ --outDir ./example/output/
```

2. with default config file
```js
// vuec.config.js
const { join } = require('path')

module.exports = {
    entry: join(process.cwd(), 'src'),
    outDir: join(process.cwd(), 'output')
}
```
```bash
vuec
```

3. with custom config file
```js
// custom.config.js
const { join } = require('path')

module.exports = {
    entry: join(process.cwd(), 'src'),
    outDir: join(process.cwd(), 'output')
}
```
```bash
vuec --config ./custom.config.js
```

## Effect
before compile
```
|—— src
    |—— component
        |—— composition.vue
        |—— options.vue
        |—— test.js
    |—— ...
```

after compile
```
|—— output
    |—— component
        |—— style
            |—— index.css
            |—— index.js
        |—— composition.js
        |—— options.js
        |—— test.js
    |—— ...
```
