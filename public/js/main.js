$(function(){
	$("div.term").each(function(){
		var id = "term" + $(this).attr('id');
		var rightCount = parseInt($(this).find("label span.right").text());
		var wrongCount = parseInt($(this).find("label span.wrong").text());
		var statsContainer = $(this).find("div.statscontainer");
		statsContainer.empty();
		statsContainer.append("<canvas width=132 height=132 id=" + id + "></canvas>");
		
		$(this).find("label.rate").html("<span>" + _toPercent(wrongCount, rightCount) + "</span>的人读错了：");
		_drawPie(id, parseInt(wrongCount), parseInt(rightCount));
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
			term.find(".vote .result").removeClass("wrong error").addClass("right").val("您读对了").show();
		}
		else{
			term.find(".vote .result").removeClass("right error").addClass("wrong").val("您读错了").show();
		}
		
		var canvas = term.find("canvas");
		var id = term.attr('id');
		$.getJSON("/term/" + id, function(data){
			term.find("label.rate").html("<span>" + _toPercent(data.wrong_count, data.right_count) + "</span>的人读错了：");
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
