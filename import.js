const generate = require('./generateTables');
const { generateSql, runSql } = require('./sql');
const { trackTables } = require('./track');
const { getInsertOrder, insertData } = require('./insert');

const importData = (db) => {
  const tables = generate(db);
  const sql = generateSql(tables);
  console.log('Creating tables');
  runSql(sql);
  setTimeout(() => {
    console.log('Tracking tables: ');
    trackTables(tables);
  }, 5000);
  setTimeout(() => {
    console.log('Inserting data: ');
    const insertOrder = getInsertOrder(tables);
    insertData(insertOrder, db);
  }, 10000);
};

module.exports = importData;
