## 简介
这是一个简单的代码插入工具，你无需将要插入的代码转成AST，也无需通过traverse来查找代码的位置，而只需通过简单的注释即可。它会自动地插入代码并通过prettier美化代码，它可以帮助你降低开发脚手架工具的成本。

## 安装
``` shell
npm i prettier-code-insert -D
```
## 使用方法
例如我们要实现一个“create route”方法，那么我们需要:

1. import这个新生成的路由；
2. 在路由代码里加入这个引入的路由。

这是一个路由的例子：
### router.js
我们声明了里两个slot
1. import 这个slot是为了插入import代码；
2. route 这个slot是为了插入新建的路由。

``` js
import App from 'components/app';
import NotFound from './not-found';
/* @code-insert slot="import" */
export default function createRoutes() {
	const root = {
		path: '/',
		component: App,
		childRoutes: [
			NotFound,
			/* @code-insert slot="route" */
		],
	};
	return root;
}
```

### create-route.js
``` js
import fs from 'fs';
import path from 'path';
// 当前项目的babelrc文件，强烈建议引入
import options from './babelrc';
import insertCode from 'prettier-code-insert';
export default function create() {
  const filename = path.resolve(__dirname, './the/path/of/router.js');
  const code = fs.readFileSync(filename, { encoding: 'utf-8' });
  return new Promise((resolve, reject) => {
    let newCode = insertCode( code, [
      {
        code: `import RouteA from "./route-a";`,
        slotName: 'import',
      },
      {
        code: 'RouteA,',
        slotName: 'route',
      },
    ], options);
    fs.writeFileSync(filename, newCode);
    resolve(true);
  });
}

```

执行后的代码
``` js
import App from 'components/app';
import NotFound from './not-found';
/* @code-insert slot="import" */
import RouteA from './route-a'; // 这是新插入的路由
export default function createRoutes() {
	const root = {
		path: '/',
		component: App,
		childRoutes: [
			NotFound,
			/* @code-insert slot="route" */
			RouteA, // 这是新插入的路由
		],
	};
	return root;
}
```



## 注意事项
1. 目前仅支持babel7
2. 需要项目中安装babel7及prettier，这个不在本包的依赖中，而是和你的项目保持一致
3. 如果需要支持typescript，请安装“@babel/typescript”, 并在.babelrc配置里引用它


## API
<a name="insertCode"></a>

## insertCode(sourceCode, codeSnaps, babelOptions, prettierConfig?) ⇒
将代码插入到指定的位置中

**Kind**: global function  
**Returns**: 转换后的代码 string  

| Param | Type | Description |
| --- | --- | --- |
| sourceCode | <code>string</code> | 被插入代码的源码 |
| codeSnaps | <code>Array.&lt;CodeSnap&gt;</code> | 代码片段，格式： { code: 'import xxx from'xxx';', slotName: 'import' }。会将sourcecode里对应slot的地方插入代码 |
| babelOptions | <code>babel.ParserOptions</code> | 最好将当前项目的babelconfig传过来，避免解析错误 |
| prettierConfig? | <code>prettier.Options</code> | 默认会读取当前项目的".prettierrc"文件，也可以自己传入 |
