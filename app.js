const express         = require("express"),
      mongoose        = require("mongoose"),
      passport        = require("passport"),
      LocalStrategy   = require("passport-local"),
      bodyParser      = require("body-parser"),
      flash           = require("connect-flash"),
      Candidate       = require("./models/candidate"),
      Test            = require("./models/test"),
      Question        = require("./models/question"),
      Response        = require("./models/response"),
      middleware      = require("./middleware");

const app = express();

app.set('view engine', 'ejs');

var isAdmin = false;

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb://localhost/project",{useNewUrlParser: true,useUnifiedTopology: true});


//Passport Configuration
app.use(require("express-session") ({
    secret : "This is a secret page",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(Candidate.authenticate()));


passport.serializeUser(Candidate.serializeUser());
passport.deserializeUser(Candidate.deserializeUser());

//Middleware For currently logged in user
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;  //This is available to all the templates
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();                             //execute next code
});

app.get("/", function(req, res) {
    console.log(req.user);
    res.render("landing");
});

app.get("/company", function(req, res){
    res.render("companyLanding.ejs");
});

//TEST ROUTES

app.get("/createtest", middleware.checkIsCompany, function(req, res) {
    res.render("createtest");
});

app.post("/createtest", function(req, res) {
    const name = req.body.name;
    let duration = req.body.duration;
    let date = req.body.date;
    let time = req.body.time;

    date = date + "T" + time + ":00Z";

    console.log((date));
    console.log(typeof(duration));

    const item = new Test( {
        name: name,
        duration:duration,
        date:date
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
            } else {
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
        test: req.body.test
    });

    item.save();
    res.render("addedsuccessfully",{testname:test});
    //res.redirect("/"+test.name+"/managetest");
})

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/:id/test", function(req, res){

    const test = new Test({
      name:req.params.id
    });
//  console.log(test);
    const id = test.name;
    Question.find({test : test.name}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {
  //        console.log("Sudhanshu");
            Test.find({_id:id},function(err,foundD){
              if(err){
                console.log(err);
              }
              else{
              var date= foundD[0].date;
              var duration=foundD[0].duration;
              res.render("test", {foundQuestions: foundQuestions,date:date,duration:duration});}
            });
        }
    });
});

app.post("/test", function(req, res){
    const len = req.body.length;
    var pref1 = "q";
    var pref2 = "ques";
    var answers = [];
    
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

app.get("/:id/viewtest", function(req, res){ //Test can only be viewed if the test is at that time

    const test = new Test({
      name:req.params.id
    });
  const id = test.name;
  var dateExam;
  var duration;
  let one =9;
  Test.find({_id:id},function(err,dateFound){
    if(err){
      console.log("Error from test db about date");
      console.log(err);
    }
    else{
       //console.log(dateFound);
       var date_diff_indays = function(date1,date2) { //Function to return seconds difference between current date and exam date
          dt1 = new Date(date1);
          dt2 = new Date(date2);
          return ((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(),dt2.getHours(),dt2.getMinutes(),dt2.getSeconds()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(),dt1.getHours(),dt1.getMinutes(),dt1.getSeconds()) ) /(1000));
       }
       dateExam=dateFound[0].date;
       dateExam.setMinutes(dateExam.getMinutes()-330);
       var curDate = new Date();
       curDate= curDate.toISOString();
       dateExam = dateExam.toISOString();
       var timeDiff  = date_diff_indays(dateExam,curDate);
       duration=dateFound[0].duration;
       duration = duration * 60;
       // console.log(duration);
       // console.log(date);
       // console.log(curDate);
       // console.log(timeDiff);
       if(duration >= timeDiff && timeDiff>=0){
         Question.find({test : id}, function(err, foundQuestions) {
           if(err) {
               console.log("Error occured while fetching data from database!");
               console.log(err);
               res.redirect("/createtest");
           } else {
              //console.log("Sudhanshu");
               let sendDate = Date.parse(dateExam); //sending in milliseconds (Time passed since I think 1970)
               res.render("test", {foundQuestions: foundQuestions,date:sendDate,duration:duration});
           }
       });
       }else{
        //console.log((date));
        //console.log(d);
        var availDateObject = new Date(Date.parse(dateExam));
        res.render("testCurrentlyNot",{availableAt:availDateObject});
       }
       //date = JSON.stringify(date);
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

    if(req.body.username === 'iamadmin@gmail.com' && req.body.password === 'admin123'){
        newCandidate.isAdmin = true;
    }

    Candidate.register(newCandidate, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("studentRegister", {error: err.message});
        }
        //res.redirect("/");
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome " + newCandidate.name + "!");
            res.redirect("/");
        })

    });
});

//Show login form
app.get("/studentLogin", function(req, res){
    res.render("studentLogin.ejs");
});

//Handle login logic
//app.post("/studentLogin, middleware, function ")
app.post("/studentLogin", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/studentLogin",
        failureFlash: true,
        successFlash: 'Welcome back!'
    }), function(req, res) {

        //res.redirect("/");
        //  if(req.body.username === "admin@gmail.com" &&  req.body.password === "admincode")
        // {
        //     isAdmin = true;
        //     Candidate.find({username : req.body.username}, function(err, foundUser) {
        //         if(err){
        //             console.log("Error in fetching candidate info");
        //         }
        //         else{
        //             console.log(foundUser);
        //             console.log("Inside if");
        //             console.log(foundUser[0].LinkedIn);
        //         }
        //     })
         //}

});

//Logout logic
app.get("/studentLogout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
})

//Comment, Do not erase
app.listen(process.env.PORT||3000, function(){
    console.log("SERVER HAS STARTED!");
});


//Comment, Do not erase

// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("SERVER HAS STARTED!");
// });
