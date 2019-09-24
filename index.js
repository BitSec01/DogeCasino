const dogecoin = require('node-dogecoin')();
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);
const mysql = require('mysql');

const port = process.env.PORT || 80;
const app = express();

const configs = [];


function check_configs(callback) {
  var session_config = {
    secret: 'dogecoind_secret'
  }

  var dogecoind_config = {
    user: 'user',
    pass: 'test',
    port: '22555'
  }

  var mysql_config = {
    host: 'localhost',
    user: 'user',
    password: '',
    database: 'database'
  }

  if (!fs.existsSync('./secrets')) {
    fs.mkdirSync('./secrets');
    console.log('secrets folder has been made');
  }

  if (fs.existsSync('./secrets/session.json')) {
    console.log('session.json loading');
    configs['session'] = require('./secrets/session.json');
  }else{
    fs.writeFile("./secrets/session.json", JSON.stringify(session_config), function (err) {
      if (err) return callback(err);
      console.log('session.json has been created');
    });
  }

  if (fs.existsSync('./secrets/dogecoind.json')) {
    console.log('dogecoind.json loading');
    configs['dogecoind'] = require('./secrets/dogecoind.json');
  }else{
    fs.writeFile("./secrets/dogecoind.json", JSON.stringify(dogecoind_config), function (err) {
      if (err) return callback(err);
      console.log('dogecoind.json has been created');
    });
  }

  if (fs.existsSync('./secrets/mysql.json')) {
    console.log('mysql.json loading');
    configs['mysql'] = require('./secrets/mysql.json');
  }else{
    fs.writeFile("./secrets/mysql.json", JSON.stringify(mysql_config), function (err) {
      if (err) return callback(err);
      console.log('mysql.json has been created');
    });
  }
}

// check if all configs are available because we cannot start without them
check_configs((err) => {
  console.log(err);
  console.warn('error has occured we will close node now');
  process.exit()
});

const connection = mysql.createConnection(configs['mysql']);

connection.query('SELECT 1', function (error, results, fields) {
  if (!error) return console.log('Connected to database!');
  console.log('Could NOT connect to database! \n' + error);
  process.exit();
});

app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(session({
  name: 'session',
  secret: configs['session'].secret,
  resave: true,
  saveUninitialized: false,
  maxAge: 2 * 60 * 60 * 1000, // Maximum age of 2 hours
  store: new MemoryStore({
    checkperiod: 10 * 60 //Check session every 10 minutes
  })
}));

dogecoin.set('user', configs['dogecoind'].user);
dogecoin.set('pass', configs['dogecoind'].pass);
dogecoin.set('port', configs['dogecoind'].port);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});