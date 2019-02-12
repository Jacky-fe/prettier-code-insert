
import { parseSync } from '@babel/core';
import * as prettier from 'prettier';
import * as fs from 'fs';
import * as path from 'path';
import * as T from '@babel/types';
import innerPrettier from '../.prettier.json';

let prettierrc: {};
try {
  prettierrc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './.prettierrc'), { encoding: 'utf-8' }));
} catch(err) {
  prettierrc = innerPrettier;
}

interface CodeSnap {
  code: string;
  slotName: string;
}

const defaultBabelOptions = {
  sourceType: 'module',
  plugins: ['*']
};
/**
 * 将代码插入到指定的位置中
 * @param  {string} sourceCode 被插入代码的源码
 * @param  {Array<CodeSnap>} codeSnaps 代码片段，格式： { code: 'import xxx from'xxx';', slotName: 'import' }。会将sourcecode里对应slot的地方插入代码
 * @param  {babel.ParserOptions} babelOptions 最好将当前项目的babelconfig传过来，避免解析错误
 * @param  {prettier.Options} prettierConfig? 默认会读取当前项目的".prettierrc"文件，也可以自己传入
 * @returns 转换后的代码 string
 */
export default function insertCode(sourceCode: string, codeSnaps: Array<CodeSnap>, babelOptions: babel.ParserOptions, prettierConfig?: prettier.Options) : string {
  babelOptions = babelOptions || defaultBabelOptions;
  // @ts-ignore
  babelOptions.filename = babelOptions.filename || 'temp.js';
  const ast = parseSync(sourceCode, babelOptions);
  const codeArray: Array<string> = [];
  let currentIndex = 0;
  if (ast !== null && T.isFile(ast)) {
    const file: T.File = ast;
    if (file.comments && file.comments.length > 0) {
      // 首先检查有没有注释
      ast.comments.forEach((comment: any)  => {
        const matchResult = comment.value.match(/.*?code-insert.*?( slot=[\"\'](.*?)[\"\'])/);
        // 看看有没有 @code-insert 的注释
        if (matchResult && matchResult.length > 0) {
          const slotName = matchResult[2];
          codeSnaps.forEach(codeSnap => {
            if (codeSnap.slotName === slotName) {
              // 根据解析到的slotName找到对应的代码插入
              codeArray.push(sourceCode.substring(currentIndex, comment.end));
              codeArray.push(`\r\n${codeSnap.code}`);
              currentIndex = comment.end;
            }
          });
        }
      });
    }
    codeArray.push(sourceCode.substr(currentIndex));
  }
  return prettier.format(codeArray.join(''), prettierConfig || prettierrc);
}
