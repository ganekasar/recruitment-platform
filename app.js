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
      Codingproblem   = require("./models/codingproblem"),
      middleware      = require("./middleware");

const app = express();

app.set('view engine', 'ejs');

var isAdmin = false;

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/project", {useNewUrlParser: true, useUnifiedTopology: true});

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
app.get("/companyLanding", function(req, res){
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
    const type = req.body.type;
    const test = req.body.test;

    if(type === "mcq") {
        const ques = req.body.question;
        const opt1 = req.body.option1;
        const opt2 = req.body.option2;
        const opt3 = req.body.option3;
        const opt4 = req.body.option4;
        const ans  = req.body.answer;

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
    } else {
        const ques = req.body.ques;
        const input = req.body.input;
        const output = req.body.output;
        const constraints = req.body.constraints;
        const sample = req.body.sample;

        const item = new Codingproblem({
            question: ques,
            input: input,
            output: output,
            constraints: constraints,
            sample: sample,
            test: test
        });

        item.save();
    }
    res.render("addedsuccessfully",{testname : test});
    //res.redirect("/"+test.name+"/managetest");
})

app.get("/sharetestlink",function(req,res){
    res.render("sharetestlink");
    const test = req.params.id;

    console.log(test);

});
app.post("/sharetestlink",function(req,res){
   res.render("sharetestlink");
    var nodemailer=require( 'nodemailer');
    var cron=require('node-cron');
    var schedule = require('node-schedule');
    var year=parseInt(req.body.year);
    var month=parseInt(req.body.month);
    var day=parseInt(req.body.day);
    var hour=parseInt(req.body.hour);
    var minute=parseInt(req.body.minute);
    var second=parseInt(req.body.second);

    var date = new Date(year,month, day, hour, minute, second);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'shivanijadhav1310@gmail.com',
          pass: 'Prasad@123'
        }
      });
      var maillist=[
        'sdjadhav13102000@gmail.com',


      ];
      var mailOptions = {
        from: 'shivanijadhav1310@gmail.com',
        to: maillist,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

    var j = schedule.scheduleJob(date, function(){
      console.log('The world is going to end today.');
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
});
});
});


app.get("/signup", function(req, res){
    res.render("signup");                     //Bhai savji ye kya hai
});

app.get("/login", function(req, res){
    res.render("login");                  //Bhai savji ye kya hai
});

