var express=require('express');
var app=express();
var path=require('path');
var port=8080;
var proxy=require('express-http-proxy');

//express反向代理
app.use('/api',proxy('shopapi-test.halobear.cn'));

app.use('/',express.static(path.join(__dirname,'../dist')));

app.get("*",function(req,res,next){
	res.sendFile(path.join(__dirname,'../dist/index.html'));
});

app.listen(port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('server satrt');
	}
})
