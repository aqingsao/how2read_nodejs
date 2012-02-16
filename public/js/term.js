$("input#reportRight").click(function(){
	var url = $("input#reportRight").attr("url");
	$.post(url, function(data) {
	   alert(data);
	 });
});