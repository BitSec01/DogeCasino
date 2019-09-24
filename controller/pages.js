const path = require('path');
const app_path = path.dirname(require.main.filename);
const api = require(path.join(app_path + '/controller/api.js'))

module.exports.index = (req, res) => {
  res.render('index');
}

module.exports.login = (req, res) => {
  res.render('login');
}

module.exports.register = (req, res) => {
  res.render('register');
}

module.exports.dashboard = (req, res) => {
  api.get_user_by_id(1, (success, user) => {
    if (!success) return console.log(user);
    res.render('dashboard', {
      id: req.session.id,
      username: req.session.username,
      tokens: user.tokens
    });
  });
}