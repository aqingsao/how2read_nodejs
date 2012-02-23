$(function(){
	$("div.term").each(function(){
		var img = $(this).find("img.stats");
		var rightCount = parseInt(img.attr('right'));
		var wrongCount = parseInt(img.attr('wrong'));

		$(this).find("label.rate span").text(_toPercent(wrongCount, rightCount));
		img.detach();		
		var id = "term" + $(this).attr('id');
		$("#" + id).show();
		_drawPie(id, wrongCount, rightCount);
	});
		
	$(".speaker").click(function(){
		$(this).find("audio").get(0).play();
	});
	
	$("div.term .vote form").submit(function(){
		var term = $(this).parents("div.term")
		var that = $(this);
		$.post(that.attr('action'), that.serialize(), function(){
			_updateTerm(term, that.find("input[name='isCorrect']").val());
		}).error(function(data){
			term.find(".vote .result").removeClass("right wrong error").addClass("error").val("对不起，投票出现错误");
		});
		
		return false;
	});
	function _updateTerm(term, voteResult){
		term.find(".vote input[type='submit']").hide();
		if(voteResult == 'true'){
			term.find(".vote").append("<input class='result right' disabled='disabled' value='您读对了'></input>");
		}
		else{
			term.find(".vote").append("<input class='result wrong' disabled='disabled' value='您读错了'></input>");
		}
		
		var canvas = term.find("canvas");
		var id = term.attr('id');
		$.getJSON("/term/" + id, function(data){
			term.find("label.rate span").text(_toPercent(data.wrong_count, data.right_count));
			_drawPie(canvas.attr("id"), parseInt(data.wrong_count), parseInt(data.right_count));
		});
	}
	function _toPercent(wrongCount, rightCount){
		return Math.round(wrongCount/(rightCount + wrongCount)*10000)/100.00+"%";
	}
	function _drawPie(id, wrongCount, rightCount){
		var total = Math.max(wrongCount + rightCount, 1);
		
		var pie2 = new RGraph.Pie(id, [wrongCount, rightCount]); // Create the pie object
		pie2.Set('chart.gutter.left', 10);
		pie2.Set('chart.gutter.right', 10);
		pie2.Set('chart.gutter.top', 25);
		pie2.Set('chart.gutter.bottom', 10);
		pie2.Set('chart.colors', ['#FFAA52', '#3E6D8E']);
		pie2.Set('chart.strokestyle', 'white');
		pie2.Set('chart.linewidth', 3);
		pie2.Set('chart.shadow', true);
		pie2.Set('chart.shadow.offsetx', 0);
		pie2.Set('chart.shadow.offsety', 0);
		pie2.Set('chart.shadow.blur', 25);
		pie2.Set('chart.tooltips', [wrongCount + " wrong", rightCount + " right"]);
		pie2.Set('chart.tooltips.event', 'onmousemove');
		pie2.Set('chart.title', total + ' votes');
		pie2.Set('chart.title.bold', false);
		
		RGraph.Clear(pie2.canvas);
		pie2.Draw();
	}
});
function getRate(wrongCount, rightCount){
	var total = wrongCount + rightCount;
	return Math.round(wrongCount/total*10000)/100.00+"%";
}
