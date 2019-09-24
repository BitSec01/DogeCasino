const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);

const port = process.env.PORT || 80;
const app = express();

const path = require('path');
const app_path = path.dirname(require.main.filename);
const configs = require(path.join(app_path + '/controller/configs.js'));
configs.initialize((err) => {
  console.log(err);
  process.exit()
});


const session_config = require(path.join(app_path + '/secrets/session.json'));


app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(session({
  name: 'session',
  secret: session_config.secret,
  resave: true,
  saveUninitialized: false,
  maxAge: 2 * 60 * 60 * 1000, // Maximum age of 2 hours
  store: new MemoryStore({
    checkperiod: 10 * 60 //Check session every 10 minutes
  })
}));

const auth = require(path.join(app_path + '/controller/auth'));
const pages = require(path.join(app_path + '/controller/pages'));
const posts = require(path.join(app_path + '/controller/posts'));

app.get('/', pages.index);
app.get('/register', pages.register);
app.get('/login', pages.login);

app.get('/dashboard', auth.isAuthenticated, pages.dashboard);

app.post('/register', posts.register);
app.post('/login', posts.login);

app.listen(port, () => {
  console.log('Listening on port ' + port);
});