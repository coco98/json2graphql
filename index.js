const sampleDb = {
  post: [
    { id: 1, title: "Lorem Ipsum", views: 254, user_id: 123 },
    { id: 2, title: "Sic Dolor amet", views: 65, user_id: 456 },
  ],
  user: [
    { id: 123, name: "John Doe" },
    { id: 456, name: "Jane Doe" }
  ],
  comment: [
    { id: 987, post_id: 1, body: "Consectetur adipiscing elit"},
    { id: 995, post_id: 1, body: "Nam molestie pellentesque dui"}
  ]
};

const convert = (db) => {
  const metaData = [];
  Object.keys(db).forEach((rootField) => {
    const tableMetadata = {};
    if (!hasPrimaryKey(db[rootField], rootField)) {
      throwError(`A unique column with name "id" and type integer must present in table ${rootField}`);
    }
    tableMetadata['name'] = rootField;
    tableMetadata['columns'] = getColumnData(db[rootField], db);
    metaData.push(tableMetadata);
  });
  console.log(JSON.stringify(metaData, null, 2));
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
  if (typeof data === 'string') {
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

const throwError = (message) => {
  throw (JSON.stringify({
    error: 1,
    message
  }, null, 2));
  exit(1);
};

convert(sampleDb);

// 1. create tables (TODO timestamp type)
// 2. alter tables to create constraints
// 3. add relationships
