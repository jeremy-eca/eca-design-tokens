const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

registerTransforms(StyleDictionary);

const sd = StyleDictionary.extend({
    source: ['tokens/*.json'],
    platforms: {
        css: {
            transformGroup: 'tokens-studio',
            buildPath: 'build/css/',
            files: [
                {
                    destination: 'variables.css',
                    format: 'css/variables'
                }
            ]
        },
    },
});



sd.cleanAllPlatforms();
sd.buildAllPlatforms();