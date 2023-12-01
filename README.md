# ECA Design Tokens

This repository contains the design tokens for the ECA Design System in the `tokens` folder

The build script `scripts/build.js` converts the design tokens for use in different platforms using [Style Dictionary](https://amzn.github.io/style-dictionary) 

## Installation

```npm i -D @ecainternational/eca-design-tokens```

## Usage

### Tailwind
- The design tokens package builds `brand` files which can be added to the tailwind config to set the colour palette for the application. **Only one brand should be added to a project**
- The design tokens package builds daisy `theme` files which define available application themes (see https://daisyui.com/docs/themes/#-4 for more). Any number of themes can be added to an application. 


### tailwind.config.js Setup

Import and use the `brand` and `theme` files in you `tailwind.config.js` file:

```js
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
  daisyui: {
    themes: [
      {
        'my-dark-theme': myDarkTheme,
        'my-light-theme': myLightTheme
      }
    ]
  },
  plugins: [require('daisyui')]
};
```

### Default Theme
To set the default theme for the application, set the `data-theme` attribute on the `html` element to the name of the theme.

```html
<html lang="en" data-theme="my-theme-name">
```

### Theme Switching
To switch themes, set the `data-theme` attribute on the `html` element to the name of the theme.

```js
document.documentElement.setAttribute('data-theme', 'my-other-theme-name');
```

## Building Tokens Manually

To build the tokens manually, run the following commands:

- `npm install`: Install dependencies  


- `npm run build`: Convert tokens  
  This will convert the tokens for use in the following platforms:
  - Tailwind (`build/tailwind`)
  - More to come...