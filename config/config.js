const env = process.env.NODE_ENV

if(env === 'development' || env === 'test'){
  require('dotenv').config();
}

module.exports ={
  "development": {
    "username": process.env.PG_USERNAME,
    "password": process.env.PG_PASSWORD,
    "database": "checklist_dev",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.PG_USERNAME,
    "password": process.env.PG_PASSWORD,
    "database": "checklist_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.PG_USERNAME,
    "password": process.env.PG_PASSWORD,
    "database": "checklist_production",
    "host": "localhost",
    "dialect": "postgres"
  }
}
