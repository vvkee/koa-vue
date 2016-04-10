'use strict';
import        gulp from 'gulp'
import     webpack from 'webpack'

import         del from 'del'
import       gutil from 'gulp-util'
import      rename from 'gulp-rename'
import     nodemon from 'gulp-nodemon'
import runSequence from 'gulp-sequence'

import      eslint from 'gulp-eslint'
import      uglify from 'gulp-uglify'
import      concat from 'gulp-concat'

import webpackConfig from './webpack.config'

import path from 'path'

const server = path.join(process.cwd(), '..', '/src/server')
const client = path.join(process.cwd(), '..', '/src/client')
const assets = path.join(process.cwd(), '..', '/assets')

import task from './task'


/**
 * 默认命令
 * @param  {[type]} 'default' [description]
 * @param  {[type]} (cb       [description]
 * @return {[type]}           [description]
 */
gulp.task('dev', (cb) => {
    runSequence(['server_dev', 'client_dev'], cb)
})


// 后端任务（开发）
task.serverDev({
       gulp: gulp,
    pluging: {
                del: del,
              gutil: gutil,
             eslint: eslint,
            nodemon: nodemon,
        runSequence: runSequence
    },
       path: {
           server: server,
           client: client,
           assets: assets
       }
})

// 前端任务（开发）
task.clientDev({
       gulp: gulp,
    pluging: {
                del: del,
              gutil: gutil,
             rename: rename,
            webpack: webpack,
        runSequence: runSequence
    },
       path: {
           server: server,
           client: client,
           assets: assets
       },
     config: {
         webpackConfig: webpackConfig
     }
})

export default gulp
