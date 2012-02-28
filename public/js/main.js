var jiathis_config = {
    title:"程序员最容易读错的单词：",
    ralateuid:{
        "tsina":"1566959347"
    }
};
var audio;

_checkBrowser();
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
	
	$(".term .votable").each(function(){
		if($(this).hasClass("selected")){
			_toggleSymbol($(this));
		}
	});
	
	$(".term .votable").mouseenter(function(){
		_speaking($(this));
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
		that.addClass("loading");
		
		$.post('/term/' + tid + '/reading/' + rid, function(data){
			that.removeClass("loading");
			_updateTerm(term, rid, data);
		}).error(function(data){
			that.removeClass("loading");
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
function _speaking(votable){
	if(audio != undefined){
		audio.pause();
	}
	audio = votable.find("audio").get(0);
	audio.play();
}

function _toggleSymbol(votable){
	votable.mouseenter(function(){
		votable.find("span").text("[" + $(this).attr("symbol") + "]");
	}).mouseleave(function(){
		if(votable.hasClass("right")){
			votable.find("span").text("您读对了");
		}
		else if(votable.hasClass("wrong")){
			votable.find("span").text("您读错了");
		}
	});
}
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
			_toggleSymbol($(this));
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
	pie2.Set('chart.shadow.blur', 5);
	pie2.Set('chart.tooltips', [wrongCount + " wrong", rightCount + " right"]);
	pie2.Set('chart.tooltips.event', 'onmousemove');
	pie2.Set('chart.title', total + ' votes');
	pie2.Set('chart.title.bold', false);
	
	RGraph.Clear(pie2.canvas);
	pie2.Draw();
};
function _checkBrowser(){
	if(!document.createElement('audio').canPlayType || !document.createElement('canvas').getContext){
		$("#content .browser.warn").text("对不起，您的浏览器版本太旧，不支持HTML5！").show();
	}
}


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-29546947-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
