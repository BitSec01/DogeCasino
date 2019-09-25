const path = require('path');
const app_path = path.dirname(require.main.filename);
const mysql = require(path.join(app_path + '/controller/mysql.js'));
const api = require(path.join(app_path + '/controller/api.js'));

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.register = (req, res) => {

  const email = req.body.email;
  const username = req.body.username;

  if (email == "") return res.send({success: false, message: 'Please fill in an email.'});
  if (password == "") return res.send({success: false, message: 'Please fill in an password.'});
  if (username == "") return res.send({success: false, message: 'Please fill in an username.'});

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
      req.session.userid = results.id;
      res.send({success: true, message: 'Welcome back ' + results.username});
    });

  });

}

module.exports.deposit = (req, res) => {
  api.check_address_balance(req.body.address, (success, balance) => {
    if (!success) return console.log(balance);
    if (balance <= 5) return res.send({success: false, message: 'balance needs to be greater than 5'})

    api.get_user_by_id(req.session.userid, (success, user) => {
      if (!success) return console.log(user);
      
      var total = (balance + user.tokens - 5);
      api.set_tokens(req.session.userid, total, (success, message) => {
        if (!success) return console.log(message);

        api.send_to_main(req.body.address, balance - 1, (success, results) => {
          console.log([success, results]);
          if (!success) return res.send({success: success, message: "Something went wrong and we couldn't add tokens to your balance."});
          res.send({success: success, message: "The tokens have been added to your balance."});
        });

      });

    });

  });
}