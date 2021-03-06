const i18n = require('i18n');
const path = require('path');

module.exports = function() {
    i18n.configure({
        locales: [
            'en',
            'es',
            'it'
        ],
        cookie: 'nodeapi-locale',
        directory: path.join(__dirname, '..', 'locales'),
        autoReload: true, // automatically reload the dictionaries as they are updated
        syncFiles: false, //create literals in all available locales as one of them is updated
        defaultLocale: 'en',
    });

    // set a default language in the global scripts
    // i18n.setLocale('en');
    return i18n;
}