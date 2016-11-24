var express = require('express');
var router = express.Router();

/* GET case listing. */
router.get('/', function(req, res, next) {
	var data={
		title:'case',
		name:'shenbin',
		age:26,
	}
	res.render('case',{data:data});
});

//case/:id
router.get('/detail/:id',function(req,res,next){
	var id=parseInt(req.params.id);
	var data={}
	if(id<=0 || isNaN(id)){
		console.log(id);
		res.status(404);
		next();
	}else{
		data={
			id:id
		}
		res.render('caseDetail',{data:data});
	}

})

module.exports = router;
