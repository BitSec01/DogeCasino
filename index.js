const request = require('request-promise');
const util = require("util");

const api_key = 'c221-82b7-a728-d595';
const secret = 'Kutkind01';

const api_base_url = 'https://block.io/api/v2/';


function get_total_balance(callback) {
  request.get(`${api_base_url}get_balance/?api_key=${api_key}`).then((data) => {
    callback(JSON.parse(data));
  }, (error) => {
    callback(JSON.parse(error.error));
  });
}

function get_addresses(callback) {
  request.get(`${api_base_url}get_my_addresses/?api_key=${api_key}`).then((data) => {
    callback(JSON.parse(data));
  }, (error) => {
    callback(JSON.parse(error.error));
  });
}

function create_address(label, callback) {
  request.get(`${api_base_url}get_new_address/?api_key=${api_key}&label=${label}`).then((data) => {
    callback(JSON.parse(data));
  }, (error) => {
    callback(JSON.parse(error.error));
  });
}

create_address("test24", (out) => {
  if (out.status == 'fail') {
    console.log(out.data.error_message);
    return;
  }
  console.log(util.inspect(out, {showHidden: false, depth: null}));
});