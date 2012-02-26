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
		
	$(".term .votable").each(function(){
		if($(this).hasClass('voted')){
			return;
		}
		
		var tid = $(this).parents("div.term").attr('id').match(termPattern)[1], rid = $(this).attr('reading');
		var voting = $("<a class='voting' href='#' onclick='_vote(this); return false;' tid='" + tid + "' rid='" + rid + "'>我就是这么读的</a>")[0];
		$(this).poshytip({
			className: 'tip-darkgray',
			bgImageFrameSize: 9, 
			showTimeout: 500,
			alignTo: 'target',
			alignX: 'center',
			alignY: 'bottom', 
			offsetY: -5,
			content: voting
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
function getRate(wrongCount, rightCount){
	var total = wrongCount + rightCount;
	return Math.round(wrongCount/total*10000)/100.00+"%";
}
function _getSummary(){
	return "Maven, 据统计，有60％的人读错这个单词，你读的对吗？";
}
function _getUrl(){
	return "http://how2read.me#" + "maven";
}
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
function _vote(reading){
	var that = $(reading);
	
	var term = $("div#term" + that.attr('tid') + ".term");
	term.find(".votable").each(function(){
		$(this).poshytip('disable');
	});

	$.post('/term/' + that.attr('tid') + '/reading/' + that.attr('rid'), function(data){
		_updateTerm(term, that.attr('rid'), data);
	}).error(function(data){
		if(term.find("a.error, a.right, a.wrong").length == 0){
			$("<a class='error'>投票错误</a>").insertAfter(term.find('label.rate'));
		}
		
		if(term.find("a.right, a.wrong").length == 0){
			term.find(".votable").each(function(){
				if($(this).hasClass('voted')){
					$(this).removeClass('voted');
				};
				$(this).poshytip('enable');
			});
		}
	});
	
	return false;
}
function _updateTerm(term, voted, data){
	term.find("a.error").each(function(){
		$(this).detach();
	});
	
	term.find(".votable").each(function(){
		var reading = $(this).attr('reading');
		if(!_isCorrect(reading, data.readings)){
			$(this).detach();
		}
		else{
			$(this).addClass("voted");
		}
	});
	for(var i in data.readings){
		if(data.readings[i].id == voted){
			if(data.readings[i].correct == 'true'){
				$("<a class='right'>您读对了</a>").insertAfter(term.find('label.rate'));
			}
			else{
				$("<a class='wrong'>您读错了</a>").insertAfter(term.find('label.rate'));
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

