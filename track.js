const fetch = require('node-fetch');
const throwError = require('./error');

const graphqlEngineUrl = process.env.GRAPHQL_ENGINE_URL || 'http://localhost:8080';

const trackTables = (tables) => {
  const makeQuery = (i) => {
    const bulkQueryArgs = [];
    tables.forEach((table) => {
      bulkQueryArgs.push({
        type: 'add_existing_table_or_view',
        args: {
          name: table.name,
          schema: 'public'
        }
      });
    });
    const bulkQuery = {
      type: 'bulk',
      args: bulkQueryArgs
    };
    fetch(
      `${graphqlEngineUrl}/v1/query`,
      {
        method: 'POST',
        body: JSON.stringify(bulkQuery)
      }
    ).then((resp) => resp.json().then((respObj) => console.log(respObj)))
      .catch(error => throwError(error));
  };
  makeQuery(0);
};

module.exports = {
  trackTables
};
