var express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    Candidate       = require("./models/candidate"),
    Test            = require("./models/test"),
    Question        = require("./models/question"),
    Response        = require("./models/response");

var app = express();
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb://localhost/project",{useNewUrlParser: true,useUnifiedTopology: true});


//Passport Configuration
app.use(require("express-session")({
    secret : "This is a secret page",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Candidate.authenticate()));



passport.serializeUser(Candidate.serializeUser());
passport.deserializeUser(Candidate.deserializeUser());

//Middleware For currently logged in user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;  //This is available to all the templates
    next();                             //execute next code
})

app.get("/", function(req, res){
    console.log(req.user);
    res.render("landing.ejs");
})

app.get("/company", function(req, res){
    res.render("companyLanding.ejs");
})




//TEST ROUTES



app.get("/createtest", function(req, res){
    res.render("createTest");
});

app.post("/createtest", function(req, res) {
    const name = req.body.name;

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
          if(foundTests ==0){
            res.render("notest");
          }else{
          res.render("selecttest", {foundTests : foundTests});
          }
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
    const test=req.body.test;

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
    res.render("addedsuccessfully",{testname:test});
    //res.redirect("/"+test.name+"/managetest");
})

app.get("/:id/test", function(req, res){

    const test = new Test({
      name:req.params.id
    });
//  console.log(test);

    Question.find({test : test.name}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {
  //        console.log("Sudhanshu");
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
});

app.get("/viewtest",function(req,res){
  Test.find({}, function(err, foundTests) {
      if(err) {
          res.redirect("/createtest");
      } else {
        if(foundTests ==0){
          res.render("notest");
        }else{
        res.render("selectviewtest", {foundTests : foundTests});
        }
      }
  });
});

app.get("/:id/viewtest", function(req, res){

    const test = new Test({
      name:req.params.id
    });
  const id = test.name;
    Question.find({test : id}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            console.log(err);
            res.redirect("/createtest");
        } else {
  //        console.log("Sudhanshu");
            res.render("test", {foundQuestions: foundQuestions});
        }
    });
});



//AUTH ROUTES//

//Show register form

app.get("/studentRegister", function(req, res){
    res.render("studentRegister.ejs");
});

//Handle signup logic
app.post("/studentRegister", function(req, res) {
    var newCandidate = new Candidate({name : req.body.candidate_name, username : req.body.username, Institute : req.body.institute, LinkedIn : req.body.linkedin })
    Candidate.register(newCandidate, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("studentRegister");
        }
        //res.redirect("/");
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        })

    });
})

//Show login form
app.get("/studentLogin", function(req, res){
    res.render("studentLogin.ejs");
});

//Handle login logic
//app.post("/studentLogin, middleware, function ")
app.post("/studentLogin", passport.authenticate("local",
    {successRedirect: "/",
     failureRedirect: "/studentLogin"
    }), function(req, res) {

});

//Logout logic
app.get("/studentLogout", function(req, res) {
    req.logout();
     res.redirect("/");
})



app.listen(process.env.PORT||3000, function(){
    console.log("SERVER HAS STARTED!");
});
