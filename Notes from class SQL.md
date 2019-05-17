

way to store data in database:

1- tables: they look like excel spreadsheets. RELATIONAL DATABASE.
Postgres is a relational database. MySQL also. 
We use a programming language called SQL to talk to databases. 
PSQL: programm that runs in our Terminal that allows us to talk to our relational databases through the Terminal

in bash: createdb "whatever name" —> create database
dropdb —> delete database

psql cities -f cities.sql CREATE TABLE
psql salt-petition -f signatures.sql —> Create Table signatures, in the database salt-petition (this has to be done in the folder where the sql file is)

\dt —> show table (relations) created in the indicated database
\q —> quit the sql bash command line

SELECT songs.name AS song_name, singers.name AS singer_name 
FROM singers 
JOIN songs (FULL JOIN songs —> to join table regardless intersection)
	(RIGHT JOIN or LEFT JOIN —> if i want all elements of either table, LEFT 	here is singers and RIGHT is songs)
ON singers.id = songs.singer_id —> when i have two tables in relation

INNER JOIN —> gives intersection of data from both tables. We can do join of more than two tables

OUTTER JOIN / FULL JOIN —> give both tables joined completely

https://github.com/spicedacademy/salt/tree/master/wk7_sql

whenever we see the # symbol, that means whatever I type after it must be a SQL command. The command for exiting PSQL is "\q"

in bash: for running or executing an SQL command

2- key-value pairs: the stored data would look like a javascript object. NO-SQL DATABASE. 
Redis is a no-sql database. 
Mongodb is also a no-sql database.