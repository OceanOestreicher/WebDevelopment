var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded());
var fs = require("fs");

 app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
    });
 })
 app.post('/validateLogin', function (req, res) {
    var params = req.body;
    var email = req.body["accountEmail"];
    var password = req.body["accountPassword"];
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        for(const user in users){
            if(users[user]["email"]==email){
                if(users[user]["password"]==password)res.end("Credentials Validated");
                else res.end("Invalid Credentials");
            }
            
        }
    });
 })

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })