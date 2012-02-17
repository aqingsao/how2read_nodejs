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
		
		var pie2 = new RGraph.Pie(id, data); // Create the pie object
		pie2.Set('chart.gutter.left', 10);
		pie2.Set('chart.gutter.right', 10);
		pie2.Set('chart.gutter.top', 10);
		pie2.Set('chart.gutter.bottom', 10);
		pie2.Set('chart.colors', ['red', '#6f6']);
		// pie2.Set('chart.key', ['Wrong(' + data[0] + ', ' +percentage[0] + ')', 'Correct(' + data[1] + ', ' + percentage[1] + ')']);
		// pie2.Set('chart.key.background', 'white');
		pie2.Set('chart.strokestyle', 'white');
		pie2.Set('chart.linewidth', 3);
		pie2.Set('chart.shadow', true);
		pie2.Set('chart.shadow.offsetx', 0);
		pie2.Set('chart.shadow.offsety', 0);
		pie2.Set('chart.shadow.blur', 25);
		pie2.Set('chart.labels', ['Wrong(' + percentage[0] + ')', 'Correct(' + percentage [1]+ ')'])

		pie2.Draw();
		// RGraph.Effects.Pie.Grow(pie2);
	}
	return {
		drawPie: drawPie
	}
}();

$(function(){
	$("div.term canvas").each(function(){
		stats.drawPie($(this).attr('id'), [$(this).attr('wrongcount'), $(this).attr('rightcount')]);
	});
	$("div.term form.report input[type='submit']").click(function(){
		var url = $(this).attr("url");
		var body = {isCorrect : "true"};
	});
});