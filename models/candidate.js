const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const CandidateSchema = new mongoose.Schema({
    name: String,
    username: String, // Email
    institute: String,
    linkedin: String
});

CandidateSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Candidate", CandidateSchema);