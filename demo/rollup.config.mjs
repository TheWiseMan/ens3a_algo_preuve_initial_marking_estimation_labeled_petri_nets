// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const isProduction = true;// process.env.NODE_ENV === 'production';

export default (async () => ({
	input: 'script/js/index.js',
	plugins: [
		resolve(),
		commonjs(),
		isProduction && (await import('@rollup/plugin-terser')).default()
	],
	output: {
		file: 'index.js',
		format: 'iife',
		name: "petri"
	}
}))();