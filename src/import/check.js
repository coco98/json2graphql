const {query} = require('graphqurl');
const {CLIError} = require('@oclif/errors');
const {cli} = require('cli-ux');

const createTables = async (tables, url, headers, overwrite, runSql, sql) => {
  const checkTablePresence = async (i) => {
    if (i < tables.length) {
      const resp = await query({
        endpoint: `${url}/v1alpha1/graphql`,
        query: `query { ${tables[i].name} { id } }`,
        headers
      });
      if (resp.data) {
        cli.action.stop('Error');
        throw new CLIError(`Your database contains table that already exist on postgres. Please use flag --overwrite to overwrite existing tables`);
      } else {
        await checkTablePresence(i+1);
      }
    } if ( i === tables.length) {
      await runSql(sql, url, headers);
    }
  }
  if (!overwrite) {
    checkTablePresence(0);
  } else {
    runSql(sql, url, headers);
  }
};

module.exports = {
  createTables
}
