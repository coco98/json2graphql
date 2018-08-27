const importData = require('./src/import');

const pathToDb = process.env.DB_PATH || './db.js';
const db = require(pathToDb);

importData(db)
