var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var CandidateSchema = new mongoose.Schema({
    name : String,
    username : String,  //Email actually
    Institute : String,
    LinkedIn : String,
    isAdmin : {type: Boolean, default: false},
    result:[[{
      type : mongoose.Schema.Types.ObjectId,
      ref : "testSchema",
    },{
      res:Number
    }]]
});

CandidateSchema.plugin(passportLocalMongoose);

//CandidateSchema.plugin(passportLocalMongoose, { usernameField: 'email', errorMessages : { UserExistsError : 'A user with the given email is already registered.' } });

module.exports = mongoose.model("Candidate" , CandidateSchema);
