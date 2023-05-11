const getData = (req, res, next) => {
  return res.status(200).json('ok');
};

module.exports = {
  getData,
};
