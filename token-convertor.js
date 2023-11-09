const fs = require('fs');

//write a function to convert your design tokens to Tailwind config





function convertDesignTokensToTailwind(designTokens) {
    const tailwindConfig = {
        theme: {
            extend: {},
        },
    };

    // Assuming your design tokens have a 'colors' property
    if (designTokens.colors) {
        tailwindConfig.theme.extend.colors = designTokens.colors;
    }

    // Add more sections for other design token properties like typography, spacing, etc.

    return tailwindConfig;
}

// Example usage
const designTokensJson = fs.readFileSync('./tokens/tokens.json', 'utf8');
const designTokens = JSON.parse(designTokensJson);

const tailwindConfig = convertDesignTokensToTailwind(designTokens);

// Save the Tailwind config to a file
fs.writeFileSync('path/to/tailwind.config.js', `module.exports = ${JSON.stringify(tailwindConfig, null, 2)};`, 'utf8');