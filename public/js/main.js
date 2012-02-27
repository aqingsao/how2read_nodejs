var jiathis_config = {
    title:"程序员最容易读错的单词：",
	siteNum:5, 
	sm:"tqq, renren, kaixin001, douban, tsina", 
    ralateuid:{
        "tsina":"1566959347"
    }
};

$(function(){
	var termPattern = /term(\d+)/;
	$("div.term").each(function(){
		var img = $(this).find("img.stats");
		var rightCount = parseInt(img.attr('right'));
		var wrongCount = parseInt(img.attr('wrong'));

		$(this).find("label.rate span").text(_toPercent(wrongCount, rightCount));
		
		var id = "canvas" + $(this).attr('id').match(termPattern)[1];
		_drawPie(id, wrongCount, rightCount);

		img.detach();		
		$("#" + id).show();
	});
	$(".term .votable").mouseenter(function(){
		$(this).find("audio").get(0).play();
	});
	$(".term .selected.right").mouseenter(function(){
		$(this).find("span").text("[" + $(this).attr("symbol") + "]");
	}).mouseleave(function(){
		$(this).find("span").text("您读对了");
	});
	$(".term .selected.wrong").mouseenter(function(){
		$(this).find("span").text("[" + $(this).attr("symbol") + "]");
	}).mouseleave(function(){
		$(this).find("span").text("您读错了");
	});
		
	$(".term .votable").click(function(){
		var vote = $(this).parents("div.vote");
		if(vote.hasClass('voted')){
			return;
		}
		
		var that = $(this);
		var term = $(this).parents("div.term");
		var tid = term.attr('id').match(termPattern)[1], rid = $(this).attr('reading');

		vote.removeClass("notVoted").addClass("voted");
		
		$.post('/term/' + tid + '/reading/' + rid, function(data){
			_updateTerm(term, rid, data);
		}).error(function(data){
			vote.removeClass('voted').addClass("notVoted");
		});
	});
	
	$(".share a").click(function(){
		var term = $(this).parents('div.term');
		var word = term.find(".summary h2").text();
		var rate = term.find(".summary .rate span").text();
		jiathis_config.summary = word + "，据统计，" + rate + "的人读错了这个单词，你呢？";
		jiathis_config.url = "http://how2read.me#"+word;
	});
});
function _toPercent(wrong, right){
	var total = Math.max(wrong + right, 1);
	return Math.round(wrong/total*10000)/100.00+"%";
}
function _getReading(rid, readings){
	for(var i in readings){
		if(rid == readings[i].id){
			return readings[i];
		}
	}
	return {};
}
function _updateTerm(term, voted, data){	
	term.find(".votable").each(function(){
		var rid = $(this).attr("reading");
		var reading = _getReading(rid, data.readings);
		if(rid == voted){
			$(this).addClass("selected");
			if(reading['correct'] == 'true'){
				$(this).attr("symbol", reading['symbol']);
				$(this).find("span").text("您读对了");
			}
			else{
				$(this).attr("symbol", reading['symbol']);
				$(this).find("span").text("您读错了");
			}
		}
		if(reading['correct'] == 'true'){
			$(this).addClass("right");
		}
		else{
			$(this).addClass("wrong");
		}
		
	});
	
	term.find("label.rate span").text(_toPercent(data.wrong, data.right));
	_drawPie(term.find("canvas").attr("id"), parseInt(data.wrong), parseInt(data.right));
}
function _drawPie(id, wrongCount, rightCount){
	var total = Math.max(wrongCount + rightCount, 1);
	
	var pie2 = new RGraph.Pie(id, [wrongCount, rightCount]); // Create the pie object
	pie2.Set('chart.gutter.left', 20);
	pie2.Set('chart.gutter.right', 20);
	pie2.Set('chart.gutter.top', 35);
	pie2.Set('chart.gutter.bottom', 20);
	pie2.Set('chart.colors', ['#FFAA52', '#3E6D8E']);
	pie2.Set('chart.strokestyle', 'white');
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
};

