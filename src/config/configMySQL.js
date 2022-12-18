require('dotenv').config();

const user = process.env.USER_DB;
const password = process.env.PASSWORD_DB; 
const db_name = process.env.DATABASE_NAME;
const host = process.env.HOST;
const dialect = process.env.DIALECT;
const config = {
  "development": {
    "username": user,
    "password": password,
    "database": db_name,
    "host": host,
    "dialect": dialect
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