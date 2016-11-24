var webpack=require('webpack');
var HtmlWebpackPlugin=require('html-webpack-plugin');//html文件中引入js文件
var EXtractTextPlugin=require('extract-text-webpack-plugin');//js中的样式文件分离出来
var CleanWebpackPlugin=require('clean-webpack-plugin');//清空打包文件夹
var LiveReloadPlugin=require('webpack-livereload-plugin');//浏览器自动刷新

var uglifyJsPlugin=webpack.optimize.UglifyJsPlugin;//压缩js;
var CommonsChunkPlugin=webpack.optimize.CommonsChunkPlugin;//提取js公共部分;



module.exports={
	// entry:{
	// 	app:__dirname+'/src/scripts/app.js',
	// 	index:__dirname+'/src/scripts/index.js',
	// },
	entry:__dirname+'/src/scripts/app.js',
	// entry:[
	// 	__dirname+'/src/scripts/app.js',
	// 	__dirname+'/src/scripts/index.js'
	// ]
	output:{
		path:__dirname+'/build',
		filename:"scripts/[name]-[chunkhash:5].js",
	},
	resolve:{
		extensions:['','.js','.es','.scss']
	},
	watch:true,
	devtool:'source-map',
	module:{
		//编译scss文件，需要装style-loader,css-loader,scss-loader
		loaders:[{
			test:/\.scss$/i,
			loader:EXtractTextPlugin.extract('style-loader','css-loader!sass-loader'),
		},{
			//babel
			test:/\.js$/,
			loader:'babel',
			exclude:/node_module/
		}]
	},
	babel:{
		presets:['es2015','stage-3'],
		plugins:['transform-runtime'],
	},
	externals:{

	},
	plugins:[
		new CleanWebpackPlugin(['dist','build'],{
			verbase:true,
			dry:false,
		}),

		//提取js公共部分
		new CommonsChunkPlugin({
			name:'vendor',
			minify:{
				collapseWhitespace:true
			},
			filename:'scripts/[name]-[chunkhash:5].bundle.js'
		}),

		//index.html中插入引入压缩好的js
		new HtmlWebpackPlugin({
			filename:'index.html',
			template:__dirname+'/src/index.html',
			//压缩html
			minify:{
				removeCommets:true,
				collapseWhitespace:true,
			}
		}),

		//样式文件分离出js中
		new EXtractTextPlugin('stylesheets/[name]-[chunkhash:5].css'),


		//压缩js代码
		new uglifyJsPlugin({
			compress:{
				warnings:false,
			}
		})
	]
}