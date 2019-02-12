import { parseSync } from '@babel/core';
import { format } from 'prettier';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { isFile } from '@babel/types';

var printWidth = 120;
var tabWidth = 2;
var semi = true;
var useTabs = true;
var bracketSpacing = true;
var singleQuote = true;
var trailingComma = "all";
var proseWrap = "always";
var parser = "babel";
var innerPrettier = {
	printWidth: printWidth,
	tabWidth: tabWidth,
	semi: semi,
	useTabs: useTabs,
	bracketSpacing: bracketSpacing,
	singleQuote: singleQuote,
	trailingComma: trailingComma,
	proseWrap: proseWrap,
	parser: parser
};

var prettierrc;
try {
    prettierrc = JSON.parse(readFileSync(resolve(process.cwd(), './.prettierrc'), { encoding: 'utf-8' }));
}
catch (err) {
    prettierrc = innerPrettier;
}
var defaultBabelOptions = {
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
function insertCode(sourceCode, codeSnaps, babelOptions, prettierConfig) {
    babelOptions = babelOptions || defaultBabelOptions;
    // @ts-ignore
    babelOptions.filename = babelOptions.filename || 'temp.js';
    var ast = parseSync(sourceCode, babelOptions);
    var codeArray = [];
    var currentIndex = 0;
    if (ast !== null && isFile(ast)) {
        var file = ast;
        if (file.comments && file.comments.length > 0) {
            // 首先检查有没有注释
            ast.comments.forEach(function (comment) {
                var matchResult = comment.value.match(/.*?code-insert.*?( slot=[\"\'](.*?)[\"\'])/);
                // 看看有没有 @code-insert 的注释
                if (matchResult && matchResult.length > 0) {
                    var slotName_1 = matchResult[2];
                    codeSnaps.forEach(function (codeSnap) {
                        if (codeSnap.slotName === slotName_1) {
                            // 根据解析到的slotName找到对应的代码插入
                            codeArray.push(sourceCode.substring(currentIndex, comment.end));
                            codeArray.push("\r\n" + codeSnap.code);
                            currentIndex = comment.end;
                        }
                    });
                }
            });
        }
        codeArray.push(sourceCode.substr(currentIndex));
    }
    return format(codeArray.join(''), prettierConfig || prettierrc);
}

export default insertCode;
