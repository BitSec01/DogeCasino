const path = require('path');
const app_path = path.dirname(require.main.filename);
const mysql = require(path.join(app_path + '/controller/mysql.js'));
const dogecoin = require(path.join(app_path + '/controller/dogecoin.js'));

module.exports.get_user_by_id = (id, callback) => {
  mysql.execute_query('SELECT * FROM users WHERE id = ?', [id], (success, results) => {
    if (!success) return callback(false, "Failed to find user");
    callback(true, results[0]);
  });
}

module.exports.set_deposit_address = (id, address, callback) => {
  mysql.execute_query('UPDATE users SET deposit_address = ? WHERE id = ?;', [address, id], (success, results) => {
    if (!success) return callback(false, "Failed to set deposit_address");
    callback(true, results[0]);
  });
}

module.exports.set_tokens = (id, tokens, callback) => {
  mysql.execute_query('UPDATE users SET tokens = ? WHERE id = ?;', [tokens, id], (success, results) => {
    if (!success) return callback(false, "Failed to set tokens");
    callback(true, results[0]);
  });
}

module.exports.check_address_balance = (address, callback) => {
  dogecoin.getReceivedByAddress(address, (err, balance) => {
    if (err) return callback(false, err);
    callback(true, balance);
  });
}

module.exports.send_to_main = (address, amount, callback) => {
  dogecoin.sendfrom(address, 'nmaiSatYkM6pKEQvdmyzMeBaiwMbpNYrvN', amount, (err, results) => {
    if (err) return callback(false, err);
    callback(results);
  });
}