import StyleDictionaryModule from 'style-dictionary';
import { tailwindFormat, themeFormat } from './formatters.mjs';

const brands = ['eca-brand'];
const themes = ['eca-light-theme', 'eca-dark-theme'];

StyleDictionaryModule.registerFormat({
  name: 'tailwind',
  formatter: ({ dictionary }) =>
    tailwindFormat({ dictionary, isVariables: false })
});

StyleDictionaryModule.registerFormat({
  name: 'theme',
  formatter: ({ dictionary }) => themeFormat({ dictionary })
});

StyleDictionaryModule.registerTransform({
  type: 'name',
  name: 'themeTransform',
  transformer: (token) => `${token.filePath} ${token.name}`
});

StyleDictionaryModule.registerFormat({
  name: 'css/variables/design-tokens',
  formatter: (dictionary, platform, file) => {
    const comment =
      '/**\n' +
      ` * @tokens ${file.destination.split('.')[0]}\n` +
      ' * @presenter Color\n */';
    const output = `:root {\n${dictionary.allProperties
      .map(
        (prop) =>
          `  --${prop.name}: ${prop.value}; ${
            prop.description ? `/* ${prop.description} */` : ''
          }`
      )
      .join('\n')}\n}`;
    return comment + output;
  }
});

StyleDictionaryModule.registerTransform({
  type: 'value',
  transitive: true,
  name: 'css/flatten-properties',
  matcher: ({ type }) => ['typography'].includes(type),
  transformer: ({ value, name, type }) => {
    if (!value) return '';

    const entries = Object.entries(value);

    const flattenedValue = entries
      .map(([key, v], index) => {
        const transformedValue = StyleDictionaryModule.transform[
          'css/evaluate-multiplication'
        ].transformer({ value: v });

        return `--${name}-${StyleDictionaryModule.transform[
          'name/cti/kebab'
        ].transformer({ path: [key] }, { prefix: '' })}: ${transformedValue}${
          index + 1 === entries.length ? '' : ';'
        }`;
      })
      .join('\n  ');

    return `${
      name.includes(type) ? '' : `${type}-`
    }${name}-group;\n  ${flattenedValue}`;
  }
});

StyleDictionaryModule.registerTransform({
  type: 'value',
  name: 'css/evaluate-multiplication',
  transitive: true,
  transformer: (test) => {
    const { value } = test;

    if (
      typeof value !== 'object' &&
      typeof value === 'string' &&
      value.includes('*')
    ) {
      const [num1, num2] = value.split('*').map(Number);
      const result = num1 * num2;

      return result.toString();
    }

    return value;
  }
});

brands.forEach((brand) => {
  StyleDictionaryModule.extend({
    source: [`tokens/${brand}.json`],
    platforms: {
      tailwind: {
        transforms: ['attribute/cti', 'name/cti/kebab'],
        buildPath: 'dist/tailwind/',
        files: [
          {
            destination: `${brand}.tailwind.js`,
            format: 'tailwind'
          }
        ]
      }
    }
  }).buildAllPlatforms();

  StyleDictionaryModule.extend({
    source: [`tokens/${brand}.json`],
    platforms: {
      css: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'css/flatten-properties',
          'css/evaluate-multiplication'
        ],
        buildPath: 'dist/css/',
        files: [
          {
            destination: `${brand}.css`,
            format: 'css/variables/design-tokens'
          }
        ]
      }
    }
  }).buildAllPlatforms();
});

themes.forEach((theme) => {
  StyleDictionaryModule.extend({
    include: [
      'tokens/*-brand.json',
      'tokens/eca-type.json',
      'tokens/tailwind.json'
    ],
    source: [`tokens/theme/${theme}.json`],
    platforms: {
      daisy: {
        transforms: ['attribute/cti', 'name/cti/kebab'],
        buildPath: 'dist/tailwind/',
        files: [
          {
            destination: `${theme}.tailwind.js`,
            format: 'theme',
            filter: {
              isSource: true
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();

  StyleDictionaryModule.extend({
    include: [
      'tokens/*-brand.json',
      'tokens/eca-type.json',
      'tokens/tailwind.json'
    ],
    source: [`tokens/theme/${theme}.json`],
    platforms: {
      css: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'css/flatten-properties',
          'css/evaluate-multiplication'
        ],
        buildPath: 'dist/css/',
        files: [
          {
            destination: `${theme}.css`,
            format: 'css/variables/design-tokens',
            filter: {
              isSource: true
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
});
