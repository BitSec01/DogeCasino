const fs = require('fs');
const path = require('path');
const app_path = path.dirname(require.main.filename);

module.exports.initialize = (callback) => {

  const secrets_path = path.join(app_path + '/secrets');
  const session_path = path.join(app_path + '/secrets/session.json');
  const dogecoind_path = path.join(app_path + '/secrets/dogecoind.json');
  const mysql_path = path.join(app_path + '/secrets/mysql.json');

  try {
   
    if (!fs.existsSync(secrets_path)) {
      fs.mkdirSync(secrets_path);
    }
  
    if (!fs.existsSync(session_path)) {
      const session_config = {
        secret: 'dogecoind_secret'
      }
      fs.writeFileSync(session_path, JSON.stringify(session_config));
    }
  
    if (!fs.existsSync(dogecoind_path)) {
      const dogecoind_config = {
        user: 'user',
        pass: 'test',
        port: '22555'
      }
      fs.writeFileSync(dogecoind_path, JSON.stringify(dogecoind_config));
    }
  
    if (!fs.existsSync(mysql_path)) {
      const mysql_config = {
        host: 'localhost',
        user: 'user',
        password: '',
        database: 'database'
      }
      fs.writeFileSync(mysql_path, JSON.stringify(mysql_config));
    }

  } catch (err) {
    callback(err);
  }

}