module.exports.index = (req, res) => {
  res.render('index');
}

module.exports.login = (req, res) => {
  res.render('login');
}

module.exports.register = (req, res) => {
  res.render('register');
}