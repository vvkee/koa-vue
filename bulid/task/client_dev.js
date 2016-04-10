export default (_opt) => {
    let gulp = _opt.gulp

    let         del = _opt.pluging.del,
              gutil = _opt.pluging.gutil,
            webpack = _opt.pluging.webpack,
             rename = _opt.pluging.rename,
        runSequence = _opt.pluging.runSequence

    let webpackConfig = _opt.config.webpackConfig

    const server = _opt.path.server
    const client = _opt.path.client
    const assets = _opt.path.assets

    gulp.task('client_dev', (cb) => {
        runSequence('client_del', ['copy_html', 'copy_img', 'webpack_dev'], 'client_watch', cb)
    });

    /**
     * webpack任务
     * @param  {[type]} 'webpack_dev' [description]
     * @param  {[type]} (             [description]
     * @return {[type]}               [description]
     */
    gulp.task('webpack_dev', () => {

        webpack(webpackConfig, (err, stats) => {
            if(err) throw new gutil.PlugingError('webpack', err)
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n')
        })
    })

    /**
     * 清空静态文件
     * @param  {[type]} 'client_dev' [description]
     * @param  {[type]} (            [description]
     * @return {[type]}              [description]
     */
    gulp.task('client_del', () => {
        del([assets + '/public/img/**/*'])
        del([assets + '/public/css/**/*'])
        del([assets + '/public/js/**/*'])
        del([assets + '/public/font/**/*'])
        del([assets + '/views/pages/**/*'])
    })

    // html任务
    gulp.task('copy_html', () => {
        return gulp.src(client + '/**/pages/**/*.html')
                   .pipe(rename((file_path) => {
                       file_path.dirname = file_path.dirname.replace(/\/pages/, '');
                   }))
                   .pipe(gulp.dest(assets + '/views/pages'))
    })
    // html任务
    gulp.task('copy_img', () => {
        return gulp.src(client + '/**/static/image/**/*')
                   .pipe(rename((file_path) => {
                       file_path.dirname = file_path.dirname.replace(/\/static\/image/, '');
                   }))
                   .pipe(gulp.dest(assets + '/public/img'))
    })


    gulp.task('client_watch', () => {
        gulp.watch(client + '/**/pages/**/*.html', ['copy_html'])
        gulp.watch(client + '/**/static/**/*', ['webpack_dev'])
        gulp.watch(client + '/**/widget/**/*', ['webpack_dev'])
        gulp.watch(client + '/**/module/**/*', ['webpack_dev'])
        gulp.watch(client + '/**/static/image/**/*', ['copy_img'])
    })
}
