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
		
	$(".term .votable").click(function(){
		if($(this).hasClass('voted')){
			return;
		}
		
		var that = $(this);
		var term = $(this).parents("div.term");
		var tid = term.attr('id').match(termPattern)[1], rid = $(this).attr('reading');

		term.find(".votable").each(function(){
			$(this).addClass("voted");
		});
		
		$.post('/term/' + tid + '/reading/' + rid, function(data){
			_updateTerm(term, rid, data);
		}).error(function(data){
			term.find(".votable").each(function(){
				$(this).removeClass('voted');
			});
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
function _isCorrect(reading, readings){
	for(var i in readings){
		if(reading == readings[i].id){
			return readings[i]['correct'] == 'true';
		}
	}
	return false;
}
function _updateTerm(term, voted, data){	
	for(var i in data.readings){
		if(data.readings[i].id == voted){
			if(data.readings[i].correct == 'true'){
				// $("<a class='right'>您读对了</a>").insertAfter(term.find('label.rate'));
			}
			else{
				// $("<a class='wrong'>您读错了</a>").insertAfter(term.find('label.rate'));
			}
		}
	}
	
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

