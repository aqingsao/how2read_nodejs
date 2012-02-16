CREATE TABLE Terms(
	id INTEGER, 
	name varchar(50), 
	reading varchar(50) NOT NULL,
	right_count INTEGER default 0, 
	source varchar(100), 
	description TEXT,
	created_at timestamp, 
	updated_at timestamp,
	CONSTRAINT PK_TERMS_ID PRIMARY KEY(ID),
	CONSTRAINT UN_TERMS_NAME UNIQUE(NAME)
);