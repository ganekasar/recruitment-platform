<<<<<<< HEAD
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const CandidateSchema = new mongoose.Schema({
    name: String,
    username: String, // Email
    institute: String,
    linkedin: String
=======
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var CandidateSchema = new mongoose.Schema({
    name : String, 
    username : String,  //Email actually
    Institute : String,
    LinkedIn : String
>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
});

CandidateSchema.plugin(passportLocalMongoose);

<<<<<<< HEAD
module.exports = mongoose.model("Candidate", CandidateSchema);
=======
//CandidateSchema.plugin(passportLocalMongoose, { usernameField: 'email', errorMessages : { UserExistsError : 'A user with the given email is already registered.' } });

module.exports = mongoose.model("Candidate" , CandidateSchema);
>>>>>>> 7897805478a409cf81b537cdc53df0e6e87161de
