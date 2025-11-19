module.exports = {
  inputFiles: ['./src/**/*.ts', './src/**/*.tsx'],
  outputFile: './docs/API_REFERENCE.md',
  exclude: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**'],
  buildOptions: {
    explore: false
  }
};
