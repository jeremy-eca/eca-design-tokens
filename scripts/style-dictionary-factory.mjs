import StyleDictionary from 'style-dictionary';
import { tailwindFormat, themeFormat } from './formatters.mjs';

StyleDictionary.registerFormat({
  name: 'tailwind',
  formatter: ({ dictionary }) =>
    tailwindFormat({ dictionary, isVariables: false })
});

StyleDictionary.registerFormat({
  name: 'theme',
  formatter: ({ dictionary }) => themeFormat({ dictionary })
});

StyleDictionary.registerTransform({
  type: 'name',
  name: 'themeTransform',
  transformer: (token) => `${token.filePath} ${token.name}`
});

StyleDictionary.registerFormat({
  name: 'css/variables/design-tokens',
  formatter: (dictionary) => {
    let currentType = '';

    const getPresenter = (type) => {
      switch (type) {
        case 'color':
          return 'Color';
        case 'fontFamilies':
          return 'FontFamily';
        case 'fontSizes':
          return 'FontSize';
        case 'fontWeights':
          return 'FontWeight';
        case 'lineHeights':
          return 'LineHeight';
        default:
          return 'Color';
      }
    };

    return `:root {\n${dictionary.allProperties
      .map(({ type, name, description, value }) => {
        const comment =
          currentType !== type
            ? '/**\n' +
              ` * @tokens eca-${type}\n` +
              ` * @presenter ${getPresenter(type)}*/\n`
            : '';

        currentType = type;

        const val = type === 'fontSizes' ? `${value}px` : value;
        return `${comment} --${name}: ${val}; ${
          description ? `/* ${description} */` : ''
        }`;
      })
      .join('\n')}\n}`;
  }
});

StyleDictionary.registerTransform({
  type: 'value',
  transitive: true,
  name: 'css/flatten-properties',
  matcher: ({ type }) => ['typography'].includes(type),
  transformer: ({ value, name, type }) => {
    if (!value) return '';

    const entries = Object.entries(value);

    const flattenedValue = entries
      .map(
        ([key, v], index) =>
          `--${name}-${StyleDictionary.transform['name/cti/kebab'].transformer(
            { path: [key] },
            { prefix: '' }
          )}: ${v}${index + 1 === entries.length ? '' : ';'}`
      )
      .join('\n  ');

    return `${
      name.includes(type) ? '' : `${type}-`
    }${name}-group;\n  ${flattenedValue}`;
  }
});

StyleDictionary.registerTransform({
  type: 'value',
  name: 'evaluate-multiplication',
  transitive: true,
  transformer: (token) => {
    let { value } = token;
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

export default StyleDictionary;
