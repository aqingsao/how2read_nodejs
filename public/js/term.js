$("input.report-right").bind('click', function(){
	var url = $(this).attr("url");
	var body = {isCorrect : "true"};
	// $.post(url, body, function(data) {
	   // alert(data);
	 // });
});

$("input.report-wrong").bind('click', function(){
	var url = $(this).attr("url");
	var body = {isCorrect : ""};
	// $.post(url, body, function(data) {
	   // alert(data);
	 // });
});