import StyleDictionaryModule from 'style-dictionary';
import {tailwindFormat, daisyFormat} from './formatter.js';

StyleDictionaryModule.registerFormat({
    name: 'tailwind',
    formatter: ({dictionary}) => tailwindFormat({dictionary, isVariables: false})
});

StyleDictionaryModule.registerFormat({
    name: 'daisy',
    formatter: ({dictionary}) => daisyFormat({dictionary})
});

StyleDictionaryModule.registerTransform({
    type: `name`,
    name: `themeTransform`,
    transformer: (token) => {
        return `${token.filePath} ${token.name}`;
    }
})

StyleDictionaryModule.extend(
    {
        source: ['tokens/*-colors.json'],
        platforms: {
            'tailwind': {
                transforms: ['attribute/cti', 'name/cti/kebab'],
                buildPath: 'build/tailwind/',
                files: [
                    {
                        destination: 'colors.tailwind.js',
                        format: 'tailwind'
                    }]
            }
        }
    }
).buildAllPlatforms();

['eca-light', 'eca-dark'].map( (theme)  => {

    StyleDictionaryModule.extend(
        {
            include: ['tokens/*-colors.json', 'tokens/tailwind.json'],
            source: [`tokens/${theme}.json`],
            platforms: {
                'daisy': {
                    transforms: ['attribute/cti', 'name/cti/kebab'],
                    buildPath: 'build/tailwind/',
                    files: [
                        {
                            destination: `${theme}.tailwind.js`,
                            format: 'daisy',
                            filter: {
                                "isSource": true
                            }
                        }]
                }
            }
        }
    ).buildAllPlatforms();
});
