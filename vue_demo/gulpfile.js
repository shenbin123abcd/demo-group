var gulp=require('gulp');
var gulpLoadPlugins=require('gulp-load-plugins');
var plugins=gulpLoadPlugins();
var webpack=require('webpack');
var sourcemaps=require('gulp-sourcemaps');
var exec=require('child_process').exec;

gulp.task('sass',function(){
	return gulp.src('./src/css/**/*.scss')
			.pipe(plugins.sass({outputStyle:'compact'}).on('error',plugins.sass.logError))
			.pipe(plugins.autoprefixer({
				browsers:['>0%'],
				cascade:false
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./src/css'));
});

gulp.task('copy:css',['sass'],function(){
	return gulp.src('./src/css/**/*.{css,map}')
			.pipe(gulp.dest('./dist/css'))
});

gulp.task('copy:js',function(){
	return gulp.src('./src/js/*.js')
			.pipe(plugins.cached('myjs'))
			.pipe(plugins.cdnizer({
				defaultCDNBase:'/admin',
				allowRev:true,
				allowMin:true,
				matchers:[
					/("'`)(.+?)("'`)/gi
				],
				fallback:false,
				files:[
					'images/**/*'
				]
			}))
			.pipe(sourcemaps.init())
			.pipe(plugins.babel({
				presets:['latest','stage-2']
			}))
			.on('error',function(e){
				console.error(e)
			})
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dist/js'))
});

gulp.task('copy:view',['copy:css'],function(){
	var htmlFilter=plugins.filter('**/*.html',{retore:"true"});
	return gulp.src('./src/**/*.html')
				.pipe(htmlFilter)
				.pipe(plugins.cdnizer({
					defaultCDNBase:'/admin',
					allowRev:true,
					allowMin:true,
					files:[
						'js/**/*.js',
						'css/**/*.css',
					]
				}))
				.pipe(plugins.cdnizer({
					defaultCDNBase:'/admin',
					allowRev:true,
					allowMin:true,
					relativeRoot:'app',
					files:[
						'js/**/*.js',
						'css/**/*.css'
					]
				}))
				.pipe(gulp.dest('./dist'))
});

gulp.task('webpack:dev',function(cb){
	var webpackConfig=require('./webpack.config.js');
	return webpack(webpackConfig,function(err){
		if(err){
			console.log(err);
		}
		//cb()
	})
});

gulp.task('devServer',function(cb){
	exec('node app.js',function(err){
		if(err){
			console.log(err);
		}
	})
	cb();
});

gulp.task('clean',require('del').bind(null,[
	'.dist/',
	'tmp'
],{force:true}));

gulp.task('dev',['clean'],function(){
	gulp.start('watch:dev')
});

gulp.task('watch:dev',['copy:css','copy:js','copy:view'],function(){
	gulp.watch('./src/css/**/*.scss',['copy:css']);
	gulp.watch('./src/js/**/*.js',['copy:js']);
	gulp.watch('./src/**/*.html',['copy:view']);
	gulp.start('webpack:dev');
})
