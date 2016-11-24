var webpack=require('webpack');
var path=require('path');

module.exports={
	entry:path.join(__dirname,'/src/app/entry.js'),
	output:{
		path:path.join(__dirname,'/tmp/'),
		filename:'bundle.js',
		publicPath:'/',
	},
	module:{
		loaders:[
			{
				test:/\.jsx?$/,
				exclude:/(node_modules|bower_components)/,
				loader:'babel',
				query:{
					presets:['es2015']
				}
			},
			{
				test:/\.(png|jpg|jpeg|gif)$/,
				loader:'file',
				query:{
					name:'app/images/[name]_[hash].[ext]'
				}
			}
		]
	},
	resolve:{
		extensions:['','.js','.jsx','.scss']
	},
	externals:{
		'jquery':'jQuery',
		'react':'React',
		'react-dom':'ReactDOM'
	},
	plugins:[
		new webpack.optimize.UglifyJsPlugin({
			compress:{
				warnings:false
			},
			output:{
				comments:false
			}
		})
	]
}