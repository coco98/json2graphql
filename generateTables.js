const throwError = require('./error');

const generate = (db) => {
  const metaData = [];
  Object.keys(db).forEach((rootField) => {
    const tableMetadata = {};
    if (!hasPrimaryKey(db[rootField], rootField)) {
      throwError(`A unique column with name "id" and type integer must present in table "${rootField}"`);
    }
    tableMetadata['name'] = rootField;
    tableMetadata['columns'] = getColumnData(db[rootField], db);
    tableMetadata['dependencies'] = [];
    tableMetadata.columns.forEach((column) => {
      if (column.isForeign) {
        tableMetadata['dependencies'].push(column.name.substring(0, column.name.length - 3));
      }
    });
    metaData.push(tableMetadata);
  });
  return metaData;
};

const getColumnData = (dataArray, db) => {
  const refColumns = dataArray[0];
  const columnData = [];
  const foreignKeys = [];
  Object.keys(refColumns).forEach((column) => {
    const columnMetadata = {};
    if (!column) {
      throwError("column names can't be empty strings");
    }
    columnMetadata['name'] = column;
    const sampleData = refColumns[column];
    columnMetadata['type'] = getDataType(sampleData, column, db);
    columnMetadata['isForeign'] = isForeign(column, db);
    columnData.push(columnMetadata);
  });
  return columnData;
};

const hasPrimaryKey = (dataObj) => {
  if (Object.keys(dataObj[0]).find((name) => name === 'id')) {
    return true;
  }
  return false;
};

const getDataType = (data, column, db) => {
  if (typeof data === 'number') {
    return (data === parseInt(data, 10)) ? "int" : "numeric";
  }
  if (typeof data === 'string' || data === null) {
    return "text";
  }
  if (data.constructor.name === 'boolean') {
    return 'boolean';
  }
  throwError(`invalid data type given for column ${column}: ${typeof data}`);
  return null;
};

const isForeign = (name, db) => {
  const l = name.length;
  if (l > 3) {
    if (name.substring(l-3, l) === '_id' &&
        Object.keys(db).find((tableName) => {
          return tableName === name.substring(0, l -3);
        })) {
      return true;
    }
  }
  return false;
};

module.exports = generate;
