module.exports = {
    workers: 2,
    application: {
        language: 'en',
        sourceLanguage: 'ru',
        components: {
            urlManager: {
                rules: {
                    '': 'site/index',
                    'guide': 'site/guide',
                    'guide/<page>': 'site/guide',
                    'development': 'site/development',
                    'development/<page>': 'site/development',
                    'contact': 'site/contact'
                }
            },
            http: {
                staticDirs: __dirname + '/../web/'
            },
            view: {}
        }
    }
};