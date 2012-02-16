$("input.report-right").bind('click', function(){
	var url = $(this).attr("url");
	$.post(url, function(data) {
	   alert(data);
	 });
});