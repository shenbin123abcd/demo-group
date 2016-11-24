var express=require('express');
var app=express();
var proxy=require('express-http-proxy');
var path=require('path');

var port=8080;

app.use('/',express.static(path.join(__dirname,'../dist')));
app.get("*",function(req,res){
	res.sendFile(path.join(__dirname,"../dist/index.html"))
});

app.listen(port,function(){
	console.log('server start');
})
