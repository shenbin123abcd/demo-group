app.index=(function(){
	'use strict';
	var consolel=function(){
		console.log('index');
		console.log($);
	}
	return{
		consolel:consolel
	}
}());

// module.exports={
// 	consolel(){
// 		console.log('index');
// 		console.log($);
// 	}
// }