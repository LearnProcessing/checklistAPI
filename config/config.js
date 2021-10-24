require('dotenv').config();


module.exports ={
  "development": {
    "username": "ayudyatriastika",
    "password": "postgres",
    "database": "checklist_dev",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "ayudyatriastika",
    "password": process.env.PG_PASSWORD,
    "database": "checklist_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "ayudyatriastika",
    "password": process.env.PG_PASSWORD,
    "database": "checklist_production",
    "host": "localhost",
    "dialect": "postgres"
  }
}
