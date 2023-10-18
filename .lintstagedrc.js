const path = require('path');

const buildOrganizeImportsCommand = (filenames) =>
  `organize-imports-cli ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildOrganizeImportsCommand, buildEslintCommand, buildPrettierCommand],
};
