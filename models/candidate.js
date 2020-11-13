var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var CandidateSchema = new mongoose.Schema({
    name : String, 
    email : String,
    Institute : String,
    LinkedIn : String
});

CandidateSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Candidate" , CandidateSchema);
