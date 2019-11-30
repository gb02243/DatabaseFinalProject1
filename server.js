//use path module
const path = require('path');
//use express module
const express = require('express');
//use express session module
const session = require('express-session');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
//use redis module
const redis = require('redis');
//use redis store
const redisStore = require('connect-redis')(session);
//create redist client
const client  = redis.createClient();
//create router
const router = express.Router();
//create express app
const app = express();

//register partials
hbs.registerPartials(__dirname + '/views/partials');

//connect to database
const database = mysql.createConnection({
  host: 'localhost',
  user: 'inv',
  password: 'password',
  database: 'InventoryManager',
  charset: 'utf8'
});

//connect to database
database.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set view engine
app.set('view engine', 'hbs');

// create individual session
app.use(session({
  secret: 'eagles',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
//set views file
app.set('views',path.join(__dirname,'views'));

//create GLOBAL session
var sess;

//route for homepage
app.get('/',(req, res) => {
  sess = req.session;
  if(sess.admin) {
    return res.redirect('/admin');
  }
  res.render('homepage');
});

//get login
app.post('/submit',(req,res) => {
  console.log('User tried to log in');
  req.session.usernane = req.body.username;
  console.log('body username:' + req.body.username);
  console.log('session username:' + req.session.username);
  if(req.session.username == 'admin'){
    console.log('Admin logged in');
    return res.redirect('/admin');
  }
});

// get logout
app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

//route for login
app.get('/login',(req, res) => {
  res.render('login');
});

//route for products
app.get('/products',(req, res) => {
  res.render('products');
});

//route for departments
app.get('/departments',(req, res) => {
  res.render('departments');
});

//route for stores
app.get('/stores',(req, res) => {
  res.render('stores');
});

//route for admin panel
app.get('/admin',(req, res) => {
  res.render('admin');
});

// hbs.registerHelper('json', function(context) {
//   return JSON.stringify(context);
// });

// route for queries
app.post('/query',(req, res) => {
  globalQuery = req.body.queryInput;
  res.redirect('/');
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
