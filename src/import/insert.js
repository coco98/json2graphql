const { query } = require('graphqurl');
const {CLIError} = require('@oclif/errors');
const graphqlEngineUrl = process.env.GRAPHQL_ENGINE_URL || 'http://localhost:8080';
const moment = require('moment');
const {cli} = require('cli-ux');

const getInsertOrder = (tables) => {
  let order = [];
  const tablesHash = {};
  tables.forEach((table) => {
    tablesHash[table.name] = table;
  });
  pushedHash = {};
  const setOrder = (table) => {
    if (table.dependencies.length === 0) {
      order.push(table.name);
      pushedHash[table.name] = true;
    } else {
      table.dependencies.forEach((parentTable) => {
        if (!pushedHash[parentTable] && parentTable !== table.name) {
          setOrder(tablesHash[parentTable]);
        }
      });
      order.push(table.name);
      pushedHash[table.name] = true;
    }
  }

  tables.forEach((table) => {
    if (!pushedHash[table.name]) {
      setOrder(table);
    }
  });
  return order;
};


const insertData = async (insertOrder, sampleData, tables, url, headers) => {
  const transformedData = transformData(sampleData, tables);
  let mutationString = '';
  let objectString = '';
  const variables = {};
  insertOrder.forEach((tableName, i) => {
    mutationString += `insert_${tableName} ( objects: $objects_${tableName} ) { returning { id } } \n`;
    objectString += `$objects_${tableName}: [${tableName}_insert_input!]!,\n`;
    variables[`objects_${tableName}`] = transformedData[tableName];
  });
  const mutation = `mutation ( ${objectString} ) { ${mutationString} }`
  cli.action.start('Inserting data');
  try {
    const response = await query({
      query: mutation,
      endpoint: `${url}/v1alpha1/graphql`,
      variables,
      headers
    });
    cli.action.stop(`Done`);
    console.log(JSON.stringify(response.data, null, 2));
  } catch (e) {
    cli.action.stop('Error');
    throw new CLIError(JSON.stringify(e, null, 2));
  }
};

const transformData = (data, tables) => {
  const newData = {};
  tables.forEach((table) => {
    const tableData = data[table.name];
    newData[table.name] = [];
    tableData.forEach((row) => {
      const newRow = { ...row };
      table.columns.forEach((column) => {
        if (column.type === 'timestamptz' && row[column.name]) {
          newRow[column.name] = moment(row[column.name]).format();
        }
        if (column.type === 'json' && row[column.name]) {
          newRow[column.name] = JSON.stringify(row[column.name]);
        }
      })
      newData[table.name].push(newRow);
    });
  });
  return newData;
}

module.exports = {
  getInsertOrder,
  insertData
};