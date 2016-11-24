var gulp=require('gulp');
var gulpLoadPlugins=require('gulp-load-plugins');
var plugins=gulpLoadPlugins();
var sourcemaps=require('gulp-sourcemaps');
var webpack=require('webpack');
var exec=require('child_process').exec;



// 开发模式
gulp.task('sass',function(){
	return gulp.src('./src/css/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(plugins.sass({outputStyle:'compact'}).on('error',plugins.sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/css/'))
});
gulp.task('copy:css',['sass'],function(){
	return gulp.src('./src/css/**/*.{css,map}')
			.pipe(gulp.dest('./dist/css'));

});
gulp.task('copy:view',function(){
	var htmlFilter=plugins.filter('**/*.html',{restore:true});
	return gulp.src('./src/**/*.html')
			.pipe(htmlFilter)
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/dist',
				allowRev:true,
				allowMin:true,
				files:[
					'js/**/*.js',
					'css/**/*.css',
				]
			}))
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/dist',
				allowRev:true,
				allowMin:true,
				relativeRoot:'app',
				files:[
					'js/**/*.js',
					'css/**/*.css'
				]
			}))
			.pipe(gulp.dest('./dist'));
});
gulp.task('copy:js',function(){
	return gulp.src('./src/js/*.js')
			.pipe(plugins.cached('myjs'))
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/dist',
				allowRev:true,
				allowMin:true,
				matchers:[
					/(["'`])(.+?)(["'`])/gi
				],
				fallback:false,
				files:[
					'/images/**/*'
				]
			}))
			.pipe(plugins.babel({
				presets:['es2015']
			}))
			.on('error',function(e){
				console.log(e);
				this.emit('end')
			})
			.pipe(gulp.dest('./dist/js'));
});


gulp.task('webpack:dev',function(cb){
	var webpackConfig=require('./webpack.config.dev.js');
	return webpack(webpackConfig,function(error,stats){
		if(error){
			console.log(error)
		}
	})
});

gulp.task('images:dev',function(){
	return gulp.src('./src/images/**/*.{jpg,png,svg,mp3,mp4,gif}')
			.pipe(gulp.dest('./dist/images'));
});

gulp.task('devServer',function(cb){
	exec('node server/app.js',function(err){

	});
	cb();
});

gulp.task('clean',require('del').bind(null,[
	'./dist/*',
	'tmp'
],{force:true}));

gulp.task('dev',['clean'],function(){
	gulp.start('watch:dev');
});

gulp.task('watch:dev',['copy:css','copy:view','copy:js','images:dev','devServer'],function(){
	gulp.watch('./src/css/**/*.scss',['copy:css']);
	gulp.watch('./src/**/*.html',['copy:view']);
	gulp.watch("./src/js/*.js",['copy:js']);
	gulp.watch('./src/images/**/*.*',['images:dev']);
	gulp.start('webpack:dev')
});



//build 上线

gulp.task('webpack',function(cb){
	var webpackConfig=require('./webpack.config.js');
	return webpack(webpackConfig,function(err){
		if(err){
			console.log(err)
		}
		cb();
	})
});

gulp.task('webpackWidthImages',['webpack'],function(){
	return gulp.src('./tmp/app/**/*.{jpg,png,jpeg,svg,mp3,mp4}')
			  .pipe(gulp.dest('./dist/app'))
});

gulp.task('webpackWidthJs',['webpack'],function(){
	return gulp.src('./tmp/bundle.js')
			.pipe(gulp.dest('./src/js'))
})

gulp.task('server',function(cb){
	exec('node server/app.build.js',function(err){

	});
	cb();
});

gulp.task('images',function(){
	return gulp.src('./src/images/**/*.{png,gif,jpg,svg,mp3,mp4}')
			.pipe(plugins.rev())
			.pipe(gulp.dest('./dist/images'))
			.pipe(plugins.rev.manifest())
			.pipe(gulp.dest('./tmp/images'))
});

gulp.task('build',['sass','images','webpackWidthImages','webpackWidthJs','server'],function(){
	var htmlFilter=plugins.filter('**/*.html',{restore:true});
	var jsFilter=plugins.filter('**/*.js',{restore:true});
	var cssFilter=plugins.filter('**/*.css',{restore:true});

	var manifestHtml=gulp.src('./tmp/images/rev-manifest.json');
	var manifestJs=gulp.src('./tmp/images/rev-manifest.json');
	var manifestCss=gulp.src('./tmp/images/rev-manifest.json');

	return gulp.src('./src/index.html')
			.pipe(plugins.useref())
			.pipe(jsFilter)
			.pipe(plugins.revReplace({manifest:manifestJs}))
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/',
				allowRev:true,
				allowMin:true,
				matchers:[
					/(['"`])(.+?)(['"`])/gi
				],
				fallback:false,
				files:[
					'/images/**/*',
				]
			}))
			.pipe(plugins.rev())
			.pipe(plugins.babel({
				presets:['es2015']
			}))
			.pipe(plugins.uglify())
			.pipe(gulp.dest('./dist'))
			.pipe(jsFilter.restore)


			.pipe(cssFilter)
			.pipe(plugins.revReplace({manifest:manifestCss}))
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/',
				allowrev:true,
				allowMin:true,
				relativeRoot:'css',
				files:[
					'images/**/*.{jpg,png,mp3,mp4}'
				],
			}))
			.pipe(plugins.autoprefixer({
				bowsers:['>0%'],
				cached:false,
			}))
			.pipe(plugins.csso())
			.pipe(plugins.rev())
			.pipe(gulp.dest('./dist'))
			.pipe(cssFilter.restore)
			.pipe(plugins.revReplace({
				replaceInExtensions:['.js','.css','.html','.ejs']
			}))


			.pipe(htmlFilter)
			.pipe(plugins.revReplace({manifest:manifestHtml}))
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/',
				allowRev:true,
				allowMin:true,
				files:[
					'css/**/*.css',
					'js/**/*.js'
				]
			}))
			.pipe(plugins.htmlmin({
				removeComments:true,
				collapseWhitespace:true,
				conservativeCollapse:true,
				minifyJS:false,
				minfyCSS:false,
			}))
			.pipe(gulp.dest('./dist'))
			.pipe(htmlFilter.restore)

});






