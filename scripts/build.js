import StyleDictionaryModule from 'style-dictionary';
import { tailwindFormat, themeFormat } from './formatter.mjs';

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
});

themes.forEach((theme) => {
  StyleDictionaryModule.extend({
    include: [
      'tokens/*-brand.json',
      'tokens/eca-type.json',
      'tokens/tailwind.json'
    ],
    source: [`tokens/${theme}.json`],
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
});
