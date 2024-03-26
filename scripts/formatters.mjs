/* eslint-disable no-param-reassign */
export const tailwindFormat = ({ dictionary: { allTokens } }) => {
  const tokens = allTokens.reduce((acc, token) => {
    acc[token.path.join('.')] = { value: token.value, type: token.type };
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
  const tokens = allTokens.reduce((acc, token) => {
    const name = token.path.join('.');

    //Ensure we keep aliases
    acc[name] = {
      value: token.original.value.replace(/^{(.*)}$/, '$1'),
      type: token.type
    };

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

const makeNestedObject = (obj, keys, token) => {
  const lastIndex = keys.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    const key = keys[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }

  //replace any numbers in value with ['NUMBER'] to make valid JS
  let val =
    typeof token.value !== 'object'
      ? token.value.replace(/\.(\d+)/g, "['$1']")
      : token.value;

  //Append px to any typography
  if (token.type === 'typography') {
    val = { ...val, fontSize: `${val.fontSize}px` };
  }

  //Append px to any fontSizes
  if (token.type === 'fontSizes') {
    val = `${val}px`;
  }

  obj[keys[lastIndex]] = val;
};
/* eslint-enable no-param-reassign */
