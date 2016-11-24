var gulp=require('gulp');
var gulpLoadPlugins=require('gulp-load-plugins');//帮助加载package.json文件中的插件
var plugins=gulpLoadPlugins();
var sourcemaps=require('gulp-sourcemaps');
var devip=require('dev-ip');
var exec=require('child_process').exec;

/*处理css*/
gulp.task('sass',function(){
	//gulp-sass gulp-sourcemaps gulp-load-plugins
	//编译sass
	return gulp.src(['./src/css/*.scss'])
	.pipe(sourcemaps.init())
		.pipe(plugins.sass({
			outputStyle:'compact'
		}).on('error',plugins.sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/css'));
});

gulp.task('copy:css',['sass'],function(){
	//copy css到dist目录中
	return gulp.src('./src/css/**/*.{css,map}')
		.pipe(gulp.dest('./dist/css'));
});

/*处理js*/
gulp.task('copy:js',function(){
	//gulp-cached 增量编译
	//gulp-cdnizer 在js文件中的图片加上'/dist'路径
	//编译es6,react--->babel-cli babel-core babel-preset-es2015 babel-loader babel-preset-react gulp-babel
	return gulp.src('./src/js/*.js')
		.pipe(plugins.cached('myjs'))
		.pipe(plugins.cdnizer({
			defaultCDNBase:'/dist',
			allowRev:true,
			allowRev:true,
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
			console.error(e);
			this.emit('end');
		})
		.pipe(gulp.dest('./dist/js'));
});

/*处理图片*/
gulp.task('images',function(){
	//gulp-rev 根据静态资源生成md5签名，同时生成json文件保存对应的路径关系
	return gulp.src('./src/images/**/*.{png,gif,jpg,jpeg,svg,mp3,mp4}')
		.pipe(plugins.rev())
		.pipe(gulp.dest("./dist/images"))
		.pipe(plugins.rev.manifest())
		.pipe(gulp.dest('tmp/images'))
})
/*生产环境下处理图片*/
gulp.task('images:dev',function(){
	return gulp.src('./src/images/**/*.{png,gif,jpg,svg,mp3,mp4}')
		.pipe(gulp.dest("./dist/images"))
})

/*处理html*/
gulp.task('copy:view',['copy:css'],function(){
	var htmlFilter=plugins.filter('**/*.html',{restore:true});
	//gulp-filter 过滤文件
	return gulp.src('./src/**/*.html')
			//.pipe(htmlFilter)
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
})

/*清除dist中的文件*/
//del 删除指定文件夹中的文件
gulp.task('clean',require('del').bind(null,[
	'./dist/*',
	'tmp',
]));


/*
** 开发环境
**
*/

/*开发环境*/
gulp.task('dev',['clean'],function(){
	gulp.start('watch:dev');
});

/*开发环境监听文件变化*/
gulp.task('watch:dev',['copy:view','copy:css','copy:js','images:dev','devServer'],function(){
	//gulp-open 自动打开浏览器
	//dev-ip 拿到开发环境下ip地址
	gulp.watch('./src/css/**/*.scss','copy:css');
	gulp.watch('./src/js/**/*.js','copy:js');
	gulp.watch('./src/**/*.html','copy:view');
	gulp.watch('./src/images/**/*.*','images:dev');
	gulp.src(__filename)
		.pipe(plugins.open({
			uri:`http://${devip()[0]}:8080`
		}))
		.pipe(htmlFilter.restore)
});

/*开发环境开启后端服务*/
gulp.task('devServer',function(callback){
	//gulp-exec
	exec('node devServer/server.dev.js',function(err,stdout,stderr){
		console.log(stdout);
		console.log(stderr);
	});
	callback();
});



/*
** 生产环境
**
*/

/*生产环境*/
gulp.task('default',['clean'],function(){
	gulp.start('build');
});

/*启动webpack文件编译react*/
gulp.task('webpack',function(callback){
	var webpackConfig=require('./webpack.config.js');
	return webpack(webpackConfig,function(err,stats){

	});
	callback();
});

/*webpack编译后处理图片*/
gulp.task('webpackWithImage',['webpack'],function(){
	return gulp.src('tmp/app/**/*.{png,gif,jpg,svg,mp3,mp4}')
			.pipe(gulp.dest('./dist/app'));
});

/*webpack编译后处理js*/
gulp.task('webpackWithJs',['webpack'],function(){
	return gulp.src('tmp/bundle.js')
			.pipe(gulp.dest('./src/js'));
});

/*生产环境开启后端服务*/
gulp.task('distServer',function(cb){
	exec('node devServer/server.js',function(){

	});
	cb();
})


/*生产环境build*/
gulp.task('build',['sass','images','webpackWithImage','webpackWithJs','distServer'],function(){
	//类似glob浏览所有的html,css,js文件
	var htmlFilter=plugins.filter('**/*.html',{restore:true});
	var jsFilter=plugins.filter("**/*.js",{restore:true});
	var cssFilter=plugins.filter("**/*.css",{restore:true});

	//html,css,js中对应家了md5戳的图片
	var manifestHtml=gulp.src('tmp/images/rev-manifest.json');
	var manifestCss=gulp.src('tmp/images/rev-manifest.json');
	var manifestJs=gulp.src('tmp/images/rev-manifest.json');

	return gulp.src('src/index.html')
		//gulp-useref 将html中引用的模块合并并传过来
		/*
			<!--build:js js/bundle.js-->
				<script>...</script>
			<!---endbuild->
		*/	

		//处理js
		.pipe(plugins.useref())
		.pipe(jsFilter)
		//gulp-rev-replace 替换引用的加了md5后缀的文件名
		//js中引用的图片更换名字
		.pipe(plugins.revReplace({manifest:manifestJs}))
		.pipe(plugins.cdnizer({
			defaultCDNBase:'',
			allowRev:true,
			allowMin:true,
			matchers:[
				/(["'`])(.+?)(["'`])/gi,
			],
			fallback:false,
			files:[
				'/images/**/*'
			]
		}))
		//给js文件名生成md5戳
		.pipe(plugins.rev())
		.pipe(plugins.babel({
			presets:['es2015']
		}))
		//gulp-uglify 压缩js文件
		.pipe(plugins.uglify())
		.pipe(gulp.dest('./dist'))
		.pipe(jsFilter.restore)

		//处理css
		.pipe(cssFilter)
		.pipe(plugins.revReplace({manifest:manifestCss}))
		.pipe(plugins.cdnizer({
			defaultCDNBase:'',
			allowRev:true,
			allowRev:true,
			relativeRoot:'css',
			files:[
				'images/**/*.{jpg,png,mp3,mp4}',

			]
		}))
		//gulp-autoprefixer 自动添加浏览器前缀
		.pipe(plugins.autofixer({
			browsers:['>0%'],
			cascade:false
		}))
		//gulp-csso css压缩合并
		.pipe(plugins.csso())
		.pipe(plugins.rev())
		.pipe(gulp.dest('./dist'))
		.pipe(cssFilter.restore)

		//给html中引入的.js,.css,.html的文件换成加戳的文件名
		.pipe(plugins.revReplace({
			replaceInExtensions:['.js','.css','.html','.ejs']
		}))

		//处理html
		.pipe(htmlFilter)
		//html中的图片换加了md5戳的名字
		.pipe(plugins.revReplace({manifest:manifestHtml}))
		.pipe(plugins.cdnizer({
			defaultCDNBase:'',
			allowRev:true,
			allowMin:true,
			files:[
				'css/**/*.css',
				'js/**/*.js'
			]
		}))
		//gulp-htmlmin 压缩html
		.pipe(plugins.htmlmin({
			removeComments:true,
			collapseWhitespace:true,
			conservativeFragments:'',
			minifyJS:false,
			minifyCss:false,
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(htmlFilter.restore)


})











