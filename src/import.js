const generate = require('./generateTables');
const { generateSql, runSql } = require('./sql');
const { trackTables } = require('./track');
const { getInsertOrder, insertData } = require('./insert');
const throwError = require('./error');
const { createRelationships } = require('./relationships');

const importData = async (db) => {
  const tables = generate(db);
  const sql = generateSql(tables);
  console.log('Creating tables...');
  runSql(sql).then(() => {
    console.log('Done!');
    console.log('Tracking tables...');
    trackTables(tables).then(() => {
      console.log('Done!');
      console.log('Creating relationships...');
      createRelationships(tables).then(() => {
        console.log('Done!');
        console.log('Inserting data...');
        const insertOrder = getInsertOrder(tables);
        insertData(insertOrder, db);
      });
    });
  }).catch((err) => {throwError(err)});

};

module.exports = importData;
