require('dotenv').config();

const user = process.env.MYSQL_USER_DB;
const password = process.env.MYSQL_PASSWORD_DB; 
const db_name = process.env.MYSQL_DATABASE_NAME;
const host = process.env.MYSQL_HOST;
const dialect = process.env.MYSQL_DIALECT;
const config = {
  "development": {
    "username": user,
    "password": password,
    "database": db_name,
    "host": host,
    "dialect": dialect,
    "port": 3306,
    "logging": true
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

module.exports = config