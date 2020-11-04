var express = require("express");

var app = express();
app.set('view engine', 'ejs');


app.get("/", function(req, res){
    res.render("landing.ejs");
})

app.get("/company", function(req, res){
    res.render("companyLanding.ejs");
})



app.get("/createTest", function(req, res){
    res.render("createTest.ejs");
});

app.get("/:test", function(req, res){
    res.render("studentLogin.ejs");
});

app.get("/:test/edit", function(req, res){
    res.render("studentLogin.ejs");
});


app.get("/studentSignup", function(req, res){
    res.render("studentSignup.ejs");
});

app.get("/studentLogin", function(req, res){
    res.render("studentLogin.ejs");
});

app.get("/test", function(req, res){
    res.render("test.ejs");
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER HAS STARTED!");
});