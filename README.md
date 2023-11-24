# ECA Design Tokens

This repository contains the design tokens for the ECA Design System in the `tokens` folder

The repository uses a build script `scripts/build.js` to convert design tokens for use in different platforms using Style Dictionary https://amzn.github.io/style-dictionary

## Building Tokens Manually

To build the tokens manually, run the following commands:

- Install dependencies `npm install`

- Convert tokens `npm run build`
  This will convert the tokens for use in the following platforms:
  - Tailwind (`build/tailwind`)
  - More to come...

## TODO

- Aliases in exported tailwind files - https://tailwindcss.com/docs/customizing-colors#aliasing-color-names
