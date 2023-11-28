/* eslint-disable no-param-reassign */
export const tailwindFormat = ({ dictionary: { allTokens }, isVariables }) => {
  const allTokenObj = allTokens.reduce((acc, cur) => {
    if (!cur.attributes) throw new Error(`Token ${cur.name} has no attributes`);

    acc[cur.path.join('.')] = isVariables ? `var(--${cur.name})` : cur.value;

    return acc;
  }, {});

  const result = Object.keys(allTokenObj).reduce((res, key) => {
    const keys = key.split('.');
    makeNestedObject(res, keys, allTokenObj[key]);
    return res;
  }, {});

  const content = JSON.stringify(result, null, 2);
  return `module.exports = ${content}`;
};

export const daisyFormat = ({ dictionary: { allTokens } }) => {
  const tokens = allTokens.reduce((acc, cur) => {
    if (!cur.attributes) throw new Error(`Token ${cur.name} has no attributes`);

    const name =
      cur.type === 'color' ? cur.path.join('.') : `--${cur.path.join('.')}`;
    acc[name] = cur.value;

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

const makeNestedObject = (obj, keys, value) => {
  const lastIndex = keys.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    const key = keys[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[keys[lastIndex]] = value;
};
/* eslint-enable no-param-reassign */
