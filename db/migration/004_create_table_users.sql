CREATE TABLE USERS(
	id INTEGER, 
	ip varchar(15) NOT NULL,
	score REAL default 0,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP, 
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_USERS_ID PRIMARY KEY(ID)
);