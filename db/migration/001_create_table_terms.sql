CREATE TABLE Terms(
	id INTEGER, 
	name varchar(50) NOT NULL, 
	pronunciation varchar(50) NOT NULL,
	audio varchar(50),
	source varchar(100), 
	description TEXT,
	right_count INTEGER default 1, 
	wrong_count INTEGER default 0,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_TERMS_ID PRIMARY KEY(ID),
	CONSTRAINT UN_TERMS_NAME UNIQUE(NAME)
);