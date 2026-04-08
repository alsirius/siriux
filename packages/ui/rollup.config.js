import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = ['react', 'react-dom'];

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: false, // Skip declarations in ESM build
      }),
    ],
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: false, // Skip declarations in CJS build
      }),
    ],
  },
  // Type definitions (separate build)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          skipLibCheck: true,
        },
      }),
    ],
  },
];
