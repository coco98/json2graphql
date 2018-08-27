const fetch = require('node-fetch');
const throwError = require('./error');

const graphqlEngineUrl = process.env.GRAPHQL_ENGINE_URL || 'http://localhost:8080';

const trackTables = async (tables) => {
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
  await fetch(
    `${graphqlEngineUrl}/v1/query`,
    {
      method: 'POST',
      body: JSON.stringify(bulkQuery)
    }
  );
};

module.exports = {
  trackTables
};
