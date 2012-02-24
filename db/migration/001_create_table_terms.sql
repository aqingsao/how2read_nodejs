CREATE TABLE Terms(
	id INTEGER, 
	name varchar(50) NOT NULL, 
	source varchar(100), 
	description TEXT,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_TERMS_ID PRIMARY KEY(ID),
	CONSTRAINT UN_TERMS_NAME UNIQUE(NAME)
);