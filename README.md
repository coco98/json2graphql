# JSON database to GraphQL

Hasura GraphQL Engine gives instant GraphQL APIs over Postgres.

This is A CLI tool to import a schema to Postgres using simple JSON data

## Quick start



## Installation

### CLI

```bash
npm install -g json-data-import
```

## Usage

### CLI

#### Without access key

```
$ json-data-import https://hge.herokuapp.com -d ./path/to/db.js
```

#### With access key

```
$ json-data-import https://hge.herokuapp.com -k <access-key> -d ./path/to/db.js
```

### Command

```bash
$ gq URL [flags]
```

#### Args

* `URL`: The URL where Hasura GraphQL Engine is running

#### Options

- `-d --db`: path to the JS file that exports your sample JSON database
- `-o --overwrite`: Overwrite tables if they already exist in database
- `-v --version`: show CLI version
- `-h, --help`: show CLI help

---
Maintained with ♡ by <a href="https://hasura.io">Hasura</a>
