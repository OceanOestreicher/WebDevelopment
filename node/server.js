var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded());
var fs = require("fs");
const { connect } = require('http2');

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

 app.get('/listUsers', function (req, res) {
    connection.query('SELECT * FROM accounts', (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(rows);
      });
      res.end(rows);
 })
 app.post('/validateLogin', function (req, res) {
    var email = req.body["accountEmail"];
    var password = req.body["accountPassword"];
    let sql = 'SELECT count(accountId) as valid FROM accounts where ? = email and ? =password'
    connection.query(sql,[email,password], (err,rows) => {
        if(err) throw err;
        console.log('Data received from Db:');
        console.log(rows);
        rows.forEach(row => {
            console.log(row.valid);
            if(row.valid == 0)res.end("Invalid Credentials");
            else res.end("Credentials Validated");
        });
      });
      /*
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        for(const user in users){
            if(users[user]["email"]==email){
                if(users[user]["password"]==password)res.end("Credentials Validated");
                else res.end("Invalid Credentials");
            }
            
        }
    });*/
 })

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server listening at http://%s:%s", host, port)
 })