$(".newReading").click(function(){
	var newReading = $("#readingsTemplate").html();
	$(".readings").append(newReading);
});