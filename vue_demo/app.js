var express=require('express');
var path=require('path');
var proxy=require('express-http-proxy');
var app=express();
var port=8081;

var index=require('./fakeApi/index');
app.get('/api/:id',function(req,res,next){
	var id=req.params.id;
	if(id=='201611'){
		setTimeout(function(){
			res.json(index.sendData11());
		},1300);
	}else if(id=='201612'){
		setTimeout(function(){
			res.json(index.sendData12());
		},1300);
	}else if(id=='201701'){
		setTimeout(function(){
			res.json(index.sendData11());
		},1300);
	}else{
		setTimeout(function(){
			res.json(index.sendData12());
		},1300);
	}
})


app.use('/admin',express.static(path.join(__dirname,'./dist')));
//app.use('/api',proxy('shopapi.halobear.cn'));

app.get('/admin*',function(req,res,next){
	res.sendFile(path.join(__dirname,'./dist/index.html'));
});



app.listen(port,function(err){
	if(err){
		console.log(err)
	}else{
		console.log('sever satrt');
	}
})
