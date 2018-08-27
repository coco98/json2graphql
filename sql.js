const fetch = require('node-fetch');
const throwError = require('./error');
const graphqlEngineUrl = process.env.GRAPHQL_ENGINE_URL || 'http://localhost:8080';

const runSql = (sqlArray) => {
  let sqlString = '';
  sqlArray.forEach((sql) => {
    sqlString += sql;
  });
  fetch(
    `${graphqlEngineUrl}/v1/query`,
    {
      method: 'POST',
      body: JSON.stringify({
        type: 'run_sql',
        args: {
          sql: sqlString,
          cascade: false
        }
      })
    }
  ).then((resp) => resp.json().then((respObj) => {
    console.log(respObj);
  })).catch((error) => {
    throwError(error);
  });
};

const generateSql = (metadata) => {
  const createTableSql = generateCreateTableSql(metadata);
  const constraintsSql = generateConstraintsSql(metadata);
  let sqlArray = [ ...createTableSql, ...constraintsSql];
  return sqlArray;
};

const generateCreateTableSql = (metadata) => {
  const sqlArray = [];
  metadata.forEach((table) => {
    sqlArray.push(`drop table if exists public.${table.name} cascade;`);
    let columnSql = '(';
    table.columns.forEach((column, i) => {
      if (column.name === 'id') {
        columnSql += `"id" int not null primary key`;
      } else {
        columnSql += `"${column.name}" ${column.type}`;
      }
      columnSql += (table.columns.length === i+1) ? ' ) ' : ', ';
    });
    const createTableSql = `create table public.${table.name} ${columnSql};`;
    sqlArray.push(createTableSql);
  });
  return sqlArray;
};

const generateConstraintsSql = (metadata) => {
  const sqlArray = [];
  metadata.forEach((table) => {
    table.columns.forEach((column) => {
      if (column.isForeign) {
        const fkSql = `add foreign key ("${column.name}") references public.${column.name.substring(0, column.name.length-3)} ("id");`;
        sqlArray.push(`alter table ${table.name} ${fkSql}`);
      }
    });
  });
  return sqlArray;
};

module.exports = {
  generateSql,
  runSql
};
