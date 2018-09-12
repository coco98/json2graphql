const {Command, flags} = require('@oclif/command');
const {CLIError} = require('@oclif/errors');
const importData = require('./import/import');
const resolve = require('path').resolve;

class JSONDataImport extends Command {
  async run() {
    const {args, flags} = this.parse(JSONDataImport);
    const {url} = args;
    if (!url) {
      throw new CLIError('endpoint is required: \'json-to-graphql <url>\'');
    }

    const {db, overwrite} = flags;
    const key = flags['access-key'];

    if (!url) {
      throw new CLIError('endpoint is required: \'json-to-graphql <url> -d ./db.js\'');
    }
    const safeUrl = this.getSafeUrl(url);
    if (!db) {
      throw new CLIError('path to sample database is required: \'json-to-graphql <url> -d ./db.js\'');
    }
    const dbJson = this.getDbJson(db);
    const headers = key ? {'x-hasura-access-key': key} : {};
    try {
      await importData(dbJson, safeUrl, headers, overwrite);
    } catch (e) {
      throw new CLIError('Error : ', e);
    }
  }

  getDbJson(db) {
    return require(resolve(db));
  }

  getSafeUrl(url) {
    const urlLength = url.length;
    return url[urlLength - 1] === '/' ? url.slice(0, -1) : url;
  }
}

JSONDataImport.description = `JSON Data Import: Import JSON data to Hasura GraphQL Engine
# Examples:

# Import data from a JSON file to Hasura GraphQL Engine without access key
json-to-graphql https://hge.herokuapp.com --db=./path/to/db.js

# Make a query with CLI auto complete (this will show a gql prompt)
json-to-graphql https://hge.herokuapp.com --access-key='<access-key>' --db=./path/to/db.js

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
    description: 'Access key to Hasura GraphQL Engine (X-Hasura-Access-Key)',
  }),

  db: flags.string({
    char: 'd',
    description: 'Path to the .js files that exports a JSON database',
  }),

  overwrite: flags.boolean({
    char: 'o',
    description: 'Overwrite tables if they exist',
  }),
};

JSONDataImport.args = [
  {
    name: 'url',
    description: 'URL where Hasura GraphQL Engine is running',
  },
];

module.exports = JSONDataImport;
