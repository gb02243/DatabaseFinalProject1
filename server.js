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

app.use(session({
  secret: 'eagles',
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false,
  maxAge: 6000
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/assets',express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

router.get('/',(req,res) => {
  res.render('homepage');
});

router.get('/stock',(req,res) => {
  if(req.session.name){
    let query = 'SELECT p.id AS id, p.name AS pname, s.quantity_in AS qin, s.quantity_rented AS qrented, s.quantity_ordered AS qordered FROM Products p, Stock s WHERE p.id = s.product_id;';
    database.query(query, (err, rows, cols) => {
      if(err) throw err;
      res.render('stock', {rows:rows});
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/order',(req,res) => {
  if(req.session.name){
    req.session.pid = req.body.productID;
    req.session.quantity = req.body.quantity;
    let query = 'UPDATE Stock SET quantity_ordered = quantity_ordered+'+req.session.quantity+' WHERE product_id = '+req.session.pid+';';
    database.query(query, (err, rows, cols) => {
      if(err) throw err;
    });
    res.redirect('/stock');
  }else{
    res.redirect('/login');
  }
});

router.get('/customers',(req,res) => {
  if(req.session.name){
    let query = 'SELECT * FROM Customers;';
    database.query(query, (err, rows, cols) => {
      if(err) throw err;
      res.render('customers', {rows:rows});
    });
  }else{
    res.redirect('/login');
  }
});

router.get('/products',(req,res) => {
  let query = 'SELECT p.id AS id, p.name AS pname, p.brand AS pbrand, p.model AS pmodel, d.name AS dname, s.upc AS upc, s.buy_price AS buy, s.rent_price AS rent FROM Products p, Stock s, Departments d WHERE p.id = s.product_id AND s.department_id = d.id;';
  database.query(query, (err, rows, cols) => {
    if(err) throw err;
    res.render('products', {rows:rows});
  });
});

router.get('/cameras',(req,res) => {
  let query = 'SELECT p.id AS id, p.name AS pname, p.brand AS pbrand, p.model AS pmodel, d.name AS dname, s.upc AS upc, s.buy_price AS buy, s.rent_price AS rent FROM Products p, Stock s, Departments d WHERE p.id = s.product_id AND s.department_id = d.id AND d.id = 1;';
  database.query(query, (err, rows, cols) => {
    if(err) throw err;
    res.render('products', {rows:rows});
  });
});

router.get('/televisions',(req,res) => {
  let query = 'SELECT p.id AS id, p.name AS pname, p.brand AS pbrand, p.model AS pmodel, d.name AS dname, s.upc AS upc, s.buy_price AS buy, s.rent_price AS rent FROM Products p, Stock s, Departments d WHERE p.id = s.product_id AND s.department_id = d.id AND d.id = 2;';
  database.query(query, (err, rows, cols) => {
    if(err) throw err;
    res.render('products', {rows:rows});
  });
});

router.get('/audio',(req,res) => {
  let query = 'SELECT p.id AS id, p.name AS pname, p.brand AS pbrand, p.model AS pmodel, d.name AS dname, s.upc AS upc, s.buy_price AS buy, s.rent_price AS rent FROM Products p, Stock s, Departments d WHERE p.id = s.product_id AND s.department_id = d.id AND d.id = 3;';
  database.query(query, (err, rows, cols) => {
    if(err) throw err;
    res.render('products', {rows:rows});
  });
});

router.get('/other',(req,res) => {
  let query = 'SELECT p.id AS id, p.name AS pname, p.brand AS pbrand, p.model AS pmodel, d.name AS dname, s.upc AS upc, s.buy_price AS buy, s.rent_price AS rent FROM Products p, Stock s, Departments d WHERE p.id = s.product_id AND s.department_id = d.id AND d.id = 4;';
  database.query(query, (err, rows, cols) => {
    if(err) throw err;
    res.render('products', {rows:rows});
  });
});

router.get('/departments',(req,res) => {
  res.render('departments');
});

router.get('/stores',(req,res) => {
  res.render('stores');
});

router.post('/submit',(req,res) => {
  req.session.username = req.body.username;
  req.session.password = req.body.pass;
  let query = 'SELECT name, username, password, type FROM Users WHERE username LIKE (\'%'+req.session.username+'\');';
  // console.log(query);
  database.query(query, (err, results, cols) => {
    if(err) throw err;
    if(results.length > 0){
      var row = results[0];
      req.session.name = row.name;
      if(req.session.password == row.password && row.type =='admin'){
        res.end('done');
        console.log("User "+req.session.username+" logged in.");
      }else{
        // console.log("bad password");
        res.end('password');
      }
    }else{
      // console.log("wrong username");
      res.end('username');
    }
  });
});

router.get('/admin',(req,res) => {
  if(req.session.name){
    res.render("admin",{user:req.session.name});
  }else{
    res.redirect("/login");
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });

});

router.get('/login',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.render('login');
  });

});

app.use('/', router);

app.listen(process.env.PORT || 8000,() => {
  console.log(`App Started on port ${process.env.PORT || 8000}`);
});
