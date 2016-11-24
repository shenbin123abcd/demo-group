var webpack=require('webpack');
var path=require('path');

module.exports={
	// entry:[
	// 	path.join(__dirname,'/src/app/entry'),
	// 	path.join(__dirname,'/src/js/app'),
	//],
	entry:path.join(__dirname,'/src/app/entry'),
	output:{
		path:path.join(__dirname,'/dist/js'),
		filename:'bundle.js',
		publicPath:'/dist/js/'
	},
	watch:true,
	module:{
		loaders:[
			{
				//babel-loader babel-core babel-preset-es2015 babel-preset-react
				test:/\.jsx?$/,
				exclude:/(node_modules)/,
				loader:'babel',
				query:{
					presets:['es2015']
				}
			},
			{
				//file-loader
				test:/\.(jpg|png|jpeg|gif)$/,
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
		'react':'React',
		'react-dom':'ReactDom',
		'jquery':'jQuery',
	}
}