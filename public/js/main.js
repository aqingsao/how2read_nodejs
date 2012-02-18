stats = function(){
	// dataset:{correct: 29, wrong: 75}
	function drawPie(id, data){
		var total = 0;
		var percentage = [];
		for(var i in data){
			data[i] = data[i] ? parseInt(data[i]) : 0;
			total += data[i];
		}
		total = total == 0 ? 1 : total;
		for(var i in data){
			percentage[i] = Math.round(data[i]/total*10000)/100.00+"%"; 
		}
		var tooltips = "Total: " + total + "\n" + "Wrong: " + data[0];
		
		var pie2 = new RGraph.Pie(id, data); // Create the pie object
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
		pie2.Set('chart.labels', ['Wrong(' + percentage[0] + ')', 'Correct(' + percentage [1]+ ')'])
		pie2.Set('chart.tooltips', [tooltips, tooltips])
		pie2.Set('chart.tooltips.event', 'onmousemove')
		pie2.Set('chart.labels.sticks', true);
		
		RGraph.Clear(pie2.canvas);
		pie2.Draw();
	}
	return {
		drawPie: drawPie
	}
}();

$(function(){
	$("div.term canvas").each(function(){
		_drawPie($(this));
	});
	$("div.term form.report").submit(function(){
		var that = $(this);
		$.post(that.attr('action'), that.serialize(), function(){
			_updateTerm(that.parents("div.term"));
		}).error(function(data){
			alert(data.responseText);
		});
		
		return false;
	});
	
	function _drawPie(canvas){
		stats.drawPie(canvas.attr('id'), [canvas.attr('wrongcount'), canvas.attr('rightcount')]);	
	};
	function _updateTerm(term){
		term.find("input[type='submit']").attr('disabled', true);
		var canvas = term.find("canvas");
		var id = term.find("input[name='id']").val();
		$.getJSON("/term/" + id, function(data){
			canvas.attr("wrongCount", data.wrong_count);
			canvas.attr("rightcount", data.right_count);
			_drawPie(canvas);
		});
	}
});