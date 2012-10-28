$(".newReading").click(function(){
	var newReading = $("#readingsTemplate").html();
	$(".readings").append(newReading);
});

$(".isCorrect").live('change', function(){
	$(this).siblings(".isCorrects").val($(this).is(':checked'));
});