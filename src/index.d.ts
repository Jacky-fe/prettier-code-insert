import * as prettier from 'prettier';
interface CodeSnap {
    code: string;
    slotName: string;
}
/**
 * 将代码插入到指定的位置中
 * @param  {string} sourceCode 被插入代码的源码
 * @param  {Array<CodeSnap>} codeSnaps 代码片段，格式： { code: 'import xxx from'xxx';', slotName: 'import' }。会将sourcecode里对应slot的地方插入代码
 * @param  {babel.ParserOptions} babelOptions 最好将当前项目的babelconfig传过来，避免解析错误
 * @param  {prettier.Options} prettierConfig? 默认会读取当前项目的".prettierrc"文件，也可以自己传入
 * @returns 转换后的代码 string
 */
export default function insertCode(sourceCode: string, codeSnaps: Array<CodeSnap>, babelOptions: babel.ParserOptions, prettierConfig?: prettier.Options): string;
export {};
