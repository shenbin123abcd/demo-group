var config={};

config.route=function(app){
	app.use('/',require('./routes/index'));
	app.use('/case',require('./routes/case'));
	app.use('/company',require('./routes/company'));
}

module.exports=config;