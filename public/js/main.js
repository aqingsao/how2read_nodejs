$(function(){
	$("div.term").each(function(){
		var rightCount = $(this).find("label span.right").text();
		var wrongCount = $(this).find("label span.wrong").text();		
		var statsContainer = $(this).find("div.statscontainer");
		var id = "term" + $(this).attr('id');
		statsContainer.empty();
		statsContainer.append("<canvas id=" + id + "></canvas>");
		_drawPie(id, parseInt(wrongCount), parseInt(rightCount));
	});
	$("div.term form.report").submit(function(){
		var term = $(this).parents("div.term")
		var that = $(this);
		$.post(that.attr('action'), that.serialize(), function(){
			_updateTerm(term);
		})
		return false;
	});
	
	function _updateTerm(term){
		term.find("input[type='submit']").attr('disabled', true);
		var canvas = term.find("canvas");
		var id = term.attr('id');
		$.getJSON("/term/" + id, function(data){
			_drawPie(canvas.attr("id"), parseInt(data.wrong_count), parseInt(data.right_count));
		});
	}
	function _toPercent(data, total){
		return Math.round(data/total*10000)/100.00+"%";
	}
	function _drawPie(id, wrongCount, rightCount){
		var total = wrongCount + rightCount;
		total = Math.max(total, 1);
		
		var tooltips = "Total: " + total + "\n" + "Wrong: " + wrongCount;
		
		var pie2 = new RGraph.Pie(id, [wrongCount, rightCount]); // Create the pie object
		pie2.Set('chart.gutter.left', 10);
		pie2.Set('chart.gutter.right', 10);
		pie2.Set('chart.gutter.top', 10);
		pie2.Set('chart.gutter.bottom', 10);
		pie2.Set('chart.colors', ['red', '#6f6']);
		pie2.Set('chart.strokestyle', 'white');
		pie2.Set('chart.linewidth', 3);
		pie2.Set('chart.shadow', true);
		pie2.Set('chart.shadow.offsetx', 0);
		pie2.Set('chart.shadow.offsety', 0);
		pie2.Set('chart.shadow.blur', 25);
		pie2.Set('chart.labels', ['Wrong(' + _toPercent(wrongCount, total) + ')', 'Correct(' + _toPercent(rightCount, total) + ')'])
		pie2.Set('chart.tooltips', [tooltips, tooltips])
		pie2.Set('chart.tooltips.event', 'onmousemove')
		pie2.Set('chart.labels.sticks', true);
		
		RGraph.Clear(pie2.canvas);
		pie2.Draw();
	}
});