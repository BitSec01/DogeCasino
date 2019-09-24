const path = require('path');
const app_path = path.dirname(require.main.filename);
const mysql = require(path.join(app_path + '/controller/mysql.js'));

module.exports.get_user_by_id = (id, callback) => {
  mysql.execute_query('SELECT * FROM users WHERE id = ?', [id], (success, results) => {
    if (!success) return callback(false, "Failed to find tokens");
    callback(true, results[0]);
  });
}
