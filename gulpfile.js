
require('gulp-easy')(require('gulp'))
    .config({
        less: {
            minifycss: {
                target: './assets',
                relativeTo: './'
            }
        }
    })
    .js('assets/main.js', 'web/assets/main.js')
    .less('assets/less/main.less', 'web/assets/main.css')
    .files('node_modules/bootstrap/fonts/*', 'web/fonts/')