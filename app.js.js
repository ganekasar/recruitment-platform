const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("landing.ejs");
});

app.get("/company", function(req, res){
    res.render("companyLanding.ejs");
});

app.get("/createtest", function(req, res){
    res.render("createTest.ejs");
});

app.get("/:test", function(req, res){
    res.render("login.ejs");
});

app.get("/:test/edit", function(req, res){
    res.render("login.ejs");
});

app.get("/signup", function(req, res){
    res.render("signup.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.get("/test", function(req, res){
    res.render("test.ejs");
});

app.listen(3000, function(){
    console.log("SERVER HAS STARTED!");
});