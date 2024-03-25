import StyleDictionary from './style-dictionary-factory.mjs';

const brands = ['eca-brand'];
const themes = ['eca-light-theme', 'eca-dark-theme'];

brands.forEach((brand) => {
  StyleDictionary.extend({
    source: [`tokens/${brand}.json`],
    platforms: {
      tailwind: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'css/evaluate-multiplication'
        ],
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

  StyleDictionary.extend({
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
  StyleDictionary.extend({
    include: [
      'tokens/*-brand.json',
      'tokens/eca-type.json',
      'tokens/tailwind.json'
    ],
    source: [`tokens/theme/${theme}.json`],
    platforms: {
      daisy: {
        transforms: [
          'attribute/cti',
          'name/cti/kebab',
          'css/evaluate-multiplication'
        ],
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

  StyleDictionary.extend({
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
