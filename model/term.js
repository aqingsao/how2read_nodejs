function Term(row){
	this.id = row.tid;
	this.name= row.tname;
	this.source= row.tsource;
	this.description= row.tdesc;
	this.readings= [];
};
Term.prototype.readCorrect = function(readingId){
	for(var i in this.readings){
		var reading = this.readings[i];
		if(reading.id == readingId){
			return reading.correct == 'true';
		}
	}	
}
Term.prototype.addReading = function(reading){
	this.readings.push(reading);
}
Term.prototype.right = function(){
	var count = 0;
	for(var i in this.readings){
		if(this.readings[i].correct == 'true'){
			count += this.readings[i].count;
		}
	}	
	return count;
}
Term.prototype.wrong = function(){
	var count = 0;
	for(var i in this.readings){
		if(this.readings[i].correct != 'true'){
			count += this.readings[i].count;
		}
	}	
	return count;
}

exports.Term = Term;