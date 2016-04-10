'use strict';
import ora from 'ora'
import gulp from './gulpfile.babel.js'

const LOADING = ora('正在编译...')



export default (() => {
    LOADING.start();


    gulp.start('dev', function(err){
        LOADING.stop();
    });
})()
