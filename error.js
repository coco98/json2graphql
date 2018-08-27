const throwError = (message) => {
  throw (JSON.stringify({
    error: 1,
    message
  }, null, 2));
  exit(1);
};

module.exports = throwError;
