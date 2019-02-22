const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

/**
 * copy assets to lib folder
 */
function copy() {
    return gulp.src(['./src/**/*', '!./**/*.ts'])
        .pipe(gulp.dest('lib'));
}

/**
 * build typescript
 */
function build() {
    return tsProject
        .src()
        .pipe(tsProject())
        .pipe(gulp.dest('lib'));
}

/**
 * clean the lib folder
 */
function cleanBuild() {
    return gulp
        .src('lib/', { allowEmpty: true })
        .pipe(clean({
            force: true
        }));
}

gulp.task('default', gulp.series(cleanBuild, build, copy));