import * as prettier from "prettier";

interface CodeSnap {
  code: string;
  slotName: string;
}

/**
 * 将代码插入到指定的位置中
 * @param  {string} sourceCode 被插入代码的源码
 * @param  {Array<CodeSnap>} codeSnaps 代码片段，格式： { code: 'import xxx from'xxx';', slotName: 'import' }。会将sourcecode里对应slot的地方插入代码
 * @returns 转换后的代码 Promise<string>
 */
export default function insertCode(
  sourceCode: string,
  codeSnaps: Array<CodeSnap>
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    prettier.resolveConfig(process.cwd()).then(prettierConfig => {
      // @ts-ignore
      const { ast, text } = prettier.__debug.parse(sourceCode, prettierConfig);
      sourceCode = text;
      const codeArray: Array<string> = [];
      let currentIndex = 0;
      if (ast !== null && ast.type === "File") {
        const file = ast;
        if (file.comments && file.comments.length > 0) {
          // 首先检查有没有注释
          ast.comments.forEach((comment: any) => {
            const matchResult = comment.value.match(
              /.*?code-insert.*?( slot=[\"\'](.*?)[\"\'])/
            );
            // 看看有没有 @code-insert 的注释
            if (matchResult && matchResult.length > 0) {
              const slotName = matchResult[2];
              codeSnaps.forEach(codeSnap => {
                if (codeSnap.slotName === slotName) {
                  // 根据解析到的slotName找到对应的代码插入
                  codeArray.push(
                    sourceCode.substring(currentIndex, comment.end)
                  );
                  codeArray.push(`\r\n${codeSnap.code}`);
                  currentIndex = comment.end;
                }
              });
            }
          });
        }
        codeArray.push(sourceCode.substr(currentIndex));
      }
      // @ts-ignore
      resolve(prettier.format(codeArray.join(""), prettierConfig));
    });
  });
}
