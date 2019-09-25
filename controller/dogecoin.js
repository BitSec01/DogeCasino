const path = require('path');
const app_path = path.dirname(require.main.filename);
const config = require(path.join(app_path + '/secrets/dogecoind.json'));

const dogecoin = require('node-dogecoin')();

dogecoin.set('user', config.user);
dogecoin.set('pass', config.pass);
dogecoin.set({ port: config.port});

module.exports = dogecoin;