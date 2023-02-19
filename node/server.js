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

//Test query function of all users in the database
 app.get('/listUsers', function (req, res) {
    connection.query('SELECT * FROM accounts', (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(rows);
      });
      res.end(rows);
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
    res.redirect("/index.html");
    //This should be executed once we implement log out features and/or account features
  }
  else{
    res.sendFile('/pages/account.html', {root: '../www'});
  }
})
//Checks if a user is in our database and that they used the correct password
 app.post('/validateLogin', function (req, res) {
    var email = req.body["email"];
    var password = req.body["password"];
    console.log(email + " "+password);
    let sql = 'SELECT count(accountId) as valid FROM accounts where ? = email and ? =password'
    connection.query(sql,[email,password], (err,rows) => {
        if(err) throw err;
        console.log('Data received from Db:');
        console.log(rows);
        rows.forEach(row => {
            console.log(row.valid);
            if(row.valid == 0)res.status(200).json({message:"Failed"});
            else{
              loggedIn = true;
              res.status(200).json({message:"Passed"});
              //res.redirect("/index.html");
              
            } 
        });
      });
 })

var server = app.listen(3000, function () {
    console.log("Server listening at localhost:3000")
 })