const request = require('request-promise');
const config = require('../config/config.json');

const api_key = config.key;
const secret = config.secret;
const api_base_url = config.baseurl;


module.exports.get_total_balance = (callback) => {
  request.get(`${api_base_url}get_balance/?api_key=${api_key}`).then((data) => {
    callback(JSON.parse(data));
  }, (error) => {
    callback(JSON.parse(error.error));
  });
}

module.exports.create_address = (label, callback) => {
  request.get(`${api_base_url}get_new_address/?api_key=${api_key}&label=${label}`).then((data) => {
    callback(JSON.parse(data));
  }, (error) => {
    callback(JSON.parse(error.error));
  });
}