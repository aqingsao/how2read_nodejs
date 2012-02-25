function Reading(row){
	this.id=row.pid;
	this.symbol=row.psymbol;
	this.audio=row.paudio;
	this.count=row.pcount;
	this.correct=row.pcorrect;
};

exports.Reading = Reading;