app.get("/:id/test", function(req, res) {

    const test = new Test({
      name:req.params.id
    });

    const id = test.name;

    Question.find({test : test.name}, function(err, foundQuestions) {
        if(err) {
            console.log("Error occured while fetching data from database!");
            res.redirect("/createtest");
        } else {

            // Test.find({_id:id},function(err,foundD){
            //   if(err){
            //     console.log(err);
            //   }
            //   else {
            //   var date= foundD[0].date;
            //   var duration=foundD[0].duration;
            //   }
            // });

            Codingproblem.find({test : test.name}, function(err, foundCodingPbs) {
                if(err) {
                    console.log("Error occured while fetching data from database!");
                    res.redirect("/createtest");
                } else {

                    Test.find({_id:id},function(err,foundD) {
                      if(err) {
                        console.log(err);
                      }
                      else {
                        var date = foundD[0].date;
                        var duration = foundD[0].duration;
                        duration=duration*60;
                        var myQuestions = [];
                        for(var f=0;f<foundQuestions.length ; f++)
                          {
                            var question = foundQuestions[f].question;
                            var  a= foundQuestions[f].option1;
                            var  b= foundQuestions[f].option2;
                            var  c= foundQuestions[f].option3;
                            var  d= foundQuestions[f].option4;
                            var correctAnswer= foundQuestions[f].answer;
                            var ob={
                            question:question,
                            answers: {
                              a: a,
                              b: b,
                              c: c,
                              d: d
                            },
                            correctAnswer: correctAnswer
                          };
                          myQuestions.push(ob);
                      }
                        res.render("test", {foundQuestions : myQuestions, date : date, duration : duration, foundCodingProblems : foundCodingPbs});
                        }
                    });
                }
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

               Codingproblem.find({test : test.name}, function(err, foundCodingPbs) {
                if(err) {
                    console.log("Error occured while fetching data from database!");
                    res.redirect("/createtest");
                } else {

                    Test.find({_id:id},function(err,foundD) {
                      if(err) {
                        console.log(err);
                      }
                      else {
                        var date = foundD[0].date;
                        var duration = foundD[0].duration;
                        duration = duration * 60;
                        var myQuestions = [];
                        for(var f=0;f<foundQuestions.length ; f++)
                          {
                            var question = foundQuestions[f].question;
                            var  a= foundQuestions[f].option1;
                            var  b= foundQuestions[f].option2;
                            var  c= foundQuestions[f].option3;
                            var  d= foundQuestions[f].option4;
                            var correctAnswer= foundQuestions[f].answer;
                            var ob={
                            question:question,
                            answers: {
                              a: a,
                              b: b,
                              c: c,
                              d: d
                            },
                            correctAnswer: correctAnswer
                          };
                          myQuestions.push(ob);
                      }
                      // for(var f=0;f<myQuestions.length;f++){
                      //   console.log(myQuestions[f]);
                      // }
                        res.render("test", {testid:req.params.id,foundQuestions : myQuestions, date : date, duration : duration, foundCodingProblems : foundCodingPbs});
                        }
                    });
                }
            });

               //res.render("test", {foundQuestions: foundQuestions,date:sendDate,duration:duration});
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

app.get("/:stuid/:id/viewtest", function(req, res){ //Test can only be viewed if the test is at that time with student

    const test = new Test({
      name:req.params.id
    });
  const id = test.name;
  var dateExam;
  var duration;
  let one =9;
  Candidate.findOne({username:req.params.stuid},function(err,stude){
    for(let i =0;i<stude.submitted.length;i++){
      if(stude.submitted[i].toString()== req.params.id.toString())
      {
        console.log("ss");
        if(stude.yesorno[i]===true)
            {
              console.log("Sud");
              res.render("testalreadysubmitted",{testid:req.params.id,stuid:req.params.stuid});
            }
      }
    }
  });

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

               Codingproblem.find({test : test.name}, function(err, foundCodingPbs) {
                if(err) {
                    console.log("Error occured while fetching data from database!");
                    res.redirect("/createtest");
                } else {

                    Test.find({_id:id},function(err,foundD) {
                      if(err) {
                        console.log(err);
                      }
                      else {
                        var date = foundD[0].date;
                        var duration = foundD[0].duration;
                        duration = duration * 60;
                        var myQuestions = [];
                        for(var f=0;f<foundQuestions.length ; f++)
                          {
                            var question = foundQuestions[f].question;
                            var  a= foundQuestions[f].option1;
                            var  b= foundQuestions[f].option2;
                            var  c= foundQuestions[f].option3;
                            var  d= foundQuestions[f].option4;
                            var correctAnswer= foundQuestions[f].answer;
                            var ob={
                            question:question,
                            answers: {
                              a: a,
                              b: b,
                              c: c,
                              d: d
                            },
                            correctAnswer: correctAnswer
                          };
                          myQuestions.push(ob);
                      }
                      // for(var f=0;f<myQuestions.length;f++){
                      //   console.log(myQuestions[f]);
                      // }
                        res.render("test", {testid:req.params.id,foundQuestions : myQuestions, date : date, duration : duration, foundCodingProblems : foundCodingPbs,stuid:req.params.stuid});
                        }
                    });
                }
            });

               //res.render("test", {foundQuestions: foundQuestions,date:sendDate,duration:duration});
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

//student result
app.post("/:testid/:stuid/studentresult",function(req,res){
  console.log(req.body.submit);
  console.log("Sudhaanh");

  Candidate.updateOne(
    { username: req.params.stuid },
    { $push: { result: req.body.submit } },
    function(err, result) {
      if (err) {
        console.log(err);
      }
    }
  );
  Candidate.updateOne(
    {username: req.params.stuid},
    {$push:{submitted: req.params.testid}},
    function(err,res){
      if(err){
        console.log(err);
      }
    }
  );
  Candidate.updateOne(
    { username: req.params.stuid },
    { $push: { yesorno: true } },
    function(err, result) {
      if (err) {
        console.log(err);
      }
    }
  );
  //Candidate.find({})
  //window.onbeforeunload = function() { return "Your work will be lost."; };
  res.render("studentresult",{result:req.params.stuid.result,stuid:req.params.stuid});
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
            if(req.body.username === 'iamadmin@gmail.com' && req.body.password === 'admin123'){
                res.redirect("/companyLanding");   //admin hai toh company page
            }
            else{
              var sendtest=[];
              var todaydate=(new Date()).toISOString();
              var date_diff_indays = function(date1,date2) { //Function to return seconds difference between current date and exam date
                 dt1 = new Date(date1);
                 dt2 = new Date(date2);
                 return ((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(),dt2.getHours(),dt2.getMinutes(),dt2.getSeconds()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(),dt1.getHours(),dt1.getMinutes(),dt1.getSeconds()) ) /(1000));
              }
              Test.find({},function(err,foundtest){
               if(err){
                 console.log(err);
               }
               else{
                 for(var i=0;i<  foundtest.length ;i++){
                  var timediff  = date_diff_indays(foundtest[i].date.toISOString(),todaydate);
                  if(timediff <0){
                    sendtest.push(foundtest[i]);
                  }
                 }
               }
               res.render("studentlanding",{sendtest:sendtest,stuid:req.body.username});
             });
            }
        })

    });
});

//Show login form
app.get("/studentLogin", function(req, res){
    res.render("studentLogin");
});

//Handle login logic
//app.post("/studentLogin, middleware, function ")
app.post("/studentLogin", passport.authenticate("local",
    {
        failureRedirect: "/studentLogin",
        failureFlash: true,
        successFlash: 'Welcome back!'
    }), function(req, res) {
         if(req.body.username === "iamadmin@gmail.com" &&  req.body.password === "admin123")
        {
              res.render("companyLanding");   //redirect to student landing page
        }else{
          // To show the test on students page
          var sendtest=[];
          var todaydate=(new Date()).toISOString();
          var date_diff_indays = function(date1,date2) { //Function to return seconds difference between current date and exam date
             dt1 = new Date(date1);
             dt2 = new Date(date2);
             return ((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(),dt2.getHours(),dt2.getMinutes(),dt2.getSeconds()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(),dt1.getHours(),dt1.getMinutes(),dt1.getSeconds()) ) /(1000));
          }
          Test.find({},function(err,foundtest){
           if(err){
             console.log(err);
           }
           else{
             Candidate.find({username:req.body.username},function(err,student){

               for(var i=0;i<  foundtest.length ;i++){
                var timediff  = date_diff_indays(foundtest[i].date.toISOString(),todaydate);
                if(timediff < 0){
                  for(var c=0 ; c< foundtest[i].candidates.length;c++){
                    if((foundtest[i].candidates[c].toString() == student[0]._id.toString())){
                        break;
                    }
                  }
                  if(c==foundtest[i].candidates.length){
                    sendtest.push(foundtest[i]);
                  }
                }
               }
              // console.log(sendtest);
              res.render("studentlanding",{sendtest:sendtest,stuid:req.body.username});
             });
         }
       });
}});

//student register for the test
app.get("/:stuid/:testid/registerteststudent",function(req,res){
  Candidate.find({username:req.params.stuid},function(err,student){
    if(err){
      console.log(err);
    }else{
        var s=student[0]._id;
        Test.updateOne(
          { _id: req.params.testid },
          { $push: { candidates: s} },
          function(err, result) {
            if (err) {
              res.send(err);
            }
          }
        );
    }
  });

  var sendtest=[];
  var todaydate=(new Date()).toISOString();
  var date_diff_indays = function(date1,date2) { //Function to return seconds difference between current date and exam date
     dt1 = new Date(date1);
     dt2 = new Date(date2);
     return ((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(),dt2.getHours(),dt2.getMinutes(),dt2.getSeconds()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(),dt1.getHours(),dt1.getMinutes(),dt1.getSeconds()) ) /(1000));
  }
  Test.find({},function(err,foundtest){
   if(err){
     console.log(err);
   }
   else{
     console.log(foundtest);
     Candidate.find({username:req.params.stuid},function(err,student){

       for(var i=0;i<  foundtest.length ;i++){
         if(foundtest[i]._id.toString()!=req.params.testid.toString())
        {var timediff  = date_diff_indays(foundtest[i].date.toISOString(),todaydate);
        if(timediff < 0){
          for(var c=0 ; c< foundtest[i].candidates.length;c++){
            // console.log(100);
            // console.log(foundtest[i].candidates[c].toString());
            // console.log(100);
            // console.log(student[0]._id.toString());
            if((foundtest[i].candidates[c].toString() == student[0]._id.toString())){
                break;
            }
          }
          if(c==foundtest[i].candidates.length){
            sendtest.push(foundtest[i]);
          }
        }}
       }
       console.log(sendtest);
       res.render("studentlanding",{sendtest:sendtest,stuid:req.params.stuid});
     });
 }
});
});

//studentlanding logic

app.get("/:stuid/studentlanding",function(req,res){
  var sendtest=[];
  var todaydate=(new Date()).toISOString();
  var date_diff_indays = function(date1,date2) { //Function to return seconds difference between current date and exam date
     dt1 = new Date(date1);
     dt2 = new Date(date2);
     return ((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(),dt2.getHours(),dt2.getMinutes(),dt2.getSeconds()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(),dt1.getHours(),dt1.getMinutes(),dt1.getSeconds()) ) /(1000));
  }
  Test.find({},function(err,foundtest){
   if(err){
     console.log(err);
   }
   else{
     Candidate.find({username:req.params.stuid},function(err,student){

       for(var i=0;i<  foundtest.length ;i++){
        var timediff  = date_diff_indays(foundtest[i].date.toISOString(),todaydate);
        if(timediff < 0){
          for(var c=0 ; c< foundtest[i].candidates.length;c++){
            if((foundtest[i].candidates[c].toString() == student[0]._id.toString())){
                break;
            }
          }
          if(c==foundtest[i].candidates.length){
            sendtest.push(foundtest[i]);
          }
        }
       }
       console.log(sendtest);
       res.render("studentlanding",{sendtest:sendtest,pro:student,stuid:req.params.stuid});

     });
 }
});
});

//student deleteprofile logic

app.post("/:stuid/deleteprofile",function(req,res){
  Candidate.find({username:req.params.stuid},function(err,stu){
    Candidate.findOneAndDelete({username:req.params.stuid},function(errr){
      if(errr){
        console.log(errr);
      }else{
        res.render("studentLogin");
      }
    });
  });
});

//studentprofile logic
app.get("/:stuid/studentprofile",function(req,res){
  Candidate.find({username:req.params.stuid},function(err,stud){
    if(err){
      console.log(err);
    }else{
      res.render("studentprofile",{pro:stud,stuid:req.params.stuid});
    }
  });
});

//studentresult logic
app.get("/:stuid/studentpastresult",function(req,res){
  Candidate.find({username:req.params.stuid},function(err,stud){
    if(err){
      console.log(err);
    }else{
      var resul=[];
      var t=[];
      for(let x=0;x<stud[0].result.length;x++){
        resul.push(stud[0].result[x]);
        t.push(stud[0].submitted[x]);
      }
      var testres=[];
      Test.find({},function(err,te){
        if(err){
          console.log(err);
        }else{
          for(let j=0;j<t.length;j++){
          {for(i=0;i<te.length;i++)
          if(te[i]._id.toString()== t[j].toString()){
            testres.push(te[i].name);
          }}
        }
      }
      res.render("studentpastresult",{testres:testres,pro:resul,stuid:req.params.stuid});
      });
    }
  });
})

//futuretest logic
app.get("/:stuid/upcomingtest",function(req,res){
  Candidate.findOne({username:req.params.stuid},function(err,stud){
    if(err){
      console.log(err);
    }else{
      var testsend=[];
      Test.find({},function(err,tesst){
        if(err){
          console.log(err);
        }
        else{
          for(var c=0;c<tesst.length;c++){
            for(var d=0;d<tesst[c].candidates.length;d++){
              if(tesst[c].candidates[d].toString()==stud._id.toString()){
                var obj=[];
                obj.push(tesst[c].name);
                obj.push(tesst[c].date);
                obj.push(tesst[c].duration);
                obj.push(tesst[c]._id);
                testsend.push(obj);
                break;
              }
            }
          }
          res.render("upcomingtest",{pro:testsend,stuid:req.params.stuid});
        }
      });
    }
  });
})

//Logout logic
app.get("/:stuid/studentLogout", function(req, res) { // for students
    req.logout();
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
})
app.get("/studentLogout", function(req, res) {    //for company
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
