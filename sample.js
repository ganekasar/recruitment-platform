var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    Candidate       = require("./models/candidate"),
    Test            = require("./models/test"),
    Question        = require("./models/question"),
    Response        = require("./models/response");

var app = express();
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/project");



app.get("/", function(req, res){
    res.render("landing.ejs");
})

app.get("/company", function(req, res){
    res.render("companyLanding.ejs");
})


//STUDENT ROUTES

app.get("/studentRegister", function(req, res){
    res.render("studentRegister.ejs");
});


app.get("/candidates", function(req, res){
    res.send("HI");
})

//CREATE ROUTE
app.post("/candidates" , function(req , res){
   var newName = req.body.candidate_name;
   var newInstitute = req.body.institute;
   var newEmail = req.body.email;
   var newLinkedin = req.body.linkedin;
   var candidateObject = {name : newName , Institute:newInstitute, email : newEmail, LinkedIn :newLinkedin};
   //Create new candidate and add to the database
   Candidate.create(candidateObject , function(err , newCandidate){
       if(err){
           console.log(err);
       } else{
           // redirect 
           res.redirect("/")
       }
   })
});




app.get("/studentLogin", function(req, res){
    res.render("studentLogin.ejs");
});


//TEST ROUTES


app.get("/createtest", function(req, res){
    res.render("createTest");
});

app.post("/createtest", function(req, res) {
    var name = req.body.name;

    const item = new Test({
        name: name
    });

    item.save();

    res.render("testadded");
});

app.get("/selecttest", function(req, res) {
    Test.find({}, function(err, foundTests) {
        if(err) {
            res.redirect("/createtest");
        } else {
            res.render("selecttest", {foundTests : foundTests});
        }
    });
});

app.post("/selecttest", function(req, res) {
    const test = req.body.name;

    console.log(test);

    res.redirect("/" + test + "/managetest");
});

app.get("/:id/managetest", function(req, res) {

    const test = req.params.id;

    console.log(test);

    res.render("managetest", {test: test});
    
    // Test.find({_id: test}, function(err, foundTest) {
    //     if(err) {
    //         res.redirect("/createtest");
    //     } else {

            
    //         // Question.find({}, function(err, foundQuestions) {
    //         //     if(err) {
    //         //         console.log("Error occured while fetching data from database!");
    //         //         res.redirect("/createtest");
    //         //     } else {
    //         //         res.render("test", {foundQuestions: foundQuestions});
    //         //     }
    //         // });
    //     }
    // });

    

    //res.render("managetest");
});

app.post("/managetest", function(req, res) {
    const ques = req.body.question;
    const opt1 = req.body.option1;
    const opt2 = req.body.option2;
    const opt3 = req.body.option3;
    const opt4 = req.body.option4;
    const ans = req.body.answer;
    const test = req.body.test;

    const item = new Question({
        question: ques,
        option1: opt1,
        option2: opt2,
        option3: opt3,
        option4: opt4,
        answer: ans,
        test: test
    });

    item.save();

    res.redirect("/" + test + "/test");
})

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/:id/test", function(req, res){
    
    const test = req.params.id;

    Question.find({test : test}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {
            res.render("test", {foundQuestions: foundQuestions});
        }
    });
});

app.post("/test", function(req, res){
    const len = req.body.length;
    var pref1 = "q";
    var pref2 = "ques";
    var answers = [];
    //var pref2 = "qid";

    for(var i = 0; i < len; i++) {
        var str1 = pref1.concat(i.toString());
        var ans = req.body[str1];
        var str2 = pref2.concat(i.toString());
        var ques = req.body[str2];
        console.log(ques);
        answers.push(ans);

        Question.findById({_id : ques}, function(err, foundQuestion) {
            if(err) {
                res.redirect("/test");
            } else {
                const item = new Response({
                    answer: ans,
                    question: foundQuestion
                });

                item.save();

                //res.render("testsubmit");
            }
        })

        
        //var str2 = pref2.concat(i.toString());
        //var ques_id = req.body[str2];

        //console.log(ques_id);
    }

    Question.find({}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {
            var score = 0;

            for(var i = 0; i < foundQuestions.length; i++) {
                if(foundQuestions[i].answer === answers[i]) {
                    score = score + 1;
                }
            }

            console.log(score);

            res.render("testsubmit", {score: score});
        }
    });

    //console.log(req.body.);

    //console.log(ans);

    //res.render("testsubmit");
})




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER HAS STARTED!");
});