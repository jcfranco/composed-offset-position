import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const input = 'src/index.ts';
const umdName = 'composed-offset-position';
const bundles = [
  {
    input,
    output: {
      file: 'dist/composed-offset-position.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: 'dist/composed-offset-position.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: 'dist/composed-offset-position.browser.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: 'dist/composed-offset-position.browser.min.mjs',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      file: 'dist/composed-offset-position.umd.js',
      format: 'umd',
      name: umdName,
    },
  },
  {
    input,
    output: {
      file: 'dist/composed-offset-position.umd.min.js',
      format: 'umd',
      name: umdName,
    },
  },
];

export default bundles.map(({input, output}) => ({
  input,
  output,
  plugins: [typescript(), output.file.includes('.min.') && terser()],
}));
