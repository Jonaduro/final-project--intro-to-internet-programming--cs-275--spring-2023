const { src, dest, series, watch } = require(`gulp`),
    babel = require(`gulp-babel`),
    htmlValidator = require(`gulp-htmlmin`),
    jsCompressor = require(`gulp-uglify`),
    jsValidator = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    cssValidator = require(`gulp-clean-css`),
    reload = browserSync.reload;

let browserChoice = `default`;

async function chrome () {
    browserChoice = `chrome`;
}

let validateHTML = () => {
    return src([
        `download/dev/html/*.html`,
        `download/dev/html/**/*.html`])
        .pipe(htmlValidator(undefined));
};

let validateCSS = () => {
    return src([
        `download/dev/css/*.css`,
        `download/dev/css/**/*.css`])
        .pipe(cssValidator(undefined));
};

let validateJS = () => {
    return src([
        `download/dev/js/*.js`,
        `download/dev/js/**/*.js`])
        .pipe(jsValidator())
        .pipe(jsValidator.formatEach(`compact`));
};

let compressHTML = () => {
    return src([`dev/html/*.html`,`dev/html/**/*.html`])
        .pipe(htmlValidator({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compressCSS = () => {
    return src([`dev/css/*.css`,`dev/css/**/*.css`])
        .pipe(htmlValidator({collapseWhitespace: true}))
        .pipe(dest(`prod/css`));
};

let transpileJSForDev = () => {
    return src(`dev/scripts/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

let transpileJSForProd = () => {
    return src(`dev/scripts/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/scripts`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `dev`,
                `dev/html`
            ]
        }
    });

    watch(`dev/html/*.html`, validateHTML).on(`change`, reload);
    watch(`dev/css/*.css`, validateCSS).on(`change`, reload);
    watch(`dev/js/*.js`, series(validateJS, transpileJSForDev)).on(`change`, reload);
};

exports.chrome = series(chrome, serve);
exports.validateHTML = validateHTML;
exports.validateCSS = validateCSS;
exports.validateJS = validateJS;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.serve = series(
    validateHTML,
    validateCSS,
    validateJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    compressCSS,
    transpileJSForProd
);
