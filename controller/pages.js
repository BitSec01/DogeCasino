const path = require('path');
const app_path = path.dirname(require.main.filename);
const api = require(path.join(app_path + '/controller/api.js'));
const dogecoin = require(path.join(app_path + '/controller/dogecoin.js'));

module.exports.index = (req, res) => {
  res.render('index');
}

module.exports.login = (req, res) => {
  res.render('login');
}

module.exports.register = (req, res) => {
  res.render('register');
}
module.exports.logout = (req, res) => {
  req.session.loggedin = false;
  req.session.id = null;
  req.session.username = null;
  req.session.tokens = null;

  res.render('index');
}

module.exports.deposit = (req, res) => {

  api.get_user_by_id(req.session.userid, (success, user) => {
    if (!success) return console.log('error at deposit');

    if (!user.deposit_address || typeof user.deposit_address == 'undefined') {
      
      dogecoin.getNewAddress(user.email, (err, address) => {
        if (err) return console.log(err);
        api.set_deposit_address(req.session.userid, address, (success, message) => {
          if (!success) return console.log(message);
          res.render('deposit', {
            id: req.session.userid,
            username: req.session.username,
            tokens: user.tokens,
            address: address
          });
        });
      });

    }else{
      res.render('deposit', {
        id: req.session.userid,
        username: req.session.username,
        tokens: user.tokens,
        address: user.deposit_address
      });
    }

  });

}

module.exports.check_address_balance = (req, res) => {

  api.check_address_balance(req.query.address, (success, message) => {
    if (!success) return res.send({error: true, message: message});
    res.send({error: false, message: message});
  });

}

module.exports.dashboard = (req, res) => {
  api.get_user_by_id(1, (success, user) => {
    if (!success) return console.log(user);
    res.render('dashboard', {
      id: req.session.userid,
      username: req.session.username,
      tokens: user.tokens
    });
  });
}