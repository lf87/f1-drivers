(function() {
    'use strict';
    var fileinclude = require('gulp-file-include'), // Include partials
        gulp = require('gulp'), // Gulp
        scss = require('gulp-sass'), // Libscss Pre-processor
        autoprefixer = require('gulp-autoprefixer'), // Autoprefixes CSS using regular CSS
        jshint = require('gulp-jshint'), // Lint your JS on the fly
        stylish = require('jshint-stylish'), // Style your jshint results
        uglify = require('gulp-uglify'), // JS minification
        imagemin = require('gulp-imagemin'), // Compress Images
        newer = require('gulp-newer'), // A Gulp plugin for passing through only those source files that are newer than corresponding destination files.
        rename = require('gulp-rename'), // Rename files i.e. in this case rename minified files to .min
        replace = require('gulp-replace'), // A string replace plugin for gulp
        concat = require('gulp-concat'), // Merges all files in to 1
        notify = require('gulp-notify'), // Notifications upon task completion
        sourcemaps = require('gulp-sourcemaps'), // Line numbers pointing to your SCSS files
        del = require('del'), // Clean folders of files
        neat = require('node-neat').includePaths, // The Bourbon Neat grid system
        browserSync = require('browser-sync'), // Live reloading
        scsslint = require('gulp-scss-lint'), // SCSS Linting
        cleanCSS = require('gulp-clean-css'), // Replaces css-nano, this will also combine MQs
        fontmin = require('gulp-fontmin'), // Font minification - Also generates CSS
        svgmin = require('gulp-svgmin'), // Optimise SVGs
        reload = browserSync.reload;


    // *********************** //
    // **** Configuration **** //
    // *********************** //

    // potential issues when using the ./ glob pattern

    // File Format
    var fileFormat = 'html',
        fileExt = '.' + fileFormat;

    // Source files
    var src = {
        pages: 'src/components/**/*' + fileExt, // files in here will go in to ./ (by default)
        scss: 'src/styles/*.scss',
        js: 'src/scripts/**/*.js', // - if you change this path, then you'll need to update your .jshintignore file
        img: 'src/images/**/*.{png,jpg,gif}',
        svg: 'src/images/svgs/**/*.svg',
        fonts: 'src/fonts/**/*',
        docs: 'src/docs/**/*',
        favicons: 'src/favicons/**/*'
    };

    // Distribution folders
    var dist = {
        pages: '',
        css: '',
        js: 'dist/assets/js',
        img: 'dist/assets/img',
        svg: 'dist/assets/img/svg',
        fonts: 'dist/assets/fonts',
        docs: 'dist/assets/docs',
        favicons: 'dist/assets/favicons'
    };

    // Miscellaneous paths
    var misc = {
        maps: 'maps', // This is where your CSS and JS sourcemaps go
        reports: 'reports',
        lint: 'src/styles/*/**.scss', // Path of SCSS files that you want to lint
        lintExclude: '!src/styles/vendors/*.scss' // Path of SCSS files that you want to exclude from lint
    };

    // Browser Sync
    gulp.task('browser-sync', function() {
        browserSync.init({
            server: './',
            //proxy: 'proxy.dev',
            files: '*.css' // Injects CSS changes
        });
    });

    // Disable or enable pop up notifications
    var disableNotifications = false;
    if (disableNotifications) {
        process.env.DISABLE_NOTIFIER = true; // Uncomment to disables all notifications
    }

    // Files and folders to clean
    gulp.task('clean', function() {
        del([dist.pages + '*' + fileExt, dist.css + '*.css', dist.js, dist.img, dist.fonts, dist.docs, dist.favicons, misc.maps, misc.reports]);
        return gulp.src('./')
            .pipe(notify({
                message: 'Folders cleaned successfully',
                onLast: true
            }));
    });



    // ********************** //
    // *** Required Tasks *** //
    // ********************** //

    // $ gulp bs-reload - Browser Sync
    gulp.task('bs-reload', function() {
        browserSync.reload();
        return gulp.src(dist.pages + '*' + fileExt);
    });

    // $ gulp scss
    gulp.task('scss', function() {
        return gulp.src(src.scss)
            .pipe(sourcemaps.init())
            .pipe(scss({
                includePaths: [src.scss]
            }))
            .on('error', notify.onError(function(error) {
                return 'An error occurred while compiling scss.\nLook in the console for details.\n' + error;
            }))
            // Comment out the 2 code below to enable exact line number for sourcemaps (workaround for the issue)
            // Remember to re-enable before testing and/or pushing to staging/prod
            // FROM HERE:
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cleanCSS({ debug: true }, function(details) {
                console.log(details.name + ' file size before: ' + details.stats.originalSize + ' bytes');
                console.log(details.name + ' file size after: ' + details.stats.minifiedSize + ' bytes');
            }))
            // TO HERE
            .pipe(sourcemaps.write(misc.maps))
            .pipe(gulp.dest(dist.css));
    });

    // $ gulp scripts
    gulp.task('scripts', function() {
        return gulp.src(src.js)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(sourcemaps.init())
            .pipe(concat('main.js'))
            .pipe(gulp.dest(dist.js))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(uglify())
            .on('error', notify.onError(function(error) {
                return 'An error occurred while compiling JS.\nLook in the console for details.\n' + error;
            }))
            .pipe(sourcemaps.write(misc.maps))
            .pipe(gulp.dest(dist.js))
            .pipe(reload({
                stream: true
            }));
    });

    // $ gulp fileinclude
    gulp.task('fileinclude', function() {
        return gulp.src([src.pages])
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .on('error', notify.onError(function(error) {
                return 'An error occurred while compiling files.\nLook in the console for details.\n' + error;
            }))
            .pipe(rename(function(opt) {
                opt.basename = opt.basename.replace(/_/g, '');
                return opt;
            }))
            .pipe(gulp.dest(dist.pages))
            .pipe(replace(/_/g, ''))
            .pipe(reload({
                stream: true
            }))
    });

    // $ gulp images - Save for web in PS first!
    gulp.task('images', function() {
        return gulp.src(src.img)
            .pipe(newer(dist.img))
            .pipe(imagemin({
                optimizationLevel: 7,
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest(dist.img))
            .pipe(reload({
                stream: true
            }));
    });

    // $ gulp svgs
    gulp.task('svgs', function() {
        return gulp.src(src.svg)
            .pipe(svgmin())
            .pipe(gulp.dest(dist.svg))
            .pipe(reload({
                stream: true
            }));
    });

    // $ gulp fonts
    gulp.task('fonts', function() {
        return gulp.src(src.fonts)
            .pipe(fontmin())
            .pipe(gulp.dest(dist.fonts))
            .pipe(reload({
                stream: true
            }));
    });

    // $ gulp docs
    gulp.task('docs', function() {
        return gulp.src(src.docs)
            .pipe(gulp.dest(dist.docs))
            .pipe(reload({
                stream: true
            }));
    });

    // $ gulp favicons
    gulp.task('favicons', function() {
        return gulp.src(src.favicons)
            .pipe(gulp.dest(dist.favicons))
            .pipe(reload({
                stream: true
            }));
    });

    // $ gulp watch - This is everything that's being watched when you run the default task
    gulp.task('watch', function() {
        gulp.watch(src.pages, ['fileinclude']);
        gulp.watch(src.scss, ['scss']);
        gulp.watch(src.js, ['scripts']);
        gulp.watch(src.img, ['images']);
        gulp.watch(src.svg, ['svgs']);
        gulp.watch(src.fonts, ['fonts']);
        gulp.watch(src.favicons, ['favicons']);
        gulp.watch(src.docs, ['docs']);
        gulp.watch('*' + fileExt);
    });

    // $ build - Runs all the required tasks
    gulp.task('build', ['fileinclude', 'scss', 'scripts', 'images', 'svgs', 'fonts', 'docs', 'favicons']);

    // $ gulp - After running all required tasks, this will launch browser sync and watch for changes
    gulp.task('default', ['build', 'browser-sync', 'watch']);



    // ********************** //
    // ** Secondary Tasks *** //
    // ********************** //



    // $ scss-lint - SCSS Linter
    gulp.task('scss-lint', function() {
        return gulp.src([misc.lint + ', ' + misc.lintExclude])
            .pipe(scsslint({
                'reporterOutputFormat': 'Checkstyle',
                'filePipeOutput': 'scssReport.xml',
                'config': 'scss-lint.yml'
            }))
            .pipe(gulp.dest(misc.reports));
    });
}());
