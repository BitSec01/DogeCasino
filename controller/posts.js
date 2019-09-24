const mysql = require('./mysql');

module.exports.register = (req, res) => {
  console.log(req.body);
  res.send({
    success: true,
    message: 'You have been logged in!'
  });
}