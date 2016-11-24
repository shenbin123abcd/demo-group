var express = require('express');
var router = express.Router();
var _=require('lodash/object');

/* GET home page. */
router.get('/', function(req, res, next) {
	var data={
			name:'shenbin',
			age:26,
			job:'web',
			arr:[
				{
					name:'1',
					age:25,
					job:2,
				},
				{
					name:"2",
					age:28,
					job:3,
				},
				{
					name:"3",
					age:28,
					job:4,
				}
			],
			arr2:[
				{
					g:'沈斌23',
				},
				{
					g:'沈伟23'
				}
			],
	}
	var data2,allData={};
	if(req.query && req.query.id && req.query.name){
		data2={
			id:req.query.id,
			name:req.query.name
		}
		allData=_.assign(data,data2);
	}else{
		allData=data;
	}
	console.log(req.query);
	res.render('index',{data:allData});
});

module.exports = router;
