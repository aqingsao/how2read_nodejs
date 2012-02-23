var util = require('util');

exports.toCookies = function(str){
	var cookies = {};
	function hasKey(key){
		return cookies[key];
	}
	function getValue(key){
		return cookies[key];
	}
	
	if(str){
		var splitted = str.split(";");
		for(var i in splitted){
			var match = splitted[i].match(/(\d+)=(\w+)/);
			if(match){
				var key = match[1];
				cookies[key] = match[2];
			}
		}
	}
	
	return {hasKey: hasKey, getValue: getValue};
};