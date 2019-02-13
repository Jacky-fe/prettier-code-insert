import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pkg from './package.json';
import path from 'path';

export default [
	{
		input: 'src/index.ts',
		external: ['ms'],
		plugins: [
			json(),
			typescript({
				useTsconfigDeclarationDir: false
			}), // so Rollup can convert TypeScript to JavaScript
			commonjs({extensions: ['.js', '.ts']})
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
