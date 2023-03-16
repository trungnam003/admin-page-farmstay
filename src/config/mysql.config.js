require('dotenv').config();

const user = process.env.MYSQL_USER_DB;
const password = process.env.MYSQL_PASSWORD_DB; 
const db_name = process.env.MYSQL_DATABASE_NAME;
const host = process.env.MYSQL_HOST;
const dialect = process.env.MYSQL_DIALECT;
const port = process.env.MYSQL_PORT;

const config = {
  "development": {
    "username": user,
    "password": password,
    "database": db_name,
    "host": host,
    "dialect": dialect,
    "port": port,
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": user,
    "password": password,
    "database": 'database_prod',
    "host": host,
    "dialect": dialect,
    "port": port,
    logging: false
  }
}

module.exports = config