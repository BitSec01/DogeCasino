const dogecoin = require('node-dogecoin')();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);

const port = process.env.PORT || 80;
const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(session({
  name: 'session',
  secret: 'Hdw#75!dj2',
  resave: true,
  saveUninitialized: false,
  maxAge: 2 * 60 * 60 * 1000, // Maximum age of 2 hours
  store: new MemoryStore({
    checkperiod: 10 * 60 //Check session every 10 minutes
  })
}));

dogecoin.set('user', 'user');
dogecoin.set('pass', 'test');
dogecoin.set('port', 44555);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});