# ECA Design Tokens

This repository contains the design tokens for the ECA Design System in the `tokens` folder

The build script `scripts/build.js` converts the design tokens for use in different platforms using [Style Dictionary](https://amzn.github.io/style-dictionary) 

## Installation

```npm i -D @ecainternational/eca-design-tokens```

## Usage

### Tailwind
- The design tokens package builds `brand` files which can be added to the tailwind config to set the colour palette for the application. **Only one brand should be added to a project**
- The design tokens package builds `theme` files which define available application themes. Any number of themes can be added to an application. 


### tailwind.config.js Setup

Import and use `brand` and `theme` files in you `tailwind.config.js` file. The [tw-colors](https://github.com/L-Blondy/tw-colors) package can be used to easily specify
different themes for your application.

```js
const { createThemes } = require('tw-colors');
import myBrand from '@ecainternational/eca-design-tokens/tailwind/my-brand.tailwind';
import myLightTheme from '@ecainternational/eca-design-tokens/tailwind/my-dark-theme.tailwind';
import myDarkTheme from '@ecainternational/eca-design-tokens/tailwind/my-light-theme.tailwind';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@ecainternational/eca-components/**/*.js'
  ],
  theme: {
    ...myBrand
  },
  plugins: [
    createThemes(
            {
              'eca-light': ecaLight,
              'eca-dark': ecaDark
            }
    )
  ]
};
```

## Building Tokens Manually

To build the tokens manually, run the following commands:

- `npm install`: Install dependencies  


- `npm run build`: Convert tokens  
  This will convert the tokens for use in the following platforms:
  - Tailwind (`dist/tailwind`)
  - CSS (`dist/css`)
  - More to come...