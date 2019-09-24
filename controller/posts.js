const path = require('path');
const app_path = path.dirname(require.main.filename);
const mysql = require(path.join(app_path + '/controller/mysql.js'));
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.register = (req, res) => {

  const email = req.body.email;
  const username = req.body.username;

  mysql.execute_query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], (success, results) => {
    if (!success) return res.send({success: false, message: 'An unknown error occured. Please try again later.'});

    if (results.length <= 0) {
      //user does not exists so register the user
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        mysql.execute_query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hash], (success, results) => { 
          if (!success) return res.send({success: false, message: 'An unknown error occured. Please try again later.'});
          res.send({
            success: true,
            message: 'You have been registered!'
          });
        });
      });

    }else{
      res.send({
        success: false,
        message: 'username or email already in use!'
      });
    }
  });
}

module.exports.login = (req, res) => {
  const email = req.body.email;

  mysql.execute_query('SELECT * FROM users WHERE email = ?', [email], (success, results) => {
    if (!success) return res.send({success: false, message: 'An unknown error occured. Please try again later.'});
    if (results.length <= 0) return res.send({success: false, message: 'Email does not exist.'});
    results = results[0];

    bcrypt.compare(req.body.password, results.password, function(err, response) {
      if (!response) return res.send({success: false, message: 'Password is wrong!'});
      req.session.username = results.username;
      req.session.loggedin = true;
      req.session.datetime = Date.now();
      req.session.id = results.id;
      res.send({success: true, message: 'Welcome back ' + results.username});
    });

  });

}