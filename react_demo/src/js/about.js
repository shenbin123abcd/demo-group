app.about=(function(){
	var about=function(){
		console.log('about');
	}
	var changeImg=function(){
		$("#aboutImg").attr('src','/images/pic2.jpg');
	}
	return{
		about:about,
		changeImg:changeImg
	}
}());

// module.exports={
// 	about(){
// 		console.log('about');
// 	},
// 	hangeImg(){
// 		$("#aboutImg").attr('src','/images/pic1.png');
// 	}
// }