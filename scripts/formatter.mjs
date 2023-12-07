/* eslint-disable no-param-reassign */
export const tailwindFormat = ({ dictionary: { allTokens }, isVariables }) => {
  const tokens = allTokens.reduce((acc, cur) => {
    acc[cur.path.join('.')] = isVariables ? `var(--${cur.name})` : cur.value;
    return acc;
  }, {});

  const result = Object.keys(tokens).reduce((res, key) => {
    const keys = key.split('.');
    makeNestedObject(res, keys, tokens[key]);
    return res;
  }, {});

  const content = JSON.stringify(result, null, 2);
  return `module.exports = ${content}`;
};

export const themeFormat = ({ dictionary: { allTokens } }) => {
  const tokens = allTokens.reduce((acc, cur) => {
    const name = cur.path.join('.');

    //Ensure we keep aliases
    acc[name] = cur.original.value.replace(/^{(.*)}$/, '$1');

    return acc;
  }, {});

  const result = Object.keys(tokens).reduce((res, key) => {
    const keys = key.split('.');
    makeNestedObject(res, keys, tokens[key]);
    return res;
  }, {});

  const content = JSON.stringify(result, null, 2).replace(
    /"colors\..*?"/g,
    (match) => match.slice(1, -1)
  );

  return `
  const {colors} = require('@ecainternational/eca-design-tokens/tailwind/eca-brand.tailwind.js');
  module.exports = ${content}`;
};

const makeNestedObject = (obj, keys, value) => {
  const lastIndex = keys.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    const key = keys[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }

  //replace any numbers in value with ['NUMBER'] to make valid JS
  obj[keys[lastIndex]] = value.replace(/\.(\d+)/g, "['$1']");
};
/* eslint-enable no-param-reassign */
