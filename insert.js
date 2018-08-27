const { query } = require('graphqurl');
const graphqlEngineUrl = process.env.GRAPHQL_ENGINE_URL || 'http://localhost:8080';

const getInsertOrder = (metadata) => {
  let order = [];
  const setOrder = (tablename) => {
    const tableData = metadata.find((td) => td.name === tablename);
    if (tableData.dependencies.length === 0 && !order.find((tn) => tn === tablename)) {
      order.push(tablename);
    } else {
      let allDepTablesPushed = true;
      tableData.dependencies.forEach((tn) => {
        if (!(order.find((pushedTn) => tn === pushedTn))) {
          allDepTablesPushed = false;
          setOrder(tn);
        }
      });
      if (allDepTablesPushed && !order.find((tn) => tn === tablename)) {
        order.push(tablename);
      }
    }
    ; };
  for (let i = 0; i < metadata.length; i++) {
    let table = metadata[i].name;
    setOrder(table);
    if (!(order.find((tn) => tn === table))) {
      order.push(table);
    }
  }
  return order;
};


const insertData = (insertOrder, sampleData) => {
  const makeQuery = (i) => {
    if (i < insertOrder.length) {
      const mutation = `mutation ($objects: [${insertOrder[i]}_insert_input!]!) { insert_${insertOrder[i]} (objects: $objects) { returning { id }}}`;
      const variables = {
        objects: sampleData[insertOrder[i]]
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
        (error) => console.error(error)
      );
    };
  };
  makeQuery(0);
};

module.exports = {
  getInsertOrder,
  insertData
};
