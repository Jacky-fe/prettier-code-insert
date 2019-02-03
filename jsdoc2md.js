const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
jsdoc2md.render({
  files: 'index.js',
}).then(res => fs.writeFile('./API.md', res, { encoding: 'utf-8' }));