const date = require('date-and-time');

exports.verifyExpires = (expires) => {
  const now = Date.now();
  const dateNow = new Date(now);
  const dateExpires = new Date(parseInt(expires));
  const dateRemaining = date.subtract(dateExpires, dateNow).toDays();
  return dateRemaining > 0;
};
