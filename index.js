const util = require("util");
const express = require('express');
const app = express();

const blockio = require('./module/blockio');

blockio.create_address("test24", (out) => {
  if (out.status == 'fail') {
    console.log(out.data.error_message);
    return;
  }
  console.log(util.inspect(out, {showHidden: false, depth: null}));
});