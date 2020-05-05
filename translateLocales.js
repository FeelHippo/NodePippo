const path = require('path')
// import package
const translate = require('@feelhippo/translate');
// define the location of the i18n locales
const directory = path.join(__dirname, './locales');

(async () => {
    translate(directory);
    console.log('Translated all Locales');
    
})().catch(err => {
    console.log(err);
})


