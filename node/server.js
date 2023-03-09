//clears the console of logs for testing
console.clear();

var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static('../www'))
var fs = require("fs");

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project_database'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Database successfully connected');
});

var loggedIn = false;

app.get('/validateLogin/:email', function(req,res){
  let query = 'SELECT user_type FROM accounts where ? = email'
  connection.query(query,[req.params.email],(err,rows)=>{
    if(err)throw err;
    res.status(200).json(rows);
  })
})
app.get('/admin',function(req,res){
  res.sendFile('/pages/admin-dashboard.html', {root: '../www'});
})

//Test query function of all users in the database
 app.get('/listUsers', function (req, res) {
    connection.query('SELECT * FROM accounts', (err,rows) => {
        if(err) throw err;
      });
      res.end(rows);
 })
 app.get('/productPage/:img_name',(req,res,next)=>{
  let query = 'SELECT * FROM products where ? = img_name'
  connection.query(query,[req.params.img_name], (err,rows) => {
    if(err) throw err;
    res.status(200).json(rows);
  });
 })
  //Index page: localhost:3000/
  app.get('/getProducts',function(req,res){
    connection.query('SELECT * FROM products', (err,rows) => {
      if(err) throw err;
      res.status(200).json(rows);
    });
    
 })

 //Index page: localhost:3000/
 app.get('/',function(req,res){
    res.sendFile('index.html', {root: '../www'});

 })

//Handles login/logout and account redirections
app.get('/accounts',function(req,res){
  if(loggedIn){
    loggedIn = false;
	res.cookie('logStatus', 'false');
	res.clearCookie('email');
	res.clearCookie('password');
	
    res.redirect("/");
  }
  else{
    res.sendFile('/pages/account.html', {root: '../www'});
  }
})
//Checks if a user is in our database and that they used the correct password
 app.post('/validateLogin', function (req, res) {
    var email = req.body["email"];
    var password = req.body["password"];
    let sql = 'SELECT count(accountId) as valid FROM accounts where ? = email and ? =password'
    connection.query(sql,[email,password], (err,rows) => {
        if(err) throw err;
        rows.forEach(row => {
            if(row.valid == 0)res.sendStatus(400)
            else{
              loggedIn = true;
			  res.cookie('logStatus', 'true');
              res.sendStatus(200);
            } 

        });
       
      console.log(sql);
      console.log({sql});
      console.log("User Logged in")
      var d = new Date();
      var time = d.toLocaleTimeString();console.log(time);
      });
 })
 
var server = app.listen(3000, function () {
    console.log("Server listening at localhost:3000")
 })
 
//tracks time, starts the stopwatch code then ends within 5 seconds
console.time()
setTimeout(() => {
  console.timeEnd()
}, 5000)
setTimeout(() => {
  console.timeLog();
}, 2000)



console.log("log");
console.warn("warn");
console.error("error");

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};