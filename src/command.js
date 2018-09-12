const {Command, flags} = require('@oclif/command');
const {cli} = require('cli-ux');
const {CLIError} = require('@oclif/errors');
const importData = require('./import/import');
const resolve = require('path').resolve;

class JSONDataImport extends Command {
  async run() {
    const {args, flags} = this.parse(JSONDataImport);
    const { url } = args;
    console.log(args)
    console.log(flags)
    if (!url) {
      throw new CLIError(`endpoint is required: 'json-data-import <url>'`);
    }

    const { db, overwrite } = flags;
    const key = flags['access-key'];

    if (!url) {
      throw new CLIError(`endpoint is required: 'json-data-import <url> -d ./db.js'`);
    }
    if (!db) {
      throw new CLIError(`path to sample database is required: 'json-data-import <url> -d ./db.js'`);
    }
    const dbJson = this.getDbJson(db);
    const headers = key ? { 'x-hasura-access-key': key } : {};
    this.args = args;
    this.flags = flags;
    try {
      await importData(dbJson, url, headers, overwrite);
    } catch (e) {
      throw new CLIError(`Error : `, e);
    }
  }

  getDbJson(db) {
    return require(resolve(db));
  }
}

JSONDataImport.description = `JSON Data Import: Import JSON data to Hasura GraphQL Engine
# Examples:

# Import data from a JSON file to Hasura GraphQL Engine without access key
json-data-import https://hge.herokuapp.com --db=./path/to/db.js

# Make a query with CLI auto complete (this will show a gql prompt)
json-data-import https://hge.herokuapp.com --access-key='<access-key>' --db=./path/to/db.js

`;

JSONDataImport.usage = 'URL [-k KEY]';

JSONDataImport.flags = {
  // add --version flag to show CLI version
  version: flags.version(),

  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),

  // Access key to Hasura GraphQL Engine
  'access-key': flags.string({
    char: 'k',
    description: 'Access key to Hasura GraphQL Engine (X-Hasura-Access-Key)'
  }),

  db: flags.string({
    char: 'd',
    description: 'Path to the .js files that exports a JSON database'
  }),

  overwrite: flags.boolean({
    char: 'o',
    description: 'Overwrite tables if they exist'
  })
};

JSONDataImport.args = [
  {
    name: 'url',
    description: 'URL where Hasura GraphQL Engine is running',
  },
];

module.exports = JSONDataImport;
