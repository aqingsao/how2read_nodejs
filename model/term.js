function Term(row){
	this.id = row.tid;
	this.name= row.tname;
	this.source= row.tsource;
	this.description= row.tdesc;
	this.readings= [];
	this.wrong = 0;
	this.right = 0;
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
	if(reading.correct == 'true'){
		this.right += reading.count;
	}
	else{
		this.wrong += reading.count;
	}
}
exports.Term = Term;