const { query } = require('graphqurl');
const graphqlEngineUrl = process.env.GRAPHQL_ENGINE_URL || 'http://localhost:8080';
const moment = require('moment');

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


const insertData = (insertOrder, sampleData, tables) => {
  const transformedData = transformData(sampleData, tables);
  const makeQuery = (i) => {
    if (i < insertOrder.length) {
      const mutation = `mutation ($objects: [${insertOrder[i]}_insert_input!]!) { insert_${insertOrder[i]} (objects: $objects) { returning { id }}}`;
      const variables = {
        objects: transformedData[insertOrder[i]]
      };
      query(
        {
          query: mutation,
          endpoint: `${graphqlEngineUrl}/v1alpha1/graphql`,
          variables
        },
        (response) => {
          console.log(`Inserted data in table ${insertOrder[i]}.`);
          console.log(JSON.stringify(response.data, null, 2));
          makeQuery(i+1);
        },
        (error) => console.error(JSON.stringify(error, null, 2))
      );
    };
  };
  makeQuery(0);
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
