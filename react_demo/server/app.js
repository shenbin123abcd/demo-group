var express=new require('express');
var app=express();
var path=require('path');
var port=8080;

app.use('/dist',express.static(path.join(__dirname,'../dist')));

app.get('*',function(req,res,next){
	res.sendFile(path.join(__dirname,'../dist/index.html'));
});

app.listen(8080,function(err){
	if(err){
		console.log(err)
	}else{
		console.log('server start');
	}
})