const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/recruitdb', {useNewUrlParser: true});

const questionsSchema = {
    question: String,
    answer: String
};
  
const Question = mongoose.model("Question", questionsSchema);
  
const ques1 = new Question({
    question: "Is this a question?",
    answer: "Definetely No"
});

const ques2 = new Question({
    question: "This is second question?",
    answer: "You are correct"
});
  
const defaultQuestions = [ques1, ques2];  

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/company", function(req, res){
    res.render("companyLanding");
});

app.get("/createtest", function(req, res){
    res.render("createTest");
});

app.post("/createtest", function(req, res) {
    const ques = req.body.question;
    const ans = req.body.answer;

    const item = new Question({
        question: ques,
        answer: ans
    });

    item.save();

    res.redirect("/test");
})

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/test", function(req, res){
    Question.find({}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {
            res.render("test", {foundQuestions: foundQuestions});
        }
    });
});

app.listen(3000, function(){
    console.log("SERVER HAS STARTED!");
});