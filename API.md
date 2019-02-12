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

